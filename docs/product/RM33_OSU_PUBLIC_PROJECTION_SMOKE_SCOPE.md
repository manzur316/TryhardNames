# RM-33 osu! Public Projection Smoke / Projection QA

## Scope

RM-33 validates whether osu! owner-public proof data can safely enter public projection after RM-31 policy gates and RM-32 owner visibility controls.

Implemented scope:

- Domain smoke for public preference with allowlist disabled.
- Domain smoke for allowlist enabled with all policy gates satisfied.
- Domain negatives for unpublished Passport, missing consent, suspension/report block, private provider, private proof, stale proof, non-profile-linked proof, and non-oauth proof.
- Local RPC projection smoke for the allowlisted osu provider DTO.
- Local RPC projection smoke for the allowlisted osu proof DTO.
- Local RPC checks that malicious metadata and blocked internal fields do not leak.
- Source guards for browser secrets, direct osu! browser API calls, commerce routes, `/cosmetics`, and tracker/ranking surfaces.
- Roadmap update setting RM-34 as the next trust-safety QA milestone.

## Decision

Decision: enable safe local projection gate for QA.

Public osu! projection is now enabled in the explicit public projection pipeline only when the allowlist and every policy condition pass. This PR does not deploy the migration to remote Supabase and does not launch production.

## Still Blocked

The following remain blocked:

- automatic public proof without owner visibility controls;
- private, stale, revoked, non-oauth, or non-profile-linked osu proofs;
- unpublished Passports;
- missing publication consent;
- suspended or report-blocked Passports;
- raw metadata, token state, internal identifiers, and gameplay/ranking data;
- production launch until RM-34 trust-safety QA.

## Rollback

Revert this PR. It removes the RM-33 local projection smoke migration, domain allowlist pipeline wiring, docs, and tests.
