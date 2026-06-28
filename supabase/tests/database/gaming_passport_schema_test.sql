begin;

create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;

select plan(184);

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
select has_table('public', 'provider_connection_intents', 'provider_connection_intents table exists');
select has_table('public', 'provider_callback_states', 'provider_callback_states table exists');
select has_table('public', 'provider_token_vault', 'provider_token_vault table exists');
select has_table('public', 'provider_sync_jobs', 'provider_sync_jobs table exists');
select has_table('public', 'provider_audit_events', 'provider_audit_events table exists');
select has_table('public', 'public_profile_reports', 'public_profile_reports table exists');

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
  (select relrowsecurity from pg_class where oid = 'public.provider_connection_intents'::regclass),
  'RLS is enabled for provider_connection_intents'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.provider_callback_states'::regclass),
  'RLS is enabled for provider_callback_states'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.provider_token_vault'::regclass),
  'RLS is enabled for provider_token_vault'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.provider_sync_jobs'::regclass),
  'RLS is enabled for provider_sync_jobs'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.provider_audit_events'::regclass),
  'RLS is enabled for provider_audit_events'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.public_profile_reports'::regclass),
  'RLS is enabled for public_profile_reports'
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
  has_function_privilege(
    'authenticated',
    'public.set_gaming_passport_publication_consent(uuid, boolean)',
    'EXECUTE'
  ),
  'authenticated can execute the publication consent command'
);
select ok(
  has_function_privilege(
    'authenticated',
    'public.claim_gaming_passport_slug(uuid, text)',
    'EXECUTE'
  ),
  'authenticated can execute the slug claim command'
);
select ok(
  has_function_privilege(
    'authenticated',
    'public.publish_gaming_passport(uuid)',
    'EXECUTE'
  ),
  'authenticated can execute the publish command'
);
select ok(
  has_function_privilege(
    'authenticated',
    'public.unpublish_gaming_passport(uuid)',
    'EXECUTE'
  ),
  'authenticated can execute the unpublish command'
);
select ok(
  has_function_privilege(
    'anon',
    'public.get_public_gaming_passport_projection(text)',
    'EXECUTE'
  ),
  'anon can execute the public Gaming Passport projection RPC'
);
select ok(
  has_function_privilege(
    'authenticated',
    'public.get_public_gaming_passport_projection(text)',
    'EXECUTE'
  ),
  'authenticated can execute the public Gaming Passport projection RPC'
);
select ok(
  has_function_privilege(
    'anon',
    'public.submit_public_profile_report(text, text, text)',
    'EXECUTE'
  ),
  'anon can execute the public profile report RPC'
);
select ok(
  has_function_privilege(
    'authenticated',
    'public.submit_public_profile_report(text, text, text)',
    'EXECUTE'
  ),
  'authenticated can execute the public profile report RPC'
);

select ok(
  not has_table_privilege('anon', 'public.public_profile_reports', 'SELECT'),
  'anon cannot select public profile reports'
);
select ok(
  not has_table_privilege('authenticated', 'public.public_profile_reports', 'SELECT'),
  'authenticated cannot select public profile reports'
);
select ok(
  not has_table_privilege('anon', 'public.public_profile_reports', 'INSERT'),
  'anon cannot insert public profile reports directly'
);
select ok(
  not has_table_privilege('authenticated', 'public.public_profile_reports', 'INSERT'),
  'authenticated cannot insert public profile reports directly'
);
select ok(
  not has_table_privilege('authenticated', 'public.public_profile_reports', 'UPDATE'),
  'authenticated cannot update public profile reports'
);
select ok(
  not has_table_privilege('authenticated', 'public.public_profile_reports', 'DELETE'),
  'authenticated cannot delete public profile reports'
);

select ok(
  has_table_privilege('authenticated', 'public.provider_connection_intents', 'SELECT'),
  'authenticated can select owned provider connection intents through RLS'
);
select ok(
  has_table_privilege('authenticated', 'public.provider_connection_intents', 'INSERT'),
  'authenticated can create provider connection intent scaffolds'
);
select ok(
  has_table_privilege('authenticated', 'public.provider_connection_intents', 'UPDATE'),
  'authenticated can consume owned provider connection intent scaffolds'
);
select ok(
  not has_table_privilege('authenticated', 'public.provider_connection_intents', 'DELETE'),
  'authenticated cannot delete provider connection intents'
);
select ok(
  has_table_privilege('authenticated', 'public.provider_callback_states', 'SELECT'),
  'authenticated can select owned provider callback states through RLS'
);
select ok(
  has_table_privilege('authenticated', 'public.provider_callback_states', 'INSERT'),
  'authenticated can create provider callback state scaffolds'
);
select ok(
  has_table_privilege('authenticated', 'public.provider_callback_states', 'UPDATE'),
  'authenticated can consume owned provider callback state scaffolds'
);
select ok(
  not has_table_privilege('authenticated', 'public.provider_callback_states', 'DELETE'),
  'authenticated cannot delete provider callback states'
);
select ok(
  not has_table_privilege('authenticated', 'public.provider_token_vault', 'SELECT'),
  'authenticated cannot select provider_token_vault directly'
);
select ok(
  not has_table_privilege('authenticated', 'public.provider_token_vault', 'INSERT'),
  'authenticated cannot insert provider_token_vault rows directly'
);
select ok(
  not has_table_privilege('authenticated', 'public.provider_token_vault', 'UPDATE'),
  'authenticated cannot update provider_token_vault rows directly'
);
select ok(
  not has_table_privilege('authenticated', 'public.provider_token_vault', 'DELETE'),
  'authenticated cannot delete provider_token_vault rows directly'
);
select ok(
  has_table_privilege('authenticated', 'public.provider_sync_jobs', 'SELECT'),
  'authenticated can select owned provider sync job scaffolds through RLS'
);
select ok(
  has_table_privilege('authenticated', 'public.provider_sync_jobs', 'INSERT'),
  'authenticated can create provider sync job scaffolds'
);
select ok(
  has_table_privilege('authenticated', 'public.provider_sync_jobs', 'UPDATE'),
  'authenticated can update owned provider sync job scaffolds'
);
select ok(
  not has_table_privilege('authenticated', 'public.provider_sync_jobs', 'DELETE'),
  'authenticated cannot delete provider sync jobs'
);
select ok(
  has_table_privilege('authenticated', 'public.provider_audit_events', 'SELECT'),
  'authenticated can select owned provider audit events through RLS'
);
select ok(
  has_table_privilege('authenticated', 'public.provider_audit_events', 'INSERT'),
  'authenticated can append provider audit events'
);
select ok(
  not has_table_privilege('authenticated', 'public.provider_audit_events', 'UPDATE'),
  'authenticated cannot update provider audit events'
);
select ok(
  not has_table_privilege('authenticated', 'public.provider_audit_events', 'DELETE'),
  'authenticated cannot delete provider audit events'
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

insert into public.gaming_passports (
  id,
  owner_id,
  status,
  alias
)
values
  (
    '10000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000010',
    'draft_private',
    'Command Draft'
  ),
  (
    '10000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000011',
    'draft_private',
    'Verified Command Draft'
  );

insert into public.passport_visibility_settings (passport_id, owner_id)
values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002');

select is(
  pg_temp.test_sqlstate($$
    insert into public.provider_connection_intents (
      owner_id,
      passport_id,
      provider,
      state_hash,
      expires_at
    )
    values (
      '00000000-0000-0000-0000-000000000001',
      '10000000-0000-0000-0000-000000000001',
      'steam',
      'unsupported-provider-state',
      now() + interval '10 minutes'
    )
  $$),
  '23514',
  'provider runtime foundation rejects unsupported provider ids'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.provider_token_vault (
      owner_id,
      passport_id,
      provider,
      token_status,
      token_ciphertext
    )
    values (
      '00000000-0000-0000-0000-000000000001',
      '10000000-0000-0000-0000-000000000001',
      'riot',
      'placeholder',
      'ciphertext-not-allowed-in-pr16'
    )
  $$),
  '23514',
  'provider_token_vault cannot store token ciphertext in PR16'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.provider_connection_intents (
      owner_id,
      passport_id,
      provider,
      state_hash,
      requested_scopes,
      expires_at
    )
    values (
      '00000000-0000-0000-0000-000000000001',
      '10000000-0000-0000-0000-000000000001',
      'osu',
      'osu-runtime-foundation-state',
      array['identify', 'public']::text[],
      now() + interval '10 minutes'
    )
  $$),
  '00000',
  'RM-27 allows osu provider connection intents with minimal scopes'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.provider_connection_intents (
      owner_id,
      passport_id,
      provider,
      state_hash,
      requested_scopes,
      expires_at
    )
    values (
      '00000000-0000-0000-0000-000000000001',
      '10000000-0000-0000-0000-000000000001',
      'osu',
      'osu-runtime-bad-scope-state',
      array['identify', 'friends.read']::text[],
      now() + interval '10 minutes'
    )
  $$),
  '23514',
  'RM-27 rejects non-minimal osu provider scopes'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.provider_token_vault (
      owner_id,
      passport_id,
      provider,
      token_status,
      token_ciphertext
    )
    values (
      '00000000-0000-0000-0000-000000000001',
      '10000000-0000-0000-0000-000000000001',
      'osu',
      'placeholder',
      'osu-ciphertext-not-allowed-in-rm27'
    )
  $$),
  '23514',
  'RM-27 keeps osu token ciphertext blocked by no-refresh-token strategy'
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
      slug,
      status,
      publication_consent,
      published_at
    )
    values (
      '10000000-0000-0000-0000-000000000013',
      '00000000-0000-0000-0000-000000000006',
      'no-consent-published',
      'published',
      false,
      now()
    )
  $$),
  '23514',
  'published Passport without consent is rejected before public serving'
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
  ),
  (
    '20000000-0000-0000-0000-000000000011',
    '10000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000011',
    'discord',
    'DiscordFuture-11',
    'Future Discord Player',
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
select is(
  pg_temp.test_sqlstate($$
    select *
    from public.publish_gaming_passport('10000000-0000-0000-0000-000000000010')
  $$),
  '42501',
  'anon cannot execute publish command'
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
    from public.provider_connection_intents
    where passport_id = '10000000-0000-0000-0000-000000000001'
  ),
  0,
  'owner B cannot read owner A provider connection intents'
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

select is(
  pg_temp.test_sqlstate($$
    select count(*)::integer
    from public.provider_connection_intents
  $$),
  '42501',
  'anon cannot read provider runtime foundation tables directly'
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
    insert into public.provider_connection_intents (
      owner_id,
      passport_id,
      provider,
      state_hash,
      expires_at
    )
    values (
      '00000000-0000-0000-0000-000000000001',
      '10000000-0000-0000-0000-000000000001',
      'riot',
      'owner-a-provider-intent-state',
      now() + interval '10 minutes'
    )
  $$),
  '00000',
  'owner can insert own provider connection intent scaffold'
);

select is(
  pg_temp.test_row_count($$
    update public.provider_connection_intents
    set status = 'consumed',
        consumed_at = now()
    where owner_id = '00000000-0000-0000-0000-000000000001'
      and passport_id = '10000000-0000-0000-0000-000000000001'
      and state_hash = 'owner-a-provider-intent-state'
  $$),
  1,
  'owner can consume own provider connection intent scaffold'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.provider_callback_states (
      owner_id,
      passport_id,
      provider,
      state_hash,
      expires_at
    )
    values (
      '00000000-0000-0000-0000-000000000001',
      '10000000-0000-0000-0000-000000000001',
      'riot',
      'owner-a-provider-callback-state',
      now() + interval '10 minutes'
    )
  $$),
  '00000',
  'owner can insert own provider callback state scaffold'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.provider_callback_states (
      owner_id,
      passport_id,
      provider,
      state_hash,
      expires_at
    )
    values (
      '00000000-0000-0000-0000-000000000001',
      '10000000-0000-0000-0000-000000000001',
      'riot',
      'owner-a-provider-callback-state',
      now() + interval '10 minutes'
    )
  $$),
  '23505',
  'provider callback state hash cannot be replayed'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.provider_sync_jobs (
      owner_id,
      passport_id,
      provider,
      status,
      reason
    )
    values (
      '00000000-0000-0000-0000-000000000001',
      '10000000-0000-0000-0000-000000000001',
      'riot',
      'blocked',
      'provider_runtime_not_live'
    )
  $$),
  '00000',
  'owner can insert blocked provider sync job scaffold'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.provider_audit_events (
      owner_id,
      passport_id,
      provider,
      event_type,
      event_status,
      metadata
    )
    values (
      '00000000-0000-0000-0000-000000000001',
      '10000000-0000-0000-0000-000000000001',
      'riot',
      'sync_job_created',
      'recorded',
      '{"reason":"provider_runtime_not_live"}'::jsonb
    )
  $$),
  '00000',
  'owner can append provider audit event'
);

select is(
  pg_temp.test_sqlstate($$
    update public.provider_audit_events
    set event_status = 'changed'
    where owner_id = '00000000-0000-0000-0000-000000000001'
      and passport_id = '10000000-0000-0000-0000-000000000001'
  $$),
  '42501',
  'owner cannot update provider audit events'
);

select is(
  pg_temp.test_sqlstate($$
    select count(*)::integer
    from public.provider_token_vault
  $$),
  '42501',
  'authenticated owner cannot select provider_token_vault directly'
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

set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000010';

select is(
  (
    select publication_consent
    from public.set_gaming_passport_publication_consent(
      '10000000-0000-0000-0000-000000000010',
      true
    )
    limit 1
  ),
  true,
  'owner can save publication consent through command'
);

select is(
  (
    select slug
    from public.claim_gaming_passport_slug(
      '10000000-0000-0000-0000-000000000010',
      ' Command Player!! '
    )
    limit 1
  ),
  'command-player',
  'owner can claim a normalized canonical slug through command'
);

select is(
  pg_temp.test_sqlstate($$
    select *
    from public.publish_gaming_passport('10000000-0000-0000-0000-000000000010')
  $$),
  'P0001',
  'publish command remains blocked without a verified linked provider'
);

set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000002';

select is(
  pg_temp.test_sqlstate($$
    select *
    from public.claim_gaming_passport_slug(
      '10000000-0000-0000-0000-000000000010',
      'stolen-command-player'
    )
  $$),
  'P0001',
  'owner cannot claim slug for another owner Passport'
);

set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000011';

select is(
  (
    select publication_consent
    from public.set_gaming_passport_publication_consent(
      '10000000-0000-0000-0000-000000000011',
      true
    )
    limit 1
  ),
  true,
  'owner with future verified provider can save publication consent'
);

select is(
  (
    select slug
    from public.claim_gaming_passport_slug(
      '10000000-0000-0000-0000-000000000011',
      'Verified Command Player'
    )
    limit 1
  ),
  'verified-command-player',
  'owner with future verified provider can claim slug'
);

select is(
  (
    select status
    from public.publish_gaming_passport('10000000-0000-0000-0000-000000000011')
    limit 1
  ),
  'published',
  'publish command can publish when policy requirements are satisfied'
);

select is(
  (
    select status
    from public.unpublish_gaming_passport('10000000-0000-0000-0000-000000000011')
    limit 1
  ),
  'unpublished',
  'unpublish command moves published Passport to unpublished'
);

select is(
  (
    select publication_consent
    from public.gaming_passports
    where id = '10000000-0000-0000-0000-000000000011'
  ),
  false,
  'unpublish command revokes publication consent'
);

set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';

select is(
  pg_temp.test_sqlstate($$
    select *
    from public.claim_gaming_passport_slug(
      '10000000-0000-0000-0000-000000000001',
      'new-player-one'
    )
  $$),
  'P0001',
  'published slug changes are blocked until public serving exists'
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

insert into public.gaming_passports (
  id,
  owner_id,
  slug,
  status,
  alias,
  publication_consent,
  published_at,
  unpublished_at,
  suspended_at
)
values
  (
    '10000000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000003',
    'public-draft',
    'draft_private',
    'Draft Public Test',
    false,
    null,
    null,
    null
  ),
  (
    '10000000-0000-0000-0000-000000000021',
    '00000000-0000-0000-0000-000000000004',
    'public-unpublished',
    'unpublished',
    'Unpublished Public Test',
    false,
    null,
    now(),
    null
  ),
  (
    '10000000-0000-0000-0000-000000000022',
    '00000000-0000-0000-0000-000000000005',
    'public-suspended',
    'suspended',
    'Suspended Public Test',
    false,
    null,
    null,
    now()
  ),
  (
    '10000000-0000-0000-0000-000000000023',
    '00000000-0000-0000-0000-000000000006',
    'public-no-provider',
    'published',
    'No Provider Public Test',
    true,
    now(),
    null,
    null
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
  metadata_safe,
  verified_at
)
values (
  '20000000-0000-0000-0000-000000000020',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'discord',
  'PrivateDiscordPublicProjection',
  'Hidden Discord',
  'verified',
  'private',
  '{}'::jsonb,
  now()
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
values (
  '30000000-0000-0000-0000-000000000020',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  'riot',
  'league_of_legends',
  'competitive_rank',
  'lol:private-public-projection',
  'solo_duo',
  'Private Proof',
  'Hidden Value',
  'game_adapter',
  'game_api',
  'current',
  'private',
  'lol-rank-v1',
  now()
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
  metadata_safe,
  verified_at
)
values (
  '20000000-0000-0000-0000-000000000021',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'osu',
  'OsuInternalPublicProjection',
  'OsuPublicOwner',
  'verified',
  'public',
  jsonb_build_object(
    'profileUrl', 'https://osu.ppy.sh/users/123456',
    'rawApiPayload', jsonb_build_object('rankedScore', 'must-not-leak'),
    'tokenMetadata', 'must-not-leak',
    'ownerId', 'must-not-leak'
  ),
  now()
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
  metadata_safe,
  normalizer_version,
  verified_at
)
values (
  '30000000-0000-0000-0000-000000000021',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000021',
  'osu',
  null,
  'provider_ownership',
  'osu:profile_linked',
  'profile',
  'Linked osu! account',
  'OsuPublicOwner',
  'linked_provider',
  'oauth',
  'current',
  'public',
  jsonb_build_object(
    'rawOAuthPayload', 'must-not-leak',
    'matchHistory', 'must-not-leak',
    'proofId', 'must-not-leak'
  ),
  'osu-profile-linked-v1',
  now()
);

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
);

insert into public.passport_featured_proofs (
  passport_id,
  owner_id,
  verified_proof_id,
  sort_order
)
values (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000021',
  1
);

update public.gaming_passports
set scene_config = jsonb_build_object(
  'themeId', 'theme.obsidian-pulse',
  'equippedCosmeticIds', jsonb_build_array(
    'border.pulse-frame',
    'background.obsidian-aura',
    'nameplate.pulse-nameplate',
    'effect.soft-glow',
    'badge.starter',
    'badge.profile-complete',
    'badge.saved-names-collector',
    'badge.slug-claimed',
    'unknown.cosmetic',
    'badge.founder-reserved'
  ),
  'featuredSavedNames', jsonb_build_array('PrivateClutch'),
  'priceId', 'price_forbidden'
)
where id = '10000000-0000-0000-0000-000000000001';

set local role anon;
set local request.jwt.claim.sub = '';
set local request.jwt.claim.role = 'anon';

select is(
  public.get_public_gaming_passport_projection('admin'),
  null,
  'public projection returns null for reserved slug'
);

select is(
  public.get_public_gaming_passport_projection('missing-player'),
  null,
  'public projection returns null for nonexistent slug'
);

select is(
  public.get_public_gaming_passport_projection('public-draft'),
  null,
  'public projection returns null for draft Passport'
);

select is(
  public.get_public_gaming_passport_projection('public-unpublished'),
  null,
  'public projection returns null for unpublished Passport'
);

select is(
  public.get_public_gaming_passport_projection('public-suspended'),
  null,
  'public projection returns null for suspended Passport'
);

select is(
  public.get_public_gaming_passport_projection('public-no-provider'),
  null,
  'public projection returns null for published Passport without verified provider'
);

select is(
  public.get_public_gaming_passport_projection('player-one')->>'slug',
  'player-one',
  'public projection returns a policy-valid published Passport'
);

select is(
  public.get_public_gaming_passport_projection('player-one')->'scene'->>'themeId',
  'theme.obsidian-pulse',
  'public projection returns allowlisted cosmetic theme id'
);

select is(
  jsonb_array_length(public.get_public_gaming_passport_projection('player-one')->'scene'->'equippedCosmeticIds'),
  7,
  'public projection returns allowlisted equipped cosmetic ids with badge cap'
);

select ok(
  position('unknown.cosmetic' in public.get_public_gaming_passport_projection('player-one')::text) = 0
    and position('badge.founder-reserved' in public.get_public_gaming_passport_projection('player-one')::text) = 0,
  'public projection strips unknown and reserved cosmetic ids'
);

select ok(
  not public.get_public_gaming_passport_projection('player-one') ?| array[
    'id',
    'owner_id',
    'ownerId',
    'email',
    'status',
    'publicationConsent',
    'bioShort',
    'featuredSavedNames'
  ],
  'public projection omits private Passport fields'
);

select is(
  jsonb_array_length(public.get_public_gaming_passport_projection('player-one')->'linkedProviders'),
  2,
  'public projection includes public linked providers and allowlisted osu provider'
);

select ok(
  position('Hidden Discord' in public.get_public_gaming_passport_projection('player-one')::text) = 0,
  'public projection omits private linked providers'
);

select is(
  (
    select count(*)::integer
    from jsonb_array_elements(public.get_public_gaming_passport_projection('player-one')->'linkedProviders') provider
    where provider->>'providerId' = 'osu'
  ),
  1,
  'RM-33 public projection includes osu linked provider only through the allowlist DTO'
);

select is(
  (
    select string_agg(key, ',' order by key)
    from jsonb_array_elements(public.get_public_gaming_passport_projection('player-one')->'linkedProviders') provider,
      lateral jsonb_object_keys(provider) key
    where provider->>'providerId' = 'osu'
  ),
  'displayName,externalUsername,profileUrl,providerId,verifiedAt',
  'RM-33 osu linked provider exposes only allowlisted provider fields'
);

select is(
  (
    select count(*)::integer
    from jsonb_array_elements(public.get_public_gaming_passport_projection('player-one')->'linkedProviders') provider
    where provider ?| array['externalAccountId', 'external_account_id', 'metadata_safe', 'metadataSafe', 'owner_id', 'id']
  ),
  0,
  'public linked provider projection omits internal provider fields'
);

select is(
  jsonb_array_length(public.get_public_gaming_passport_projection('player-one')->'featuredProofs'),
  2,
  'public projection includes displayable featured proofs and allowlisted osu proof'
);

select is(
  (
    select count(*)::integer
    from jsonb_array_elements(public.get_public_gaming_passport_projection('player-one')->'featuredProofs') proof
    where proof->>'source' = 'osu'
      and proof->>'type' = 'profile_linked'
  ),
  1,
  'RM-33 public projection includes osu profile-linked proof only through the allowlist DTO'
);

select is(
  (
    select string_agg(key, ',' order by key)
    from jsonb_array_elements(public.get_public_gaming_passport_projection('player-one')->'featuredProofs') proof,
      lateral jsonb_object_keys(proof) key
    where proof->>'source' = 'osu'
  ),
  'label,observedAt,source,type,visibility',
  'RM-33 osu proof exposes only allowlisted proof fields'
);

select ok(
  position('Private Proof' in public.get_public_gaming_passport_projection('player-one')::text) = 0
    and position('Hidden Value' in public.get_public_gaming_passport_projection('player-one')::text) = 0,
  'public projection omits private proofs'
);

select ok(
  position('OsuPublicOwner' in public.get_public_gaming_passport_projection('player-one')::text) > 0
    and position('Linked osu! account' in public.get_public_gaming_passport_projection('player-one')::text) > 0
    and position('OsuInternalPublicProjection' in public.get_public_gaming_passport_projection('player-one')::text) = 0
    and position('must-not-leak' in public.get_public_gaming_passport_projection('player-one')::text) = 0,
  'RM-33 public projection allows safe osu labels but omits internal id and malicious metadata'
);

select is(
  public.get_public_gaming_passport_projection('player-one')->'featuredProofs'->0->>'title',
  'Solo/Duo Rank',
  'public projection includes allowlisted proof title'
);

select ok(
  position('RiotPUUID-1' in public.get_public_gaming_passport_projection('player-one')::text) = 0
    and position('metadata_safe' in public.get_public_gaming_passport_projection('player-one')::text) = 0
    and position('rawPayload' in public.get_public_gaming_passport_projection('player-one')::text) = 0
    and position('token' in lower(public.get_public_gaming_passport_projection('player-one')::text)) = 0,
  'public projection omits external IDs, raw metadata, and tokens'
);

select ok(
  not public.get_public_gaming_passport_projection('player-one')->'scene' ? 'featuredSavedNames',
  'public projection omits private Saved Names highlights'
);

select ok(
  position('price_forbidden' in public.get_public_gaming_passport_projection('player-one')::text) = 0
    and position('priceId' in public.get_public_gaming_passport_projection('player-one')::text) = 0,
  'public projection omits cosmetic pricing and private scene fields'
);

select is(
  public.submit_public_profile_report(
    'player-one',
    'impersonation',
    '  pretending   to be me  '
  )->>'ok',
  'true',
  'anon can submit a valid public profile report'
);

reset role;

select is(
  (
    select count(*)::integer
    from public.public_profile_reports
    where public_slug = 'player-one'
      and category = 'impersonation'
  ),
  1,
  'valid public profile report inserts one private report row'
);

select is(
  (
    select details
    from public.public_profile_reports
    where public_slug = 'player-one'
      and category = 'impersonation'
    limit 1
  ),
  'pretending to be me',
  'public profile report details are trimmed and whitespace-normalized'
);

set local role anon;
set local request.jwt.claim.sub = '';
set local request.jwt.claim.role = 'anon';

select ok(
  not public.submit_public_profile_report(
    'player-one',
    'riot_oauth',
    'invalid report category'
  ) ? 'id',
  'invalid report responses do not expose report ids'
);

select is(
  public.submit_public_profile_report(
    'player-one',
    'riot_oauth',
    'invalid report category'
  )->>'ok',
  'false',
  'public profile report RPC rejects invalid categories safely'
);

select is(
  public.submit_public_profile_report(
    'player-one',
    'other',
    repeat('x', 801)
  )->>'ok',
  'false',
  'public profile report RPC rejects oversized details safely'
);

select is(
  public.submit_public_profile_report(
    'admin',
    'other',
    'reserved slug'
  )->>'ok',
  'false',
  'public profile report RPC rejects reserved slugs safely'
);

select ok(
  position('owner_id' in public.submit_public_profile_report('player-one', 'privacy_request', 'privacy request')::text) = 0
    and position('target_passport_id' in public.submit_public_profile_report('player-one', 'privacy_request', 'privacy request')::text) = 0
    and position('reporter_owner_id' in public.submit_public_profile_report('player-one', 'privacy_request', 'privacy request')::text) = 0
    and position('id' in public.submit_public_profile_report('player-one', 'privacy_request', 'privacy request')::text) = 0,
  'report RPC response does not expose owner, Passport, reporter, or report ids'
);

set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';
set local request.jwt.claim.role = 'authenticated';

select is(
  public.submit_public_profile_report(
    'player-one',
    'privacy_request',
    'privacy request from owner session'
  )->>'ok',
  'true',
  'authenticated can submit a public profile report'
);

reset role;

select is(
  (
    select reporter_owner_id::text
    from public.public_profile_reports
    where public_slug = 'player-one'
      and category = 'privacy_request'
      and details = 'privacy request from owner session'
    order by created_at desc
    limit 1
  ),
  '00000000-0000-0000-0000-000000000001',
  'authenticated report stores reporter owner id internally only'
);

reset role;

select * from finish();

rollback;
