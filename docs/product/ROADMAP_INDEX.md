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
| RM-24 | Launch Readiness | this PR | Production smoke, observability, rollback, policy review, launch checklist, and operational go/no-go. Does not execute deploy. |
| RM-25 | Provider Expansion Readiness Matrix | next | Compares provider candidates using readiness-before-runtime criteria. |
| RM-26 | osu! Readiness Pack | future | Reviews official osu! docs, account ownership, API/OAuth model, public fields, privacy, rate limits, and proof boundaries. |
| RM-27 | osu! Runtime Foundation | conditional future | Runtime only if RM-26 passes official review and product constraints. |

## Future Provider Candidates

- Steam Identity Readiness.
- Supercell / Clash Readiness.
- Discord Social Provider Readiness.
- Riot Runtime, still gated by explicit Riot approval.

## Not Implemented By RM-24

- RM-25 Provider Expansion Readiness Matrix.
- RM-26 osu! Readiness Pack.
- RM-27 osu! Runtime Foundation.
- Any provider runtime.
- Any OAuth/API integration.
- `/cosmetics`.
- Store or payments.
