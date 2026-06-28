# Roadmap Index

This index maps stable Roadmap Milestones to product blocks. It exists to avoid confusing GitHub's automatic PR numbers with product roadmap phases.

GitHub/main/docs are the source of truth. GH PR numbers are historical execution records. RM numbers are stable product milestones.

## Historical Milestones

Early roadmap labels were recorded as PR-style product blocks. Their RM mapping is retained at a high level.

| RM | Name | Status | Notes |
| --- | --- | --- | --- |
| RM-01 | Repository security and reproducibility | done | Historical security/build hygiene block. |
| RM-02 | Gaming Passport domain foundation | done | Historical domain contracts block. |
| RM-03 | Gaming Passport database foundation | done | Historical local schema/RLS block. |
| RM-04 | Parent Auth and private drafts | done | Historical Parent Auth/private draft block. |
| RM-05 | Riot site verification | done | Historical Riot verification support. |
| RM-06 | Gaming Passport landing | done | Historical public landing for users and Riot review. |
| RM-07 | Riot review submission pack | done | Historical submission docs block. |
| RM-08 | Riot policy compliance audit | done | Historical compliance docs block. |
| RM-09 | Current state and policy alignment | done | Historical README/privacy/terms/docs alignment. |
| RM-10 | Theme, visual surfaces, and generator UX polish | done | Includes PR10.x visual/tooling line through PR10.8. |
| RM-11 | Account Dashboard V2 and saved-name UX | done | Includes Account Dashboard V2, favorite-first saved names, and roadmap reconciliation. |
| RM-12 | Saved Names Persistence | done | Supabase-backed saved names with local fallback. |
| RM-13 | Private Gaming Passport Editor V2 | done | Private draft editor, preview, checklist, and private saved-name highlights. |
| RM-14 | Publish Runtime Commands | done | Implemented by GH PR #23. |
| RM-15 | Public Gaming Passport MVP `/id/:slug` | done | Implemented by GH PR #24. |
| RM-16 | Provider Runtime Foundation | done | Implemented by GH PR #25 as provider-neutral foundation, not provider activation. |
| RM-17 | First Provider Decision Readiness | done | Implemented by GH PR #26. |
| RM-18 | Riot Readiness Pack | done | Implemented by GH PR #27. Riot runtime remains blocked. |
| RM-19 | Riot Provider Runtime | gated | Gated by explicit Riot approval. |
| RM-20 | League of Legends Adapter | gated | Depends on approved Riot runtime. |
| RM-21 | Passport Cosmetics Foundation | done | Implemented by GH PR #28. |
| RM-22 | Trust / Safety / Privacy Controls | done | Implemented by GH PR #29. |

## Current And Next Milestones

| RM | Name | Status | Scope |
| --- | --- | --- | --- |
| RM-23 | Roadmap Governance + Provider Expansion Plan | done | Defines RM convention, source-of-truth rules, provider expansion readiness policy, and future provider candidate taxonomy. |
| RM-24 | Launch Readiness | done | Production smoke, observability, rollback, policy review, launch checklist, and operational go/no-go. Does not execute deploy. |
| RM-25 | Provider Expansion Readiness Matrix | done | Implemented by GH PR #32 / merge `a072aed297d209107e6ca719874496f30eaac8e9`. Compares provider candidates using readiness-before-runtime criteria and recommends RM-26 osu! Readiness Pack. |
| RM-26 | osu! Readiness Pack | done | Implemented by GH PR #33 / merge `c933f7d4fb60ee5f5a334dd96af4ef20fa2ee294`. Reviews official osu! docs, account ownership, API/OAuth model, public fields, privacy, rate limits, proof boundaries, branding, token/revoke, and outputs `conditional-go` for RM-27. |
| RM-27 | osu! Runtime Foundation | done | Implemented by GH PR #34 / merge `8ee0ceea7b090205d5f4dc543f9f8f5ea6337337`. Disabled-by-default server-side foundation with OAuth state, token exchange, `/me` ownership verification, immediate revoke, no-refresh-token storage strategy, owner-only unlink, private proof foundation, and public projection guards. Not production launch. |
| RM-28 | osu! Runtime Smoke / Owner Linking QA | done / partial-pass | Local smoke docs/tests for configured env, owner link-intent, manual callback criteria, DB verification criteria, token vault non-persistence criteria, unlink/revoke criteria, revoked proof criteria, public projection non-leakage criteria, and rollback readiness. Full callback evidence was deferred to RM-29. |
| RM-29 | osu! Smoke Blocker Fixes | done / full-pass | Completed the human-authorized callback smoke locally, verified private DB rows, token vault non-persistence, unlink/revoke, public projection non-leakage, and negative cases. |
| RM-30 | osu! Owner Linking UI Hardening / Private Account UX | done | Harden private owner UX around osu! linking status, backend link-intent, unlink/revoke confirmation, privacy copy, and account controls after smoke completion. |
| RM-31 | osu! Private Proof Publish Policy / Public Projection Gate | done | Defines and enforces the closed public projection gate for osu! private ownership proof data. Public osu! projection remained blocked until owner visibility controls existed. |
| RM-32 | osu! Owner Proof Visibility Controls | done | Adds explicit owner controls for private/public osu! proof visibility preference under the RM-31 gate while keeping public projection blocked by allowlist until RM-33. |
| RM-33 | osu! Public Projection Smoke / Projection QA | done | Implemented by GH PR #40 / merge `97df703a88edc938e6ee3b4f0cd42b271b3d7599`. Enables safe local public projection smoke only through explicit allowlisted osu! provider/proof DTOs, published Passport, consent, owner public preference, and blocked-field tests. |
| RM-34 | osu! Public Profile Trust-Safety QA | done | Implemented by GH PR #41 / merge `2e5526fecec611d588182452dbe08fd459af91f3`. Audits public profile trust-safety behavior, fixes the minimum public renderer/mapper issue for osu! allowlisted DTOs, documents rollback, and keeps production blocked. |
| RM-35 | osu! Production Readiness / Staging Go-No-Go | this PR | Staging is `conditional-go` pending isolated staging configuration and manual smoke. Production is `no-go` until staging evidence, owner go/no-go, env/callback review, rollback acceptance, monitoring review, and source guards pass. |
| RM-36 | osu! Staging Configuration / Manual Smoke | next | Future staging configuration and manual smoke execution. No production enablement without explicit owner approval. |

## Future Provider Candidates

- Steam Identity Readiness.
- Supercell / Clash Readiness.
- Discord Social Provider Readiness.
- Riot Runtime, still gated by explicit Riot approval.

## Not Implemented By RM-35

- Production osu! launch.
- Secret changes.
- Remote Supabase changes.
- Vercel changes.
- Public provider linking UI outside `/account`.
- Automatic public osu! proof.
- Browser token exchange.
- Refresh-token storage.
- Any env vars/secrets.
- `/cosmetics`.
- Store or payments.
- Rank, PP, score, match-history, best-play, beatmap, or live tracker surfaces.
- Hidden-player inference.
- Official osu! endorsement claims.
