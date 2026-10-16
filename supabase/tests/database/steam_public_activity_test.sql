reset role;
insert into auth.users values ('11111111-dddd-4ddd-8ddd-dddddddddddd');
insert into auth.sessions values ('11111111-eeee-4eee-8eee-eeeeeeeeeeee','11111111-dddd-4ddd-8ddd-dddddddddddd',null);
insert into public.gaming_passports(id,owner_id,alias) values ('11111111-ffff-4fff-8fff-ffffffffffff','11111111-dddd-4ddd-8ddd-dddddddddddd','Steam only');
insert into public.linked_provider_accounts(id,passport_id,owner_id,provider,external_account_id,display_name,status,verified_at,last_synced_at,metadata_safe) values
('11111111-1234-4234-8234-123456789012','11111111-ffff-4fff-8fff-ffffffffffff','11111111-dddd-4ddd-8ddd-dddddddddddd',
 'steam','76561198000000001','Steam Player','verified',now()-interval '3 days',now()-interval '3 days',
 '{"normalizerVersion":"steam.identity.v1","linkEpoch":"steam-one","snapshot":{"steamId":"76561198000000001","displayName":"Steam Player","avatarUrl":"SECRET","library":{"status":"available","gameCount":2,"games":[{"appId":480,"name":"Spacewar","playtimeMinutes":120,"recentMinutes":0,"iconUrl":null,"SECRET":"secret"}]}},"achievements":[{"appId":480,"status":"available","unlocked":3,"total":49,"recent":[{"name":"Winner","iconUrl":"https://evil.test/tracker.png","SECRET":"secret"}],"SECRET":"secret"}]}');
select pg_temp.assert_true(not has_function_privilege('anon','private.public_steam_activity(jsonb,jsonb)','EXECUTE'),'anonymous cannot invoke Steam helper');
select pg_temp.assert_true(not has_function_privilege('authenticated','private.public_steam_activity(jsonb,jsonb)','EXECUTE'),'authenticated cannot invoke Steam helper');
select pg_temp.assert_true(jsonb_array_length(private.public_steam_activity(
 jsonb_build_object('library',jsonb_build_object('status','available','gameCount',7,'games',
 (select jsonb_agg(jsonb_build_object('appId',n,'name','Game')) from generate_series(1,7) n))), '[]')->'library'->'games')=6,'public Steam library bounded to six games');
select pg_temp.assert_true(private.public_steam_activity('{"library":{"status":"available","games":[{"appId":480,"name":"Game"}]}}',
 '[{"appId":480,"status":"available","unlocked":50,"total":49,"recent":[]}]')#>>'{achievements,0,status}'='unavailable','invalid achievement counts fail closed');
select pg_temp.assert_true(private.public_steam_activity('{"library":{"status":"available","games":[{"appId":480,"name":"Game"}]}}',
 '[{"appId":480,"status":"available","unlocked":1,"total":2,"recent":[{"name":"Winner","iconUrl":"https://shared.fastly.steamstatic.com/steamcommunity/public/images/apps/480/abcdef.jpg"}]}]')#>>'{achievements,0,recent,0,iconUrl}'='https://shared.fastly.steamstatic.com/steamcommunity/public/images/apps/480/abcdef.jpg','approved Steam icon survives projection');
select pg_temp.assert_true(private.public_steam_activity('{"library":{"status":"available","games":null}}','[]')->'library'->>'status'='unavailable','malformed library fails closed');
set role authenticated;
select set_config('request.jwt.claim.sub','11111111-dddd-4ddd-8ddd-dddddddddddd',false);
select set_config('request.jwt.claims','{"session_id":"11111111-eeee-4eee-8eee-eeeeeeeeeeee"}',false);
select pg_temp.assert_true(public.manage_passport_publication('11111111-ffff-4fff-8fff-ffffffffffff')->'accounts'->0->>'username'='Steam Player','Steam choice has display name');
select pg_temp.assert_true(public.manage_passport_publication('11111111-ffff-4fff-8fff-ffffffffffff')->'accounts'->0->>'selected'='false','Steam unchecked by default');
select pg_temp.expect_error($q$select pg_temp.publish('steam-only','[]',false)$q$,'23514','Steam needs consent');
select pg_temp.assert_true(pg_temp.publish('steam-only') is not null,'Steam-only owner eligible');
set role anon;
select pg_temp.assert_true(jsonb_array_length(public.get_public_gaming_passport_projection('steam-only')->'games')=0,'unselected Steam stays hidden');
set role authenticated;
select pg_temp.assert_true(pg_temp.publish('steam-only','[{"accountId":"11111111-1234-4234-8234-123456789012","showStats":false}]') is not null,'identity-only Steam accepted');
set role anon;
select pg_temp.assert_true(public.get_public_gaming_passport_projection('steam-only')->'games'->0->'stats'='null'::jsonb,'identity does not imply activity consent');
select pg_temp.assert_true(public.get_public_gaming_passport_projection('steam-only')->'games'->0->>'stale'='false','identity-only Steam is not stale after 24h');
set role authenticated;
select pg_temp.assert_true(pg_temp.publish('steam-only','[{"accountId":"11111111-1234-4234-8234-123456789012","showStats":true}]') is not null,'Steam activity requires explicit option');
set role anon;
select pg_temp.assert_true(public.get_public_gaming_passport_projection('steam-only')->'games'->0->>'stale'='true','old activity is visibly stale');
select pg_temp.assert_true(public.get_public_gaming_passport_projection('steam-only')#>>'{games,0,stats,library,games,0,playtimeMinutes}'='120','opted-in hours projected');
select pg_temp.assert_true(public.get_public_gaming_passport_projection('steam-only')#>>'{games,0,stats,achievements,0,unlocked}'='3','opted-in achievements projected');
select pg_temp.assert_true(public.get_public_gaming_passport_projection('steam-only')::text !~ 'SECRET|secret|steamId|76561198000000001|linkEpoch|evil.test|metadata_safe|external_account_id','private fields and untrusted icons excluded');
reset role;
update public.linked_provider_accounts set metadata_safe=jsonb_set(metadata_safe,'{snapshot,library,status}','"unavailable"') where provider='steam';
set role anon;
select pg_temp.assert_true(public.get_public_gaming_passport_projection('steam-only')#>'{games,0,stats}'='{"library":{"status":"unavailable","gameCount":null,"games":[]},"achievements":[]}'::jsonb,'private library clears previously stored games and achievements');
reset role;
update public.linked_provider_accounts set metadata_safe=jsonb_set(metadata_safe,'{snapshot,library,status}','"available"') - 'achievements' where provider='steam';
set role anon;
select pg_temp.assert_true(public.get_public_gaming_passport_projection('steam-only')#>>'{games,0,stats,achievements,0,status}'='pending','missing achievements are pending');
select pg_temp.assert_true(public.get_public_gaming_passport_projection('steam-only')#>'{games,0,stats,achievements,0,total}'='null'::jsonb,'missing achievements are not fake zero');
reset role;
update public.linked_provider_accounts set metadata_safe=jsonb_set(metadata_safe,'{normalizerVersion}','"invalid"') where provider='steam';
set role anon;
select pg_temp.assert_true(jsonb_array_length(public.get_public_gaming_passport_projection('steam-only')->'games')=0,'unknown Steam normalizer hidden');
reset role;
update public.linked_provider_accounts set metadata_safe=jsonb_set(metadata_safe,'{normalizerVersion}','"steam.identity.v1"') where provider='steam';
set role steam_passport_writer;
select pg_temp.assert_true(private.steam_link_transition('unlink','11111111-dddd-4ddd-8ddd-dddddddddddd','11111111-eeee-4eee-8eee-eeeeeeeeeeee','11111111-ffff-4fff-8fff-ffffffffffff',null,null,null,'11111111-1234-4234-8234-123456789012') is not null,'Steam writer unlinks public account');
reset role;
set role anon;
select pg_temp.assert_true(jsonb_array_length(public.get_public_gaming_passport_projection('steam-only')->'games')=0,'unlink immediately hides Steam');
reset role;
update public.linked_provider_accounts set status='verified',revoked_at=null,verified_at=now(),last_synced_at=now(),
 metadata_safe='{"normalizerVersion":"steam.identity.v1","linkEpoch":"steam-two","snapshot":{"displayName":"Relinked"}}' where provider='steam';
set role anon;
select pg_temp.assert_true(jsonb_array_length(public.get_public_gaming_passport_projection('steam-only')->'games')=0,'relink cannot inherit Steam consent');
set role authenticated;
select pg_temp.assert_true(pg_temp.publish('steam-only','[{"accountId":"11111111-1234-4234-8234-123456789012","showStats":false}]') is not null,'Steam can be reselected without activity');
select pg_temp.assert_true(public.manage_passport_publication('11111111-ffff-4fff-8fff-ffffffffffff','unpublish') is not null,'Steam profile can be made private');
set role anon;
select pg_temp.assert_true(public.get_public_gaming_passport_projection('steam-only') is null,'unpublish hides entire Steam profile');
reset role;
