
create function pg_temp.assert_true(ok boolean, label text) returns text language plpgsql as $$
begin if ok is not true then raise exception 'FAIL: %', label; end if; return 'ok: ' || label; end $$;
create function pg_temp.expect_error(statement text, code text, label text) returns text language plpgsql as $$
begin
  begin execute statement;
  exception when others then
    if sqlstate = code then return 'ok: ' || label; end if;
    raise;
  end;
  raise exception 'FAIL (no error): %', label;
end $$;
insert into auth.users values('11111111-1111-4111-8111-111111111111'),('66666666-6666-4666-8666-666666666666');
insert into auth.sessions values('22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111',null),('77777777-7777-4777-8777-777777777777','66666666-6666-4666-8666-666666666666',null);
insert into public.gaming_passports(id,owner_id) values('33333333-3333-4333-8333-333333333333','11111111-1111-4111-8111-111111111111'),('88888888-8888-4888-8888-888888888888','66666666-6666-4666-8666-666666666666');
select pg_temp.assert_true(not has_table_privilege('steam_passport_writer','public.linked_provider_accounts','INSERT'),'writer cannot write accounts directly');
select pg_temp.assert_true(not has_function_privilege('authenticated','private.steam_link_transition(text,uuid,uuid,uuid,uuid,text,jsonb,uuid)','EXECUTE'),'browser cannot execute writer function');
select pg_temp.assert_true(not has_table_privilege('anon','private.steam_link_attempts','SELECT'),'anonymous cannot read attempts');
select pg_temp.assert_true(not (select rolbypassrls from pg_roles where rolname='steam_passport_executor'),'executor cannot bypass RLS');
set role steam_passport_writer;
select pg_temp.expect_error('select private.steam_link_transition(''start'',''11111111-1111-4111-8111-111111111111'',''77777777-7777-4777-8777-777777777777'',''33333333-3333-4333-8333-333333333333'',''44444444-4444-4444-8444-444444444444'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',null,null)','42501','another owner''s session is rejected');
select pg_temp.assert_true((select private.steam_link_transition('start','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333','44444444-4444-4444-8444-444444444444','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',null,null)) is not null,'attempt created');
select pg_temp.expect_error('select private.steam_link_transition(''start'',''11111111-1111-4111-8111-111111111111'',''22222222-2222-4222-8222-222222222222'',''33333333-3333-4333-8333-333333333333'',''55555555-5555-4555-8555-555555555555'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',null,null)','P0001','rate limit survives separate calls');
select pg_temp.expect_error('select private.steam_link_transition(''complete'',''11111111-1111-4111-8111-111111111111'',''22222222-2222-4222-8222-222222222222'',''33333333-3333-4333-8333-333333333333'',''44444444-4444-4444-8444-444444444444'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',null,null)','42501','cannot complete before callback');
select pg_temp.assert_true((select private.steam_link_transition('claim','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333','44444444-4444-4444-8444-444444444444','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',null,null)) is not null,'callback claimed');
select pg_temp.expect_error('select private.steam_link_transition(''claim'',''11111111-1111-4111-8111-111111111111'',''22222222-2222-4222-8222-222222222222'',''33333333-3333-4333-8333-333333333333'',''44444444-4444-4444-8444-444444444444'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',null,null)','42501','callback replay rejected');
select pg_temp.expect_error('select private.steam_link_transition(''ready'',''11111111-1111-4111-8111-111111111111'',''22222222-2222-4222-8222-222222222222'',''33333333-3333-4333-8333-333333333333'',''44444444-4444-4444-8444-444444444444'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',jsonb_build_object(''steamId'',''76561198000000000'',''displayName'',''Test Player'',''avatarUrl'',null,''createdAt'',null,''verifiedAt'',now(),''dataError'',null,''library'',jsonb_build_object(''status'',''unavailable'',''gameCount'',null,''games'',''[]''::jsonb)) || ''{"access_token":"forbidden"}''::jsonb,null)','23514','token fields rejected');
select pg_temp.expect_error('select private.steam_link_transition(''ready'',''11111111-1111-4111-8111-111111111111'',''22222222-2222-4222-8222-222222222222'',''33333333-3333-4333-8333-333333333333'',''44444444-4444-4444-8444-444444444444'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',jsonb_build_object(''steamId'',''76561198000000000'',''displayName'',''Test Player'',''avatarUrl'',null,''createdAt'',null,''verifiedAt'',now(),''dataError'',null,''library'',jsonb_build_object(''status'',''unavailable'',''gameCount'',null,''games'',''[]''::jsonb)) || ''{"avatarUrl":"https://evil.example/avatar"}''::jsonb,null)','23514','untrusted avatar rejected');
select pg_temp.assert_true((select private.steam_link_transition('ready','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333','44444444-4444-4444-8444-444444444444','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',jsonb_build_object('steamId','76561198000000000','displayName','Test Player','avatarUrl',null,'createdAt',null,'verifiedAt',now(),'dataError',null,'library',jsonb_build_object('status','unavailable','gameCount',null,'games','[]'::jsonb)),null)) is not null,'allowlisted snapshot staged');
select pg_temp.expect_error('select private.steam_link_transition(''complete'',''66666666-6666-4666-8666-666666666666'',''77777777-7777-4777-8777-777777777777'',''88888888-8888-4888-8888-888888888888'',''44444444-4444-4444-8444-444444444444'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',null,null)','42501','another owner cannot complete attempt');
select pg_temp.assert_true((select private.steam_link_transition('complete','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333','44444444-4444-4444-8444-444444444444','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',null,null)) is not null,'identity committed');
select pg_temp.assert_true((select private.steam_link_transition('complete','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333','44444444-4444-4444-8444-444444444444','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',null,null)) is not null,'completion retry is idempotent');
reset role;
select pg_temp.assert_true((select count(*)=1 from public.linked_provider_accounts where provider='steam'),'exactly one linked account');
select pg_temp.assert_true((select count(*)=1 from public.verified_proofs where provider='steam' and proof_type='provider_ownership' and game is null and visibility='private'),'one private ownership proof, no invented game stats');
select pg_temp.assert_true((select snapshot is null from private.steam_link_attempts where id='44444444-4444-4444-8444-444444444444'),'temporary snapshot cleared after commit');
set role authenticated;
select set_config('request.jwt.claim.sub','66666666-6666-4666-8666-666666666666',false);
select pg_temp.assert_true((select count(*)=0 from public.linked_provider_accounts),'RLS hides another owner account');
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',false);
select pg_temp.assert_true((select count(*)=1 from public.linked_provider_accounts),'owner can read own account');
reset role;
select pg_temp.assert_true((select private.steam_link_transition('start','66666666-6666-4666-8666-666666666666','77777777-7777-4777-8777-777777777777','88888888-8888-4888-8888-888888888888','55555555-5555-4555-8555-555555555555','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',null,null)) is not null,'second owner begins own attempt');
select pg_temp.assert_true((select private.steam_link_transition('claim','66666666-6666-4666-8666-666666666666','77777777-7777-4777-8777-777777777777','88888888-8888-4888-8888-888888888888','55555555-5555-4555-8555-555555555555','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',null,null)) is not null,'second owner claims own callback');
select pg_temp.assert_true((select private.steam_link_transition('ready','66666666-6666-4666-8666-666666666666','77777777-7777-4777-8777-777777777777','88888888-8888-4888-8888-888888888888','55555555-5555-4555-8555-555555555555','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',jsonb_build_object('steamId','76561198000000000','displayName','Test Player','avatarUrl',null,'createdAt',null,'verifiedAt',now(),'dataError',null,'library',jsonb_build_object('status','unavailable','gameCount',null,'games','[]'::jsonb)),null)) is not null,'second owner''s snapshot staged');
select pg_temp.expect_error('select private.steam_link_transition(''complete'',''66666666-6666-4666-8666-666666666666'',''77777777-7777-4777-8777-777777777777'',''88888888-8888-4888-8888-888888888888'',''55555555-5555-4555-8555-555555555555'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',null,null)','23505','same Steam identity cannot belong to two owners');
select pg_temp.assert_true((select private.steam_link_transition('unlink','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333','44444444-4444-4444-8444-444444444444','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',null,(select id from public.linked_provider_accounts where provider='steam'))) is not null,'unlink succeeds');
select pg_temp.expect_error('select private.steam_link_transition(''complete'',''11111111-1111-4111-8111-111111111111'',''22222222-2222-4222-8222-222222222222'',''33333333-3333-4333-8333-333333333333'',''44444444-4444-4444-8444-444444444444'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',null,null)','42501','old attempt cannot restore an unlinked account');
select pg_temp.assert_true((select status='revoked' and metadata_safe='{}'::jsonb from public.linked_provider_accounts where provider='steam'),'unlink clears stored profile');
select pg_temp.assert_true((select status='revoked' from public.verified_proofs where provider='steam'),'unlink revokes proof');
update private.steam_link_attempts set created_at=now()-interval '2 minutes';
select pg_temp.assert_true((select private.steam_link_transition('start','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333','99999999-9999-4999-8999-999999999999','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',null,null)) is not null,'relink starts with a fresh attempt');
update auth.sessions set not_after=now()-interval '1 second' where id='22222222-2222-4222-8222-222222222222';
select pg_temp.expect_error('select private.steam_link_transition(''claim'',''11111111-1111-4111-8111-111111111111'',''22222222-2222-4222-8222-222222222222'',''33333333-3333-4333-8333-333333333333'',''99999999-9999-4999-8999-999999999999'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',null,null)','42501','revoked parent session blocks callback');
update auth.sessions set not_after=null where id='22222222-2222-4222-8222-222222222222';
update private.steam_link_attempts set expires_at=now()-interval '1 second' where id='99999999-9999-4999-8999-999999999999';
select pg_temp.expect_error('select private.steam_link_transition(''claim'',''11111111-1111-4111-8111-111111111111'',''22222222-2222-4222-8222-222222222222'',''33333333-3333-4333-8333-333333333333'',''99999999-9999-4999-8999-999999999999'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',null,null)','42501','expired attempts rejected');
-- Steam-specific library validation and fresh-link proof lifecycle.
update private.steam_link_attempts set expires_at=now()+interval '10 minutes'
  where id='99999999-9999-4999-8999-999999999999';
select private.steam_link_transition('claim','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333','99999999-9999-4999-8999-999999999999',repeat('a',64));
create function pg_temp.steam_profile() returns jsonb language sql as $$
select jsonb_build_object('steamId','76561198000000000','displayName','Tester','avatarUrl',null,
  'createdAt',null,'verifiedAt',now(),'dataError',null,'library',jsonb_build_object('status','available','gameCount',1,
  'games',jsonb_build_array(jsonb_build_object('appId',730,'name','Counter-Strike 2','playtimeMinutes',120,'recentMinutes',null,'iconUrl',null))));
$$;
create function pg_temp.steam_ready(p jsonb) returns uuid language sql as $$
select private.steam_link_transition('ready','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333','99999999-9999-4999-8999-999999999999',repeat('a',64),p);
$$;
select pg_temp.expect_error(format('select pg_temp.steam_ready(%L::jsonb)',jsonb_set(pg_temp.steam_profile(),'{library,games,0,playtimeMinutes}','-1')),'23514','negative playtime rejected');
select pg_temp.expect_error(format('select pg_temp.steam_ready(%L::jsonb)',jsonb_set(pg_temp.steam_profile(),'{library,games,0,playtimeMinutes}','"120"')),'23514','string playtime rejected');
select pg_temp.expect_error(format('select pg_temp.steam_ready(%L::jsonb)',jsonb_set(pg_temp.steam_profile(),'{library,status}','"unavailable"')),'23514','private library cannot carry old public games');
select pg_temp.expect_error(format('select pg_temp.steam_ready(%L::jsonb)',jsonb_set(pg_temp.steam_profile(),'{library,gameCount}','0')),'23514','game count cannot contradict preview');
select pg_temp.expect_error(format('select pg_temp.steam_ready(%L::jsonb)',jsonb_set(pg_temp.steam_profile(),'{library,games,0,iconUrl}','"https://evil.example/image"')),'23514','game icons cannot point to arbitrary hosts');
select pg_temp.expect_error(format('select pg_temp.steam_ready(%L::jsonb)',pg_temp.steam_profile() || '{"cookie":"forbidden"}'),'23514','unknown snapshot properties rejected');
select pg_temp.expect_error(format('select pg_temp.steam_ready(%L::jsonb)',jsonb_set(pg_temp.steam_profile(),'{library,games}',jsonb_build_array(pg_temp.steam_profile()#>'{library,games,0}',pg_temp.steam_profile()#>'{library,games,0}')) || '{}'),'23514','duplicate or inconsistent preview rejected');
select pg_temp.assert_true(pg_temp.steam_ready(pg_temp.steam_profile()) is not null,'normalized library snapshot accepted');
select private.steam_link_transition('complete','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333','99999999-9999-4999-8999-999999999999',repeat('a',64));
select pg_temp.assert_true((select count(*)=2 from public.verified_proofs where provider='steam'),'relink creates a new ownership proof');
select pg_temp.assert_true((select count(*)=1 from public.verified_proofs where provider='steam' and status='revoked'),'old ownership proof remains revoked');
select pg_temp.assert_true((select metadata_safe#>>'{snapshot,library,games,0,playtimeMinutes}'='120' from public.linked_provider_accounts where provider='steam'),'library stored across separate statements');
select pg_temp.assert_true((select count(*)=1 from public.verified_proofs where provider='steam' and verification_method='openid' and proof_type='provider_ownership' and status='current'),'only ownership is a proof, never playtime rank');
select pg_temp.assert_true((select status='draft_private' and slug is null and not publication_consent from public.gaming_passports where id='33333333-3333-4333-8333-333333333333'),'linking does not publish Passport');
select pg_temp.assert_true(not has_function_privilege('anon','private.steam_owner_session_active(uuid,uuid)','EXECUTE'),'auth lookup not exposed to anonymous');

-- Parent publication never automatically publishes Steam identity or library.
update public.gaming_passports set status='published', slug='steam-test-player', publication_consent=true,
  published_at=now() where id='33333333-3333-4333-8333-333333333333';
update private.steam_link_attempts set created_at=now()-interval '2 minutes';
set role steam_passport_writer;
select pg_temp.assert_true(private.steam_link_transition('start','11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',repeat('b',64)) is not null,'published owner can begin private link');
reset role;
select pg_temp.assert_true((select bool_and(visibility='private') from public.linked_provider_accounts where provider='steam'),'published parent does not expose Steam');
update public.gaming_passports set suspended_at=now() where id='33333333-3333-4333-8333-333333333333';
set role steam_passport_writer;
select pg_temp.expect_error('select private.steam_link_transition(''claim'',''11111111-1111-4111-8111-111111111111'',
  ''22222222-2222-4222-8222-222222222222'',''33333333-3333-4333-8333-333333333333'',
  ''aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'',repeat(''b'',64))','42501','suspension blocks pending callback');
reset role;
update public.gaming_passports set status='unpublished', publication_consent=false, unpublished_at=now(), suspended_at=null
  where id='33333333-3333-4333-8333-333333333333';
set role steam_passport_writer;
select pg_temp.assert_true(private.steam_link_transition('claim','11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',repeat('b',64)) is not null,'unpublished owner can finish verification');
reset role;
