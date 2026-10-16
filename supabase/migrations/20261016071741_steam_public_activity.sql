-- Only explicit public fields leave the private Steam snapshot.
create function private.public_steam_activity(snapshot jsonb, achievements jsonb) returns jsonb
language plpgsql immutable security invoker set search_path = '' as $$
declare
  library jsonb := snapshot->'library';
  games jsonb := '[]'; details jsonb := '[]'; icons jsonb;
  game jsonb; detail jsonb; icon jsonb; state text; count_value jsonb := 'null';
  image_pattern text := '^https://(cdn[.](cloudflare|akamai|fastly)[.]steamstatic[.]com|steamcdn-a[.]akamaihd[.]net|steamcommunity-a[.]akamaihd[.]net|shared[.](akamai|fastly)[.]steamstatic[.]com)/steamcommunity/public/images/apps/[0-9]+/[a-f0-9]+[.](jpg|png)$';
begin
  if library->>'status' is distinct from 'available' or jsonb_typeof(library->'games') is distinct from 'array' then
    return jsonb_build_object('library', jsonb_build_object('status','unavailable','gameCount',null,'games','[]'::jsonb), 'achievements','[]'::jsonb);
  end if;
  if jsonb_typeof(library->'gameCount') = 'number' and library->>'gameCount' ~ '^[0-9]{1,9}$' then count_value := library->'gameCount'; end if;
  for game in select value from jsonb_array_elements(library->'games') with ordinality t(value, n) where n <= 6 loop
    if jsonb_typeof(game->'appId') is distinct from 'number' or not coalesce(game->>'appId' ~ '^[1-9][0-9]{0,9}$',false)
      or jsonb_typeof(game->'name') is distinct from 'string' then continue; end if;
    games := games || jsonb_build_array(jsonb_build_object(
      'appId',game->'appId','name',left(game->>'name',100),
      'playtimeMinutes',case when jsonb_typeof(game->'playtimeMinutes') = 'number' and game->>'playtimeMinutes' ~ '^[0-9]{1,15}$' then game->'playtimeMinutes' else 'null'::jsonb end,
      'recentMinutes',case when jsonb_typeof(game->'recentMinutes') = 'number' and game->>'recentMinutes' ~ '^[0-9]{1,15}$' then game->'recentMinutes' else 'null'::jsonb end,
      'iconUrl',case when length(game->>'iconUrl') <= 256 and game->>'iconUrl' ~ image_pattern then game->>'iconUrl' else null end));
    detail := null;
    if jsonb_typeof(achievements) = 'array' then
      select value into detail from jsonb_array_elements(achievements) with ordinality t(value,n)
        where n <= 6 and value->'appId' = game->'appId' limit 1;
    end if;
    state := case when detail is null then 'pending' else 'unavailable' end;
    icons := '[]';
    if detail->>'status' = 'available' and jsonb_typeof(detail->'unlocked') = 'number' and jsonb_typeof(detail->'total') = 'number'
      and detail->>'unlocked' ~ '^[0-9]{1,6}$' and detail->>'total' ~ '^[0-9]{1,6}$' then
      if (detail->>'unlocked')::integer <= (detail->>'total')::integer and (detail->>'total')::integer <= 100000 then
        state := 'available';
        if jsonb_typeof(detail->'recent') = 'array' then
          for icon in select value from jsonb_array_elements(detail->'recent') with ordinality t(value,n) where n <= 3 loop
            if jsonb_typeof(icon->'name') = 'string' then
              icons := icons || jsonb_build_array(jsonb_build_object('name',left(icon->>'name',64),
                'iconUrl',case when length(icon->>'iconUrl') <= 256 and icon->>'iconUrl' ~ image_pattern then icon->>'iconUrl' else null end));
            end if;
          end loop;
        end if;
      end if;
    end if;
    details := details || jsonb_build_array(jsonb_build_object('appId',game->'appId','status',state,
      'unlocked',case when state = 'available' then detail->'unlocked' else 'null'::jsonb end,
      'total',case when state = 'available' then detail->'total' else 'null'::jsonb end,'recent',icons));
  end loop;
  return jsonb_build_object('library',jsonb_build_object('status','available','gameCount',count_value,'games',games),'achievements',details);
end;
$$;
revoke all on function private.public_steam_activity(jsonb,jsonb) from public, anon, authenticated;

-- Preserve owners, grants, consent/session checks and existing account selections.
do $migration$
declare
  f regprocedure; definition text; expected integer;
  guard text := $old$(a.provider = 'bungie' and a.metadata_safe->>'normalizerVersion' = 'bungie.identity.v1')$old$;
  extended text := $new$(a.provider = 'bungie' and a.metadata_safe->>'normalizerVersion' = 'bungie.identity.v1')
            or (a.provider = 'steam' and a.metadata_safe->>'normalizerVersion' = 'steam.identity.v1')$new$;
  old_name text := $old$else a.metadata_safe->'snapshot'->>'username' end$old$;
  new_name text := $new$when a.provider = 'steam' then a.metadata_safe->'snapshot'->>'displayName'
        else a.metadata_safe->'snapshot'->>'username' end$new$;
  old_stats text := $old$) else null end$old$;
  new_stats text := $new$) when a.provider = 'steam' and s.show_stats then private.public_steam_activity(a.metadata_safe->'snapshot', a.metadata_safe->'achievements') else null end$new$;
begin
  foreach f in array array[
    'private.passport_publication_command(uuid,text,text,jsonb,boolean,timestamptz)'::regprocedure,
    'private.read_public_passport(text)'::regprocedure
  ] loop
    definition := pg_get_functiondef(f);
    expected := case when f::text like 'private.passport_publication_command%' then 3 else 1 end;
    if (length(definition)-length(replace(definition,guard,'')))/length(guard) <> expected
      or strpos(definition,old_name) = 0 or strpos(definition,'steam.identity.v1') > 0 then
      raise exception 'unexpected_steam_publication_definition: %', f;
    end if;
    definition := replace(replace(definition,guard,extended),old_name,new_name);
    if expected = 3 then
      if strpos(definition, $old$account.provider = 'osu' and (selection->>'showStats')::boolean$old$) = 0 then
        raise exception 'unexpected_steam_consent_definition';
      end if;
      definition := replace(definition, $old$account.provider = 'osu' and (selection->>'showStats')::boolean$old$,
        $new$account.provider in ('osu','steam') and (selection->>'showStats')::boolean$new$);
    else
      if (length(definition)-length(replace(definition,old_stats,'')))/length(old_stats) <> 1
        or strpos(definition,$old$a.provider <> 'bungie'$old$) = 0 then raise exception 'unexpected_steam_projection_definition'; end if;
      definition := replace(replace(definition,old_stats,new_stats),$old$a.provider <> 'bungie'$old$,
        $new$a.provider <> 'bungie' and (a.provider <> 'steam' or s.show_stats)$new$);
    end if;
    execute definition;
  end loop;
end;
$migration$;
notify pgrst, 'reload schema';
