create function pg_temp.assert_true(ok boolean, label text) returns text language plpgsql as $$
begin if ok is not true then raise exception 'FAIL: %', label; end if; return 'ok: ' || label; end $$;
create function pg_temp.expect_error(statement text, code text, label text) returns text language plpgsql as $$
begin
  begin execute statement;
  exception when others then if sqlstate = code then return 'ok: ' || label; end if; raise; end;
  raise exception 'FAIL (no error): %', label;
end $$;
create function pg_temp.publish(slug text, accounts jsonb default '[]', consent boolean default true, expected timestamptz default null)
returns jsonb language sql as $$
  select public.manage_passport_publication(id, 'publish', $1, $2, $3, coalesce($4, updated_at))
    from public.gaming_passports where owner_id = auth.uid();
$$;
insert into auth.users values('11111111-1111-4111-8111-111111111111'),('66666666-6666-4666-8666-666666666666');
insert into auth.sessions values('22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111',null),('77777777-7777-4777-8777-777777777777','66666666-6666-4666-8666-666666666666',null);
insert into public.gaming_passports(id,owner_id,alias,bio_short,scene_config) values
('33333333-3333-4333-8333-333333333333','11111111-1111-4111-8111-111111111111','Player one','My bio','{"backgroundId":"sky-islands","avatarFrameId":"christmas-rustic","privateField":"SECRET"}'),
('88888888-8888-4888-8888-888888888888','66666666-6666-4666-8666-666666666666','Other owner',null,'{}');
insert into public.linked_provider_accounts(id,passport_id,owner_id,provider,external_account_id,status,verified_at,last_synced_at,metadata_safe) values
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','33333333-3333-4333-8333-333333333333','11111111-1111-4111-8111-111111111111','osu','12345','verified',now(),now(),'{"normalizerVersion":"osu.private.v1","linkEpoch":"one","snapshot":{"username":"Player","mode":"osu","pp":123,"globalRank":456,"countryRank":78,"accuracyPercent":98,"medals":2,"privateField":"SECRET"}}'),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','33333333-3333-4333-8333-333333333333','11111111-1111-4111-8111-111111111111','roblox','56789','verified',now(),now(),'{"normalizerVersion":"roblox.identity.v1","linkEpoch":"two","snapshot":{"username":"Roblox player","accountId":"56789","avatarUrl":"https://example.com/private"}}'),
('cccccccc-cccc-4ccc-8ccc-cccccccccccc','88888888-8888-4888-8888-888888888888','66666666-6666-4666-8666-666666666666','osu','99999','verified',now(),now(),'{"normalizerVersion":"osu.private.v1","linkEpoch":"other","snapshot":{"username":"Other"}}');
select pg_temp.assert_true(not has_table_privilege('anon','public.gaming_passports','SELECT'), 'anon cannot read source profiles');
select pg_temp.assert_true(not has_table_privilege('anon','private.passport_public_accounts','SELECT'), 'anon cannot read private selections');
select pg_temp.assert_true(not has_table_privilege('authenticated','private.passport_public_accounts','INSERT'), 'browser cannot bypass consent');
select pg_temp.assert_true(not has_function_privilege('anon','public.manage_passport_publication(uuid,text,text,jsonb,boolean,timestamptz)','EXECUTE'), 'anonymous mutations denied');
select pg_temp.assert_true(not has_function_privilege('anon','private.osu_link_transition(text,uuid,uuid,uuid,uuid,text,jsonb,uuid)','EXECUTE'), 'private schema usage does not expose linking');
set role anon;
select pg_temp.assert_true(public.get_public_gaming_passport_projection('player-one') is null, 'private draft hidden');
reset role;
set role authenticated;
select pg_temp.expect_error($q$select public.manage_passport_publication('33333333-3333-4333-8333-333333333333')$q$,'42501','missing session denied');
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',false);
select set_config('request.jwt.claims','{"session_id":"22222222-2222-4222-8222-222222222222"}',false);
select pg_temp.assert_true(jsonb_array_length(public.manage_passport_publication('33333333-3333-4333-8333-333333333333')->'accounts')=2,'owner sees eligible choices');
select pg_temp.expect_error($q$select public.manage_passport_publication('88888888-8888-4888-8888-888888888888')$q$,'42501','other owner cannot inspect');
select pg_temp.expect_error($q$select public.manage_passport_publication('88888888-8888-4888-8888-888888888888','unpublish')$q$,'42501','other owner cannot unpublish');
select pg_temp.expect_error($q$select pg_temp.publish('player-one','[]',false)$q$,'23514','explicit consent required');
select pg_temp.expect_error($q$select pg_temp.publish('admin')$q$,'23514','reserved slug rejected');
select pg_temp.expect_error($q$select pg_temp.publish('Mixed Case')$q$,'23514','noncanonical slug rejected');
select pg_temp.expect_error($q$select pg_temp.publish('player-one','[]',true,'2000-01-01')$q$,'40001','stale editor rejected');
select pg_temp.expect_error($q$select pg_temp.publish('player-one','[{"accountId":"cccccccc-cccc-4ccc-8ccc-cccccccccccc","showStats":true}]')$q$,'23514','another owners account rejected');
select pg_temp.expect_error($q$select pg_temp.publish('player-one','[{"accountId":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa","showStats":true,"extra":true}]')$q$,'23514','extra selection fields rejected');
select pg_temp.assert_true(pg_temp.publish('player-one','[{"accountId":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa","showStats":false}]')->'passport'->>'status'='published','publish atomically claims URL');
select pg_temp.assert_true((select visibility='private' from public.linked_provider_accounts where provider='osu'),'source accounts remain private');
set role anon;
select pg_temp.assert_true(jsonb_array_length(public.get_public_gaming_passport_projection('player-one')->'games')=1,'only selected account public');
select pg_temp.assert_true(public.get_public_gaming_passport_projection('player-one')->'games'->0->'stats'='null'::jsonb,'stats hidden by default');
select pg_temp.assert_true(public.get_public_gaming_passport_projection('player-one')->>'bio'='My bio','consented bio is public');
select pg_temp.assert_true(public.get_public_gaming_passport_projection('player-one')::text !~ 'SECRET|owner_id|external_account_id|12345|56789|metadata_safe|accountId','projection contains no private metadata or IDs');
select pg_temp.assert_true(public.get_public_gaming_passport_projection('missing') is null,'unknown slug returns null');
reset role;
set role authenticated;
select pg_temp.assert_true(pg_temp.publish('player-one','[{"accountId":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa","showStats":true},{"accountId":"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb","showStats":true}]') is not null,'selected stats published');
set role anon;
select pg_temp.assert_true((public.get_public_gaming_passport_projection('player-one')->'games'->0->'stats'->>'pp')::numeric=123,'osu stats allowlisted');
select pg_temp.assert_true(public.get_public_gaming_passport_projection('player-one')->'games'->1->'stats'='null'::jsonb,'Roblox never fabricates metrics');
reset role;
set role authenticated;
select set_config('request.jwt.claim.sub','66666666-6666-4666-8666-666666666666',false);
select set_config('request.jwt.claims','{"session_id":"77777777-7777-4777-8777-777777777777"}',false);
select pg_temp.expect_error($q$select pg_temp.publish('player-one')$q$,'23505','slug collision rejected');
reset role;
set role osu_linking_writer;
select pg_temp.assert_true(private.osu_link_transition('unlink','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333',null,null,null,'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa') is not null,'osu unlink works while public');
reset role;
set role anon;
select pg_temp.assert_true(jsonb_array_length(public.get_public_gaming_passport_projection('player-one')->'games')=1,'unlink immediately removes public game');
reset role;
set role osu_passport_writer;
select pg_temp.assert_true(private.persist_osu_link('11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333','44444444-4444-4444-8444-444444444444',jsonb_build_object('externalAccountId','12345','username','Relinked','mode','osu','pp',100,'globalRank',500,'countryRank',10,'accuracyPercent',90,'medals',3,'verifiedAt',now())) is not null,'osu relink works while public');
reset role;
set role anon;
select pg_temp.assert_true(jsonb_array_length(public.get_public_gaming_passport_projection('player-one')->'games')=1,'relinked identity stays hidden without renewed selection');
reset role;
set role roblox_passport_writer;
select pg_temp.assert_true(private.roblox_link_transition('unlink','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333',null,null,null,'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb') is not null,'Roblox unlink works while public');
reset role;
set role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',false);
select set_config('request.jwt.claims','{"session_id":"22222222-2222-4222-8222-222222222222"}',false);
select pg_temp.assert_true(public.manage_passport_publication('33333333-3333-4333-8333-333333333333','unpublish')->'passport'->>'publication_consent'='false','unpublish revokes consent');
set role anon;
select pg_temp.assert_true(public.get_public_gaming_passport_projection('player-one') is null,'unpublish hides entire profile');
reset role;
select pg_temp.assert_true(not exists(select 1 from private.passport_public_accounts where passport_id='33333333-3333-4333-8333-333333333333'),'unpublish clears selections');
set role authenticated;
select pg_temp.expect_error($q$select pg_temp.publish('another-slug')$q$,'23514','claimed slug remains stable');
select pg_temp.assert_true(pg_temp.publish('player-one')->'passport'->>'status'='published','explicit republication supported');
reset role;
update public.gaming_passports set status='suspended',suspended_at=now() where id='33333333-3333-4333-8333-333333333333';
set role anon;
select pg_temp.assert_true(public.get_public_gaming_passport_projection('player-one') is null,'suspended profile hidden');
reset role;
set role authenticated;
select pg_temp.expect_error($q$select pg_temp.publish('player-one')$q$,'42501','suspension cannot be bypassed');
reset role;
update auth.sessions set not_after=now()-interval '1 second' where id='22222222-2222-4222-8222-222222222222';
set role authenticated;
select pg_temp.expect_error($q$select public.manage_passport_publication('33333333-3333-4333-8333-333333333333')$q$,'42501','expired parent session rejected');
reset role;
