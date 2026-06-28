-- RM-33 enables the local osu! public projection smoke path with explicit allowlisted DTOs only.
create or replace function public.get_public_gaming_passport_projection(public_slug text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, private, auth
as $$
declare
  normalized_slug text := private.normalize_gaming_passport_slug(public_slug);
  target public.gaming_passports%rowtype;
  linked_providers jsonb := '[]'::jsonb;
  featured_proofs jsonb := '[]'::jsonb;
  has_featured_proofs boolean := false;
  source_scene jsonb := '{}'::jsonb;
  safe_theme_id text := 'theme.clean-dark';
  safe_equipped_cosmetic_ids jsonb := '[]'::jsonb;
  allowed_theme_ids text[] := array[
    'theme.clean-dark',
    'theme.obsidian-pulse'
  ];
  allowed_equipped_ids text[] := array[
    'border.default-frame',
    'background.soft-shadow',
    'nameplate.minimal-tag',
    'effect.none',
    'badge.starter',
    'badge.profile-complete',
    'badge.saved-names-collector',
    'badge.slug-claimed',
    'badge.published-passport',
    'border.identity-builder',
    'border.pulse-frame',
    'background.obsidian-aura',
    'nameplate.pulse-nameplate',
    'effect.soft-glow'
  ];
begin
  if normalized_slug is null or not private.is_canonical_gaming_passport_slug(normalized_slug) then
    return null;
  end if;

  select *
    into target
    from public.gaming_passports passport
    where passport.slug = normalized_slug
      and passport.status = 'published'
      and passport.publication_consent is true
      and passport.suspended_at is null
      and private.is_canonical_gaming_passport_slug(passport.slug);

  if not found then
    return null;
  end if;

  if not exists (
    select 1
    from public.linked_provider_accounts provider
    where provider.passport_id = target.id
      and provider.owner_id = target.owner_id
      and provider.status = 'verified'
  ) then
    return null;
  end if;

  source_scene := coalesce(target.scene_config, '{}'::jsonb);

  if source_scene->>'themeId' = any(allowed_theme_ids) then
    safe_theme_id := source_scene->>'themeId';
  end if;

  if jsonb_typeof(source_scene->'equippedCosmeticIds') = 'array' then
    with raw as (
      select value::text as id, ordinality::integer as ord
      from jsonb_array_elements_text(source_scene->'equippedCosmeticIds') with ordinality
    ),
    filtered as (
      select distinct on (id)
        id,
        ord,
        split_part(id, '.', 1) as type
      from raw
      where id = any(allowed_equipped_ids)
      order by id, ord
    ),
    single_slots as (
      select distinct on (type)
        id,
        ord,
        type
      from filtered
      where type in ('border', 'background', 'nameplate', 'effect')
      order by type, ord
    ),
    badges as (
      select id, ord, type
      from filtered
      where type = 'badge'
      order by ord
      limit 3
    ),
    combined as (
      select id, ord, type from single_slots
      union all
      select id, ord, type from badges
    )
    select coalesce(
      jsonb_agg(
        id
        order by case type
          when 'border' then 1
          when 'background' then 2
          when 'nameplate' then 3
          when 'effect' then 4
          when 'badge' then 5
          else 99
        end,
        ord
      ),
      '[]'::jsonb
    )
      into safe_equipped_cosmetic_ids
      from combined;
  end if;

  select coalesce(
    jsonb_agg(row.provider_json order by row.provider_sort, row.verified_at desc nulls last, row.id),
    '[]'::jsonb
  )
    into linked_providers
    from (
      select
        provider.provider as provider_sort,
        provider.verified_at,
        provider.id,
        jsonb_build_object(
          'provider', provider.provider,
          'displayName', provider.display_name,
          'verifiedAt', provider.verified_at,
          'lastSyncedAt', provider.last_synced_at
        ) as provider_json
      from public.linked_provider_accounts provider
      where provider.passport_id = target.id
        and provider.owner_id = target.owner_id
        and provider.status = 'verified'
        and provider.visibility = 'public'
        and provider.provider <> 'osu'

      union all

      select
        'osu' as provider_sort,
        provider.verified_at,
        provider.id,
        jsonb_build_object(
          'providerId', 'osu',
          'displayName', 'osu!',
          'externalUsername', provider.display_name,
          'profileUrl', case
            when provider.metadata_safe->>'profileUrl' ~ '^https://osu[.]ppy[.]sh/users/[0-9]+$'
              then provider.metadata_safe->>'profileUrl'
            else null
          end,
          'verifiedAt', provider.verified_at
        ) as provider_json
      from public.linked_provider_accounts provider
      join public.verified_proofs proof
        on proof.linked_provider_account_id = provider.id
       and proof.passport_id = provider.passport_id
       and proof.owner_id = provider.owner_id
       and proof.provider = provider.provider
      where provider.passport_id = target.id
        and provider.owner_id = target.owner_id
        and provider.provider = 'osu'
        and provider.status = 'verified'
        and provider.visibility = 'public'
        and provider.revoked_at is null
        and provider.stale_at is null
        and proof.source_key = 'osu:profile_linked'
        and proof.proof_type = 'provider_ownership'
        and proof.source = 'linked_provider'
        and proof.verification_method = 'oauth'
        and proof.status = 'current'
        and proof.visibility = 'public'
        and proof.revoked_at is null
        and proof.stale_at is null
    ) row;

  select exists (
    select 1
    from public.passport_featured_proofs featured
    where featured.passport_id = target.id
      and featured.owner_id = target.owner_id
  )
    into has_featured_proofs;

  if has_featured_proofs then
    select coalesce(jsonb_agg(row.proof_json order by row.sort_order, row.verified_at desc nulls last, row.id), '[]'::jsonb)
      into featured_proofs
      from (
        select
          featured.sort_order,
          proof.verified_at,
          proof.id,
          jsonb_build_object(
            'provider', proof.provider,
            'game', proof.game,
            'proofType', proof.proof_type,
            'mode', proof.mode,
            'title', proof.title,
            'displayValue', proof.display_value,
            'season', proof.season,
            'status', proof.status,
            'verifiedAt', proof.verified_at,
            'lastSyncedAt', proof.last_synced_at,
            'staleAt', proof.stale_at
          ) as proof_json
        from public.passport_featured_proofs featured
        join public.verified_proofs proof
          on proof.id = featured.verified_proof_id
         and proof.passport_id = featured.passport_id
         and proof.owner_id = featured.owner_id
        join public.linked_provider_accounts provider
          on provider.id = proof.linked_provider_account_id
         and provider.passport_id = proof.passport_id
         and provider.owner_id = proof.owner_id
         and provider.provider = proof.provider
        where featured.passport_id = target.id
          and featured.owner_id = target.owner_id
          and proof.visibility = 'public'
          and proof.status in ('current', 'stale')
          and proof.provider <> 'osu'
          and provider.status = 'verified'

        union all

        select
          featured.sort_order,
          proof.verified_at,
          proof.id,
          jsonb_build_object(
            'type', 'profile_linked',
            'label', 'Linked osu! account',
            'source', 'osu',
            'observedAt', proof.verified_at,
            'visibility', 'public'
          ) as proof_json
        from public.passport_featured_proofs featured
        join public.verified_proofs proof
          on proof.id = featured.verified_proof_id
         and proof.passport_id = featured.passport_id
         and proof.owner_id = featured.owner_id
        join public.linked_provider_accounts provider
          on provider.id = proof.linked_provider_account_id
         and provider.passport_id = proof.passport_id
         and provider.owner_id = proof.owner_id
         and provider.provider = proof.provider
        where featured.passport_id = target.id
          and featured.owner_id = target.owner_id
          and provider.provider = 'osu'
          and provider.status = 'verified'
          and provider.visibility = 'public'
          and provider.revoked_at is null
          and provider.stale_at is null
          and proof.source_key = 'osu:profile_linked'
          and proof.proof_type = 'provider_ownership'
          and proof.source = 'linked_provider'
          and proof.verification_method = 'oauth'
          and proof.status = 'current'
          and proof.visibility = 'public'
          and proof.revoked_at is null
          and proof.stale_at is null
        order by sort_order, verified_at desc nulls last, id
        limit 6
      ) row;
  else
    select coalesce(jsonb_agg(row.proof_json order by row.verified_at desc nulls last, row.id), '[]'::jsonb)
      into featured_proofs
      from (
        select
          proof.verified_at,
          proof.id,
          jsonb_build_object(
            'provider', proof.provider,
            'game', proof.game,
            'proofType', proof.proof_type,
            'mode', proof.mode,
            'title', proof.title,
            'displayValue', proof.display_value,
            'season', proof.season,
            'status', proof.status,
            'verifiedAt', proof.verified_at,
            'lastSyncedAt', proof.last_synced_at,
            'staleAt', proof.stale_at
          ) as proof_json
        from public.verified_proofs proof
        join public.linked_provider_accounts provider
          on provider.id = proof.linked_provider_account_id
         and provider.passport_id = proof.passport_id
         and provider.owner_id = proof.owner_id
         and provider.provider = proof.provider
        where proof.passport_id = target.id
          and proof.owner_id = target.owner_id
          and proof.visibility = 'public'
          and proof.status in ('current', 'stale')
          and proof.provider <> 'osu'
          and provider.status = 'verified'

        union all

        select
          proof.verified_at,
          proof.id,
          jsonb_build_object(
            'type', 'profile_linked',
            'label', 'Linked osu! account',
            'source', 'osu',
            'observedAt', proof.verified_at,
            'visibility', 'public'
          ) as proof_json
        from public.verified_proofs proof
        join public.linked_provider_accounts provider
          on provider.id = proof.linked_provider_account_id
         and provider.passport_id = proof.passport_id
         and provider.owner_id = proof.owner_id
         and provider.provider = proof.provider
        where proof.passport_id = target.id
          and proof.owner_id = target.owner_id
          and provider.provider = 'osu'
          and provider.status = 'verified'
          and provider.visibility = 'public'
          and provider.revoked_at is null
          and provider.stale_at is null
          and proof.source_key = 'osu:profile_linked'
          and proof.proof_type = 'provider_ownership'
          and proof.source = 'linked_provider'
          and proof.verification_method = 'oauth'
          and proof.status = 'current'
          and proof.visibility = 'public'
          and proof.revoked_at is null
          and proof.stale_at is null
        order by verified_at desc nulls last, id
        limit 6
      ) row;
  end if;

  return jsonb_build_object(
    'slug', target.slug,
    'alias', target.alias,
    'avatarUrl', target.avatar_url,
    'publishedAt', target.published_at,
    'updatedAt', target.updated_at,
    'scene', jsonb_build_object(
      'themeId', safe_theme_id,
      'equippedCosmeticIds', safe_equipped_cosmetic_ids
    ),
    'linkedProviders', linked_providers,
    'featuredProofs', featured_proofs
  );
end;
$$;

revoke all on function public.get_public_gaming_passport_projection(text) from public;
grant execute on function public.get_public_gaming_passport_projection(text) to anon;
grant execute on function public.get_public_gaming_passport_projection(text) to authenticated;
