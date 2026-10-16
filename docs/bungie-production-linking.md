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
- New links stay private, even for a published Passport. Owners can separately
  select Bungie for public display with explicit publication consent. Only its
  display name, Bungie Name and verification dates are projected; no IDs, avatar,
  Destiny memberships or gameplay stats. Unlink/relink invalidates the selection.
- Bungie is not part of the Steam/osu daily scheduler. Identity verification is
  dated rather than presented as live gameplay data or automatically stale at 24h.
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
For rollback, prefer a frontend build that understands the Bungie public provider.
Before restoring a pre-public-identity build, restore the prior publication/read
function bodies through a reviewed migration so older clients do not receive an
unsupported provider. Preserve stored selections and account records; do not drop
identity data. Reverting only the frontend after Bungie has been selected can make
older clients reject the entire public projection.

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
- The user confirmed real production OAuth, explicit confirmation and reload
  persistence after rollout. Public identity selection is a separate acceptance.

## Public identity extension

Migration `20261016063932_bungie_public_identity.sql` extends the existing
publication functions, preserving their owners, ACLs, owner/session checks,
explicit consent, optimistic concurrency and link-epoch matching. It does not
insert selections or publish any user's account. The existing projection schema
stays at version 2 with Bungie added to its provider allowlist.

The publication dialog, saved public preview and `/id/` use the same provider
name and presentation. Header emblems link to the corresponding public card.
Individual cards retain the official logo with a named fallback and use an
existing supplied space background. Only osu can expose consented statistics.

Regression command: `node apps/api/scripts/testOsuLinkingDatabase.js --publication`.
This uses isolated PostgreSQL and checks existing osu/Roblox publication plus
Bungie-only eligibility, default-hidden selection, explicit consent, field
allowlisting, unlink, relink, unpublish and normalizer rejection.

### Public identity rollout 2026-10-16

- Application commit `fb7986a`; deployment `dpl_AUSwr9k9qR5opuT5TCAao4XJJSMg`.
- Tested in staged Production and promoted to `https://www.tryhardnames.com`.
- Migration applied with history in a repeatable-read transaction. Assertions
  confirmed existing publication selections and public projections were unchanged.
- Passed: 65 isolated database assertions, 119 Passport tests, 199 web tests,
  106 API tests, 109 prerendered pages and three build checks.
- Browser fixtures verified public/preview parity at 1440/390/320, full-length
  Bungie names, working emblem anchors, background loading, default-unchecked
  selection and explicit consent. Fixed an existing desktop preview overflow.
- Canonical smoke confirmed the existing public profile stayed unchanged, no
  automatic Bungie publication, four providers enabled, protected mutations and
  unchanged Steam/osu cron definitions. Security advisors added no new warning.
- Log scan: one Node DEP0169 deprecation warning, no application failures.
  ESLint: zero errors and one pre-existing generation-ref cleanup warning.
- User confirmed selecting Bungie through the production consent dialog and
  seeing it in both Preview and `/id/thetryhardnames`. A subsequent anonymous
  browser check confirmed the real Bungie card, emblem and anchor at 1440/390/320;
  the response contains only the seven reviewed fields, no IDs or memberships,
  and null stats. Steam remains unselected and absent from the public profile.
  Fixture consent tests did not publish any real account.
