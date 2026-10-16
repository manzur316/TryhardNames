# Roblox, osu! and Steam Production Candidate

Prepared October 15, 2026 in `TryhardNames-release`. Production configuration
and the publication migration are prepared as recorded below. Deployment and
real hosted provider logins still need their separate verification.
Keep unrelated local Riot demos and temporary provider probes out of this release.

## Scope

- Roblox: explicit `ROBLOX_LINKING_ACCESS=public` removes the local tester gate
  for authenticated Passport owners. The owner reports the Roblox application
  is approved and public; verify its configuration in Creator Dashboard before rollout.
- osu!: retain the existing production OAuth implementation and owner read path.
  No tester allowlist is required by that implementation. Scopes: `identify public`.
- Steam: production OpenID callback, explicit save confirmation, private persisted
  identity, header logo, optional library count and up to six games with playtime.
  Missing/private data is not a zero score. Steam is a platform, not a competitive rank.
- Provider linking never publishes a Passport or its data. Steam public projection
  is deliberately not included. Roblox/osu! public display requires the separate
  publication workflow and per-account selection.

## Production Configuration

Target only Vercel project `tryhard-names-web`, Production, canonical origin
`https://www.tryhardnames.com`. Keep Preview and Development unchanged.
Never put these server variables into a `VITE_` variable or a tracked file.

| Provider | Enable / access | Existing or required private configuration |
| --- | --- | --- |
| Roblox | `ROBLOX_LINKING_ENABLED=true`, `ROBLOX_LINKING_ACCESS=public` | Retain `ROBLOX_CLIENT_ID`, `ROBLOX_CLIENT_SECRET`, `ROBLOX_COOKIE_KEY`, `ROBLOX_APP_ORIGIN`, `ROBLOX_PASSPORT_API_URL`, `ROBLOX_PASSPORT_PUBLIC_KEY`, `ROBLOX_PASSPORT_DATABASE_URL` |
| osu! | `OSU_LINKING_ENABLED=true` | Retain `OSU_CLIENT_ID`, `OSU_CLIENT_SECRET`, `OSU_COOKIE_KEY`, `OSU_APP_ORIGIN`, `OSU_PASSPORT_API_URL`, `OSU_PASSPORT_PUBLIC_KEY`, `OSU_PASSPORT_DATABASE_URL` |
| Steam | Initially `STEAM_LINKING_ENABLED=false`; then `true` with `STEAM_LINKING_ACCESS=public` after checks | `STEAM_WEB_API_KEY`, a new independent 64-hex-character `STEAM_COOKIE_KEY`, `STEAM_APP_ORIGIN`, `STEAM_PASSPORT_API_URL`, `STEAM_PASSPORT_PUBLIC_KEY`, `STEAM_PASSPORT_DATABASE_URL` |

All three APP_ORIGIN values must equal the canonical origin. API_URL values must
refer to the same intended Supabase project as Parent Auth, currently
`https://bjfryclqznpkptfhsaak.supabase.co`. PUBLIC_KEY must be publishable/anon,
never service-role. Database users must remain provider-restricted:
`roblox_passport_writer`, `osu_linking_writer`, `steam_passport_writer`.
Use a new Steam production cookie key, not a test fixture or another provider's key.
Disable/omit LOCAL_TEST in hosting. Roblox/Steam default to `testers` unless
public access is explicitly selected; retain tester IDs for rollback if desired.

Registered callbacks:

- Roblox: `https://www.tryhardnames.com/api/v1/integrations/roblox/callback`
- osu!: `https://www.tryhardnames.com/api/v1/integrations/osu/callback`
- Steam OpenID return_to is generated with state at
  `https://www.tryhardnames.com/api/v1/integrations/steam/callback`.
  Steam realm: `https://www.tryhardnames.com/`.

The owner subsequently authorized Steam activation and secret transfer exclusively
to this Production project. Steam credentials, a new independent cookie key, the
restricted writer connection, canonical origin and `STEAM_LINKING_ACCESS=public`
are configured. `STEAM_LINKING_ENABLED=true` applies to the next deployment.
The restricted TLS connection and runtime configuration passed preflight.
Other provider credentials and Preview/Development configuration were not changed.
After rollout, the owner confirmed hosted Steam sign-in, explicit save and that
the account remains linked after reloading. This verifies that owner's account;
additional account/privacy variants remain useful regression checks.

## Database Gates

Do not run a blanket migration push or reset against the shared production database.
Compare deployed function definitions and migration history first. Historical Steam
files were previously applied under different remote timestamps:

- `20261015192140_steam_private_linking.sql`: remote `20261015194953`.
- `20261015195918_steam_link_attempts_owner_index.sql`: remote `20261015200037`.

Migration `20261015203753_steam_linking_passport_states.sql`
allows active private, published and unpublished Passports while rejecting
suspension. It does not publish Steam data. Applied transactionally to the shared
production project and recorded with the same version, after checking the old
guard and passing 50 isolated PostgreSQL assertions. The restricted writer was
then used to verify the deployed guard and connection without modifying accounts.
`20261015173323_passport_publication_launch.sql` was applied transactionally to
`bjfryclqznpkptfhsaak` and recorded in migration history. The two Passports remain
private, all three linked accounts remain, and no public selections were added.
Verified anonymous access is denied to the underlying tables and publication RPC;
only the sanitized projection RPC is readable, and a missing profile returns null.

## Verification And Rollout

Released application commit `21acdaec8bf585e9737deda6fa026d4e62b1f64f` as deployment
`dpl_GnQNsLzWkHEaRNVf6Qtq6YGTQwRF`, staged with Production configuration and then
promoted to `https://www.tryhardnames.com`. The staged Steam API returned enabled,
401 for anonymous status/connect, and 403 for a foreign origin. Canonical-domain
checks confirmed all three providers enabled with anonymous access denied.
The live public profile, artwork, canonical URL, missing-profile privacy behavior
and Riot verification file passed checks at desktop/mobile widths without JS errors.
Rollback target: `dpl_5nKxe5DMkxToYc3ScFGSmTMkrB7W` (Steam disabled).

1. Run `npm run test:api`, `npm run test:providers:release`, `npm run test:passport`,
   `npm run test:auth`, `npm run build` and the isolated provider database runners.
2. Inspect `npm audit --omit=dev`. Existing unrelated advisories remain; resolve or
   explicitly assess them before calling this an unrestricted production launch.
3. Confirm Vercel's Node function tracing includes `steam/openidWorker.js`, `openid`
   and `axios`. Worker verification is isolated from the shared API HTTP client,
   bounded to 25 seconds, and receives no application secrets.
4. Set aside sufficient function duration for callback verification, two bounded
   Steam API reads and database transitions. Verify the deployed runtime setting.
5. Configure only approved Production variables and reviewed additive SQL changes.
   Build/deploy the reviewed release checkout, not the development checkout.
6. On the canonical domain, test each provider with an owner outside the old tester
   list: authorization, explicit confirmation, reload, header badge and unlink.
   Exercise denial/cancel, expired attempt, session switch, logged-out access,
   published Passport and private Steam library. Never automate user consent.
7. Check availability endpoints and sanitized runtime logs. Availability confirms
   configuration only, not provider credentials or database connectivity.

Rollback: disable the affected LINKING_ENABLED variable and redeploy, or restore
the last known-good deployment. Keep additive SQL and user records. Do not reset
the shared database, erase accounts, or silently change publication selections.

## Candidate Evidence

- Public profile refresh: the published preview and `/id/:slug` now share the
  sanitized public projection and presentation, including game artwork and badges.
  Preview displays saved public selections, not private linked accounts or unsaved
  changes. Steam is still absent from public projection by design.
- Current checks: 56 provider tests, 118 Passport tests, 89 Auth tests, 199 web
  tests, build/prerender checks and changed frontend ESLint all pass. Browser
  fixtures verify identical public/preview content, artwork loading, hidden stats
  and no overflow at 1440, 390 and 320 pixels.
- Vercel API duration is explicitly 90 seconds; worker and CA files are explicitly
  included for Steam verification. Stage production and verify before promotion.

- API: 103 tests passing, including provider client normalization, owner/session
  binding, callback replay, CSRF, public access and isolated OpenID verification.
- Passport: 134 tests passing. Parent Auth: 89 tests passing.
- Default web suite: 199 tests passing. Production build and Vercel dependency
  tracing passed; generated browser bundles contain none of the checked server
  secret variable names or local Steam/Riot probe endpoints.
- Isolated PostgreSQL: Roblox 32, osu! 34, Steam 50 and publication 40 assertions
  passing. No remote database accessed for these tests.
- Browser fixtures: Steam at 1440, 390 and 320 pixels; logo loaded, no horizontal
  overflow, explicit save, unlink/cancel and empty/private library states passed.
  These are mocked integration responses, not a real hosted provider login.
- Publication browser fixtures passed at 1440, 390 and 320 pixels: explicit
  consent, per-account/stat choices, public cards and badges, and unpublishing.
  Dialog bounds are checked after animations settle. No real profile was published.
- Frontend ESLint passes on touched files. The existing API lint setup cannot
  run as configured: `@eslint/js` 10 recommends rules missing from the inherited
  ESLint 8 executable. The changed API files were separately checked using
  temporary ESLint 10.0.1. Align the persistent toolchain before treating CI lint
  as passing.
- Dependency fixes: Express 4.22.3, body-parser 1.20.8, qs 6.16.1 and Morgan 1.12.1.
  Repository-wide `npm audit --omit=dev` still reports 22 inherited advisories
  (19 high, 3 moderate, no critical), including image processing, routing and
  tooling. No forced major upgrades were performed.

## Official References

- Roblox: https://create.roblox.com/docs/cloud/auth/oauth2-registration
- Steam OpenID: https://partner.steamgames.com/doc/features/auth#website
- osu! authentication: https://osu.ppy.sh/docs/index.html#authentication
