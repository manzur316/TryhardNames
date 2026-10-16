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
