-- Reuses the existing osu! persistence functions and their RLS-bound executor.
create role osu_linking_writer nologin noinherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls;
grant usage on schema private to osu_linking_writer;

create table private.osu_link_attempts (
  id uuid primary key,
  owner_id uuid not null,
  passport_id uuid not null,
  session_id uuid not null,
  state_hash text not null check (state_hash ~ '^[a-f0-9]{64}$'),
  status text not null default 'pending' check (status in ('pending', 'processing', 'ready', 'complete', 'cancelled')),
  snapshot jsonb,
  account_id uuid references public.linked_provider_accounts(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '5 minutes',
  foreign key (passport_id, owner_id) references public.gaming_passports(id, owner_id) on delete cascade,
  check (snapshot is null or (jsonb_typeof(snapshot) = 'object' and pg_column_size(snapshot) <= 3500))
);
create index osu_link_attempts_owner_idx on private.osu_link_attempts(owner_id, created_at desc);
create index osu_link_attempts_passport_idx on private.osu_link_attempts(passport_id);
create index osu_link_attempts_account_idx on private.osu_link_attempts(account_id);
create index osu_link_attempts_expiry_idx on private.osu_link_attempts(expires_at);
alter table private.osu_link_attempts enable row level security;
revoke all on private.osu_link_attempts from public, anon, authenticated, osu_linking_writer;
grant select, insert, update, delete on private.osu_link_attempts to osu_passport_executor;
create policy osu_executor_attempts on private.osu_link_attempts to osu_passport_executor using (true) with check (true);

-- Writer has EXECUTE only. Each transition rechecks owner/session and locks parent first.
create function private.osu_link_transition(
  p_action text, p_owner uuid, p_session uuid, p_passport uuid, p_attempt uuid,
  p_state_hash text, p_profile jsonb default null, p_account uuid default null
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  attempt private.osu_link_attempts;
  saved_account_id uuid;
  observed timestamptz;
  metric text;
begin
  if p_owner is null or p_session is null or p_passport is null
    or not private.osu_owner_session_active(p_owner, p_session) then
    raise exception 'owner_session_required' using errcode = '42501';
  end if;
  perform 1 from public.gaming_passports where id = p_passport and owner_id = p_owner
    and status = 'draft_private' and slug is null and publication_consent is false for update;
  if not found then raise exception 'private_passport_required' using errcode = '42501'; end if;

  if p_action = 'unlink' then
    perform private.unlink_osu_account(p_owner, p_session, p_passport, p_account);
    update private.osu_link_attempts set status = 'cancelled', snapshot = null
      where owner_id = p_owner and passport_id = p_passport;
    return p_account;
  end if;

  if p_attempt is null or p_state_hash is null or p_state_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'invalid_attempt' using errcode = '23514';
  end if;
  if p_action = 'start' then
    -- Persistent throttling works across cold starts and multiple server instances.
    if exists(select 1 from private.osu_link_attempts where owner_id = p_owner
      and created_at > now() - interval '60 seconds') then
      raise exception 'rate_limited' using errcode = 'P0001';
    end if;
    delete from private.osu_link_attempts where expires_at < now();
    update private.osu_link_attempts set status = 'cancelled', snapshot = null
      where owner_id = p_owner and status in ('pending', 'processing', 'ready');
    insert into private.osu_link_attempts(id, owner_id, passport_id, session_id, state_hash)
      values(p_attempt, p_owner, p_passport, p_session, p_state_hash);
    return p_attempt;
  end if;

  select * into attempt from private.osu_link_attempts where id = p_attempt for update;
  if not found or attempt.owner_id <> p_owner or attempt.passport_id <> p_passport
    or attempt.session_id <> p_session or attempt.state_hash <> p_state_hash or attempt.expires_at <= now() then
    raise exception 'invalid_attempt' using errcode = '42501';
  end if;
  if p_action = 'claim' and attempt.status = 'pending' then
    update private.osu_link_attempts set status = 'processing' where id = p_attempt;
    return p_attempt;
  end if;
  if p_action = 'cancel' then
    update private.osu_link_attempts set status = 'cancelled', snapshot = null where id = p_attempt;
    return p_attempt;
  end if;
  if p_action = 'ready' and attempt.status = 'processing' then
  if p_profile is null or jsonb_typeof(p_profile) <> 'object' or pg_column_size(p_profile) > 2048
    or (p_profile - array['externalAccountId','username','mode','pp','globalRank','countryRank','accuracyPercent','medals','verifiedAt']) <> '{}'::jsonb
    or not (p_profile ?& array['externalAccountId','username','mode','pp','globalRank','countryRank','accuracyPercent','medals','verifiedAt'])
    or jsonb_typeof(p_profile->'externalAccountId') <> 'string'
    or (p_profile->>'externalAccountId') !~ '^[1-9][0-9]{0,15}$'
    or jsonb_typeof(p_profile->'username') <> 'string'
    or char_length(btrim(p_profile->>'username')) not between 1 and 64
    or p_profile->>'username' <> btrim(p_profile->>'username')
    or jsonb_typeof(p_profile->'mode') <> 'string'
    or p_profile->>'mode' not in ('osu','taiko','fruits','mania')
    or jsonb_typeof(p_profile->'verifiedAt') <> 'string' then
    raise exception 'invalid_osu_snapshot' using errcode = '23514';
  end if;
  observed := (p_profile->>'verifiedAt')::timestamptz;
  if observed is null or observed < now() - interval '5 minutes' or observed > now() + interval '1 minute' then
    raise exception 'expired_osu_snapshot' using errcode = '23514';
  end if;
  foreach metric in array array['pp','globalRank','countryRank','accuracyPercent','medals'] loop
    if jsonb_typeof(p_profile->metric) not in ('null','number') then
      raise exception 'invalid_osu_metric' using errcode = '23514';
    end if;
    if jsonb_typeof(p_profile->metric) = 'number' then
      if (p_profile->>metric)::numeric < 0 or (p_profile->>metric)::numeric > 9007199254740991
        or (metric = 'accuracyPercent' and (p_profile->>metric)::numeric > 100)
        or (metric in ('globalRank','countryRank','medals') and trunc((p_profile->>metric)::numeric) <> (p_profile->>metric)::numeric)
        or (metric in ('globalRank','countryRank') and (p_profile->>metric)::numeric = 0) then
        raise exception 'invalid_osu_metric' using errcode = '23514';
      end if;
    end if;
  end loop;
    update private.osu_link_attempts set status = 'ready', snapshot = p_profile where id = p_attempt;
    return p_attempt;
  end if;
  if p_action = 'complete' and attempt.status = 'complete' then return attempt.account_id; end if;
  if p_action <> 'complete' or attempt.status <> 'ready' then
    raise exception 'invalid_transition' using errcode = '42501';
  end if;

  saved_account_id := private.persist_osu_link(p_owner, p_session, p_passport, p_attempt, attempt.snapshot);
  update private.osu_link_attempts set status = 'complete', snapshot = null,
    account_id = saved_account_id where id = p_attempt;
  return saved_account_id;
end;
$$;

grant osu_passport_executor to postgres;
grant create on schema private to osu_passport_executor;
alter function private.osu_link_transition(text, uuid, uuid, uuid, uuid, text, jsonb, uuid) owner to osu_passport_executor;
revoke create on schema private from osu_passport_executor;
revoke all on function private.osu_link_transition(text, uuid, uuid, uuid, uuid, text, jsonb, uuid) from public, anon, authenticated;
grant execute on function private.osu_link_transition(text, uuid, uuid, uuid, uuid, text, jsonb, uuid) to osu_linking_writer;
revoke osu_passport_executor from postgres;
