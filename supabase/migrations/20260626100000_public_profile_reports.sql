create table public.public_profile_reports (
  id uuid primary key default extensions.gen_random_uuid(),
  public_slug text not null,
  target_passport_id uuid null references public.gaming_passports(id) on delete set null,
  category text not null,
  details text not null default '',
  reporter_owner_id uuid null references auth.users(id) on delete set null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  constraint public_profile_reports_slug_canonical check (
    private.is_canonical_gaming_passport_slug(public_slug)
  ),
  constraint public_profile_reports_category_check check (
    category in (
      'impersonation',
      'offensive_content',
      'offensive_cosmetic',
      'fake_proof_or_rank',
      'privacy_request',
      'harassment',
      'other'
    )
  ),
  constraint public_profile_reports_details_trimmed check (details = btrim(details)),
  constraint public_profile_reports_details_length check (char_length(details) <= 800),
  constraint public_profile_reports_status_check check (
    status in ('new', 'reviewing', 'resolved', 'dismissed')
  )
);

create index public_profile_reports_slug_idx
  on public.public_profile_reports (public_slug, created_at desc);

create index public_profile_reports_target_passport_idx
  on public.public_profile_reports (target_passport_id, created_at desc)
  where target_passport_id is not null;

alter table public.public_profile_reports enable row level security;

revoke all on table public.public_profile_reports from public;
revoke all on table public.public_profile_reports from anon;
revoke all on table public.public_profile_reports from authenticated;

create or replace function public.submit_public_profile_report(
  public_slug text,
  report_category text,
  report_details text
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, auth
as $$
declare
  normalized_slug text := private.normalize_gaming_passport_slug(public_slug);
  safe_category text := btrim(coalesce(report_category, ''));
  safe_details text := regexp_replace(btrim(coalesce(report_details, '')), '\s+', ' ', 'g');
  target_id uuid := null;
  reporter_id uuid := auth.uid();
begin
  if normalized_slug is null or not private.is_canonical_gaming_passport_slug(normalized_slug) then
    return jsonb_build_object('ok', false, 'error', 'invalid_report');
  end if;

  if safe_category not in (
    'impersonation',
    'offensive_content',
    'offensive_cosmetic',
    'fake_proof_or_rank',
    'privacy_request',
    'harassment',
    'other'
  ) then
    return jsonb_build_object('ok', false, 'error', 'invalid_report');
  end if;

  if char_length(safe_details) > 800 then
    return jsonb_build_object('ok', false, 'error', 'invalid_report');
  end if;

  select passport.id
    into target_id
    from public.gaming_passports passport
    where passport.slug = normalized_slug
      and passport.status = 'published'
      and passport.publication_consent is true
      and passport.suspended_at is null
      and private.is_canonical_gaming_passport_slug(passport.slug)
      and exists (
        select 1
        from public.linked_provider_accounts provider
        where provider.passport_id = passport.id
          and provider.owner_id = passport.owner_id
          and provider.status = 'verified'
      );

  insert into public.public_profile_reports (
    public_slug,
    target_passport_id,
    category,
    details,
    reporter_owner_id
  )
  values (
    normalized_slug,
    target_id,
    safe_category,
    safe_details,
    reporter_id
  );

  return jsonb_build_object('ok', true);
exception when others then
  return jsonb_build_object('ok', false, 'error', 'invalid_report');
end;
$$;

revoke all on function public.submit_public_profile_report(text, text, text) from public;
grant execute on function public.submit_public_profile_report(text, text, text) to anon;
grant execute on function public.submit_public_profile_report(text, text, text) to authenticated;
