
reset role;
reset session authorization;
insert into auth.users values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
insert into public.gaming_passports(id,owner_id) values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
insert into public.linked_provider_accounts(id,passport_id,owner_id,provider,external_account_id,status,verified_at,last_synced_at,metadata_safe)
values ('cccccccc-cccc-4ccc-8ccc-cccccccccccc','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'steam','76561198011111111','verified',now()-interval '3 days',now()-interval '2 days',jsonb_build_object('snapshot',
  jsonb_build_object('steamId','76561198011111111','displayName','Daily Tester','avatarUrl',null,'createdAt',null,
    'verifiedAt',now()-interval '3 days','dataError',null,'library',jsonb_build_object('status','unavailable','gameCount',null,'games','[]'::jsonb))));
create temporary table daily_fixture as select id, verified_at, metadata_safe from public.linked_provider_accounts where id='cccccccc-cccc-4ccc-8ccc-cccccccccccc';
grant select on daily_fixture to steam_passport_writer, osu_linking_writer;
select pg_temp.assert_true(not has_function_privilege('anon','private.claim_passport_refresh(text)','EXECUTE'),'anonymous cannot claim daily work');
select pg_temp.assert_true(not has_function_privilege('authenticated','private.finish_passport_refresh(text,uuid,uuid,jsonb)','EXECUTE'),'browser cannot finish daily work');
select pg_temp.assert_true(not has_table_privilege('steam_passport_writer','public.linked_provider_accounts','UPDATE'),'Steam writer still has no direct writes');
select pg_temp.assert_true(not has_column_privilege('passport_refresh_executor','public.linked_provider_accounts','visibility','UPDATE'),'refresh cannot publish accounts');
select pg_temp.assert_true(not has_column_privilege('passport_refresh_executor','public.linked_provider_accounts','verified_at','UPDATE'),'refresh cannot renew ownership');
set session authorization steam_passport_writer;
select pg_temp.expect_error('select private.claim_passport_refresh(''osu'')','42501','provider writer cannot claim another provider');
select private.claim_passport_refresh('steam') as daily_claim \gset
select pg_temp.assert_true(:'daily_claim'::jsonb->>'externalId'='76561198011111111','due account claimed');
select pg_temp.assert_true(private.claim_passport_refresh('steam') is null,'second invocation makes no duplicate claim');
select pg_temp.assert_true(not private.finish_passport_refresh('steam',(:'daily_claim'::jsonb->>'id')::uuid,gen_random_uuid(),null),'wrong claim cannot finish');
select pg_temp.assert_true(not private.finish_passport_refresh('steam',(:'daily_claim'::jsonb->>'id')::uuid,null,null),'null claim cannot finish');
select pg_temp.assert_true(private.finish_passport_refresh('steam',(:'daily_claim'::jsonb->>'id')::uuid,(:'daily_claim'::jsonb->>'claimId')::uuid,
  (select jsonb_build_object('snapshot',metadata_safe->'snapshot','achievements','[]'::jsonb) from daily_fixture)),'daily refresh succeeds');
select pg_temp.assert_true(not private.finish_passport_refresh('steam',(:'daily_claim'::jsonb->>'id')::uuid,(:'daily_claim'::jsonb->>'claimId')::uuid,null),'completion replay rejected');
reset session authorization;
select pg_temp.assert_true((select a.verified_at=f.verified_at and a.visibility='private' and a.last_synced_at>f.verified_at
 from public.linked_provider_accounts a join daily_fixture f using(id)),'verification and privacy unchanged');
update public.linked_provider_accounts set last_synced_at=now()-interval '2 days' where id='cccccccc-cccc-4ccc-8ccc-cccccccccccc';
update private.passport_refresh_schedule set next_attempt_at=now()-interval '1 second' where account_id='cccccccc-cccc-4ccc-8ccc-cccccccccccc';
set session authorization steam_passport_writer;
select private.claim_passport_refresh('steam') as next_claim \gset
reset session authorization;
update public.linked_provider_accounts set status='revoked',revoked_at=now(),metadata_safe='{}' where id='cccccccc-cccc-4ccc-8ccc-cccccccccccc';
set session authorization steam_passport_writer;
select pg_temp.assert_true(not private.finish_passport_refresh('steam',(:'next_claim'::jsonb->>'id')::uuid,(:'next_claim'::jsonb->>'claimId')::uuid,
  (select jsonb_build_object('snapshot',metadata_safe->'snapshot','achievements','[]'::jsonb) from daily_fixture)),'unlink racing refresh cannot restore data');
reset session authorization;
select pg_temp.assert_true((select metadata_safe='{}'::jsonb from public.linked_provider_accounts where id='cccccccc-cccc-4ccc-8ccc-cccccccccccc'),'revoked profile stays empty');
insert into public.linked_provider_accounts(id,passport_id,owner_id,provider,external_account_id,status,verified_at,last_synced_at,metadata_safe)
values ('dddddddd-dddd-4ddd-8ddd-dddddddddddd','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
 'osu','123','verified',now()-interval '3 days',now()-interval '2 days',jsonb_build_object('linkEpoch','epoch','normalizerVersion','osu.private.v1','snapshot',
 jsonb_build_object('username','Old name','mode','osu','pp',1,'globalRank',100,'countryRank',5,'accuracyPercent',50,'medals',0,'verifiedAt',now()-interval '3 days')));
insert into public.verified_proofs(passport_id,owner_id,linked_provider_account_id,provider,game,proof_type,source_key,mode,title,display_value,normalized_value,source,verification_method,visibility,normalizer_version,verified_at,last_synced_at)
values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','dddddddd-dddd-4ddd-8ddd-dddddddddddd',
 'osu','osu','competitive_rating','osu:pp:osu:epoch','osu','Performance points','1 PP','1','game_adapter','oauth','private','osu.private.v1',now()-interval '3 days',now()-interval '2 days');
create temporary table osu_daily_fixture as select id,verified_at,metadata_safe from public.linked_provider_accounts where id='dddddddd-dddd-4ddd-8ddd-dddddddddddd';
grant select on osu_daily_fixture to osu_linking_writer;
set session authorization osu_linking_writer;
select pg_temp.expect_error('select private.claim_passport_refresh(''steam'')','42501','osu writer cannot refresh Steam');
select private.claim_passport_refresh('osu') as osu_claim \gset
select pg_temp.assert_true(private.finish_passport_refresh('osu',(:'osu_claim'::jsonb->>'id')::uuid,(:'osu_claim'::jsonb->>'claimId')::uuid,
 (select jsonb_build_object('snapshot',(metadata_safe->'snapshot') || '{"externalAccountId":"123","username":"New name","pp":12}'::jsonb) from osu_daily_fixture)),'osu daily refresh succeeds');
reset session authorization;
select pg_temp.assert_true((select metadata_safe->>'linkEpoch'='epoch' and metadata_safe->'snapshot'->>'pp'='12' and visibility='private'
 from public.linked_provider_accounts where id='dddddddd-dddd-4ddd-8ddd-dddddddddddd'),'osu retains publication epoch and visibility');
select pg_temp.assert_true((select normalized_value='12'::jsonb and visibility='private' and verified_at<last_synced_at
 from public.verified_proofs where source_key='osu:pp:osu:epoch'),'osu proof updates without renewing verified ownership');
