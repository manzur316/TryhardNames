-- Publication is separate from provider storage. New/relinked accounts stay hidden.
create table private.passport_public_accounts (
  account_id uuid primary key references public.linked_provider_accounts(id) on delete cascade,
  passport_id uuid not null references public.gaming_passports(id) on delete cascade,
  link_epoch text not null,
  show_stats boolean not null default false
);
create index passport_public_accounts_passport_idx on private.passport_public_accounts(passport_id);
alter table private.passport_public_accounts enable row level security;
revoke all on private.passport_public_accounts from public, anon, authenticated;

create function private.passport_publication_command(
  p_passport uuid, p_action text, p_slug text, p_accounts jsonb, p_consent boolean, p_expected_updated_at timestamptz
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  owner_uid uuid := auth.uid();
  session_uid uuid := nullif(auth.jwt()->>'session_id', '')::uuid;
  passport public.gaming_passports;
  account public.linked_provider_accounts;
  selection jsonb;
  accounts jsonb;
begin
  if owner_uid is null or session_uid is null or not exists (
    select 1 from auth.sessions where id = session_uid and user_id = owner_uid
      and (not_after is null or not_after > now())
  ) then raise exception 'sign_in_required' using errcode = '42501'; end if;
  select * into passport from public.gaming_passports
    where id = p_passport and owner_id = owner_uid for update;
  if not found then raise exception 'passport_not_found' using errcode = '42501'; end if;
  if p_action not in ('inspect', 'publish', 'unpublish') or p_action is null then
    raise exception 'invalid_action' using errcode = '22023';
  end if;
  if p_action = 'publish' then
    if passport.status = 'suspended' then raise exception 'passport_suspended' using errcode = '42501'; end if;
    if p_consent is distinct from true then raise exception 'consent_required' using errcode = '23514'; end if;
    if p_expected_updated_at is distinct from passport.updated_at then
      raise exception 'passport_changed' using errcode = '40001';
    end if;
    if private.is_canonical_gaming_passport_slug(p_slug) is distinct from true then
      raise exception 'invalid_slug' using errcode = '23514';
    end if;
    -- Keep a claimed URL stable, including after unpublishing.
    if passport.slug is not null and passport.slug <> p_slug then
      raise exception 'slug_locked' using errcode = '23514';
    end if;
    if coalesce(btrim(passport.alias), '') = '' then raise exception 'alias_required' using errcode = '23514'; end if;
    if jsonb_typeof(p_accounts) is distinct from 'array' or jsonb_array_length(p_accounts) > 32 then
      raise exception 'invalid_selection' using errcode = '23514';
    end if;
    if not exists (select 1 from public.linked_provider_accounts a where a.passport_id = p_passport
      and a.owner_id = owner_uid and a.provider in ('osu', 'roblox')
      and a.status in ('verified', 'stale') and a.revoked_at is null and a.verified_at is not null) then
      raise exception 'verified_account_required' using errcode = '23514';
    end if;
    delete from private.passport_public_accounts where passport_id = p_passport;
    for selection in select value from jsonb_array_elements(p_accounts) loop
      if jsonb_typeof(selection) is distinct from 'object'
        or selection - array['accountId','showStats'] <> '{}'::jsonb
        or jsonb_typeof(selection->'accountId') is distinct from 'string'
        or jsonb_typeof(selection->'showStats') is distinct from 'boolean' then
        raise exception 'invalid_selection' using errcode = '23514';
      end if;
      select * into account from public.linked_provider_accounts a
        where a.id = (selection->>'accountId')::uuid and a.passport_id = p_passport and a.owner_id = owner_uid
          and a.status in ('verified','stale') and a.revoked_at is null and a.verified_at is not null
          and ((a.provider = 'osu' and a.metadata_safe->>'normalizerVersion' = 'osu.private.v1')
            or (a.provider = 'roblox' and a.metadata_safe->>'normalizerVersion' = 'roblox.identity.v1'))
          and a.metadata_safe->>'linkEpoch' is not null for update;
      if not found then raise exception 'invalid_selection' using errcode = '23514'; end if;
      insert into private.passport_public_accounts values (account.id, p_passport,
        account.metadata_safe->>'linkEpoch', account.provider = 'osu' and (selection->>'showStats')::boolean);
    end loop;
    update public.gaming_passports set slug = p_slug, status = 'published', publication_consent = true,
      published_at = coalesce(published_at, now()), unpublished_at = null where id = p_passport returning * into passport;
  elsif p_action = 'unpublish' then
    delete from private.passport_public_accounts where passport_id = p_passport;
    update public.gaming_passports set status = case when status = 'suspended' then status else 'unpublished' end,
      publication_consent = false, unpublished_at = now() where id = p_passport returning * into passport;
  end if;
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'provider', a.provider, 'username', a.metadata_safe->'snapshot'->>'username',
    'selected', s.account_id is not null, 'showStats', coalesce(s.show_stats, false)
  ) order by a.provider, a.id), '[]'::jsonb) into accounts
  from public.linked_provider_accounts a left join private.passport_public_accounts s
    on s.account_id = a.id and s.passport_id = a.passport_id and s.link_epoch = a.metadata_safe->>'linkEpoch'
  where a.passport_id = p_passport and a.owner_id = owner_uid and a.status in ('verified','stale')
    and a.revoked_at is null and a.verified_at is not null and a.metadata_safe->>'linkEpoch' is not null
    and ((a.provider = 'osu' and a.metadata_safe->>'normalizerVersion' = 'osu.private.v1')
      or (a.provider = 'roblox' and a.metadata_safe->>'normalizerVersion' = 'roblox.identity.v1'));
  return jsonb_build_object('passport', to_jsonb(passport), 'accounts', accounts);
end;
$$;
revoke all on function private.passport_publication_command(uuid,text,text,jsonb,boolean,timestamptz) from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.passport_publication_command(uuid,text,text,jsonb,boolean,timestamptz) to authenticated;
create function public.manage_passport_publication(
  p_passport uuid, p_action text default 'inspect', p_slug text default null,
  p_accounts jsonb default '[]'::jsonb, p_consent boolean default false, p_expected_updated_at timestamptz default null
) returns jsonb language sql security invoker set search_path = '' as $$
  select private.passport_publication_command(p_passport,p_action,p_slug,p_accounts,p_consent,p_expected_updated_at);
$$;
revoke all on function public.manage_passport_publication(uuid,text,text,jsonb,boolean,timestamptz) from public, anon, authenticated;
grant execute on function public.manage_passport_publication(uuid,text,text,jsonb,boolean,timestamptz) to authenticated;

-- Anonymous reads are limited to this explicit projection, never the source tables.
create function private.read_public_passport(public_slug text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare result jsonb;
begin
  perform set_config('response.headers', '[{"Cache-Control":"no-store, max-age=0"}]', true);
  select jsonb_build_object(
    'schemaVersion', 2, 'slug', p.slug, 'alias', p.alias, 'avatarUrl', p.avatar_url, 'bio', p.bio_short,
    'updatedAt', p.updated_at, 'publishedAt', p.published_at,
    'scene', jsonb_build_object('themeId', p.scene_config->>'themeId',
      'accent', p.scene_config->>'accent', 'backgroundId', p.scene_config->>'backgroundId',
      'avatarFrameId', p.scene_config->>'avatarFrameId'),
    'games', coalesce((select jsonb_agg(jsonb_build_object(
      'provider', a.provider, 'username', a.metadata_safe->'snapshot'->>'username',
      'displayName', a.display_name, 'verifiedAt', a.verified_at, 'updatedAt', a.last_synced_at,
      'stale', a.status = 'stale' or a.last_synced_at is null or a.last_synced_at < now() - interval '24 hours',
      'stats', case when a.provider = 'osu' and s.show_stats then jsonb_build_object(
        'mode', a.metadata_safe->'snapshot'->>'mode', 'pp', a.metadata_safe->'snapshot'->'pp',
        'globalRank', a.metadata_safe->'snapshot'->'globalRank', 'countryRank', a.metadata_safe->'snapshot'->'countryRank',
        'accuracyPercent', a.metadata_safe->'snapshot'->'accuracyPercent', 'medals', a.metadata_safe->'snapshot'->'medals'
      ) else null end
    ) order by a.provider, a.id) from private.passport_public_accounts s
      join public.linked_provider_accounts a on a.id = s.account_id and a.passport_id = s.passport_id
      where s.passport_id = p.id and a.owner_id = p.owner_id and a.status in ('verified','stale')
        and a.revoked_at is null and a.verified_at is not null and s.link_epoch = a.metadata_safe->>'linkEpoch'
        and ((a.provider = 'osu' and a.metadata_safe->>'normalizerVersion' = 'osu.private.v1')
          or (a.provider = 'roblox' and a.metadata_safe->>'normalizerVersion' = 'roblox.identity.v1'))
    ), '[]'::jsonb)
  ) into result from public.gaming_passports p
  where p.slug = public_slug and p.status = 'published' and p.publication_consent is true
    and p.suspended_at is null and p.published_at is not null;
  return result;
end;
$$;
revoke all on function private.read_public_passport(text) from public, anon, authenticated;
grant usage on schema private to anon;
grant execute on function private.read_public_passport(text) to anon, authenticated;
create function public.get_public_gaming_passport_projection(public_slug text) returns jsonb
language sql security invoker set search_path = '' as $$ select private.read_public_passport(public_slug); $$;
revoke all on function public.get_public_gaming_passport_projection(text) from public, anon, authenticated;
grant execute on function public.get_public_gaming_passport_projection(text) to anon, authenticated;

-- Preserve tested provider transitions and their restricted owners/ACLs, changing only
-- the parent-state predicate. Abort if a function no longer matches the reviewed body.
grant osu_passport_executor, roblox_passport_executor to postgres;
do $$
declare f regprocedure; definition text; old_guard text;
begin
  foreach f in array array[
    'private.persist_osu_link(uuid,uuid,uuid,uuid,jsonb)'::regprocedure,
    'private.osu_link_transition(text,uuid,uuid,uuid,uuid,text,jsonb,uuid)'::regprocedure,
    'private.roblox_link_transition(text,uuid,uuid,uuid,uuid,text,jsonb,uuid)'::regprocedure
  ] loop
    definition := pg_get_functiondef(f);
    old_guard := case when f::text like 'private.persist_osu_link%'
      then 'status = ''draft_private'' and publication_consent is false and slug is null'
      else 'status = ''draft_private'' and slug is null and publication_consent is false' end;
    if strpos(definition, old_guard) = 0 then raise exception 'unexpected_linking_definition: %', f; end if;
    execute replace(definition, old_guard, 'status in (''draft_private'', ''published'', ''unpublished'') and suspended_at is null');
  end loop;
end;
$$;
revoke osu_passport_executor, roblox_passport_executor from postgres;
notify pgrst, 'reload schema';
