-- Requires only gaming_passport_core. Staging applies an explicit migration allowlist.
alter table public.linked_provider_accounts drop constraint linked_provider_accounts_provider_check,
  add constraint linked_provider_accounts_provider_check check (provider in ('discord', 'riot', 'osu'));
alter table public.verified_proofs drop constraint verified_proofs_provider_check,
  add constraint verified_proofs_provider_check check (provider in ('discord', 'riot', 'osu'));
alter table public.verified_proofs drop constraint verified_proofs_game_check,
  add constraint verified_proofs_game_check check (game is null or game in ('league_of_legends', 'osu'));
alter table public.verified_proofs add constraint verified_proofs_osu_game_check
  check (game <> 'osu' or (provider = 'osu' and mode in ('osu', 'taiko', 'fruits', 'mania')));

-- Neither role can administer the project. Login/password provisioning is separate.
create role osu_passport_executor nologin noinherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls;
create role osu_passport_writer nologin noinherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls;
grant usage on schema public, private to osu_passport_executor;
grant usage on schema private to osu_passport_writer;
grant select on public.gaming_passports to osu_passport_executor;
grant update (updated_at) on public.gaming_passports to osu_passport_executor;
grant select, insert, update on public.linked_provider_accounts, public.verified_proofs to osu_passport_executor;
create policy osu_executor_passport_read on public.gaming_passports for select to osu_passport_executor using (true);
create policy osu_executor_passport_lock on public.gaming_passports for update to osu_passport_executor using (true) with check (true);
create policy osu_executor_accounts on public.linked_provider_accounts to osu_passport_executor
  using (provider = 'osu') with check (provider = 'osu' and visibility = 'private');
create policy osu_executor_proofs on public.verified_proofs to osu_passport_executor
  using (provider = 'osu') with check (provider = 'osu' and visibility = 'private');

create table private.osu_link_receipts (
  attempt_id uuid primary key,
  owner_id uuid not null,
  passport_id uuid not null,
  linked_provider_account_id uuid not null,
  created_at timestamptz not null default now(),
  foreign key (passport_id, owner_id) references public.gaming_passports(id, owner_id) on delete cascade,
  foreign key (linked_provider_account_id) references public.linked_provider_accounts(id) on delete cascade
);
create index osu_link_receipts_passport_idx on private.osu_link_receipts(passport_id);
create index osu_link_receipts_account_idx on private.osu_link_receipts(linked_provider_account_id);
alter table private.osu_link_receipts enable row level security;
revoke all on private.osu_link_receipts from public, anon, authenticated, osu_passport_writer;
grant select, insert on private.osu_link_receipts to osu_passport_executor;
create policy osu_executor_receipts on private.osu_link_receipts to osu_passport_executor using (true) with check (true);

-- Auth owns its schema. Expose only this boolean internally, never Auth rows or browser RPCs.
create function private.osu_owner_session_active(p_owner uuid, p_session uuid)
returns boolean language sql security definer set search_path = '' as $$
  select exists(select 1 from auth.sessions where id = p_session and user_id = p_owner
    and (not_after is null or not_after > now()));
$$;
revoke all on function private.osu_owner_session_active(uuid, uuid) from public, anon, authenticated;
grant execute on function private.osu_owner_session_active(uuid, uuid) to osu_passport_executor;

create function private.persist_osu_link(
  p_owner uuid, p_session uuid, p_passport uuid, p_attempt uuid, p_profile jsonb
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  account public.linked_provider_accounts;
  receipt private.osu_link_receipts;
  observed timestamptz;
  epoch text;
  snapshot jsonb;
  metric text;
begin
  if p_owner is null or p_session is null or p_passport is null or p_attempt is null then
    raise exception 'owner_session_required' using errcode = '42501';
  end if;
  if not private.osu_owner_session_active(p_owner, p_session) then
    raise exception 'owner_session_required' using errcode = '42501';
  end if;
  -- Lock the parent before the account; concurrent requests for one owner serialize.
  perform 1 from public.gaming_passports where id = p_passport and owner_id = p_owner
    and status = 'draft_private' and publication_consent is false and slug is null for update;
  if not found then raise exception 'private_passport_required' using errcode = '42501'; end if;
  select * into receipt from private.osu_link_receipts where attempt_id = p_attempt;
  if found then
    if receipt.owner_id <> p_owner or receipt.passport_id <> p_passport then
      raise exception 'attempt_conflict' using errcode = '42501';
    end if;
    return receipt.linked_provider_account_id;
  end if;
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
  insert into public.linked_provider_accounts(passport_id, owner_id, provider, external_account_id)
    values(p_passport, p_owner, 'osu', p_profile->>'externalAccountId')
    on conflict (provider, external_account_id) do nothing;
  select * into account from public.linked_provider_accounts
    where provider = 'osu' and external_account_id = p_profile->>'externalAccountId' for update;
  if account.owner_id <> p_owner or account.passport_id <> p_passport then
    raise exception 'external_account_conflict' using errcode = '23505';
  end if;
  if account.last_synced_at > observed then raise exception 'older_osu_snapshot' using errcode = '23514'; end if;
  epoch := case when account.status <> 'revoked' then account.metadata_safe->>'linkEpoch' end;
  if epoch is null then epoch := p_attempt::text; end if;
  snapshot := p_profile - 'externalAccountId';
  update public.linked_provider_accounts set display_name = p_profile->>'username', status = 'verified',
    visibility = 'private', verified_at = observed, last_synced_at = observed, stale_at = null, revoked_at = null,
    metadata_safe = jsonb_build_object('snapshot', snapshot, 'linkEpoch', epoch, 'normalizerVersion', 'osu.private.v1')
    where id = account.id;
  -- Existing revoked proofs stay terminal. Relinking uses a new epoch/source key.
  insert into public.verified_proofs(passport_id, owner_id, linked_provider_account_id, provider, game,
    proof_type, source_key, mode, title, display_value, source, verification_method, visibility,
    normalizer_version, verified_at, last_synced_at)
    values(p_passport, p_owner, account.id, 'osu', null, 'provider_ownership', 'osu:ownership:' || epoch,
      'account', 'osu! account', p_profile->>'username', 'linked_provider', 'oauth', 'private',
      'osu.private.v1', observed, observed)
    on conflict (linked_provider_account_id, source_key) do update set display_value = excluded.display_value,
      verified_at = excluded.verified_at, last_synced_at = excluded.last_synced_at
      where public.verified_proofs.status <> 'revoked';
  if jsonb_typeof(p_profile->'pp') = 'number' then
    insert into public.verified_proofs(passport_id, owner_id, linked_provider_account_id, provider, game,
      proof_type, source_key, mode, title, display_value, normalized_value, source, verification_method,
      visibility, normalizer_version, verified_at, last_synced_at)
      values(p_passport, p_owner, account.id, 'osu', 'osu', 'competitive_rating',
        'osu:pp:' || (p_profile->>'mode') || ':' || epoch, p_profile->>'mode', 'Performance points',
        (p_profile->>'pp') || ' PP', p_profile->'pp', 'game_adapter', 'oauth', 'private',
        'osu.private.v1', observed, observed)
      on conflict (linked_provider_account_id, source_key) do update set display_value = excluded.display_value,
        normalized_value = excluded.normalized_value, status = 'current', stale_at = null,
        verified_at = excluded.verified_at, last_synced_at = excluded.last_synced_at
        where public.verified_proofs.status <> 'revoked';
  else
    update public.verified_proofs set status = 'stale', stale_at = observed
      where linked_provider_account_id = account.id and status = 'current'
        and source_key = 'osu:pp:' || (p_profile->>'mode') || ':' || epoch;
  end if;
  insert into private.osu_link_receipts(attempt_id, owner_id, passport_id, linked_provider_account_id)
    values(p_attempt, p_owner, p_passport, account.id);
  return account.id;
end;
$$;

create function private.unlink_osu_account(p_owner uuid, p_session uuid, p_passport uuid, p_account uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not private.osu_owner_session_active(p_owner, p_session) then
    raise exception 'owner_session_required' using errcode = '42501';
  end if;
  perform 1 from public.gaming_passports where id = p_passport and owner_id = p_owner for update;
  if not found then raise exception 'passport_not_found' using errcode = '42501'; end if;
  perform 1 from public.linked_provider_accounts where id = p_account and owner_id = p_owner
    and passport_id = p_passport and provider = 'osu' for update;
  if not found then raise exception 'account_not_found' using errcode = '42501'; end if;
  update public.linked_provider_accounts set status = 'revoked', visibility = 'private', revoked_at = coalesce(revoked_at, now()),
    metadata_safe = '{}'::jsonb where id = p_account;
  update public.verified_proofs set status = 'revoked', visibility = 'private', revoked_at = coalesce(revoked_at, now())
    where linked_provider_account_id = p_account and provider = 'osu';
end;
$$;

-- Use a non-login, RLS-bound function owner, not postgres or an administrative API role.
grant osu_passport_executor to postgres;
grant create on schema private to osu_passport_executor;
alter function private.persist_osu_link(uuid, uuid, uuid, uuid, jsonb) owner to osu_passport_executor;
alter function private.unlink_osu_account(uuid, uuid, uuid, uuid) owner to osu_passport_executor;
revoke create on schema private from osu_passport_executor;
revoke all on function private.persist_osu_link(uuid, uuid, uuid, uuid, jsonb) from public, anon, authenticated;
revoke all on function private.unlink_osu_account(uuid, uuid, uuid, uuid) from public, anon, authenticated;
grant execute on function private.persist_osu_link(uuid, uuid, uuid, uuid, jsonb) to osu_passport_writer;
grant execute on function private.unlink_osu_account(uuid, uuid, uuid, uuid) to osu_passport_writer;
revoke osu_passport_executor from postgres;
