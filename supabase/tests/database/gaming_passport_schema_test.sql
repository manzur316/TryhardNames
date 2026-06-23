begin;

create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;

select plan(76);

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

select ok(
  has_table_privilege('authenticated', 'public.gaming_passports', 'SELECT'),
  'authenticated can select owned Passports through RLS'
);
select ok(
  has_column_privilege('authenticated', 'public.gaming_passports', 'owner_id', 'INSERT'),
  'authenticated can provide owner_id when creating a draft Passport'
);
select ok(
  not has_column_privilege('authenticated', 'public.gaming_passports', 'status', 'INSERT'),
  'authenticated cannot provide Passport status on insert'
);
select ok(
  has_column_privilege('authenticated', 'public.gaming_passports', 'alias', 'UPDATE'),
  'authenticated can update Passport presentation fields'
);
select ok(
  not has_column_privilege('authenticated', 'public.gaming_passports', 'status', 'UPDATE'),
  'authenticated cannot update Passport status'
);
select ok(
  not has_column_privilege('authenticated', 'public.gaming_passports', 'suspended_at', 'UPDATE'),
  'authenticated cannot update Passport suspension timestamp'
);
select ok(
  not has_table_privilege('authenticated', 'public.gaming_passports', 'DELETE'),
  'authenticated cannot delete Passports directly'
);

select ok(
  has_table_privilege('authenticated', 'public.linked_provider_accounts', 'SELECT'),
  'authenticated can select owned provider accounts through RLS'
);
select ok(
  not has_table_privilege('authenticated', 'public.linked_provider_accounts', 'INSERT'),
  'authenticated cannot insert provider accounts'
);
select ok(
  not has_table_privilege('authenticated', 'public.linked_provider_accounts', 'UPDATE'),
  'authenticated cannot update provider accounts'
);
select ok(
  not has_table_privilege('authenticated', 'public.linked_provider_accounts', 'DELETE'),
  'authenticated cannot delete provider accounts'
);

select ok(
  has_table_privilege('authenticated', 'public.verified_proofs', 'SELECT'),
  'authenticated can select owned proofs through RLS'
);
select ok(
  not has_table_privilege('authenticated', 'public.verified_proofs', 'INSERT'),
  'authenticated cannot insert proofs'
);
select ok(
  not has_table_privilege('authenticated', 'public.verified_proofs', 'UPDATE'),
  'authenticated cannot update proofs'
);
select ok(
  not has_table_privilege('authenticated', 'public.verified_proofs', 'DELETE'),
  'authenticated cannot delete proofs'
);
select ok(
  not has_function_privilege(
    'authenticated',
    'private.is_canonical_gaming_passport_slug(text)',
    'EXECUTE'
  ),
  'authenticated cannot execute internal helper functions directly'
);

select ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = 'public.passport_featured_proofs'::regclass
      and contype = 'p'
      and conkey = array[
        (
          select attnum
          from pg_attribute
          where attrelid = 'public.passport_featured_proofs'::regclass
            and attname = 'passport_id'
        ),
        (
          select attnum
          from pg_attribute
          where attrelid = 'public.passport_featured_proofs'::regclass
            and attname = 'verified_proof_id'
        )
      ]::smallint[]
  ),
  'featured proofs use (passport_id, verified_proof_id) as primary key'
);

insert into auth.users (id, aud, role, created_at, updated_at)
select
  ('00000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  'authenticated',
  'authenticated',
  now(),
  now()
from generate_series(1, 12) as i;

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

insert into public.passport_visibility_settings (passport_id, owner_id)
values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002');

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

select is(
  pg_temp.test_sqlstate($$
    insert into public.gaming_passports (
      id,
      owner_id,
      status,
      publication_consent,
      published_at
    )
    values (
      '10000000-0000-0000-0000-000000000007',
      '00000000-0000-0000-0000-000000000006',
      'published',
      true,
      now()
    )
  $$),
  '23514',
  'published Passport without slug is rejected'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.gaming_passports (
      id,
      owner_id,
      scene_config
    )
    values (
      '10000000-0000-0000-0000-000000000008',
      '00000000-0000-0000-0000-000000000008',
      jsonb_build_object(
        'blob',
        (select string_agg(md5(i::text), '') from generate_series(1, 400) as i)
      )
    )
  $$),
  '23514',
  'oversized scene_config is rejected'
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
      '00000000-0000-0000-0000-000000000001',
      'discord',
      ' SpacedDiscord '
    )
  $$),
  '23514',
  'external_account_id with surrounding spaces is rejected'
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
      '00000000-0000-0000-0000-000000000002',
      'discord',
      'CrossOwnerDiscord'
    )
  $$),
  '23503',
  'provider owner_id must match the owning Passport'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.linked_provider_accounts (
      id,
      passport_id,
      owner_id,
      provider,
      external_account_id,
      metadata_safe
    )
    values (
      '20000000-0000-0000-0000-000000000007',
      '10000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000001',
      'discord',
      'OversizedDiscord',
      jsonb_build_object(
        'blob',
        (select string_agg(md5(i::text), '') from generate_series(1, 400) as i)
      )
    )
  $$),
  '23514',
  'oversized linked provider metadata_safe is rejected'
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
      ' lol:spaced ',
      'solo_duo',
      'Solo/Duo Rank',
      'Emerald IV',
      'game_adapter',
      'game_api',
      'lol-rank-v1',
      now()
    )
  $$),
  '23514',
  'source_key with surrounding spaces is rejected'
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
      '30000000-0000-0000-0000-000000000009',
      '10000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000001',
      '20000000-0000-0000-0000-000000000001',
      'riot',
      'league_of_legends',
      'competitive_rank',
      'lol:spaced-mode',
      ' solo_duo ',
      'Solo/Duo Rank',
      'Emerald IV',
      'game_adapter',
      'game_api',
      'lol-rank-v1',
      now()
    )
  $$),
  '23514',
  'mode with surrounding spaces is rejected'
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
      '30000000-0000-0000-0000-000000000010',
      '10000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000001',
      '20000000-0000-0000-0000-000000000001',
      'riot',
      'league_of_legends',
      'competitive_rank',
      'lol:spaced-normalizer',
      'solo_duo',
      'Solo/Duo Rank',
      'Emerald IV',
      'game_adapter',
      'game_api',
      ' lol-rank-v1 ',
      now()
    )
  $$),
  '23514',
  'normalizer_version with surrounding spaces is rejected'
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
      metadata_safe,
      normalizer_version,
      verified_at
    )
    values (
      '30000000-0000-0000-0000-000000000011',
      '10000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000001',
      '20000000-0000-0000-0000-000000000001',
      'riot',
      'league_of_legends',
      'competitive_rank',
      'lol:oversized-metadata',
      'solo_duo',
      'Solo/Duo Rank',
      'Emerald IV',
      'game_adapter',
      'game_api',
      jsonb_build_object(
        'blob',
        (select string_agg(md5(i::text), '') from generate_series(1, 400) as i)
      ),
      'lol-rank-v1',
      now()
    )
  $$),
  '23514',
  'oversized proof metadata_safe is rejected'
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

set local role anon;
set local request.jwt.claim.sub = '';
set local request.jwt.claim.role = 'anon';

select is(
  pg_temp.test_sqlstate($$
    select private.is_canonical_gaming_passport_slug('player-one')
  $$),
  '42501',
  'anon cannot execute the canonical slug helper'
);

select is(
  pg_temp.test_sqlstate($$
    select private.set_updated_at()
  $$),
  '42501',
  'anon cannot execute the updated_at trigger helper'
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

select is(
  (
    select count(*)::integer
    from public.linked_provider_accounts
    where passport_id = '10000000-0000-0000-0000-000000000001'
  ),
  0,
  'owner B cannot read owner A provider accounts'
);

select is(
  (
    select count(*)::integer
    from public.verified_proofs
    where passport_id = '10000000-0000-0000-0000-000000000001'
  ),
  0,
  'owner B cannot read owner A proofs'
);

select is(
  (
    select count(*)::integer
    from public.passport_visibility_settings
    where passport_id = '10000000-0000-0000-0000-000000000001'
  ),
  0,
  'owner B cannot read owner A visibility settings'
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
      '20000000-0000-0000-0000-000000000008',
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
  pg_temp.test_sqlstate($$
    update public.linked_provider_accounts
    set display_name = 'Changed by client'
    where id = '20000000-0000-0000-0000-000000000001'
  $$),
  '42501',
  'owner cannot update provider accounts from the client role'
);

select is(
  pg_temp.test_sqlstate($$
    delete from public.linked_provider_accounts
    where id = '20000000-0000-0000-0000-000000000001'
  $$),
  '42501',
  'owner cannot delete provider accounts from the client role'
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
      '30000000-0000-0000-0000-000000000012',
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
  pg_temp.test_sqlstate($$
    update public.verified_proofs
    set title = 'Changed by client'
    where id = '30000000-0000-0000-0000-000000000001'
  $$),
  '42501',
  'owner cannot update proofs from the client role'
);

select is(
  pg_temp.test_sqlstate($$
    delete from public.verified_proofs
    where id = '30000000-0000-0000-0000-000000000001'
  $$),
  '42501',
  'owner cannot delete proofs from the client role'
);

set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000009';

select is(
  pg_temp.test_sqlstate($$
    insert into public.gaming_passports (
      owner_id,
      slug,
      status,
      publication_consent,
      published_at
    )
    values (
      '00000000-0000-0000-0000-000000000009',
      'client-published',
      'published',
      true,
      now()
    )
  $$),
  '42501',
  'authenticated cannot insert an already-published Passport'
);

set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000007';

select is(
  pg_temp.test_sqlstate($$
    insert into public.gaming_passports (
      owner_id,
      alias,
      avatar_url,
      bio_short,
      scene_config
    )
    values (
      '00000000-0000-0000-0000-000000000007',
      'Draft Player',
      'https://example.test/avatar.png',
      'Short bio',
      '{"layout":"default"}'::jsonb
    )
  $$),
  '00000',
  'authenticated can insert a safe private draft Passport'
);

select is(
  (
    select status
    from public.gaming_passports
    where owner_id = '00000000-0000-0000-0000-000000000007'
  ),
  'draft_private',
  'authenticated draft insert defaults to draft_private'
);

set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';

select is(
  pg_temp.test_sqlstate($$
    update public.gaming_passports
    set status = 'suspended'
    where id = '10000000-0000-0000-0000-000000000001'
  $$),
  '42501',
  'authenticated cannot modify Passport status'
);

select is(
  pg_temp.test_sqlstate($$
    update public.gaming_passports
    set suspended_at = now()
    where id = '10000000-0000-0000-0000-000000000001'
  $$),
  '42501',
  'authenticated cannot modify Passport suspended_at'
);

select is(
  pg_temp.test_sqlstate($$
    delete from public.gaming_passports
    where id = '10000000-0000-0000-0000-000000000001'
  $$),
  '42501',
  'authenticated cannot delete Passports directly'
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

set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000002';

select is(
  (
    select count(*)::integer
    from public.passport_featured_proofs
    where passport_id = '10000000-0000-0000-0000-000000000001'
  ),
  0,
  'owner B cannot read owner A featured proofs'
);

set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';

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
