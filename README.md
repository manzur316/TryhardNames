# TryhardNames

## What It Is

TryhardNames is a public gaming identity toolkit with free generators and a private-first Gaming Passport identity layer.

The site currently combines public name/text/symbol tools with a Gaming Passport product surface for players who want a visual, verifiable, shareable gaming resume without exposing accounts by default.

## Current Live Surfaces

- `/` - home page and public generator entry points.
- Public generators - free name, text, symbol, and identity utilities.
- `/gaming-passport` - public Gaming Passport landing page for users and Riot review.
- `/id/:slug` - public Gaming Passport MVP for published, policy-compliant Passports.
- `/sign-in` - Parent Auth sign-in for the TryhardNames account.
- `/account` - protected Account Dashboard V2 with private Gaming Passport draft and saved-name guidance.
- `/privacy-policy` - public Privacy Policy.
- `/terms-of-service` - public Terms of Service.
- `/sitemap.xml` - public sitemap.

Public generators are free and usable without an account. `/gaming-passport` is public. `/account` requires Parent Auth and manages private account state. `/id/:slug` serves only allowlisted public projection data for published, policy-compliant Passports.

## Gaming Passport

Gaming Passport is a visual, verifiable, shareable gaming resume.

- It starts as a private draft by default.
- Nothing becomes public without explicit user consent.
- Google Auth is Parent Auth only.
- Riot and Discord are future linked provider accounts.
- League of Legends is a GameAdapter inside RiotProvider.
- No Riot data is live.
- Public profile serving is limited to the `/id/:slug` allowlisted projection and does not activate providers.

Parent Auth lets a user enter TryhardNames and own a draft. It is never a public proof, badge, or gaming provider.

## Riot Review Status

The Riot project has been registered in Riot Developer Portal and is awaiting Riot confirmation/review.

- Riot integration is pending Riot approval.
- Riot OAuth / Riot Sign On is not live.
- The repo has no production Riot key.
- No Riot API calls are active.
- No Riot data is live in production.

Current support docs:

- `docs/product/RIOT_REVIEW_SUBMISSION_PACK.md`
- `docs/product/RIOT_POLICY_COMPLIANCE_AUDIT.md`
- `docs/product/GAMING_PASSPORT_RIOT_REVIEW_LANDING.md`

## What TryhardNames Does Not Do

- No custom MMR/ELO.
- No OP.GG alternative.
- No tracker replacement.
- No alternative ranking system.
- No live-game advantage.
- No in-game recommendations.
- No match-history dumping.
- No hidden-player de-anonymization.
- No public profile without consent.
- No selling Riot data.
- No Riot data behind a paywall.

## Architecture Boundaries

- Parent Auth = TryhardNames account login only.
- Linked Provider = external account connected after sign-in.
- GameAdapter = game-specific proof normalization under a provider.
- VerifiedProof = normalized, source-backed proof.
- PublicProjection = allowlisted output only.

## Planning Documents

- `docs/product/ROADMAP_GOVERNANCE.md`
- `docs/product/ROADMAP_INDEX.md`
- `docs/product/ROADMAP_MILESTONE_REGISTRY.md`
- `docs/product/PROVIDER_EXPANSION_ROADMAP.md`
- `docs/product/OSU_READINESS_PACK.md`
- `docs/product/OSU_PROVIDER_CONTRACT_REVIEW.md`
- `docs/product/OSU_OAUTH_API_REVIEW.md`
- `docs/product/OSU_PUBLIC_PROOF_MODEL.md`
- `docs/product/OSU_TRUST_SAFETY_PRIVACY_REVIEW.md`
- `docs/product/OSU_BRANDING_MONETIZATION_REVIEW.md`
- `docs/product/RM26_OSU_READINESS_SCOPE.md`
- `docs/product/OSU_RUNTIME_FOUNDATION.md`
- `docs/product/OSU_RUNTIME_SECURITY_REVIEW.md`
- `docs/product/OSU_TOKEN_REVOKE_UNLINK_PLAN.md`
- `docs/product/OSU_RUNTIME_PUBLIC_PROJECTION_REVIEW.md`
- `docs/product/RM27_OSU_RUNTIME_SCOPE.md`
- `docs/product/OSU_RUNTIME_SMOKE_QA.md`
- `docs/product/OSU_OWNER_LINKING_SMOKE_RUNBOOK.md`
- `docs/product/OSU_RUNTIME_SMOKE_RESULTS.md`
- `docs/product/RM28_OSU_RUNTIME_SMOKE_SCOPE.md`
- `docs/product/RM29_OSU_SMOKE_BLOCKER_FIXES_SCOPE.md`
- `docs/product/OSU_OWNER_LINKING_UI_HARDENING.md`
- `docs/product/RM30_OSU_OWNER_LINKING_UI_SCOPE.md`
- `docs/product/OSU_PRIVATE_PROOF_PUBLISH_POLICY.md`
- `docs/product/OSU_PUBLIC_PROJECTION_GATE.md`
- `docs/product/RM31_OSU_PUBLIC_PROJECTION_GATE_SCOPE.md`
- `docs/product/MASTER_PRODUCT_ROADMAP.md`
- `docs/product/ROADMAP_STATUS_MATRIX.md`
- `docs/product/PRODUCT_EXECUTION_PLAN_AFTER_PR10.md`
- `docs/product/PROVIDER_RUNTIME_FOUNDATION.md`
- `docs/product/FIRST_PROVIDER_DECISION_READINESS.md`
- `docs/product/PROVIDER_READINESS_CHECKLIST.md`
- `docs/product/PR18_RIOT_READINESS_SCOPE.md`
- `docs/product/RIOT_READINESS_PACK.md`
- `docs/product/RIOT_RSO_CALLBACK_DESIGN.md`
- `docs/product/RIOT_PROVIDER_ADAPTER_CONTRACT_REVIEW.md`
- `docs/product/PASSPORT_COSMETICS_FOUNDATION.md`
- `docs/product/TRUST_SAFETY_PRIVACY_CONTROLS.md`
- `docs/product/PUBLIC_GAMING_PASSPORT_MVP.md`
- `docs/product/DECISION_LOG.md`
- `docs/product/UI_THEME_SURFACE_CONTRACT.md`
- `docs/product/THEME_AUDIT.md`
- `docs/product/CURRENT_STATE_AND_ROADMAP.md`

## Development

Install dependencies:

```bash
npm ci
```

Run the web app:

```bash
npm run dev
```

Validate the repo:

```bash
npm run lint
npm test
npm run test:auth
npm run test:passport
npm run test:seo
npm run build
```

Local Supabase workflow:

```bash
npm run db:start
npm run db:reset
npm run test:db
npm run db:stop
```

Database commands run local Supabase only. Do not connect to remote Supabase for tests.

## Worktree Workflow

Local convention:

- `TryhardNames-main-clean` = central main control folder.
- `TryhardNames-<task>` = temporary worktree per PR.
- Remove worktrees after merge.
- Do not work in old worktrees.

Example:

```bash
git fetch origin
git worktree add "../TryhardNames-new-task" -b docs/example origin/main
```

## Safety Rules

- Do not commit secrets.
- Do not add env files.
- Do not expose service role keys.
- Do not implement Riot OAuth until Riot approval.
- Do not add Riot keys/tokens.
- Do not touch Supabase remote without explicit approval.
- Do not change migrations/RLS without a dedicated PR.
- Do not activate gaming providers in docs-only PRs.

## Roadmap Snapshot

GitHub/main/docs are the source of truth. GitHub PR numbers are automatic GitHub records; RM-XX is the stable product roadmap milestone identifier used in `docs/product`. Chat is not a source of truth.

Completed:

- Security/reproducibility.
- Domain foundation.
- Local schema foundation.
- Parent Auth/private draft.
- Account Dashboard V2 and favorite-first saved-name UI.
- Saved Names Supabase persistence.
- Private Gaming Passport Editor V2.
- Publish Runtime Commands.
- Public Gaming Passport MVP `/id/:slug`.
- Provider Runtime Foundation contracts, local schema, repository scaffolding, audit model, and private account status panel.
- First Provider Decision + Readiness Pack selecting PR18 as Riot Readiness.
- Riot Readiness Pack with approval gates, design-only RSO callback plan, token-retention requirements, and adapter contract review.
- Passport Cosmetics Foundation with TryhardNames-owned visual-only cosmetics and Obsidian Pulse as a free foundation preview.
- Trust / Safety / Privacy Controls Foundation with public profile report intent, safe report submission, private report storage, cosmetic abuse policy, and moderation runbook.
- RM-23 Roadmap Governance + Provider Expansion Plan, defining GH PR # versus RM-XX, roadmap source-of-truth rules, and provider expansion readiness policy.
- RM-24 Launch Readiness Pack with production smoke, observability, rollback, go/no-go, and policy final review docs.
- RM-25 Provider Expansion Readiness Matrix comparing Riot, osu!, Steam, Supercell/Clash, Discord, and future console/Epic candidates without runtime activation.
- RM-26 osu! Readiness Pack with official docs review, OAuth/API model, ownership proof, public proof model, token/revoke/stale-proof review, trust/safety/privacy review, branding/monetization review, and conditional RM-27 decision without runtime activation.
- RM-27 osu! Runtime Foundation with disabled-by-default server-side API gates, CSRF-safe state, Authorization Code token exchange, `/me` ownership verification, immediate token revoke, no-refresh-token storage strategy, owner-only unlink, private proof foundation, and public projection guards.
- RM-28 osu! Runtime Smoke / Owner Linking QA partial-pass docs and tests for local status, link-intent, manual callback, DB verification, token vault non-persistence, unlink/revoke, and negative cases.
- RM-29 osu! Smoke Blocker Fixes full-pass local smoke completion with real human-authorized callback, DB verification, token vault non-persistence, unlink/revoke, public projection non-leakage, and negative cases.
- RM-30 osu! Owner Linking UI Hardening / Private Account UX with owner-only `/account` status, connect, unlink, privacy copy, and source guards.
- Riot site verification.
- Gaming Passport landing.
- Riot review submission pack.
- Riot policy compliance audit.
- PR10.x theme, visual surface, tool audit, dynamic card, lineup, and feature generator card polish.
- Publish Policy contract.
- Public Projection contract.
- Local saved-name/favorites SoT.

Waiting:

- Riot confirmation/review.

This PR:

- RM-31 osu! Private Proof Publish Policy / Public Projection Gate.
- Result: public osu! projection remains blocked until explicit owner proof visibility controls exist, with domain and local RPC gates.

Next product block:

- RM-32 osu! Owner Proof Visibility Controls.

Provider expansion planning:

- RM-25 Provider Expansion Readiness Matrix is implemented as docs/tests-only decision support by GH PR #32 and merge commit `a072aed297d209107e6ca719874496f30eaac8e9`.
- RM-26 osu! Readiness Pack is implemented by GH PR #33 and merge commit `c933f7d4fb60ee5f5a334dd96af4ef20fa2ee294`.
- RM-27 osu! Runtime Foundation is implemented by GH PR #34 and merge commit `8ee0ceea7b090205d5f4dc543f9f8f5ea6337337`.
- RM-28 osu! Runtime Smoke / Owner Linking QA is historical partial-pass smoke evidence.
- RM-29 osu! Smoke Blocker Fixes is full-pass local smoke completion, not production launch.
- RM-30 osu! Owner Linking UI Hardening / Private Account UX is complete as private owner UI, not public provider UI.
- RM-31 osu! Private Proof Publish Policy / Public Projection Gate is this PR and keeps public osu! proof projection blocked.
- Riot runtime only after explicit approval evidence exists.
- osu! has a gated runtime foundation, not a live public launch.
- Steam is a future identity provider candidate.
- Supercell / Clash remains blocked until ownership verification strategy is documented.
- Discord is a future social/community provider candidate, not an achievement proof.
- Discord pilot remains an alternate future path only if product direction explicitly changes.
- Server-side token storage.
- Unlink/revoke.
- RiotProvider runtime.
- LeagueOfLegendsAdapter.
- Proof sync.
- Future `/cosmetics` showcase.

No dates are promised. Riot runtime work should wait until approval and next steps are clear.
