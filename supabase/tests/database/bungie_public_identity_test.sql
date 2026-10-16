-- Run after passport_publication_test.sql in the isolated publication suite.
reset role;
insert into auth.users values ('dddddddd-dddd-4ddd-8ddd-dddddddddddd');
insert into auth.sessions values ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','dddddddd-dddd-4ddd-8ddd-dddddddddddd',null);
insert into public.gaming_passports(id,owner_id,alias) values
('ffffffff-ffff-4fff-8fff-ffffffffffff','dddddddd-dddd-4ddd-8ddd-dddddddddddd','Bungie only');
insert into public.linked_provider_accounts(id,passport_id,owner_id,provider,external_account_id,display_name,status,verified_at,last_synced_at,metadata_safe) values
('12345678-1234-4234-8234-123456789012','ffffffff-ffff-4fff-8fff-ffffffffffff','dddddddd-dddd-4ddd-8ddd-dddddddddddd',
 'bungie','1234567890','Bungie Player','verified',now()-interval '3 days',now()-interval '3 days',
 '{"normalizerVersion":"bungie.identity.v1","linkEpoch":"bungie-one","snapshot":{"bungieName":"Bungie Player#1234","accountId":"1234567890","avatarUrl":"https://www.bungie.net/img/SECRET.png","destinyMemberships":[{"membershipId":"9876543210"}],"secret":"SECRET"}}');
select pg_temp.assert_true(not exists(select 1 from private.passport_public_accounts where passport_id='ffffffff-ffff-4fff-8fff-ffffffffffff'),'Bungie migration does not auto-select');
select pg_temp.assert_true(not has_table_privilege('anon','public.linked_provider_accounts','SELECT'),'Bungie source accounts inaccessible anonymously');
set role authenticated;
select set_config('request.jwt.claim.sub','dddddddd-dddd-4ddd-8ddd-dddddddddddd',false);
select set_config('request.jwt.claims','{"session_id":"eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee"}',false);
select pg_temp.assert_true(public.manage_passport_publication('ffffffff-ffff-4fff-8fff-ffffffffffff')->'accounts'->0->>'provider'='bungie','Bungie is an eligible choice');
select pg_temp.assert_true(public.manage_passport_publication('ffffffff-ffff-4fff-8fff-ffffffffffff')->'accounts'->0->>'username'='Bungie Player#1234','choice displays full Bungie name');
select pg_temp.assert_true(public.manage_passport_publication('ffffffff-ffff-4fff-8fff-ffffffffffff')->'accounts'->0->>'selected'='false','new Bungie choice is unchecked');
select pg_temp.expect_error($q$select pg_temp.publish('bungie-only','[]',false)$q$,'23514','Bungie requires explicit consent');
select pg_temp.assert_true(pg_temp.publish('bungie-only')->'passport'->>'status'='published','Bungie-only owner can publish');
set role anon;
select pg_temp.assert_true(jsonb_array_length(public.get_public_gaming_passport_projection('bungie-only')->'games')=0,'Bungie remains hidden when not selected');
reset role;
set role authenticated;
select pg_temp.assert_true(pg_temp.publish('bungie-only','[{"accountId":"12345678-1234-4234-8234-123456789012","showStats":true}]') is not null,'explicit Bungie selection accepted');
select pg_temp.assert_true(public.manage_passport_publication('ffffffff-ffff-4fff-8fff-ffffffffffff')->'accounts'->0->>'showStats'='false','Bungie stats request ignored');
set role anon;
select pg_temp.assert_true(jsonb_array_length(public.get_public_gaming_passport_projection('bungie-only')->'games')=1,'selected Bungie is public');
select pg_temp.assert_true(public.get_public_gaming_passport_projection('bungie-only')->'games'->0->>'username'='Bungie Player#1234','public Bungie name preserved');
select pg_temp.assert_true(public.get_public_gaming_passport_projection('bungie-only')->'games'->0->'stats'='null'::jsonb,'Bungie has no public stats');
select pg_temp.assert_true(public.get_public_gaming_passport_projection('bungie-only')->'games'->0->>'stale'='false','OAuth identity does not expire as daily stats');
select pg_temp.assert_true(public.get_public_gaming_passport_projection('bungie-only')::text !~ 'SECRET|destinyMemberships|membershipId|accountId|1234567890|9876543210|linkEpoch|metadata_safe','public identity excludes all private Bungie metadata');
select pg_temp.assert_true((public.get_public_gaming_passport_projection('bungie-only')->'games'->0) - array['provider','username','displayName','verifiedAt','updatedAt','stale','stats']='{}'::jsonb,'Bungie projection has only reviewed fields');
reset role;
update public.linked_provider_accounts set metadata_safe=jsonb_set(metadata_safe,'{normalizerVersion}','"unexpected"') where provider='bungie';
set role anon;
select pg_temp.assert_true(jsonb_array_length(public.get_public_gaming_passport_projection('bungie-only')->'games')=0,'unsupported Bungie normalizer fails closed');
reset role;
update public.linked_provider_accounts set metadata_safe=jsonb_set(metadata_safe,'{normalizerVersion}','"bungie.identity.v1"') where provider='bungie';
set role bungie_passport_writer;
select pg_temp.assert_true(private.bungie_link_transition('unlink','dddddddd-dddd-4ddd-8ddd-dddddddddddd','eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','ffffffff-ffff-4fff-8fff-ffffffffffff',null,null,null,'12345678-1234-4234-8234-123456789012') is not null,'Bungie writer can unlink a selected account');
reset role;
set role anon;
select pg_temp.assert_true(jsonb_array_length(public.get_public_gaming_passport_projection('bungie-only')->'games')=0,'unlink immediately removes public Bungie');
reset role;
-- Model the new epoch produced by a fresh OAuth link after revocation.
update public.linked_provider_accounts set status='verified', revoked_at=null, verified_at=now(), last_synced_at=now(),
 metadata_safe='{"normalizerVersion":"bungie.identity.v1","linkEpoch":"bungie-two","snapshot":{"bungieName":"Relinked#1234"}}' where provider='bungie';
set role anon;
select pg_temp.assert_true(jsonb_array_length(public.get_public_gaming_passport_projection('bungie-only')->'games')=0,'relinked Bungie cannot inherit old consent');
reset role;
set role authenticated;
select pg_temp.assert_true(public.manage_passport_publication('ffffffff-ffff-4fff-8fff-ffffffffffff')->'accounts'->0->>'selected'='false','relinked choice unchecked');
select pg_temp.assert_true(pg_temp.publish('bungie-only','[{"accountId":"12345678-1234-4234-8234-123456789012","showStats":false}]') is not null,'relinked Bungie needs explicit reselection');
select pg_temp.assert_true(public.manage_passport_publication('ffffffff-ffff-4fff-8fff-ffffffffffff','unpublish')->'passport'->>'publication_consent'='false','Bungie profile can become private');
set role anon;
select pg_temp.assert_true(public.get_public_gaming_passport_projection('bungie-only') is null,'unpublish hides Bungie profile');
reset role;
select pg_temp.assert_true(not exists(select 1 from private.passport_public_accounts where passport_id='ffffffff-ffff-4fff-8fff-ffffffffffff'),'unpublish clears Bungie selection');
