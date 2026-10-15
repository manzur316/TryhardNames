set lock_timeout = '5s';

-- Linking remains private even when the parent Passport has been published.
grant steam_passport_executor to postgres;
do $$
declare
  f regprocedure := 'private.steam_link_transition(text,uuid,uuid,uuid,uuid,text,jsonb,uuid)'::regprocedure;
  definition text := pg_get_functiondef(f);
  old_guard text := 'status = ''draft_private'' and slug is null and publication_consent is false';
begin
  if strpos(definition, old_guard) = 0 then raise exception 'unexpected_steam_linking_definition'; end if;
  execute replace(definition, old_guard,
    'status in (''draft_private'', ''published'', ''unpublished'') and suspended_at is null');
end;
$$;
revoke steam_passport_executor from postgres;
