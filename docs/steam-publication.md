# Steam Public Passport

Steam linking is already live. This phase adds opt-in public presentation through
the same consent workflow and projection used by Preview and `/id/:slug`.

- New and relinked accounts remain unselected. Deployment does not publish accounts.
- Selecting Steam publishes only display name and verification timestamps.
- A separate unchecked activity option shares game count, up to six games, total
  and recent playtime, achievement counts and up to three unlocked names/icons.
- Steam ID, source metadata, account avatar, creation date and OpenID assertions
  are excluded. Nested activity uses an explicit database allowlist and strict
  client parser, not a raw provider snapshot.
- Existing daily refresh updates selected activity without changing consent.
  Anonymous visits do not call Steam. Private/unavailable data is not zero progress.
- Revocation removes Steam immediately; relinking requires fresh selection.
- Cards use original Steam branding and game covers; header uses the supplied badge.

Migration: `20261016071741_steam_public_activity.sql`. It preserves existing
function owners/grants and validates expected definitions before modifying them.
No new environment variables, provider secrets or scheduler changes are required.

Verification: isolated PostgreSQL publication suite, frontend mapper/consent tests,
shared Preview/public browser fixtures at 1440/390/320, build and protected candidate
smoke. Production rollout must preserve existing selections and public projections.

Owner acceptance after rollout: open Gaming Passport > Public profile, select Steam,
optionally enable games/playtime/achievements, accept consent and update. Confirm
Preview and the anonymous public URL. Never perform this consent step for the owner.

## Production Rollout (2026-10-16)

- Application commit: `a212888`; deployment: `dpl_ACuPzUu1SZBBjU7HyJzbWe6zhbNr`.
- Published to `https://www.tryhardnames.com` after protected candidate smoke.
- Migration applied transactionally on the authorized shared project. Hash checks
  confirmed all existing public projections and account selections were unchanged.
- 94 isolated database assertions, 123 Passport tests, 199 default web tests,
  106 API tests and three prerender checks passed. 109 public pages prerendered.
- Local Preview/public parity and production compiled browser fixtures passed at
  1440/390/320, including identity-only, activity, unavailable data and real artwork.
  Fixture responses were substituted only in the browser, never saved remotely.
- Anonymous checks confirm the real owner's Bungie/osu/Roblox profile is intact,
  Steam remains unselected, all four provider endpoints require authentication,
  and Riot verification remains intact. Actual owner Steam publication is pending.
- Daily schedules unchanged: Steam 08:00 UTC, osu! 08:30 UTC.
- Existing warnings remain: one React cleanup lint warning, 27 dependency audit
  findings (22 high), disabled leaked-password protection, Node `url.parse()`
  deprecation messages. No new database security findings or application errors
  were observed during this rollout; these existing issues are not resolved here.
