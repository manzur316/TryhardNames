-- Execute-only refresh access. No caller can create links, renew ownership or publish data.
create role passport_refresh_executor nologin noinherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls;
grant usage on schema public, private to passport_refresh_executor;
grant select on public.gaming_passports, public.linked_provider_accounts, public.verified_proofs to passport_refresh_executor;
grant update(updated_at) on public.gaming_passports to passport_refresh_executor;
grant update(metadata_safe, display_name, last_synced_at, stale_at) on public.linked_provider_accounts to passport_refresh_executor;
grant update(display_value, normalized_value, last_synced_at, stale_at, status) on public.verified_proofs to passport_refresh_executor;
create policy daily_passports_read on public.gaming_passports for select to passport_refresh_executor using (true);
create policy daily_passports_lock on public.gaming_passports for update to passport_refresh_executor using (true) with check (true);
create policy daily_accounts_read on public.linked_provider_accounts for select to passport_refresh_executor
  using (provider in ('steam','osu'));
create policy daily_accounts_update on public.linked_provider_accounts for update to passport_refresh_executor
  using (provider in ('steam','osu') and status in ('verified','stale') and revoked_at is null)
  with check (provider in ('steam','osu') and status in ('verified','stale') and revoked_at is null);
create policy daily_proofs_read on public.verified_proofs for select to passport_refresh_executor using (provider = 'osu');
create policy daily_proofs_update on public.verified_proofs for update to passport_refresh_executor
  using (provider = 'osu' and status <> 'revoked') with check (provider = 'osu' and status <> 'revoked');

create table private.passport_refresh_schedule (
  account_id uuid primary key references public.linked_provider_accounts(id) on delete cascade,
  claim_id uuid not null,
  verified_at timestamptz not null,
  claimed_at timestamptz not null,
  next_attempt_at timestamptz not null,
  completed_at timestamptz,
  outcome text check (outcome in ('updated','unavailable'))
);
alter table private.passport_refresh_schedule enable row level security;
revoke all on private.passport_refresh_schedule from public, anon, authenticated;
grant select, insert, update on private.passport_refresh_schedule to passport_refresh_executor;
create policy daily_schedule_executor on private.passport_refresh_schedule to passport_refresh_executor using (true) with check (true);
create index daily_refresh_accounts on public.linked_provider_accounts(provider, last_synced_at, id)
  where status in ('verified','stale') and revoked_at is null;

create function private.claim_passport_refresh(p_provider text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare a public.linked_provider_accounts; claim uuid; claimed uuid;
begin
  if (p_provider = 'steam' and session_user <> 'steam_passport_writer')
    or (p_provider = 'osu' and session_user <> 'osu_linking_writer')
    or p_provider is null or p_provider not in ('steam','osu') then
    raise exception 'provider_denied' using errcode = '42501';
  end if;
  for a in select l.* from public.linked_provider_accounts l
    join public.gaming_passports p on p.id = l.passport_id and p.owner_id = l.owner_id
    left join private.passport_refresh_schedule s on s.account_id = l.id
    where l.provider = p_provider and l.status in ('verified','stale') and l.revoked_at is null
      and l.verified_at is not null and p.suspended_at is null
      and p.status in ('draft_private','published','unpublished')
      and (s.next_attempt_at is null or s.next_attempt_at <= now())
      and (l.last_synced_at is null or l.last_synced_at < date_trunc('day', now() at time zone 'UTC') at time zone 'UTC')
    order by l.last_synced_at nulls first, l.id limit 1 for update of l skip locked
  loop
    claim := gen_random_uuid();
    insert into private.passport_refresh_schedule(account_id, claim_id, verified_at, claimed_at, next_attempt_at)
      values(a.id, claim, a.verified_at, now(), (date_trunc('day', now() at time zone 'UTC') + interval '1 day') at time zone 'UTC')
      on conflict (account_id) do update set claim_id = excluded.claim_id, verified_at = excluded.verified_at,
        claimed_at = excluded.claimed_at, next_attempt_at = excluded.next_attempt_at, completed_at = null, outcome = null
      where private.passport_refresh_schedule.next_attempt_at <= now() returning claim_id into claimed;
    if claimed is not null then
      return jsonb_build_object('id', a.id, 'claimId', claim, 'externalId', a.external_account_id,
        'verifiedAt', a.verified_at, 'mode', a.metadata_safe->'snapshot'->>'mode');
    end if;
  end loop;
  return null;
end; $$;

create function private.finish_passport_refresh(p_provider text, p_account uuid, p_claim uuid, p_data jsonb)
returns boolean language plpgsql security definer set search_path = '' as $$
declare a public.linked_provider_accounts; s private.passport_refresh_schedule; snap jsonb; extra jsonb;
  metric text; item jsonb; icon jsonb; parent uuid;
begin
  if (p_provider = 'steam' and session_user <> 'steam_passport_writer')
    or (p_provider = 'osu' and session_user <> 'osu_linking_writer')
    or p_provider is null or p_provider not in ('steam','osu') then
    raise exception 'provider_denied' using errcode = '42501';
  end if;
  select passport_id into parent from public.linked_provider_accounts where id = p_account and provider = p_provider;
  -- Same lock order as linking, unlinking and publication. Never resurrect a revoked/relinked account.
  perform 1 from public.gaming_passports where id = parent and suspended_at is null
    and status in ('draft_private','published','unpublished') for update;
  if not found then return false; end if;
  select * into a from public.linked_provider_accounts where id = p_account and provider = p_provider for update;
  select * into s from private.passport_refresh_schedule where account_id = p_account for update;
  if a.id is null or s.account_id is null or s.claim_id is distinct from p_claim or s.completed_at is not null
    or s.claimed_at < now() - interval '10 minutes' or a.status not in ('verified','stale')
    or a.revoked_at is not null or a.verified_at is distinct from s.verified_at then return false; end if;
  if p_data is null then
    update private.passport_refresh_schedule set completed_at = now(), outcome = 'unavailable' where account_id = a.id;
    return false;
  end if;
  snap := p_data->'snapshot'; extra := p_data->'achievements';
  if jsonb_typeof(p_data) <> 'object' or pg_column_size(p_data) > 11000
    or jsonb_typeof(snap) is distinct from 'object' or (p_data - array['snapshot','achievements']) <> '{}'::jsonb
    or (snap->>'verifiedAt')::timestamptz is distinct from a.verified_at then
    raise exception 'invalid_refresh' using errcode = '23514';
  end if;
  if p_provider = 'steam' then
    if snap->>'steamId' is distinct from a.external_account_id
      or not (snap ?& array['steamId','displayName','avatarUrl','createdAt','verifiedAt','library','dataError'])
      or jsonb_typeof(snap->'displayName') is distinct from 'string'
      or jsonb_typeof(snap->'avatarUrl') not in ('null','string')
      or snap->'dataError' is distinct from 'null'::jsonb
      or (snap - array['steamId','displayName','avatarUrl','createdAt','verifiedAt','library','dataError']) <> '{}'::jsonb
      or char_length(snap->>'displayName') not between 1 and 64
      or jsonb_typeof(snap->'library'->'games') is distinct from 'array'
      or jsonb_array_length(snap->'library'->'games') > 6
      or snap->'library'->>'status' not in ('available','unavailable')
      or jsonb_typeof(extra) is distinct from 'array' or jsonb_array_length(extra) > 6 then
      raise exception 'invalid_steam_refresh' using errcode = '23514';
    end if;
    if ((snap->'library') - array['status','gameCount','games']) <> '{}'::jsonb
      or not (snap->'library' ?& array['status','gameCount','games'])
      or (snap->'library'->>'status' = 'unavailable' and
        (snap->'library'->'games' <> '[]'::jsonb or snap->'library'->'gameCount' <> 'null'::jsonb))
      or (snap->'library'->>'status' = 'available' and
        (jsonb_typeof(snap->'library'->'gameCount') is distinct from 'number'
          or snap->'library'->>'gameCount' !~ '^[0-9]{1,10}$')) then
      raise exception 'invalid_library' using errcode = '23514';
    end if;
    for item in select value from jsonb_array_elements(snap->'library'->'games') loop
      if jsonb_typeof(item) <> 'object' or not (item ?& array['appId','name','playtimeMinutes','recentMinutes','iconUrl'])
        or (item - array['appId','name','playtimeMinutes','recentMinutes','iconUrl']) <> '{}'::jsonb
        or jsonb_typeof(item->'appId') <> 'number' or item->>'appId' !~ '^[1-9][0-9]{0,9}$'
        or jsonb_typeof(item->'name') <> 'string' or char_length(btrim(item->>'name')) not between 1 and 100
        or jsonb_typeof(item->'iconUrl') not in ('string','null') then
        raise exception 'invalid_game' using errcode = '23514';
      end if;
      foreach metric in array array['playtimeMinutes','recentMinutes'] loop
        if item->metric <> 'null'::jsonb and (jsonb_typeof(item->metric) <> 'number' or item->>metric !~ '^[0-9]{1,15}$') then
          raise exception 'invalid_playtime' using errcode = '23514';
        end if;
      end loop;
      if item->'iconUrl' <> 'null'::jsonb and (char_length(item->>'iconUrl') > 512
        or item->>'iconUrl' !~ '^https://cdn[.]cloudflare[.]steamstatic[.]com/steamcommunity/public/images/apps/[0-9]+/[a-f0-9]{40}[.]jpg$') then
        raise exception 'invalid_icon' using errcode = '23514';
      end if;
    end loop;
    if snap->'avatarUrl' <> 'null'::jsonb and (char_length(snap->>'avatarUrl') > 512
      or snap->>'avatarUrl' !~ '^https://(avatars[.]steamstatic[.]com|avatars[.]fastly[.]steamstatic[.]com|avatars[.]akamai[.]steamstatic[.]com|steamcdn-a[.]akamaihd[.]net)/') then
      raise exception 'invalid_avatar' using errcode = '23514';
    end if;
    for item in select value from jsonb_array_elements(extra) loop
      if jsonb_typeof(item) <> 'object' or not (item ?& array['appId','status','unlocked','total','recent'])
        or (item - array['appId','status','unlocked','total','recent']) <> '{}'::jsonb
        or jsonb_typeof(item->'appId') <> 'number' or jsonb_typeof(item->'status') <> 'string'
        or (item->>'appId') !~ '^[1-9][0-9]{0,9}$'
        or not exists(select 1 from jsonb_array_elements(snap->'library'->'games') g where g->'appId' = item->'appId')
        or item->>'status' not in ('available','unavailable')
        or jsonb_typeof(item->'recent') is distinct from 'array' or jsonb_array_length(item->'recent') > 3 then
        raise exception 'invalid_achievements' using errcode = '23514';
      end if;
      if item->>'status' = 'available' and ((item->>'total') !~ '^[0-9]{1,6}$'
        or (item->>'unlocked') !~ '^[0-9]{1,6}$' or (item->>'unlocked')::int > (item->>'total')::int) then
        raise exception 'invalid_progress' using errcode = '23514';
      end if;
      for icon in select value from jsonb_array_elements(item->'recent') loop
        if jsonb_typeof(icon) <> 'object' or not (icon ?& array['name','iconUrl'])
          or (icon - array['name','iconUrl']) <> '{}'::jsonb or jsonb_typeof(icon->'name') <> 'string'
          or jsonb_typeof(icon->'iconUrl') not in ('string','null') or char_length(icon->>'name') > 64
          or char_length(icon->>'iconUrl') > 256
          or (icon->'iconUrl' <> 'null'::jsonb and icon->>'iconUrl' !~ '^https://(cdn[.]cloudflare[.]steamstatic[.]com|cdn[.]akamai[.]steamstatic[.]com|cdn[.]fastly[.]steamstatic[.]com|steamcdn-a[.]akamaihd[.]net|steamcommunity-a[.]akamaihd[.]net|shared[.]akamai[.]steamstatic[.]com|shared[.]fastly[.]steamstatic[.]com)/steamcommunity/public/images/apps/[0-9]+/[a-f0-9]+[.](jpg|png)$')
          then raise exception 'invalid_icon' using errcode = '23514'; end if;
      end loop;
    end loop;
    update public.linked_provider_accounts set metadata_safe = jsonb_set(metadata_safe, '{snapshot}', snap)
      || jsonb_build_object('achievements', extra), display_name = snap->>'displayName', last_synced_at = now(), stale_at = null where id = a.id;
  else
    if snap->>'externalAccountId' is distinct from a.external_account_id
      or snap->>'mode' is distinct from a.metadata_safe->'snapshot'->>'mode'
      or char_length(snap->>'username') not between 1 and 64
      or not (snap ?& array['externalAccountId','username','mode','pp','globalRank','countryRank','accuracyPercent','medals','verifiedAt'])
      or (snap - array['externalAccountId','username','mode','pp','globalRank','countryRank','accuracyPercent','medals','verifiedAt']) <> '{}'::jsonb then
      raise exception 'invalid_osu_refresh' using errcode = '23514';
    end if;
    foreach metric in array array['pp','globalRank','countryRank','accuracyPercent','medals'] loop
      if jsonb_typeof(snap->metric) not in ('number','null') then raise exception 'invalid_metric' using errcode = '23514'; end if;
      if jsonb_typeof(snap->metric) = 'number' and ((snap->>metric)::numeric < 0 or (snap->>metric)::numeric > 9007199254740991
        or (metric = 'accuracyPercent' and (snap->>metric)::numeric > 100)
        or (metric in ('globalRank','countryRank','medals') and trunc((snap->>metric)::numeric) <> (snap->>metric)::numeric)) then
        raise exception 'invalid_metric' using errcode = '23514';
      end if;
    end loop;
    update public.linked_provider_accounts set metadata_safe = jsonb_set(metadata_safe, '{snapshot}', snap - 'externalAccountId'),
      display_name = snap->>'username', last_synced_at = now(), stale_at = null where id = a.id;
    update public.verified_proofs set display_value = snap->>'username', last_synced_at = now()
      where linked_provider_account_id = a.id and provider = 'osu' and proof_type = 'provider_ownership' and status <> 'revoked';
    update public.verified_proofs set normalized_value = snap->'pp',
      display_value = case when jsonb_typeof(snap->'pp') = 'number' then (snap->>'pp') || ' PP' else display_value end,
      status = case when jsonb_typeof(snap->'pp') = 'number' then 'current' else 'stale' end,
      stale_at = case when jsonb_typeof(snap->'pp') = 'number' then null else now() end, last_synced_at = now()
      where linked_provider_account_id = a.id and provider = 'osu' and proof_type = 'competitive_rating'
        and mode = snap->>'mode' and status <> 'revoked';
  end if;
  update private.passport_refresh_schedule set completed_at = now(), outcome = 'updated' where account_id = a.id;
  return true;
end; $$;

grant passport_refresh_executor to postgres;
grant create on schema private to passport_refresh_executor;
alter function private.claim_passport_refresh(text) owner to passport_refresh_executor;
alter function private.finish_passport_refresh(text, uuid, uuid, jsonb) owner to passport_refresh_executor;
revoke create on schema private from passport_refresh_executor;
revoke passport_refresh_executor from postgres;
revoke all on function private.claim_passport_refresh(text) from public, anon, authenticated;
revoke all on function private.finish_passport_refresh(text, uuid, uuid, jsonb) from public, anon, authenticated;
grant execute on function private.claim_passport_refresh(text), private.finish_passport_refresh(text, uuid, uuid, jsonb)
  to steam_passport_writer, osu_linking_writer;
