# Roblox Private Linking Release

## Scope

This release adds the unified Gaming Passport presentation, supplied avatar frames,
game emblems and backgrounds, and persistent Roblox identity linking for explicitly
allowlisted testers. It does not open Roblox to the general public or activate
the local osu!, Clash, Riot, or other provider experiments.

Roblox approval and public application status were confirmed by the owner on October 15, 2026.
The implementation retains tester mode by default; the prepared public beta requires
the explicit server setting ROBLOX_LINKING_ACCESS=public. This does not publish profile data.
The new database was explicitly selected for the initial launch. Preview retains its
previous environment; production and local development must be treated as separate.

## Required Server Configuration

- ROBLOX_LINKING_ENABLED: true only for the restricted test.
- ROBLOX_APP_ORIGIN: https://www.tryhardnames.com
- ROBLOX_CLIENT_ID and ROBLOX_CLIENT_SECRET: registered application credentials.
- ROBLOX_COOKIE_KEY: 32 random bytes encoded as 64 hex characters.
- ROBLOX_TESTER_IDS: comma-separated TryhardNames owner UUIDs, maximum 10.
- ROBLOX_PASSPORT_API_URL and ROBLOX_PASSPORT_PUBLIC_KEY: selected Supabase project.
- ROBLOX_PASSPORT_DATABASE_URL: TLS-verified pooler URL using ONLY roblox_passport_writer.
- Frontend: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_AUTH_GOOGLE_ENABLED.

Never put provider credentials or a database password in VITE_ variables, Git,
screenshots, command arguments, or logs. Secrets are entered through CLI stdin.
The database writer has only the private transition function privilege and no
direct account-table writes. The executor is NOLOGIN and remains separate.

## Redirects

Roblox application callback:
https://www.tryhardnames.com/api/v1/integrations/roblox/callback

Supabase Site URL:
https://www.tryhardnames.com

Supabase allowed redirect:
https://www.tryhardnames.com/auth/callback

Preserve local redirect entries. Enabling a hosted callback does not publish the
Roblox application.

## Data and Security Contract

Only openid/profile are requested, with S256 PKCE and single-use server-side state.
Parent Auth is validated against Supabase and the original active session before
the link is completed. The Roblox callback alone does not save a linked identity.
The user confirms the link after returning to the same signed-in Passport.

Stored profile fields are Roblox ID, username, display name, allowlisted avatar URL,
account creation date when supplied, and verification timestamp. No competitive
statistics or fabricated rank are inferred. Userinfo is authoritative; decoded ID
tokens and browser-supplied IDs are not accepted as proof.

Tokens are never persisted; the refresh authorization is revoked after userinfo.
Verification fails if revocation fails. The badge means ownership verified at the
recorded time, not continuous provider authorization.

Unlinking clears the profile snapshot, cancels pending attempts, and revokes its
proof. Revoked IDs/proof records remain for anti-reassignment and audit. Public
projection of Roblox is not implemented. Temporary attempts expire after ten
minutes; expired snapshots are deleted when subsequent linking starts.

## Database Deployment

Apply only reviewed migrations. Do not blindly push the repository's full history
to the initial-launch database: remote migration timestamps and historical local
migration files are not identical.

The launch database already has the core Passport, the private osu! persistence
schema used locally, the internal helper search-path repair, and the Roblox
private linking migration. The pending public-visibility experiment is excluded.

## Verification and Rollback

Run npm test, npm run test:api, npm run test:auth, npm run test:passport,
npm run lint, npm run build, and npm run test:roblox:db --prefix apps/api.

The database test uses its own ephemeral Docker PostgreSQL with no network/ports;
it never targets a hosted database. Hosted smoke tests must confirm the badge,
connect, callback, explicit confirmation, reload persistence, and unlink.

Deploy without assigning production domains first, inspect the built function and
assets, then promote the verified deployment. A production OAuth completion still
requires the tester's real browser consent on the canonical domain.

To stop new linking, set ROBLOX_LINKING_ENABLED=false and redeploy. To roll back the
site, restore the last known-good deployment. Keep additive database migrations;
do not delete user Passports or apply a destructive database reset.

## Roblox Review Packet

- Entry: https://www.tryhardnames.com/gaming-passport
- Privacy: https://www.tryhardnames.com/privacy-policy
- Terms: https://www.tryhardnames.com/terms-of-service
- Description: Link your Roblox identity to your private TryhardNames Gaming
  Passport through Roblox authorization. Display your username, avatar, account
  creation date when available, and the time ownership was verified.
- Category justification: Identity/profile linking using only openid and profile;
  no Robux, transactions, hidden player data, or competitive rank claims.
- Demo: record the signed-out start, sign-in, Roblox consent, return, explicit
  confirmation, saved emblem after reload, and unlink. Use the current Roblox
  registration instructions for video length and public accessibility.

Official registration guidance:
https://create.roblox.com/docs/cloud/auth/oauth2-registration

## Dependency Review

The release audit identified two critical inherited dependency advisories. The
lockfile updates proxy-addr to 2.0.8 and shell-quote to 1.12.0 without changing
their major versions. All four application test suites were rerun afterward.

This is not a clean dependency audit: npm audit --omit=dev still reports 25
advisories (19 high, 5 moderate, 1 low) on October 14, 2026. These include existing
image-processing, routing, and tooling dependency trees. Broader dependency
remediation requires its own compatibility review; this release does not claim
to resolve those pre-existing advisories.

