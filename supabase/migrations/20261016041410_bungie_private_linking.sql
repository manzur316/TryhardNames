-- Apply only after gaming_passport_core; never run unrelated historical migrations.
alter table public.linked_provider_accounts drop constraint linked_provider_accounts_provider_check,
  add constraint linked_provider_accounts_provider_check check (provider in ('discord', 'riot', 'osu', 'roblox', 'steam', 'bungie'));
alter table public.verified_proofs drop constraint verified_proofs_provider_check,
  add constraint verified_proofs_provider_check check (provider in ('discord', 'riot', 'osu', 'roblox', 'steam', 'bungie'));

create role bungie_passport_executor nologin noinherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls;
create role bungie_passport_writer nologin noinherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls;
grant usage on schema public, private to bungie_passport_executor;
grant usage on schema private to bungie_passport_writer;
grant select, update (updated_at) on public.gaming_passports to bungie_passport_executor;
grant select, insert, update on public.linked_provider_accounts, public.verified_proofs to bungie_passport_executor;
create policy bungie_executor_passport_read on public.gaming_passports for select to bungie_passport_executor using (true);
create policy bungie_executor_passport_lock on public.gaming_passports for update to bungie_passport_executor using (true) with check (true);
create policy bungie_executor_accounts on public.linked_provider_accounts to bungie_passport_executor
  using (provider = 'bungie') with check (provider = 'bungie' and visibility = 'private');
create policy bungie_executor_proofs on public.verified_proofs to bungie_passport_executor
  using (provider = 'bungie') with check (provider = 'bungie' and visibility = 'private'
    and proof_type = 'provider_ownership' and game is null and verification_method = 'oauth');

create table private.bungie_link_attempts (
  id uuid primary key,
  owner_id uuid not null,
  passport_id uuid not null,
  session_id uuid not null,
  state_hash text not null check (state_hash ~ '^[a-f0-9]{64}$'),
  status text not null default 'pending' check (status in ('pending', 'processing', 'ready', 'complete', 'cancelled')),
  snapshot jsonb,
  account_id uuid references public.linked_provider_accounts(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '10 minutes',
  foreign key (passport_id, owner_id) references public.gaming_passports(id, owner_id) on delete cascade,
  check (snapshot is null or (jsonb_typeof(snapshot) = 'object' and pg_column_size(snapshot) <= 3500))
);
create index bungie_link_attempts_owner_idx on private.bungie_link_attempts(owner_id, created_at desc);
create index bungie_link_attempts_passport_idx on private.bungie_link_attempts(passport_id, owner_id);
create index bungie_link_attempts_account_idx on private.bungie_link_attempts(account_id);
create index bungie_link_attempts_expiry_idx on private.bungie_link_attempts(expires_at);
alter table private.bungie_link_attempts enable row level security;
revoke all on private.bungie_link_attempts from public, anon, authenticated, bungie_passport_writer;
grant select, insert, update, delete on private.bungie_link_attempts to bungie_passport_executor;
create policy bungie_executor_attempts on private.bungie_link_attempts to bungie_passport_executor using (true) with check (true);

-- The only privileged Auth lookup returns a boolean; Auth rows never reach the runtime.
create function private.bungie_owner_session_active(p_owner uuid, p_session uuid)
returns boolean language sql security definer set search_path = '' as $$
  select exists(select 1 from auth.sessions where id = p_session and user_id = p_owner
    and (not_after is null or not_after > now()));
$$;
revoke all on function private.bungie_owner_session_active(uuid, uuid) from public, anon, authenticated;
grant execute on function private.bungie_owner_session_active(uuid, uuid) to bungie_passport_executor;

-- Writer has EXECUTE only. Each transition rechecks owner/session and locks parent first.
create function private.bungie_link_transition(
  p_action text, p_owner uuid, p_session uuid, p_passport uuid, p_attempt uuid,
  p_state_hash text, p_profile jsonb default null, p_account uuid default null
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  attempt private.bungie_link_attempts;
  account public.linked_provider_accounts;
  observed timestamptz;
  epoch text;
  membership jsonb;
begin
  if p_action is null then raise exception 'invalid_action' using errcode = '23514'; end if;
  if p_owner is null or p_session is null or p_passport is null
    or not private.bungie_owner_session_active(p_owner, p_session) then
    raise exception 'owner_session_required' using errcode = '42501';
  end if;
  perform 1 from public.gaming_passports where id = p_passport and owner_id = p_owner
    and status in ('draft_private', 'published', 'unpublished') and suspended_at is null for update;
  if not found then raise exception 'private_passport_required' using errcode = '42501'; end if;

  if p_action = 'unlink' then
    perform 1 from public.linked_provider_accounts where id = p_account and owner_id = p_owner
      and passport_id = p_passport and provider = 'bungie' for update;
    if not found then raise exception 'account_not_found' using errcode = '42501'; end if;
    update private.bungie_link_attempts set status = 'cancelled', snapshot = null
      where owner_id = p_owner and passport_id = p_passport;
    update public.linked_provider_accounts set status = 'revoked', visibility = 'private',
      metadata_safe = '{}'::jsonb, display_name = null, revoked_at = coalesce(revoked_at, now())
      where id = p_account;
    update public.verified_proofs set status = 'revoked', visibility = 'private',
      display_value = 'Unlinked account', revoked_at = coalesce(revoked_at, now())
      where linked_provider_account_id = p_account and provider = 'bungie';
    return p_account;
  end if;

  if p_attempt is null or p_state_hash is null or p_state_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'invalid_attempt' using errcode = '23514';
  end if;
  if p_action = 'start' then
    -- Persistent throttling works across cold starts and multiple server instances.
    if exists(select 1 from private.bungie_link_attempts where owner_id = p_owner
      and created_at > now() - interval '60 seconds') then
      raise exception 'rate_limited' using errcode = 'P0001';
    end if;
    delete from private.bungie_link_attempts where expires_at < now();
    update private.bungie_link_attempts set status = 'cancelled', snapshot = null
      where owner_id = p_owner and status in ('pending', 'processing', 'ready');
    insert into private.bungie_link_attempts(id, owner_id, passport_id, session_id, state_hash)
      values(p_attempt, p_owner, p_passport, p_session, p_state_hash);
    return p_attempt;
  end if;

  select * into attempt from private.bungie_link_attempts where id = p_attempt for update;
  if not found or attempt.owner_id <> p_owner or attempt.passport_id <> p_passport
    or attempt.session_id <> p_session or attempt.state_hash <> p_state_hash or attempt.expires_at <= now() then
    raise exception 'invalid_attempt' using errcode = '42501';
  end if;
  if p_action = 'claim' and attempt.status = 'pending' then
    update private.bungie_link_attempts set status = 'processing' where id = p_attempt;
    return p_attempt;
  end if;
  if p_action = 'cancel' then
    update private.bungie_link_attempts set status = 'cancelled', snapshot = null where id = p_attempt;
    return p_attempt;
  end if;
  if p_action = 'ready' and attempt.status = 'processing' then
    if p_profile is null or jsonb_typeof(p_profile) <> 'object' or pg_column_size(p_profile) > 3500
      or (p_profile - array['accountId','bungieName','displayName','avatarUrl','destinyMemberships','verifiedAt']) <> '{}'::jsonb
      or not (p_profile ?& array['accountId','bungieName','displayName','avatarUrl','destinyMemberships','verifiedAt'])
      or jsonb_typeof(p_profile->'accountId') <> 'string'
      or (p_profile->>'accountId') !~ '^[1-9][0-9]{0,19}$'
      or jsonb_typeof(p_profile->'bungieName') <> 'string'
      or char_length(btrim(p_profile->>'bungieName')) not between 1 and 134
      or jsonb_typeof(p_profile->'displayName') <> 'string'
      or char_length(btrim(p_profile->>'displayName')) not between 1 and 128
      or jsonb_typeof(p_profile->'verifiedAt') <> 'string'
      or jsonb_typeof(p_profile->'destinyMemberships') <> 'array'
      or jsonb_typeof(p_profile->'avatarUrl') not in ('null', 'string') then
      raise exception 'invalid_snapshot' using errcode = '23514';
    end if;
    if jsonb_typeof(p_profile->'avatarUrl') = 'string' and
      (char_length(p_profile->>'avatarUrl') > 512 or (p_profile->>'avatarUrl') !~ '^https://www[.]bungie[.]net/img/[A-Za-z0-9_./-]+$') then
      raise exception 'invalid_avatar' using errcode = '23514';
    end if;
    if jsonb_array_length(p_profile->'destinyMemberships') > 6 then
      raise exception 'invalid_memberships' using errcode = '23514';
    end if;
    for membership in select value from jsonb_array_elements(p_profile->'destinyMemberships') loop
      if jsonb_typeof(membership) <> 'object'
        or not (membership ?& array['accountId','displayName','platform','crossSaveOverride'])
        or (membership - array['accountId','displayName','platform','crossSaveOverride']) <> '{}'::jsonb
        or jsonb_typeof(membership->'accountId') <> 'string'
        or membership->>'accountId' !~ '^[1-9][0-9]{0,19}$'
        or jsonb_typeof(membership->'displayName') not in ('null','string')
        or (membership->'displayName' <> 'null'::jsonb and char_length(btrim(membership->>'displayName')) not between 1 and 128)
        or jsonb_typeof(membership->'platform') <> 'number'
        or membership->>'platform' !~ '^[1-9][0-9]{0,2}$'
        or jsonb_typeof(membership->'crossSaveOverride') <> 'number'
        or membership->>'crossSaveOverride' !~ '^[0-9]{1,3}$' then
        raise exception 'invalid_membership' using errcode = '23514';
      end if;
      if (membership->>'platform')::int > 255 or (membership->>'crossSaveOverride')::int > 255 then
        raise exception 'invalid_platform' using errcode = '23514';
      end if;
    end loop;
    if (select count(*) <> count(distinct (value->>'accountId',value->>'platform'))
      from jsonb_array_elements(p_profile->'destinyMemberships')) then
      raise exception 'duplicate_membership' using errcode = '23514';
    end if;
    observed := (p_profile->>'verifiedAt')::timestamptz;
    if not isfinite(observed) or observed < now() - interval '1 minute' or observed > now() + interval '1 minute' then
      raise exception 'invalid_snapshot_time' using errcode = '23514';
    end if;
    update private.bungie_link_attempts set status = 'ready', snapshot = p_profile where id = p_attempt;
    return p_attempt;
  end if;
  if p_action = 'complete' and attempt.status = 'complete' then return attempt.account_id; end if;
  if p_action <> 'complete' or attempt.status <> 'ready' then
    raise exception 'invalid_transition' using errcode = '42501';
  end if;

  p_profile := attempt.snapshot;
  observed := (p_profile->>'verifiedAt')::timestamptz;
  insert into public.linked_provider_accounts(passport_id, owner_id, provider, external_account_id)
    values(p_passport, p_owner, 'bungie', p_profile->>'accountId')
    on conflict (provider, external_account_id) do nothing;
  select * into account from public.linked_provider_accounts
    where provider = 'bungie' and external_account_id = p_profile->>'accountId' for update;
  if account.owner_id <> p_owner or account.passport_id <> p_passport then
    raise exception 'account_already_linked' using errcode = '23505';
  end if;
  if account.last_synced_at > observed then raise exception 'older_snapshot' using errcode = '23514'; end if;
  epoch := case when account.status <> 'revoked' then account.metadata_safe->>'linkEpoch' end;
  epoch := coalesce(epoch, p_attempt::text);
  update public.linked_provider_accounts set status = 'verified', visibility = 'private',
    display_name = p_profile->>'displayName', verified_at = observed, last_synced_at = observed,
    revoked_at = null, stale_at = null,
    metadata_safe = jsonb_build_object('snapshot', p_profile, 'linkEpoch', epoch, 'normalizerVersion', 'bungie.identity.v1')
    where id = account.id;
  insert into public.verified_proofs(passport_id, owner_id, linked_provider_account_id, provider, game,
    proof_type, source_key, mode, title, display_value, source, verification_method, visibility,
    normalizer_version, verified_at, last_synced_at)
    values(p_passport, p_owner, account.id, 'bungie', null, 'provider_ownership', 'bungie:ownership:' || epoch,
      'account', 'Bungie account', p_profile->>'bungieName', 'linked_provider', 'oauth', 'private',
      'bungie.identity.v1', observed, observed)
    on conflict (linked_provider_account_id, source_key) do update set display_value = excluded.display_value,
      verified_at = excluded.verified_at, last_synced_at = excluded.last_synced_at
      where public.verified_proofs.status <> 'revoked';
  update private.bungie_link_attempts set status = 'complete', snapshot = null, account_id = account.id where id = p_attempt;
  return account.id;
end;
$$;

grant bungie_passport_executor to postgres;
grant create on schema private to bungie_passport_executor;
alter function private.bungie_link_transition(text, uuid, uuid, uuid, uuid, text, jsonb, uuid) owner to bungie_passport_executor;
revoke create on schema private from bungie_passport_executor;
revoke all on function private.bungie_link_transition(text, uuid, uuid, uuid, uuid, text, jsonb, uuid) from public, anon, authenticated;
grant execute on function private.bungie_link_transition(text, uuid, uuid, uuid, uuid, text, jsonb, uuid) to bungie_passport_writer;
revoke bungie_passport_executor from postgres;
