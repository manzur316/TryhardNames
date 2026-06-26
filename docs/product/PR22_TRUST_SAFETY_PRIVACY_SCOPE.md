# PR22 Trust / Safety / Privacy Controls Scope

PR22 prepares public identity surfaces for abuse, privacy, moderation, and safe cosmetic/profile distribution.

## Current state

- PR21 Passport Cosmetics Foundation is merged into `main`.
- Public profile `/id/:slug` exists as an allowlisted projection.
- Passport Cosmetics are visual-only and do not change proof truth.
- Riot Provider Runtime remains blocked until explicit Riot approval exists.
- `/cosmetics`, payments, inventory purchases, and pets/companions runtime are not live.

## Goal

Prepare public identity surfaces for abuse and privacy cases before broader public distribution, future `/cosmetics`, inventory, payments, or provider-backed public profiles.

## Expected scope

- Public profile report action on valid `/id/:slug` profiles.
- Safe `submit_public_profile_report` RPC.
- Private `public_profile_reports` table with no public/client read access.
- Report category/domain policy.
- Takedown/suspension behavior.
- Cosmetic abuse policy.
- Reserved/blocked terms for visual identity surfaces.
- Impersonation rules.
- Visibility/privacy controls review.
- Moderation runbook.
- Public profile safe-unavailable behavior for suspended/taken-down profiles.
- Docs and tests proving trust/safety boundaries.

## Non-goals

- No Riot runtime.
- No League of Legends adapter.
- No provider launch expansion.
- No `/cosmetics` route.
- No store.
- No payments.
- No inventory purchases.
- No pets/companions runtime.
- No 3D runtime.
- No new public provider data.
- No fake proofs, fake ranks, proof boosts, MMR/ELO, ranking alternative, match history, live-game advice, or hidden-player de-anonymization.

## Exit criteria

Public profile abuse and privacy paths are documented, testable, and do not weaken public projection safety.

## Implemented by PR22

- `apps/web/src/gaming-passport/trust-safety/*` defines report categories, detail sanitization, blocked visual identity terms, and cosmetic abuse policy.
- `apps/web/src/gaming-passport/components/PublicProfileReportDialog.jsx` adds the public report intent.
- `apps/web/src/gaming-passport/data/trustSafetyRepository.js` submits reports through the safe RPC wrapper.
- `supabase/migrations/20260626100000_public_profile_reports.sql` adds private report storage and the report submission RPC.
- `docs/product/TRUST_SAFETY_PRIVACY_CONTROLS.md` documents report, takedown, suspension, privacy, impersonation, and cosmetic abuse controls.
