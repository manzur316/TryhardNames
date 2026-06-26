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

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'provider', provider.provider,
        'displayName', provider.display_name,
        'verifiedAt', provider.verified_at,
        'lastSyncedAt', provider.last_synced_at
      )
      order by provider.provider, provider.verified_at desc nulls last, provider.id
    ),
    '[]'::jsonb
  )
    into linked_providers
    from public.linked_provider_accounts provider
    where provider.passport_id = target.id
      and provider.owner_id = target.owner_id
      and provider.status = 'verified'
      and provider.visibility = 'public';

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
          and provider.status = 'verified'
        order by featured.sort_order, proof.verified_at desc nulls last, proof.id
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
          and provider.status = 'verified'
        order by proof.verified_at desc nulls last, proof.id
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
      'themeId', null,
      'equippedCosmeticIds', '[]'::jsonb
    ),
    'linkedProviders', linked_providers,
    'featuredProofs', featured_proofs
  );
end;
$$;

revoke all on function public.get_public_gaming_passport_projection(text) from public;
grant execute on function public.get_public_gaming_passport_projection(text) to anon;
grant execute on function public.get_public_gaming_passport_projection(text) to authenticated;
