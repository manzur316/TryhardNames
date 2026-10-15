-- Apply only after gaming_passport_core; never run unrelated historical migrations.
alter table public.linked_provider_accounts drop constraint linked_provider_accounts_provider_check,
  add constraint linked_provider_accounts_provider_check check (provider in ('discord', 'riot', 'osu', 'roblox'));
alter table public.verified_proofs drop constraint verified_proofs_provider_check,
  add constraint verified_proofs_provider_check check (provider in ('discord', 'riot', 'osu', 'roblox'));

create role roblox_passport_executor nologin noinherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls;
create role roblox_passport_writer nologin noinherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls;
grant usage on schema public, private to roblox_passport_executor;
grant usage on schema private to roblox_passport_writer;
grant select, update (updated_at) on public.gaming_passports to roblox_passport_executor;
grant select, insert, update on public.linked_provider_accounts, public.verified_proofs to roblox_passport_executor;
create policy roblox_executor_passport_read on public.gaming_passports for select to roblox_passport_executor using (true);
create policy roblox_executor_passport_lock on public.gaming_passports for update to roblox_passport_executor using (true) with check (true);
create policy roblox_executor_accounts on public.linked_provider_accounts to roblox_passport_executor
  using (provider = 'roblox') with check (provider = 'roblox' and visibility = 'private');
create policy roblox_executor_proofs on public.verified_proofs to roblox_passport_executor
  using (provider = 'roblox') with check (provider = 'roblox' and visibility = 'private'
    and proof_type = 'provider_ownership' and game is null and verification_method = 'oauth');

create table private.roblox_link_attempts (
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
create index roblox_link_attempts_owner_idx on private.roblox_link_attempts(owner_id, created_at desc);
create index roblox_link_attempts_passport_idx on private.roblox_link_attempts(passport_id);
create index roblox_link_attempts_account_idx on private.roblox_link_attempts(account_id);
create index roblox_link_attempts_expiry_idx on private.roblox_link_attempts(expires_at);
alter table private.roblox_link_attempts enable row level security;
revoke all on private.roblox_link_attempts from public, anon, authenticated, roblox_passport_writer;
grant select, insert, update, delete on private.roblox_link_attempts to roblox_passport_executor;
create policy roblox_executor_attempts on private.roblox_link_attempts to roblox_passport_executor using (true) with check (true);

-- The only privileged Auth lookup returns a boolean; Auth rows never reach the runtime.
create function private.roblox_owner_session_active(p_owner uuid, p_session uuid)
returns boolean language sql security definer set search_path = '' as $$
  select exists(select 1 from auth.sessions where id = p_session and user_id = p_owner
    and (not_after is null or not_after > now()));
$$;
revoke all on function private.roblox_owner_session_active(uuid, uuid) from public, anon, authenticated;
grant execute on function private.roblox_owner_session_active(uuid, uuid) to roblox_passport_executor;

-- Writer has EXECUTE only. Each transition rechecks owner/session and locks parent first.
create function private.roblox_link_transition(
  p_action text, p_owner uuid, p_session uuid, p_passport uuid, p_attempt uuid,
  p_state_hash text, p_profile jsonb default null, p_account uuid default null
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  attempt private.roblox_link_attempts;
  account public.linked_provider_accounts;
  observed timestamptz;
  epoch text;
begin
  if p_owner is null or p_session is null or p_passport is null
    or not private.roblox_owner_session_active(p_owner, p_session) then
    raise exception 'owner_session_required' using errcode = '42501';
  end if;
  perform 1 from public.gaming_passports where id = p_passport and owner_id = p_owner
    and status = 'draft_private' and slug is null and publication_consent is false for update;
  if not found then raise exception 'private_passport_required' using errcode = '42501'; end if;

  if p_action = 'unlink' then
    perform 1 from public.linked_provider_accounts where id = p_account and owner_id = p_owner
      and passport_id = p_passport and provider = 'roblox' for update;
    if not found then raise exception 'account_not_found' using errcode = '42501'; end if;
    update private.roblox_link_attempts set status = 'cancelled', snapshot = null
      where owner_id = p_owner and passport_id = p_passport;
    update public.linked_provider_accounts set status = 'revoked', visibility = 'private',
      metadata_safe = '{}'::jsonb, display_name = null, revoked_at = coalesce(revoked_at, now())
      where id = p_account;
    update public.verified_proofs set status = 'revoked', visibility = 'private',
      display_value = 'Unlinked account', revoked_at = coalesce(revoked_at, now())
      where linked_provider_account_id = p_account and provider = 'roblox';
    return p_account;
  end if;

  if p_attempt is null or p_state_hash is null or p_state_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'invalid_attempt' using errcode = '23514';
  end if;
  if p_action = 'start' then
    -- Persistent throttling works across cold starts and multiple server instances.
    if exists(select 1 from private.roblox_link_attempts where owner_id = p_owner
      and created_at > now() - interval '60 seconds') then
      raise exception 'rate_limited' using errcode = 'P0001';
    end if;
    delete from private.roblox_link_attempts where expires_at < now();
    update private.roblox_link_attempts set status = 'cancelled', snapshot = null
      where owner_id = p_owner and status in ('pending', 'processing', 'ready');
    insert into private.roblox_link_attempts(id, owner_id, passport_id, session_id, state_hash)
      values(p_attempt, p_owner, p_passport, p_session, p_state_hash);
    return p_attempt;
  end if;

  select * into attempt from private.roblox_link_attempts where id = p_attempt for update;
  if not found or attempt.owner_id <> p_owner or attempt.passport_id <> p_passport
    or attempt.session_id <> p_session or attempt.state_hash <> p_state_hash or attempt.expires_at <= now() then
    raise exception 'invalid_attempt' using errcode = '42501';
  end if;
  if p_action = 'claim' and attempt.status = 'pending' then
    update private.roblox_link_attempts set status = 'processing' where id = p_attempt;
    return p_attempt;
  end if;
  if p_action = 'cancel' then
    update private.roblox_link_attempts set status = 'cancelled', snapshot = null where id = p_attempt;
    return p_attempt;
  end if;
  if p_action = 'ready' and attempt.status = 'processing' then
    if p_profile is null or jsonb_typeof(p_profile) <> 'object' or pg_column_size(p_profile) > 3500
      or (p_profile - array['accountId','username','displayName','avatarUrl','createdAt','verifiedAt']) <> '{}'::jsonb
      or not (p_profile ?& array['accountId','username','displayName','avatarUrl','createdAt','verifiedAt'])
      or jsonb_typeof(p_profile->'accountId') <> 'string'
      or (p_profile->>'accountId') !~ '^[1-9][0-9]{0,39}$'
      or jsonb_typeof(p_profile->'username') <> 'string'
      or char_length(btrim(p_profile->>'username')) not between 1 and 64
      or jsonb_typeof(p_profile->'displayName') <> 'string'
      or char_length(btrim(p_profile->>'displayName')) not between 1 and 64
      or jsonb_typeof(p_profile->'verifiedAt') <> 'string'
      or jsonb_typeof(p_profile->'createdAt') not in ('null', 'string')
      or jsonb_typeof(p_profile->'avatarUrl') not in ('null', 'string') then
      raise exception 'invalid_snapshot' using errcode = '23514';
    end if;
    if jsonb_typeof(p_profile->'avatarUrl') = 'string' and
      (char_length(p_profile->>'avatarUrl') > 2048 or (p_profile->>'avatarUrl') !~ '^https://([A-Za-z0-9-]+[.])*rbxcdn[.]com/') then
      raise exception 'invalid_avatar' using errcode = '23514';
    end if;
    observed := (p_profile->>'verifiedAt')::timestamptz;
    if not isfinite(observed) or observed < now() - interval '1 minute' or observed > now() + interval '1 minute'
      or (p_profile->>'createdAt')::timestamptz > now() then
      raise exception 'invalid_snapshot_time' using errcode = '23514';
    end if;
    update private.roblox_link_attempts set status = 'ready', snapshot = p_profile where id = p_attempt;
    return p_attempt;
  end if;
  if p_action = 'complete' and attempt.status = 'complete' then return attempt.account_id; end if;
  if p_action <> 'complete' or attempt.status <> 'ready' then
    raise exception 'invalid_transition' using errcode = '42501';
  end if;

  p_profile := attempt.snapshot;
  observed := (p_profile->>'verifiedAt')::timestamptz;
  insert into public.linked_provider_accounts(passport_id, owner_id, provider, external_account_id)
    values(p_passport, p_owner, 'roblox', p_profile->>'accountId')
    on conflict (provider, external_account_id) do nothing;
  select * into account from public.linked_provider_accounts
    where provider = 'roblox' and external_account_id = p_profile->>'accountId' for update;
  if account.owner_id <> p_owner or account.passport_id <> p_passport then
    raise exception 'account_already_linked' using errcode = '23505';
  end if;
  if account.last_synced_at > observed then raise exception 'older_snapshot' using errcode = '23514'; end if;
  epoch := case when account.status <> 'revoked' then account.metadata_safe->>'linkEpoch' end;
  epoch := coalesce(epoch, p_attempt::text);
  update public.linked_provider_accounts set status = 'verified', visibility = 'private',
    display_name = p_profile->>'displayName', verified_at = observed, last_synced_at = observed,
    revoked_at = null, stale_at = null,
    metadata_safe = jsonb_build_object('snapshot', p_profile, 'linkEpoch', epoch, 'normalizerVersion', 'roblox.identity.v1')
    where id = account.id;
  insert into public.verified_proofs(passport_id, owner_id, linked_provider_account_id, provider, game,
    proof_type, source_key, mode, title, display_value, source, verification_method, visibility,
    normalizer_version, verified_at, last_synced_at)
    values(p_passport, p_owner, account.id, 'roblox', null, 'provider_ownership', 'roblox:ownership:' || epoch,
      'account', 'Roblox account', p_profile->>'username', 'linked_provider', 'oauth', 'private',
      'roblox.identity.v1', observed, observed)
    on conflict (linked_provider_account_id, source_key) do update set display_value = excluded.display_value,
      verified_at = excluded.verified_at, last_synced_at = excluded.last_synced_at
      where public.verified_proofs.status <> 'revoked';
  update private.roblox_link_attempts set status = 'complete', snapshot = null, account_id = account.id where id = p_attempt;
  return account.id;
end;
$$;

grant roblox_passport_executor to postgres;
grant create on schema private to roblox_passport_executor;
alter function private.roblox_link_transition(text, uuid, uuid, uuid, uuid, text, jsonb, uuid) owner to roblox_passport_executor;
revoke create on schema private from roblox_passport_executor;
revoke all on function private.roblox_link_transition(text, uuid, uuid, uuid, uuid, text, jsonb, uuid) from public, anon, authenticated;
grant execute on function private.roblox_link_transition(text, uuid, uuid, uuid, uuid, text, jsonb, uuid) to roblox_passport_writer;
revoke roblox_passport_executor from postgres;
