begin;

create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;

select plan(36);

create function pg_temp.test_sqlstate(statement text)
returns text
language plpgsql
as $$
begin
  execute statement;
  return '00000';
exception when others then
  return sqlstate;
end;
$$;

create function pg_temp.test_row_count(statement text)
returns integer
language plpgsql
as $$
declare
  affected_rows integer;
begin
  execute statement;
  get diagnostics affected_rows = row_count;
  return affected_rows;
exception when others then
  return -1;
end;
$$;

select has_table('public', 'gaming_passports', 'gaming_passports table exists');
select has_table('public', 'linked_provider_accounts', 'linked_provider_accounts table exists');
select has_table('public', 'verified_proofs', 'verified_proofs table exists');
select has_table('public', 'passport_featured_proofs', 'passport_featured_proofs table exists');
select has_table('public', 'passport_visibility_settings', 'passport_visibility_settings table exists');

select ok(
  (select relrowsecurity from pg_class where oid = 'public.gaming_passports'::regclass),
  'RLS is enabled for gaming_passports'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.linked_provider_accounts'::regclass),
  'RLS is enabled for linked_provider_accounts'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.verified_proofs'::regclass),
  'RLS is enabled for verified_proofs'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.passport_featured_proofs'::regclass),
  'RLS is enabled for passport_featured_proofs'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.passport_visibility_settings'::regclass),
  'RLS is enabled for passport_visibility_settings'
);

insert into auth.users (id, aud, role, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', now(), now()),
  ('00000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', now(), now()),
  ('00000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', now(), now()),
  ('00000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', now(), now()),
  ('00000000-0000-0000-0000-000000000005', 'authenticated', 'authenticated', now(), now());

insert into public.gaming_passports (
  id,
  owner_id,
  slug,
  status,
  alias,
  publication_consent,
  published_at
)
values (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'player-one',
  'published',
  'Player One',
  true,
  now()
);

insert into public.gaming_passports (
  id,
  owner_id,
  slug,
  status,
  alias,
  publication_consent,
  published_at
)
values (
  '10000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000002',
  'player-two',
  'published',
  'Player Two',
  true,
  now()
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.gaming_passports (
      id,
      owner_id,
      slug
    )
    values (
      '10000000-0000-0000-0000-000000000003',
      '00000000-0000-0000-0000-000000000001',
      'player-three'
    )
  $$),
  '23505',
  'an owner can only have one Gaming Passport'
);

select ok(
  exists (
    select 1
    from public.gaming_passports
    where slug = 'player-one'
  ),
  'canonical slug is accepted'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.gaming_passports (
      id,
      owner_id,
      slug
    )
    values (
      '10000000-0000-0000-0000-000000000004',
      '00000000-0000-0000-0000-000000000003',
      'Player-One'
    )
  $$),
  '23514',
  'noncanonical slug is rejected'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.gaming_passports (
      id,
      owner_id,
      slug
    )
    values (
      '10000000-0000-0000-0000-000000000005',
      '00000000-0000-0000-0000-000000000004',
      'account'
    )
  $$),
  '23514',
  'reserved slug is rejected'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.gaming_passports (
      id,
      owner_id,
      slug
    )
    values (
      '10000000-0000-0000-0000-000000000006',
      '00000000-0000-0000-0000-000000000005',
      'player-two'
    )
  $$),
  '23505',
  'duplicate slug is rejected'
);

insert into public.linked_provider_accounts (
  id,
  passport_id,
  owner_id,
  provider,
  external_account_id,
  display_name,
  status,
  visibility,
  verified_at
)
values
  (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'riot',
    'RiotPUUID-1',
    'Riot Player One',
    'verified',
    'public',
    now()
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'riot',
    'RiotPUUID-2',
    'Riot Player Two',
    'verified',
    'public',
    now()
  );

select is(
  pg_temp.test_sqlstate($$
    insert into public.linked_provider_accounts (
      id,
      passport_id,
      owner_id,
      provider,
      external_account_id,
      status,
      verified_at
    )
    values (
      '20000000-0000-0000-0000-000000000003',
      '10000000-0000-0000-0000-000000000002',
      '00000000-0000-0000-0000-000000000002',
      'riot',
      'RiotPUUID-1',
      'verified',
      now()
    )
  $$),
  '23505',
  'two owners cannot claim the same provider external account'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.linked_provider_accounts (
      id,
      passport_id,
      owner_id,
      provider,
      external_account_id,
      status,
      verified_at
    )
    values (
      '20000000-0000-0000-0000-000000000004',
      '10000000-0000-0000-0000-000000000002',
      '00000000-0000-0000-0000-000000000002',
      'riot',
      'riotpuuid-1',
      'verified',
      now()
    )
  $$),
  '00000',
  'external account ids remain case-sensitive opaque identifiers'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.linked_provider_accounts (
      id,
      passport_id,
      owner_id,
      provider,
      external_account_id
    )
    values (
      '20000000-0000-0000-0000-000000000005',
      '10000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000002',
      'discord',
      'CrossOwnerDiscord'
    )
  $$),
  '23503',
  'provider owner_id must match the owning Passport'
);

insert into public.verified_proofs (
  id,
  passport_id,
  owner_id,
  linked_provider_account_id,
  provider,
  game,
  proof_type,
  source_key,
  mode,
  title,
  display_value,
  source,
  verification_method,
  status,
  visibility,
  normalizer_version,
  verified_at
)
values
  (
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'riot',
    'league_of_legends',
    'competitive_rank',
    'lol:solo:2026',
    'solo_duo',
    'Solo/Duo Rank',
    'Emerald IV',
    'game_adapter',
    'game_api',
    'current',
    'public',
    'lol-rank-v1',
    now()
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000002',
    'riot',
    'league_of_legends',
    'competitive_rank',
    'lol:solo:2026',
    'solo_duo',
    'Solo/Duo Rank',
    'Gold I',
    'game_adapter',
    'game_api',
    'current',
    'public',
    'lol-rank-v1',
    now()
  );

select is(
  pg_temp.test_sqlstate($$
    insert into public.verified_proofs (
      id,
      passport_id,
      owner_id,
      linked_provider_account_id,
      provider,
      game,
      proof_type,
      source_key,
      mode,
      title,
      display_value,
      source,
      verification_method,
      normalizer_version,
      verified_at
    )
    values (
      '30000000-0000-0000-0000-000000000003',
      '10000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000001',
      '20000000-0000-0000-0000-000000000001',
      'discord',
      null,
      'social_verification',
      'discord:verified',
      'account',
      'Discord verified',
      'Verified',
      'linked_provider',
      'oauth',
      'discord-social-v1',
      now()
    )
  $$),
  '23503',
  'proof provider must match the source linked provider'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.verified_proofs (
      id,
      passport_id,
      owner_id,
      linked_provider_account_id,
      provider,
      game,
      proof_type,
      source_key,
      mode,
      title,
      display_value,
      source,
      verification_method,
      normalizer_version,
      verified_at
    )
    values (
      '30000000-0000-0000-0000-000000000004',
      '10000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000001',
      '20000000-0000-0000-0000-000000000001',
      'riot',
      null,
      'competitive_rank',
      'lol:flex:2026',
      'flex',
      'Flex Rank',
      'Platinum II',
      'game_adapter',
      'game_api',
      'lol-rank-v1',
      now()
    )
  $$),
  '23514',
  'competitive rank requires a game'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.verified_proofs (
      id,
      passport_id,
      owner_id,
      linked_provider_account_id,
      provider,
      game,
      proof_type,
      source_key,
      mode,
      title,
      display_value,
      source,
      verification_method,
      normalizer_version,
      verified_at
    )
    values (
      '30000000-0000-0000-0000-000000000005',
      '10000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000001',
      '20000000-0000-0000-0000-000000000001',
      'riot',
      'league_of_legends',
      'social_verification',
      'riot:social',
      'account',
      'Social verified',
      'Verified',
      'linked_provider',
      'oauth',
      'social-v1',
      now()
    )
  $$),
  '23514',
  'social verification cannot have a game'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.verified_proofs (
      id,
      passport_id,
      owner_id,
      linked_provider_account_id,
      provider,
      game,
      proof_type,
      source_key,
      mode,
      title,
      display_value,
      source,
      verification_method,
      normalizer_version,
      verified_at
    )
    values (
      '30000000-0000-0000-0000-000000000006',
      '10000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000001',
      '20000000-0000-0000-0000-000000000001',
      'riot',
      'league_of_legends',
      'competitive_rank',
      'lol:bad-source',
      'solo_duo',
      'Solo/Duo Rank',
      'Emerald IV',
      'linked_provider',
      'game_api',
      'lol-rank-v1',
      now()
    )
  $$),
  '23514',
  'game proof source must be game_adapter'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.verified_proofs (
      id,
      passport_id,
      owner_id,
      linked_provider_account_id,
      provider,
      game,
      proof_type,
      source_key,
      mode,
      title,
      display_value,
      source,
      verification_method,
      normalizer_version,
      verified_at
    )
    values (
      '30000000-0000-0000-0000-000000000007',
      '10000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000001',
      '20000000-0000-0000-0000-000000000001',
      'riot',
      'league_of_legends',
      'competitive_rank',
      'lol:solo:2026',
      'solo_duo',
      'Solo/Duo Rank',
      'Emerald IV',
      'game_adapter',
      'game_api',
      'lol-rank-v1',
      now()
    )
  $$),
  '23505',
  'source_key must be unique per linked provider'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.passport_featured_proofs (
      passport_id,
      owner_id,
      verified_proof_id,
      sort_order
    )
    values (
      '10000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000001',
      '30000000-0000-0000-0000-000000000001',
      6
    )
  $$),
  '23514',
  'featured proof positions are limited to 0 through 5'
);

set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';
set local request.jwt.claim.role = 'authenticated';

select is(
  (
    select count(*)::integer
    from public.gaming_passports
    where id = '10000000-0000-0000-0000-000000000001'
  ),
  1,
  'owner A can read their Passport'
);

set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000002';

select is(
  (
    select count(*)::integer
    from public.gaming_passports
    where id = '10000000-0000-0000-0000-000000000001'
  ),
  0,
  'owner B cannot read owner A Passport'
);

set local role anon;
set local request.jwt.claim.sub = '';
set local request.jwt.claim.role = 'anon';

select is(
  pg_temp.test_sqlstate($$
    select count(*)::integer
    from public.gaming_passports
  $$),
  '42501',
  'anon cannot read tables directly'
);

set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';
set local request.jwt.claim.role = 'authenticated';

select is(
  (
    select count(*)::integer
    from public.linked_provider_accounts
    where passport_id = '10000000-0000-0000-0000-000000000001'
  ),
  1,
  'owner can read their provider accounts'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.linked_provider_accounts (
      id,
      passport_id,
      owner_id,
      provider,
      external_account_id
    )
    values (
      '20000000-0000-0000-0000-000000000006',
      '10000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000001',
      'discord',
      'ClientInsertedDiscord'
    )
  $$),
  '42501',
  'owner cannot insert provider accounts from the client role'
);

select is(
  (
    select count(*)::integer
    from public.verified_proofs
    where passport_id = '10000000-0000-0000-0000-000000000001'
  ),
  1,
  'owner can read their proofs'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.verified_proofs (
      id,
      passport_id,
      owner_id,
      linked_provider_account_id,
      provider,
      game,
      proof_type,
      source_key,
      mode,
      title,
      display_value,
      source,
      verification_method,
      normalizer_version,
      verified_at
    )
    values (
      '30000000-0000-0000-0000-000000000008',
      '10000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000001',
      '20000000-0000-0000-0000-000000000001',
      'riot',
      'league_of_legends',
      'competitive_rank',
      'lol:client-insert',
      'solo_duo',
      'Solo/Duo Rank',
      'Emerald IV',
      'game_adapter',
      'game_api',
      'lol-rank-v1',
      now()
    )
  $$),
  '42501',
  'owner cannot insert proofs from the client role'
);

select is(
  pg_temp.test_row_count($$
    update public.verified_proofs
    set title = 'Changed by client'
    where id = '30000000-0000-0000-0000-000000000001'
  $$),
  0,
  'owner cannot modify proofs from the client role'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.passport_featured_proofs (
      passport_id,
      owner_id,
      verified_proof_id,
      sort_order
    )
    values (
      '10000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000001',
      '30000000-0000-0000-0000-000000000001',
      0
    )
  $$),
  '00000',
  'owner can feature one of their proofs'
);

select is(
  pg_temp.test_row_count($$
    update public.passport_featured_proofs
    set sort_order = 1
    where passport_id = '10000000-0000-0000-0000-000000000001'
      and verified_proof_id = '30000000-0000-0000-0000-000000000001'
  $$),
  1,
  'owner can reorder their featured proofs'
);

select is(
  pg_temp.test_row_count($$
    delete from public.passport_featured_proofs
    where passport_id = '10000000-0000-0000-0000-000000000001'
      and verified_proof_id = '30000000-0000-0000-0000-000000000001'
  $$),
  1,
  'owner can remove their featured proof selection'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.passport_featured_proofs (
      passport_id,
      owner_id,
      verified_proof_id,
      sort_order
    )
    values (
      '10000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000001',
      '30000000-0000-0000-0000-000000000002',
      0
    )
  $$),
  '23503',
  'owner cannot feature a proof from another Passport'
);

reset role;

select * from finish();

rollback;
