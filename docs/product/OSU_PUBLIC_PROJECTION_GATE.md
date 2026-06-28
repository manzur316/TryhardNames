# osu! Public Projection Gate

RM-31 added a closed public projection gate for osu!. RM-32 adds owner proof visibility controls, but public projection remains gated.

## Gate Status

- Gate: closed.
- Reason: `public_projection_allowlist_disabled`.
- Public proof status: blocked.
- Next milestone: RM-33 osu! Public Projection Smoke / Projection QA.

## Code Boundaries

RM-31 applies the gate in two places:

- Web domain policy: `apps/web/src/gaming-passport/domain/osuPublicProjectionPolicy.js`.
- Local Supabase RPC projection: `supabase/migrations/20260628120000_osu_public_projection_gate.sql`.

The domain policy blocks osu! linked provider rows and `osu:profile_linked` proof rows from public projection until all policy gates and the public projection allowlist pass. The RPC migration still mirrors a closed rule so local database projection cannot leak osu! rows after an owner records public preference.

## Projection Rules

Current public projection behavior:

- A published Passport with consent can still render public non-osu allowlisted data.
- A private osu! linked account does not appear.
- An owner-public osu! linked account does not appear while the projection allowlist is disabled.
- A private osu! proof does not appear.
- An owner-public osu! proof does not appear while the projection allowlist is disabled.
- A stale osu! proof does not appear.
- A revoked osu! proof does not appear.
- Raw metadata, token status, owner identifiers, provider internals, and raw external ids do not appear.

## Future Allowlist

The future public provider DTO is limited to:

- `providerId`
- `displayName`
- `externalUsername`
- `profileUrl`
- `verifiedAt`

The future public proof DTO is limited to:

- `type`
- `label`
- `source`
- `observedAt`
- `visibility`

This allowlist remains disabled in RM-32. It does not enable public osu! proof serving.

## Test Evidence

RM-31/RM-32 tests cover:

- private osu! proof absence;
- owner-public osu! proof absence while projection is gated;
- stale and revoked osu! proof absence;
- RPC-level exclusion of owner-public osu! rows;
- blocked fields not appearing in public projection;
- no direct osu! browser API call;
- no store, payments, `/cosmetics`, or tracker/ranking behavior.

## RM-32 Update

RM-32 removes the default `owner_visibility_controls_missing` blocker by adding private owner controls. The historical blocker remains documented for legacy policy state, but the live default domain blocker is now `public_projection_allowlist_disabled`.

RM-32 does not add a migration and does not enable public projection.

## Rollback

Revert the RM-31/RM-32 PRs as needed. RM-31 removes the explicit policy module and RPC gate migration. RM-32 removes the visibility route, private UI controls, docs, and tests. Neither rollback path requires touching production services.
