# Bungie production linking

Bungie uses a confidential OAuth authorization-code client with the exact callback
`https://www.tryhardnames.com/api/v1/integrations/bungie/callback`.
The provider configures permissions in its application portal; requests do not
send a dynamic scope. Changing the application's callback disables its old local
callback. The local probe files themselves are unchanged.

## Scope

- Authenticated Passport owners can start a browser/session-bound OAuth attempt.
- A one-use database claim precedes the code exchange. The authenticated
  membership ID must match the account returned by Bungie.
- The user explicitly confirms before saving. Unlinking clears the snapshot,
  revokes the proof and cancels outstanding attempts.
- Saved fields: Bungie ID, display name/Bungie Name, avatar, verification time
  and up to six Destiny membership identities/platforms. No gameplay stats.
- Access and refresh tokens are discarded, not persisted. Discarding is not
  remote revocation; users can manage application permission on Bungie.
- New links stay private, even for a published Passport. This release does not
  add Bungie to public projections or to the Steam/osu daily scheduler.
- Header uses the supplied decorative emblem. Individual cards use Bungie's
  official favicon with a named fallback if its remote image is unavailable.

## Configuration

Production-only variables:
`BUNGIE_LINKING_ENABLED=true`, `BUNGIE_LINKING_ACCESS=public`,
`BUNGIE_APP_ORIGIN=https://www.tryhardnames.com`, `BUNGIE_CLIENT_ID`,
`BUNGIE_CLIENT_SECRET`, `BUNGIE_API_KEY`, `BUNGIE_COOKIE_KEY`,
`BUNGIE_PASSPORT_API_URL`, `BUNGIE_PASSPORT_PUBLIC_KEY`,
`BUNGIE_PASSPORT_DATABASE_URL`.

Cookie key is a random 32-byte hex secret. Database connection uses the approved
Supabase project's transaction pooler with TLS verification and the
`bungie_passport_writer` role. This role has EXECUTE-only transition access,
no direct table writes and no RLS bypass. Secrets are never frontend variables.

Migration: `20261016041410_bungie_private_linking.sql`.
It adds provider constraints, private attempts, RLS, session checks and the
restricted transition function. It does not change existing account data.
Apply this reviewed migration only, not all historical migrations.

## Verification and rollback

- `npm run test:bungie`: OAuth/state/session/provider errors and safe snapshots.
- `npm run test:bungie:db`: isolated PostgreSQL, no remote database.
- `npm run test:api`, `npm test`, `npm run test:passport`, `npm run build`.
- Browser fixtures: 1440/390/320, light/dark, confirmation, unlink/cancel,
  memberships and no-Destiny state. Fixture identity is not a real OAuth test.
- Production acceptance requires the owner to authorize on bungie.net, confirm
  the link on TryhardNames, reload and verify persistence.

To stop new links, set `BUNGIE_LINKING_ENABLED=false` and redeploy.
For rollback, promote the previous production deployment. Leave the additive
migration and existing account records in place; do not drop identity data.

## Rollout 2026-10-16

- Application commit: `80d1baa383982dcf7cd2b1fa2f64da59c6dc6526` on `main`.
- Production: `dpl_3HPxobfTSMMtsonJFhaaoqgxY9Jd`, promoted after staged checks.
- Previous production: `dpl_GQ2x7QAhZ9kVW2kmipWMUAbdHHyQ`.
- Migration applied transactionally with history; restricted pooler connection
  verified. Provider credentials and writer connection are Production-only.
- Passed: Bungie 12 tests, isolated database 35 assertions, API 106 tests,
  web 199 tests, Passport 118 tests, parent auth 89 tests, provider release 68
  tests; build 109 public prerenders and three build checks.
- Candidate and canonical smoke: four providers enabled; anonymous status and
  connect denied; foreign-origin completion denied; unsolicited callback goes
  only to the fixed failure return URL. No OAuth code exchanged in smoke tests.
- Canonical public profile checked at 1440/390/320: artwork loaded, no overflow
  or JavaScript errors, canonical correct, private Bungie absent, missing
  profile unavailable, Riot verification file preserved.
- Steam and osu cron schedules remain 08:00 and 08:30 UTC respectively.
- Post-release log scan returned two Node DEP0169 `url.parse()` deprecation
  warnings, no application failures. Existing dependency audit warnings and
  disabled leaked-password protection remain unrelated follow-up work.
- Real production OAuth, explicit confirmation and reload persistence are
  pending user acceptance. Local prototype success is not production acceptance.
