
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
select pg_temp.assert_true(not has_table_privilege('bungie_passport_writer','public.linked_provider_accounts','INSERT'),'writer cannot write accounts directly');
select pg_temp.assert_true(not has_function_privilege('authenticated','private.bungie_link_transition(text,uuid,uuid,uuid,uuid,text,jsonb,uuid)','EXECUTE'),'browser cannot execute writer function');
select pg_temp.assert_true(not has_table_privilege('anon','private.bungie_link_attempts','SELECT'),'anonymous cannot read attempts');
select pg_temp.assert_true(not (select rolbypassrls from pg_roles where rolname='bungie_passport_executor'),'executor cannot bypass RLS');
set role bungie_passport_writer;
select pg_temp.expect_error('select private.bungie_link_transition(''start'',''11111111-1111-4111-8111-111111111111'',''77777777-7777-4777-8777-777777777777'',''33333333-3333-4333-8333-333333333333'',''44444444-4444-4444-8444-444444444444'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',null,null)','42501','another owner''s session is rejected');
select pg_temp.assert_true((select private.bungie_link_transition('start','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333','44444444-4444-4444-8444-444444444444','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',null,null)) is not null,'attempt created');
select pg_temp.expect_error('select private.bungie_link_transition(''start'',''11111111-1111-4111-8111-111111111111'',''22222222-2222-4222-8222-222222222222'',''33333333-3333-4333-8333-333333333333'',''55555555-5555-4555-8555-555555555555'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',null,null)','P0001','rate limit survives separate calls');
select pg_temp.expect_error('select private.bungie_link_transition(''complete'',''11111111-1111-4111-8111-111111111111'',''22222222-2222-4222-8222-222222222222'',''33333333-3333-4333-8333-333333333333'',''44444444-4444-4444-8444-444444444444'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',null,null)','42501','cannot complete before callback');
select pg_temp.assert_true((select private.bungie_link_transition('claim','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333','44444444-4444-4444-8444-444444444444','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',null,null)) is not null,'callback claimed');
select pg_temp.expect_error('select private.bungie_link_transition(''claim'',''11111111-1111-4111-8111-111111111111'',''22222222-2222-4222-8222-222222222222'',''33333333-3333-4333-8333-333333333333'',''44444444-4444-4444-8444-444444444444'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',null,null)','42501','callback replay rejected');
select pg_temp.expect_error('select private.bungie_link_transition(''ready'',''11111111-1111-4111-8111-111111111111'',''22222222-2222-4222-8222-222222222222'',''33333333-3333-4333-8333-333333333333'',''44444444-4444-4444-8444-444444444444'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',jsonb_build_object(''accountId'',''35376489'',''displayName'',''Test Player'',''bungieName'',''TestPlayer#1234'',''avatarUrl'',null,''verifiedAt'',now(),''destinyMemberships'',''[]''::jsonb) || ''{"access_token":"forbidden"}''::jsonb,null)','23514','token fields rejected');
select pg_temp.expect_error('select private.bungie_link_transition(''ready'',''11111111-1111-4111-8111-111111111111'',''22222222-2222-4222-8222-222222222222'',''33333333-3333-4333-8333-333333333333'',''44444444-4444-4444-8444-444444444444'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',jsonb_build_object(''accountId'',''35376489'',''displayName'',''Test Player'',''bungieName'',''TestPlayer#1234'',''avatarUrl'',null,''verifiedAt'',now(),''destinyMemberships'',''[]''::jsonb) || ''{"avatarUrl":"https://evil.example/avatar"}''::jsonb,null)','23514','untrusted avatar rejected');
select pg_temp.assert_true((select private.bungie_link_transition('ready','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333','44444444-4444-4444-8444-444444444444','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',jsonb_build_object('accountId','35376489','displayName','Test Player','bungieName','TestPlayer#1234','avatarUrl',null,'verifiedAt',now(),'destinyMemberships','[]'::jsonb),null)) is not null,'allowlisted snapshot staged');
select pg_temp.expect_error('select private.bungie_link_transition(''complete'',''66666666-6666-4666-8666-666666666666'',''77777777-7777-4777-8777-777777777777'',''88888888-8888-4888-8888-888888888888'',''44444444-4444-4444-8444-444444444444'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',null,null)','42501','another owner cannot complete attempt');
select pg_temp.assert_true((select private.bungie_link_transition('complete','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333','44444444-4444-4444-8444-444444444444','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',null,null)) is not null,'identity committed');
select pg_temp.assert_true((select private.bungie_link_transition('complete','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333','44444444-4444-4444-8444-444444444444','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',null,null)) is not null,'completion retry is idempotent');
reset role;
select pg_temp.assert_true((select count(*)=1 from public.linked_provider_accounts where provider='bungie'),'exactly one linked account');
select pg_temp.assert_true((select count(*)=1 from public.verified_proofs where provider='bungie' and proof_type='provider_ownership' and game is null and visibility='private'),'one private ownership proof, no invented game stats');
select pg_temp.assert_true((select snapshot is null from private.bungie_link_attempts where id='44444444-4444-4444-8444-444444444444'),'temporary snapshot cleared after commit');
set role authenticated;
select set_config('request.jwt.claim.sub','66666666-6666-4666-8666-666666666666',false);
select pg_temp.assert_true((select count(*)=0 from public.linked_provider_accounts),'RLS hides another owner account');
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',false);
select pg_temp.assert_true((select count(*)=1 from public.linked_provider_accounts),'owner can read own account');
reset role;
select pg_temp.assert_true((select private.bungie_link_transition('start','66666666-6666-4666-8666-666666666666','77777777-7777-4777-8777-777777777777','88888888-8888-4888-8888-888888888888','55555555-5555-4555-8555-555555555555','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',null,null)) is not null,'second owner begins own attempt');
select pg_temp.assert_true((select private.bungie_link_transition('claim','66666666-6666-4666-8666-666666666666','77777777-7777-4777-8777-777777777777','88888888-8888-4888-8888-888888888888','55555555-5555-4555-8555-555555555555','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',null,null)) is not null,'second owner claims own callback');
select pg_temp.assert_true((select private.bungie_link_transition('ready','66666666-6666-4666-8666-666666666666','77777777-7777-4777-8777-777777777777','88888888-8888-4888-8888-888888888888','55555555-5555-4555-8555-555555555555','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',jsonb_build_object('accountId','35376489','displayName','Test Player','bungieName','TestPlayer#1234','avatarUrl',null,'verifiedAt',now(),'destinyMemberships','[]'::jsonb),null)) is not null,'second owner''s snapshot staged');
select pg_temp.expect_error('select private.bungie_link_transition(''complete'',''66666666-6666-4666-8666-666666666666'',''77777777-7777-4777-8777-777777777777'',''88888888-8888-4888-8888-888888888888'',''55555555-5555-4555-8555-555555555555'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',null,null)','23505','same Bungie identity cannot belong to two owners');
select pg_temp.assert_true((select private.bungie_link_transition('unlink','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333','44444444-4444-4444-8444-444444444444','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',null,(select id from public.linked_provider_accounts where provider='bungie'))) is not null,'unlink succeeds');
select pg_temp.expect_error('select private.bungie_link_transition(''complete'',''11111111-1111-4111-8111-111111111111'',''22222222-2222-4222-8222-222222222222'',''33333333-3333-4333-8333-333333333333'',''44444444-4444-4444-8444-444444444444'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',null,null)','42501','old attempt cannot restore an unlinked account');
select pg_temp.assert_true((select status='revoked' and metadata_safe='{}'::jsonb from public.linked_provider_accounts where provider='bungie'),'unlink clears stored profile');
select pg_temp.assert_true((select status='revoked' from public.verified_proofs where provider='bungie'),'unlink revokes proof');
update private.bungie_link_attempts set created_at=now()-interval '2 minutes';
select pg_temp.assert_true((select private.bungie_link_transition('start','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333','99999999-9999-4999-8999-999999999999','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',null,null)) is not null,'relink starts with a fresh attempt');
update auth.sessions set not_after=now()-interval '1 second' where id='22222222-2222-4222-8222-222222222222';
select pg_temp.expect_error('select private.bungie_link_transition(''claim'',''11111111-1111-4111-8111-111111111111'',''22222222-2222-4222-8222-222222222222'',''33333333-3333-4333-8333-333333333333'',''99999999-9999-4999-8999-999999999999'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',null,null)','42501','revoked parent session blocks callback');
update auth.sessions set not_after=null where id='22222222-2222-4222-8222-222222222222';
update private.bungie_link_attempts set expires_at=now()-interval '1 second' where id='99999999-9999-4999-8999-999999999999';
select pg_temp.expect_error('select private.bungie_link_transition(''claim'',''11111111-1111-4111-8111-111111111111'',''22222222-2222-4222-8222-222222222222'',''33333333-3333-4333-8333-333333333333'',''99999999-9999-4999-8999-999999999999'',''aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'',null,null)','42501','expired attempts rejected');

update private.bungie_link_attempts set expires_at=now()+interval '10 minutes' where id='99999999-9999-4999-8999-999999999999';
update public.gaming_passports set status='published',slug='bungie-tester',publication_consent=true,published_at=now() where id='33333333-3333-4333-8333-333333333333';
set role bungie_passport_writer;
select pg_temp.assert_true(private.bungie_link_transition('claim','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333','99999999-9999-4999-8999-999999999999',repeat('a',64)) is not null,'published parent allows private Bungie linking');
reset role;
select pg_temp.assert_true((select bool_and(visibility='private') from public.linked_provider_accounts where provider='bungie'),'publication does not expose Bungie identity');
update public.gaming_passports set suspended_at=now() where id='33333333-3333-4333-8333-333333333333';
select pg_temp.expect_error('select private.bungie_link_transition(''complete'',''11111111-1111-4111-8111-111111111111'',''22222222-2222-4222-8222-222222222222'',''33333333-3333-4333-8333-333333333333'',''99999999-9999-4999-8999-999999999999'',repeat(''a'',64))','42501','suspended Passport blocks completing Bungie link');
