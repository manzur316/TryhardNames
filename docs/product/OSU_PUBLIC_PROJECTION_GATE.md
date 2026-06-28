# osu! Public Projection Gate

RM-31 added a closed public projection gate for osu!. RM-32 added owner proof visibility controls. RM-33 enables the safe local projection smoke path with explicit allowlisted osu! DTOs.

## Gate Status

- Gate: open only in the explicit public projection pipeline.
- Default domain allowlist: disabled unless the projection caller passes `osuPublicProjectionAllowlistEnabled`.
- Production status: not launched.
- Public proof status: eligible only when every gate passes.
- Next milestone: RM-34 osu! Public Profile Trust-Safety QA.

## Code Boundaries

The gate is enforced in two places:

- Web domain policy: `apps/web/src/gaming-passport/domain/osuPublicProjectionPolicy.js`.
- Local Supabase RPC projection: `supabase/migrations/20260628180000_osu_public_projection_smoke.sql`.

The domain policy blocks osu! linked provider rows and `osu:profile_linked` proof rows unless owner visibility controls, Passport publication state, owner consent, linked provider state, proof state, trust-safety checks, and the public projection allowlist all pass.

The RPC keeps generic osu rows excluded from the generic provider/proof builders and emits osu only through separate allowlisted builders.

## Projection Rules

Current public projection behavior:

- A published Passport with consent can render public non-osu allowlisted data.
- A private osu! linked account does not appear.
- An owner-public osu! linked account does not appear unless the projection allowlist is active.
- A private osu! proof does not appear.
- An owner-public osu! proof does not appear unless the projection allowlist is active.
- A stale osu! proof does not appear.
- A revoked osu! proof does not appear.
- Raw metadata, token status, owner identifiers, provider internals, proof identifiers, and raw external ids do not appear.

## Public Allowlist

The public provider DTO is limited to:

- `providerId`
- `displayName`
- `externalUsername`
- `profileUrl`
- `verifiedAt`

The public proof DTO is limited to:

- `type`
- `label`
- `source`
- `observedAt`
- `visibility`

## Test Evidence

RM-33 tests cover:

- public preference alone does not bypass the allowlist;
- allowlist false blocks domain projection;
- allowlist true passes only with published Passport, consent, verified/current/public provider, current/public proof, and no trust-safety block;
- stale or revoked provider/proof states stay hidden;
- non-oauth and non-profile-linked proof rows stay hidden;
- RPC output contains only allowlisted osu fields;
- malicious metadata does not leak;
- featured proofs cannot bypass the gate;
- no direct osu! browser API call;
- no store, payments, `/cosmetics`, or tracker/ranking behavior.

## RM-33 Update

RM-33 removes the `public_projection_allowlist_disabled` blocker from the local RPC smoke path by adding a safe allowlisted projection branch. The default domain policy still uses that block reason unless the caller explicitly enables the osu projection allowlist.

This is a local QA enablement, not a production launch.

## Rollback

Revert the RM-33 PR. It removes the local smoke migration, domain allowlist pipeline wiring, docs, and tests. No remote Supabase, Vercel, or production rollback is required by this PR.
