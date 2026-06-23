create extension if not exists pgcrypto with schema extensions;

create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.is_canonical_gaming_passport_slug(value text)
returns boolean
language sql
immutable
returns null on null input
as $$
  select value = lower(value)
    and char_length(value) between 2 and 32
    and value ~ '^[a-z0-9]([a-z0-9-]{0,30}[a-z0-9])?$'
    and value not in (
      'account',
      'admin',
      'api',
      'auth',
      'gaming-passport',
      'id',
      'null',
      'sign-in',
      'sign-up',
      'undefined',
      'www'
    );
$$;

revoke all on function private.set_updated_at() from public;
revoke all on function private.set_updated_at() from anon;
revoke all on function private.set_updated_at() from authenticated;
revoke all on function private.is_canonical_gaming_passport_slug(text) from public;
revoke all on function private.is_canonical_gaming_passport_slug(text) from anon;
revoke all on function private.is_canonical_gaming_passport_slug(text) from authenticated;

create table public.gaming_passports (
  id uuid primary key default extensions.gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text null,
  status text not null default 'draft_private',
  alias text null,
  avatar_url text null,
  bio_short text null,
  publication_consent boolean not null default false,
  scene_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz null,
  unpublished_at timestamptz null,
  suspended_at timestamptz null,
  constraint gaming_passports_one_per_owner unique (owner_id),
  constraint gaming_passports_id_owner_uid unique (id, owner_id),
  constraint gaming_passports_status_check check (
    status in ('draft_private', 'published', 'unpublished', 'suspended')
  ),
  constraint gaming_passports_slug_check check (
    slug is null or (
      slug = lower(slug)
      and char_length(slug) between 2 and 32
      and slug ~ '^[a-z0-9]([a-z0-9-]{0,30}[a-z0-9])?$'
      and slug not in (
        'account',
        'admin',
        'api',
        'auth',
        'gaming-passport',
        'id',
        'null',
        'sign-in',
        'sign-up',
        'undefined',
        'www'
      )
    )
  ),
  constraint gaming_passports_alias_length check (alias is null or char_length(alias) <= 64),
  constraint gaming_passports_avatar_url_length check (
    avatar_url is null or char_length(avatar_url) <= 500
  ),
  constraint gaming_passports_bio_short_length check (
    bio_short is null or char_length(bio_short) <= 200
  ),
  constraint gaming_passports_scene_config_object check (jsonb_typeof(scene_config) = 'object'),
  constraint gaming_passports_scene_config_size check (pg_column_size(scene_config) <= 8192),
  constraint gaming_passports_published_coherent check (
    status <> 'published'
    or (publication_consent is true and published_at is not null and slug is not null)
  ),
  constraint gaming_passports_unpublished_coherent check (
    status <> 'unpublished' or unpublished_at is not null
  ),
  constraint gaming_passports_suspended_coherent check (
    status <> 'suspended' or suspended_at is not null
  ),
  constraint gaming_passports_updated_after_created check (updated_at >= created_at)
);

create unique index gaming_passports_slug_uidx
  on public.gaming_passports (slug)
  where slug is not null;

create table public.linked_provider_accounts (
  id uuid primary key default extensions.gen_random_uuid(),
  passport_id uuid not null,
  owner_id uuid not null,
  provider text not null,
  external_account_id text not null,
  display_name text null,
  status text not null default 'pending',
  visibility text not null default 'private',
  metadata_safe jsonb not null default '{}'::jsonb,
  verified_at timestamptz null,
  last_synced_at timestamptz null,
  stale_at timestamptz null,
  revoked_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint linked_provider_accounts_passport_owner_fk foreign key (passport_id, owner_id)
    references public.gaming_passports (id, owner_id)
    on delete cascade,
  constraint linked_provider_accounts_provider_external_uid unique (provider, external_account_id),
  constraint linked_provider_accounts_composite_uid unique (
    id,
    passport_id,
    owner_id,
    provider
  ),
  constraint linked_provider_accounts_provider_check check (provider in ('discord', 'riot')),
  constraint linked_provider_accounts_external_account_id_length check (
    external_account_id = btrim(external_account_id)
    and char_length(external_account_id) between 1 and 256
  ),
  constraint linked_provider_accounts_display_name_length check (
    display_name is null or char_length(display_name) <= 120
  ),
  constraint linked_provider_accounts_status_check check (
    status in ('pending', 'verified', 'failed', 'stale', 'revoked')
  ),
  constraint linked_provider_accounts_visibility_check check (visibility in ('private', 'public')),
  constraint linked_provider_accounts_metadata_safe_object check (
    jsonb_typeof(metadata_safe) = 'object'
  ),
  constraint linked_provider_accounts_metadata_safe_size check (
    pg_column_size(metadata_safe) <= 4096
  ),
  constraint linked_provider_accounts_verified_coherent check (
    status <> 'verified' or verified_at is not null
  ),
  constraint linked_provider_accounts_stale_coherent check (
    status <> 'stale' or stale_at is not null
  ),
  constraint linked_provider_accounts_revoked_coherent check (
    status <> 'revoked' or revoked_at is not null
  ),
  constraint linked_provider_accounts_updated_after_created check (updated_at >= created_at)
);

create index linked_provider_accounts_passport_idx
  on public.linked_provider_accounts (passport_id);

create index linked_provider_accounts_owner_idx
  on public.linked_provider_accounts (owner_id);

create table public.verified_proofs (
  id uuid primary key default extensions.gen_random_uuid(),
  passport_id uuid not null,
  owner_id uuid not null,
  linked_provider_account_id uuid not null,
  provider text not null,
  game text null,
  proof_type text not null,
  source_key text not null,
  mode text not null,
  title text not null,
  display_value text not null,
  normalized_value jsonb null,
  season text null,
  source text not null,
  verification_method text not null,
  status text not null default 'current',
  visibility text not null default 'private',
  metadata_safe jsonb not null default '{}'::jsonb,
  normalizer_version text not null,
  verified_at timestamptz not null,
  last_synced_at timestamptz null,
  stale_at timestamptz null,
  revoked_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint verified_proofs_linked_provider_fk foreign key (
    linked_provider_account_id,
    passport_id,
    owner_id,
    provider
  )
    references public.linked_provider_accounts (id, passport_id, owner_id, provider)
    on delete cascade,
  constraint verified_proofs_id_passport_owner_uid unique (id, passport_id, owner_id),
  constraint verified_proofs_source_key_uid unique (linked_provider_account_id, source_key),
  constraint verified_proofs_provider_check check (provider in ('discord', 'riot')),
  constraint verified_proofs_game_check check (game is null or game in ('league_of_legends')),
  constraint verified_proofs_proof_type_check check (
    proof_type in (
      'social_verification',
      'provider_ownership',
      'competitive_rank',
      'competitive_rating',
      'progression_achievement',
      'title_or_completion'
    )
  ),
  constraint verified_proofs_source_key_length check (
    source_key = btrim(source_key)
    and char_length(source_key) between 1 and 256
  ),
  constraint verified_proofs_mode_length check (
    mode = btrim(mode)
    and char_length(mode) between 1 and 64
  ),
  constraint verified_proofs_title_length check (char_length(btrim(title)) between 1 and 120),
  constraint verified_proofs_display_value_length check (
    char_length(btrim(display_value)) between 1 and 120
  ),
  constraint verified_proofs_normalized_value_shape check (
    normalized_value is null or jsonb_typeof(normalized_value) in ('string', 'number')
  ),
  constraint verified_proofs_season_length check (season is null or char_length(season) <= 64),
  constraint verified_proofs_source_check check (source in ('linked_provider', 'game_adapter')),
  constraint verified_proofs_verification_method_check check (
    verification_method in ('oauth', 'provider_api', 'game_api', 'one_time_api_token')
  ),
  constraint verified_proofs_status_check check (status in ('current', 'stale', 'revoked')),
  constraint verified_proofs_visibility_check check (visibility in ('private', 'public')),
  constraint verified_proofs_metadata_safe_object check (jsonb_typeof(metadata_safe) = 'object'),
  constraint verified_proofs_metadata_safe_size check (pg_column_size(metadata_safe) <= 4096),
  constraint verified_proofs_normalizer_version_length check (
    normalizer_version = btrim(normalizer_version)
    and char_length(normalizer_version) between 1 and 80
  ),
  constraint verified_proofs_stale_coherent check (status <> 'stale' or stale_at is not null),
  constraint verified_proofs_revoked_coherent check (status <> 'revoked' or revoked_at is not null),
  constraint verified_proofs_provider_level_invariant check (
    proof_type not in ('social_verification', 'provider_ownership')
    or (game is null and source = 'linked_provider')
  ),
  constraint verified_proofs_game_level_invariant check (
    proof_type not in (
      'competitive_rank',
      'competitive_rating',
      'progression_achievement',
      'title_or_completion'
    )
    or (game is not null and source = 'game_adapter')
  ),
  constraint verified_proofs_updated_after_created check (updated_at >= created_at)
);

create index verified_proofs_passport_idx
  on public.verified_proofs (passport_id);

create index verified_proofs_owner_idx
  on public.verified_proofs (owner_id);

create index verified_proofs_linked_provider_idx
  on public.verified_proofs (linked_provider_account_id);

create table public.passport_featured_proofs (
  passport_id uuid not null,
  owner_id uuid not null,
  verified_proof_id uuid not null,
  sort_order integer not null,
  created_at timestamptz not null default now(),
  constraint passport_featured_proofs_passport_owner_fk foreign key (passport_id, owner_id)
    references public.gaming_passports (id, owner_id)
    on delete cascade,
  constraint passport_featured_proofs_verified_proof_fk foreign key (
    verified_proof_id,
    passport_id,
    owner_id
  )
    references public.verified_proofs (id, passport_id, owner_id)
    on delete cascade,
  constraint passport_featured_proofs_pkey primary key (passport_id, verified_proof_id),
  constraint passport_featured_proofs_sort_order_uid unique (passport_id, sort_order),
  constraint passport_featured_proofs_sort_order_check check (sort_order between 0 and 5)
);

create index passport_featured_proofs_owner_idx
  on public.passport_featured_proofs (owner_id);

create table public.passport_visibility_settings (
  passport_id uuid primary key,
  owner_id uuid not null,
  show_linked_providers boolean not null default true,
  show_last_updated boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint passport_visibility_settings_passport_owner_fk foreign key (passport_id, owner_id)
    references public.gaming_passports (id, owner_id)
    on delete cascade,
  constraint passport_visibility_settings_updated_after_created check (updated_at >= created_at)
);

create index passport_visibility_settings_owner_idx
  on public.passport_visibility_settings (owner_id);

create trigger set_gaming_passports_updated_at
before update on public.gaming_passports
for each row execute function private.set_updated_at();

create trigger set_linked_provider_accounts_updated_at
before update on public.linked_provider_accounts
for each row execute function private.set_updated_at();

create trigger set_verified_proofs_updated_at
before update on public.verified_proofs
for each row execute function private.set_updated_at();

create trigger set_passport_visibility_settings_updated_at
before update on public.passport_visibility_settings
for each row execute function private.set_updated_at();

alter table public.gaming_passports enable row level security;
alter table public.linked_provider_accounts enable row level security;
alter table public.verified_proofs enable row level security;
alter table public.passport_featured_proofs enable row level security;
alter table public.passport_visibility_settings enable row level security;

revoke all on table
  public.gaming_passports,
  public.linked_provider_accounts,
  public.verified_proofs,
  public.passport_featured_proofs,
  public.passport_visibility_settings
from anon;

revoke all on table
  public.gaming_passports,
  public.linked_provider_accounts,
  public.verified_proofs,
  public.passport_featured_proofs,
  public.passport_visibility_settings
from public;

revoke all on table
  public.gaming_passports,
  public.linked_provider_accounts,
  public.verified_proofs,
  public.passport_featured_proofs,
  public.passport_visibility_settings
from authenticated;

grant select on table public.gaming_passports to authenticated;

grant insert (
  owner_id,
  alias,
  avatar_url,
  bio_short,
  scene_config
) on public.gaming_passports to authenticated;

grant update (
  alias,
  avatar_url,
  bio_short,
  scene_config
) on public.gaming_passports to authenticated;

grant select on table public.linked_provider_accounts to authenticated;

grant select on table public.verified_proofs to authenticated;

grant select, insert, update, delete on table public.passport_featured_proofs to authenticated;

grant select, insert, update, delete on table public.passport_visibility_settings to authenticated;

create policy "gaming_passports_select_own"
on public.gaming_passports
for select
to authenticated
using (owner_id = auth.uid());

create policy "gaming_passports_insert_own"
on public.gaming_passports
for insert
to authenticated
with check (
  owner_id = auth.uid()
  and status = 'draft_private'
  and publication_consent is false
  and published_at is null
  and unpublished_at is null
  and suspended_at is null
);

create policy "gaming_passports_update_own"
on public.gaming_passports
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "passport_visibility_settings_select_own"
on public.passport_visibility_settings
for select
to authenticated
using (owner_id = auth.uid());

create policy "passport_visibility_settings_insert_own"
on public.passport_visibility_settings
for insert
to authenticated
with check (owner_id = auth.uid());

create policy "passport_visibility_settings_update_own"
on public.passport_visibility_settings
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "passport_visibility_settings_delete_own"
on public.passport_visibility_settings
for delete
to authenticated
using (owner_id = auth.uid());

create policy "passport_featured_proofs_select_own"
on public.passport_featured_proofs
for select
to authenticated
using (owner_id = auth.uid());

create policy "passport_featured_proofs_insert_own"
on public.passport_featured_proofs
for insert
to authenticated
with check (owner_id = auth.uid());

create policy "passport_featured_proofs_update_own"
on public.passport_featured_proofs
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "passport_featured_proofs_delete_own"
on public.passport_featured_proofs
for delete
to authenticated
using (owner_id = auth.uid());

create policy "linked_provider_accounts_select_own"
on public.linked_provider_accounts
for select
to authenticated
using (owner_id = auth.uid());

create policy "verified_proofs_select_own"
on public.verified_proofs
for select
to authenticated
using (owner_id = auth.uid());
