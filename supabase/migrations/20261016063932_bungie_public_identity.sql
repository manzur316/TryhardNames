-- Add an opt-in identity-only provider without changing any existing selections.
-- Preserve the reviewed session, consent, owner, epoch and projection guards.
do $migration$
declare
  f regprocedure;
  definition text;
  provider_guard text := $old$(a.provider = 'roblox' and a.metadata_safe->>'normalizerVersion' = 'roblox.identity.v1')$old$;
  extended_guard text := $new$(a.provider = 'roblox' and a.metadata_safe->>'normalizerVersion' = 'roblox.identity.v1')
            or (a.provider = 'bungie' and a.metadata_safe->>'normalizerVersion' = 'bungie.identity.v1')$new$;
  old_name text := $old$'username', a.metadata_safe->'snapshot'->>'username'$old$;
  new_name text := $new$'username', case when a.provider = 'bungie' then a.metadata_safe->'snapshot'->>'bungieName'
        else a.metadata_safe->'snapshot'->>'username' end$new$;
  old_freshness text := $old$a.status = 'stale' or a.last_synced_at is null or a.last_synced_at < now() - interval '24 hours'$old$;
  new_freshness text := $new$a.status = 'stale' or (a.provider <> 'bungie' and (a.last_synced_at is null or a.last_synced_at < now() - interval '24 hours'))$new$;
  expected_guards integer;
begin
  foreach f in array array[
    'private.passport_publication_command(uuid,text,text,jsonb,boolean,timestamptz)'::regprocedure,
    'private.read_public_passport(text)'::regprocedure
  ] loop
    definition := pg_get_functiondef(f);
    expected_guards := case when f::text like 'private.passport_publication_command%' then 2 else 1 end;
    if (length(definition) - length(replace(definition, provider_guard, ''))) / length(provider_guard) <> expected_guards
      or strpos(definition, old_name) = 0 or strpos(definition, 'bungie.identity.v1') > 0 then
      raise exception 'unexpected_publication_definition: %', f;
    end if;
    definition := replace(replace(definition, provider_guard, extended_guard), old_name, new_name);
    if expected_guards = 2 then
      if strpos(definition, $old$a.provider in ('osu', 'roblox')$old$) = 0 then
        raise exception 'unexpected_publication_eligibility';
      end if;
      definition := replace(definition, $old$a.provider in ('osu', 'roblox')$old$,
        $new$(a.provider in ('osu', 'roblox') or (a.provider = 'bungie' and a.metadata_safe->>'normalizerVersion' = 'bungie.identity.v1'))$new$);
    else
      if strpos(definition, old_freshness) = 0 then raise exception 'unexpected_publication_freshness'; end if;
      -- A saved OAuth identity is not a daily gameplay-stat snapshot.
      definition := replace(definition, old_freshness, new_freshness);
    end if;
    execute definition;
  end loop;
end;
$migration$;
notify pgrst, 'reload schema';
