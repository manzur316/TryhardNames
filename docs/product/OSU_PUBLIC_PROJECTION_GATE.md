# osu! Public Projection Gate

RM-31 adds a closed public projection gate for osu!.

## Gate Status

- Gate: closed.
- Reason: `owner_visibility_controls_missing`.
- Public proof status: blocked.
- Next milestone: RM-32 osu! Owner Proof Visibility Controls.

## Code Boundaries

RM-31 applies the gate in two places:

- Web domain policy: `apps/web/src/gaming-passport/domain/osuPublicProjectionPolicy.js`.
- Local Supabase RPC projection: `supabase/migrations/20260628120000_osu_public_projection_gate.sql`.

The domain policy blocks osu! linked provider rows and `osu:profile_linked` proof rows from the public projection by default. The RPC migration mirrors the rule so local database projection cannot leak osu! rows that were manually marked public.

## Projection Rules

Current public projection behavior:

- A published Passport with consent can still render public non-osu allowlisted data.
- A private osu! linked account does not appear.
- A manually public osu! linked account does not appear.
- A private osu! proof does not appear.
- A manually public osu! proof does not appear.
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

This allowlist is conceptual in RM-31. It does not enable public osu! proof serving.

## Test Evidence

RM-31 adds tests for:

- private osu! proof absence;
- manually public osu! proof absence;
- stale and revoked osu! proof absence;
- RPC-level exclusion of manually public osu! rows;
- blocked fields not appearing in public projection;
- no direct osu! browser API call;
- no store, payments, `/cosmetics`, or tracker/ranking behavior.

## Rollback

Revert the RM-31 PR. This removes the explicit policy module, the RPC gate migration, docs, and tests. It does not affect osu! OAuth link/unlink runtime behavior.
