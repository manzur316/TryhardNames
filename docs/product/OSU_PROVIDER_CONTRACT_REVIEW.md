# RM-26 osu! Provider Contract Review

This contract review is conceptual only. It defines the expected shape of a future osu! linked provider without creating runtime, OAuth, API calls, callback route, tokens, env vars or DB migrations.

## Provider Identity

| Field | Conceptual value |
| --- | --- |
| provider id conceptual | `osu` |
| display name | `osu!` |
| provider type | gaming proof provider |
| milestone | RM-26 osu! Readiness Pack |
| policy | readiness-before-runtime |

No `OsuProvider` runtime class/function is approved by RM-26.

## Account Identity Shape Conceptual

Conceptual private identity record:

- TryhardNames owner id;
- linked provider account id internal to TryhardNames;
- provider id `osu`;
- external account id from osu! response, stored privately if needed for refresh/reconciliation;
- external username/display name;
- profile URL;
- verification timestamp;
- token status, stored separately from public projection;
- proof status: `verified`, `stale`, or `revoked`;
- audit timestamps.

This is not a schema migration. It is a readiness contract for RM-27.

## External Account Id Policy

The external osu! account id is sensitive linkage metadata. It may be stored privately in a future provider table if required for refresh and deduplication, but it must not be exposed in `/id/:slug`.

Public proof should use username/display name and profile URL only if accepted by RM-27 public projection review.

## Username And Display Name Policy

The public username/display name may be shown as an allowlisted field when:

- the owner explicitly links osu!;
- the owner publishes a Gaming Passport;
- the linked account is verified and not revoked;
- stale state is handled according to product policy;
- moderation has not suspended the Passport.

TryhardNames must not claim username uniqueness across platforms. Copy should identify it as "Linked osu! account".

## Profile URL Policy

Profile URL may be shown as a public field if derived from an official osu! profile URL pattern or returned by official API data.

Requirements:

- display only normalized HTTPS osu! profile URL;
- never accept arbitrary user-provided URL as proof;
- never use profile URL as replacement for OAuth ownership;
- hide URL when proof is revoked or unpublished.

## Verification Timestamp

`verifiedAt` is required for public proof. It represents when TryhardNames observed ownership through official OAuth/API flow.

`observedAt` may be attached to individual proof events. It must not imply live status.

## Stale And Revoked Status

Stale proof:

- may be public only with explicit stale labeling if RM-27 accepts stale display;
- otherwise hidden until refreshed.

Revoked proof:

- never public;
- cannot satisfy publish policy;
- must stop sync;
- must remain auditable privately without token exposure.

## Proof Visibility

Default visibility: private until owner publishes.

Public visibility requires:

- verified or product-approved stale state;
- owner publish consent;
- public projection allowlist;
- no report/suspension block;
- no raw token public exposure;
- no raw metadata public exposure;
- no public private fields.

## Public/Private Boundary

Public projection remains allowlisted.

Allowed conceptual public fields:

- `providerId`;
- `displayName`;
- `externalUsername`;
- `profileUrl`;
- `verifiedAt`;
- `proofs[].type`;
- `proofs[].label`;
- `proofs[].source`;
- `proofs[].observedAt`;
- `proofs[].visibility`.

Private fields:

- access token;
- refresh token;
- token status internals;
- token expiration;
- raw OAuth payload;
- raw API response;
- external account id unless separately approved;
- owner id;
- internal linked provider account id;
- audit metadata;
- failed auth details.

## Contract Decision

Contract decision: conditional-go for RM-27 design.

RM-27 must implement strict runtime guards before activation. RM-26 is proof model is conceptual, no OAuth implementation, no callback route, no token storage implementation, no env vars/secrets and no osu! runtime.
