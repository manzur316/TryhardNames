# Public Gaming Passport MVP

PR15 implements the first public Gaming Passport profile route:

`/id/:slug`

## Why This Exists

PR14 added owner-controlled Publish Runtime Commands for consent, slug claim, publish attempt, and unpublish. PR15 adds the minimal public serving surface that can read a policy-valid published Passport and render only public allowlisted projection data.

## Data Contract

The public route uses `get_public_gaming_passport_projection(public_slug text)` and `publicPassportRepository.js`.

Allowed public Passport fields:

- `slug`
- `alias`
- `avatarUrl`
- `publishedAt`
- `updatedAt`
- `scene`
- `linkedProviders`
- `featuredProofs`

Allowed linked provider fields:

- `provider`
- `displayName`
- `verifiedAt`
- `lastSyncedAt`

Allowed proof fields:

- `provider`
- `game`
- `proofType`
- `mode`
- `title`
- `displayValue`
- `season`
- `status`
- `verifiedAt`
- `lastSyncedAt`
- `staleAt`

## Public Serving Rules

The RPC returns `null` for:

- nonexistent slugs;
- invalid or reserved slugs;
- private drafts;
- unpublished Passports;
- suspended Passports;
- Passports without publication consent;
- Passports without a verified linked provider.

The page renders safe unavailable behavior and does not disclose whether a private slug exists.

## Privacy Boundaries

The public projection does not expose:

- owner id;
- owner email;
- internal Passport id;
- internal provider ids;
- provider external account ids;
- raw metadata;
- private metadata;
- tokens;
- private Saved Names highlights;
- edit controls.

## Product Boundaries

TryhardNames remains identity tooling. The public profile is not:

- an OP.GG clone;
- a tracker;
- a match-history dump;
- a custom MMR/ELO product;
- a live-game advice tool;
- a hidden-player de-anonymization surface;
- a ranking alternative.

## Provider Status

Provider runtime remains pending. PR15 does not implement:

- Riot OAuth;
- Riot API calls;
- Discord OAuth;
- provider token storage;
- linked provider runtime;
- VerifiedProof sync runtime;
- real Riot data.

Riot runtime remains gated by Riot approval.

## Next

PR16 should build Provider Runtime Foundation: token storage, link/unlink/revoke, callback state, sync scaffolding, audit boundaries, privacy controls, and rate-limit contracts before any provider goes live.
