create or replace function private.normalize_gaming_passport_slug(value text)
returns text
language sql
immutable
as $$
  select regexp_replace(
    regexp_replace(
      regexp_replace(lower(btrim(coalesce(value, ''))), '[^a-z0-9-]+', '-', 'g'),
      '-+',
      '-',
      'g'
    ),
    '(^-+|-+$)',
    '',
    'g'
  );
$$;

revoke all on function private.normalize_gaming_passport_slug(text) from public;
revoke all on function private.normalize_gaming_passport_slug(text) from anon;
revoke all on function private.normalize_gaming_passport_slug(text) from authenticated;

create or replace function public.set_gaming_passport_publication_consent(
  target_passport_id uuid,
  next_consent boolean
)
returns setof public.gaming_passports
language plpgsql
security definer
set search_path = public, private, auth
as $$
declare
  caller_id uuid := auth.uid();
  existing public.gaming_passports%rowtype;
begin
  if caller_id is null then
    raise exception 'Parent Auth session is required.' using errcode = 'P0001';
  end if;

  select *
    into existing
    from public.gaming_passports
    where id = target_passport_id
      and owner_id = caller_id;

  if not found then
    raise exception 'Gaming Passport not found for owner.' using errcode = 'P0001';
  end if;

  if existing.status = 'suspended' and next_consent is true then
    raise exception 'Suspended Gaming Passports cannot accept publication consent.' using errcode = 'P0001';
  end if;

  if existing.status = 'published' and coalesce(next_consent, false) is false then
    return query
      update public.gaming_passports
      set publication_consent = false,
          status = 'unpublished',
          unpublished_at = now()
      where id = target_passport_id
        and owner_id = caller_id
      returning *;
    return;
  end if;

  return query
    update public.gaming_passports
    set publication_consent = coalesce(next_consent, false)
    where id = target_passport_id
      and owner_id = caller_id
    returning *;
end;
$$;

create or replace function public.claim_gaming_passport_slug(
  target_passport_id uuid,
  raw_slug text
)
returns setof public.gaming_passports
language plpgsql
security definer
set search_path = public, private, auth
as $$
declare
  caller_id uuid := auth.uid();
  existing public.gaming_passports%rowtype;
  normalized_slug text := private.normalize_gaming_passport_slug(raw_slug);
begin
  if caller_id is null then
    raise exception 'Parent Auth session is required.' using errcode = 'P0001';
  end if;

  select *
    into existing
    from public.gaming_passports
    where id = target_passport_id
      and owner_id = caller_id;

  if not found then
    raise exception 'Gaming Passport not found for owner.' using errcode = 'P0001';
  end if;

  if existing.status = 'published' then
    raise exception 'Published Gaming Passport slugs are locked until public serving exists.' using errcode = 'P0001';
  end if;

  if existing.status = 'suspended' then
    raise exception 'Suspended Gaming Passports cannot claim slugs.' using errcode = 'P0001';
  end if;

  if not private.is_canonical_gaming_passport_slug(normalized_slug) then
    raise exception 'Gaming Passport slug is not canonical.' using errcode = '23514';
  end if;

  if exists (
    select 1
    from public.gaming_passports
    where slug = normalized_slug
      and id <> target_passport_id
  ) then
    raise exception 'Gaming Passport slug is already claimed.' using errcode = '23505';
  end if;

  return query
    update public.gaming_passports
    set slug = normalized_slug
    where id = target_passport_id
      and owner_id = caller_id
    returning *;
end;
$$;

create or replace function public.publish_gaming_passport(
  target_passport_id uuid
)
returns setof public.gaming_passports
language plpgsql
security definer
set search_path = public, private, auth
as $$
declare
  caller_id uuid := auth.uid();
  existing public.gaming_passports%rowtype;
begin
  if caller_id is null then
    raise exception 'Parent Auth session is required.' using errcode = 'P0001';
  end if;

  select *
    into existing
    from public.gaming_passports
    where id = target_passport_id
      and owner_id = caller_id;

  if not found then
    raise exception 'Gaming Passport not found for owner.' using errcode = 'P0001';
  end if;

  if existing.status = 'suspended' then
    raise exception 'Suspended Gaming Passports cannot be published.' using errcode = 'P0001';
  end if;

  if existing.publication_consent is not true then
    raise exception 'Publication consent is required.' using errcode = 'P0001';
  end if;

  if existing.slug is null or not private.is_canonical_gaming_passport_slug(existing.slug) then
    raise exception 'A canonical public slug is required.' using errcode = 'P0001';
  end if;

  if not exists (
    select 1
    from public.linked_provider_accounts provider
    where provider.passport_id = target_passport_id
      and provider.owner_id = caller_id
      and provider.status = 'verified'
  ) then
    raise exception 'A verified linked provider is required before publishing.' using errcode = 'P0001';
  end if;

  return query
    update public.gaming_passports
    set status = 'published',
        published_at = now(),
        unpublished_at = null
    where id = target_passport_id
      and owner_id = caller_id
    returning *;
end;
$$;

create or replace function public.unpublish_gaming_passport(
  target_passport_id uuid
)
returns setof public.gaming_passports
language plpgsql
security definer
set search_path = public, private, auth
as $$
declare
  caller_id uuid := auth.uid();
  existing public.gaming_passports%rowtype;
begin
  if caller_id is null then
    raise exception 'Parent Auth session is required.' using errcode = 'P0001';
  end if;

  select *
    into existing
    from public.gaming_passports
    where id = target_passport_id
      and owner_id = caller_id;

  if not found then
    raise exception 'Gaming Passport not found for owner.' using errcode = 'P0001';
  end if;

  if existing.status = 'suspended' then
    raise exception 'Suspended Gaming Passports cannot be unpublished by this command.' using errcode = 'P0001';
  end if;

  if existing.status <> 'published' then
    return query
      select *
      from public.gaming_passports
      where id = target_passport_id
        and owner_id = caller_id;
    return;
  end if;

  return query
    update public.gaming_passports
    set status = 'unpublished',
        publication_consent = false,
        unpublished_at = now()
    where id = target_passport_id
      and owner_id = caller_id
    returning *;
end;
$$;

revoke all on function public.set_gaming_passport_publication_consent(uuid, boolean) from public;
revoke all on function public.set_gaming_passport_publication_consent(uuid, boolean) from anon;
grant execute on function public.set_gaming_passport_publication_consent(uuid, boolean) to authenticated;

revoke all on function public.claim_gaming_passport_slug(uuid, text) from public;
revoke all on function public.claim_gaming_passport_slug(uuid, text) from anon;
grant execute on function public.claim_gaming_passport_slug(uuid, text) to authenticated;

revoke all on function public.publish_gaming_passport(uuid) from public;
revoke all on function public.publish_gaming_passport(uuid) from anon;
grant execute on function public.publish_gaming_passport(uuid) to authenticated;

revoke all on function public.unpublish_gaming_passport(uuid) from public;
revoke all on function public.unpublish_gaming_passport(uuid) from anon;
grant execute on function public.unpublish_gaming_passport(uuid) to authenticated;
