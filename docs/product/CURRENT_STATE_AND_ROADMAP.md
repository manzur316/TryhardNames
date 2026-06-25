# TryhardNames Current State And Roadmap

## Current Status After PR13

This document reflects the PR13 branch after PR10.8, `fix(generator): align feature generator cards`, PR11.1, `feat(account): add dashboard v2 and unify saved names`, PR12, `feat(account): persist saved names`, and PR13, `feat(account): improve private passport editor`.

TryhardNames has public generators, a public `/gaming-passport` landing page, Parent Auth for TryhardNames accounts, a protected `/account` Account Dashboard V2, Supabase-backed saved names for authenticated users, local saved-name fallback for signed-out users, and Private Gaming Passport Editor V2 for owner-only draft editing.

Riot integration is not live. Discord integration is not live. No public Riot data is live. No public Gaming Passport profile route is implemented. No Riot OAuth button exists. No Riot API calls exist. No production Riot key exists in the repo or runtime.

Gaming Passport remains a private-first, verifiable, shareable gaming resume. It is not a tracker, OP.GG alternative, custom MMR/ELO product, match-history dump, live-game advantage tool, hidden-player de-anonymization surface, or alternative ranking system.

## PR History Through PR12

The repo history is summarized through PR12.

| PR | Title | Status | Outcome | Runtime impact | Non-goals |
| --- | --- | --- | --- | --- | --- |
| PR1 | `chore: secure repository and ensure reproducible builds` | Merged | Removed sensitive/generated files from version control and stabilized reproducible local/CI builds. | Build/test hygiene improved. | No product feature launch, no provider integration. |
| PR2 | `feat: define Gaming Passport domain foundation` | Merged | Added pure Gaming Passport domain contracts, policies, constants, and tests. | Domain logic available locally. | No routes, OAuth, API calls, database writes, public profiles, or providers. |
| PR3 | `feat: define Gaming Passport database foundation` | Merged | Added local Supabase migration/tests for core Passport tables and RLS. | Local schema foundation and DB tests exist. | No remote Supabase changes, no production rollout, no provider token storage. |
| PR4 | `feat: add Parent Auth and private Gaming Passport drafts` | Merged | Added Parent Auth flow and `/account` private draft management. | Users can sign in and manage a private draft when auth is configured. | No public profiles, linked providers, Riot OAuth, Discord OAuth, or proof sync. |
| PR5 | `chore: add Riot verification file` | Merged | Added Riot site verification file. | Supports Riot Developer Portal verification. | No Riot runtime integration. |
| PR6 | `feat(passport): add public Gaming Passport landing for Riot review` | Merged | Added public `/gaming-passport` landing and review-safe copy. | Public product page is live. | No Riot OAuth, Discord OAuth, Riot data, profile publishing, or provider activation. |
| PR7 | `docs(passport): add Riot review submission pack` | Merged | Added Riot submission support packet with URLs, smoke results, and safe wording. | Documentation only. | No credentials, API calls, OAuth, production keys, or service config. |
| PR8 | `docs(passport): audit Riot policy compliance` | Merged | Added compliance audit with `PASS WITH CONDITIONS` verdict. | Documentation only. | No runtime work, no secrets, no migrations, no RLS changes. |
| PR9 | `docs(passport): document current state and policy alignment` | Merged | Added root README, public privacy/terms alignment, copy tests, and current roadmap. | Documentation and public policy copy only. | No runtime work, provider integration, secrets, migrations, RLS changes, or service config. |
| PR10 | `docs(product): define roadmap and theme audit` | Merged | Added master roadmap, theme contract, and audit path. | Documentation only. | No runtime redesign. |
| PR10.1 | `fix(auth): align account and auth surfaces with light-dark theme contract` | Merged | Normalized account/auth theme behavior. | Account/auth surfaces became theme-consistent. | No provider/OAuth changes. |
| PR10.2 | `fix(passport): decide and normalize Gaming Passport landing theme` | Merged | Normalized Gaming Passport landing theme behavior. | Public landing remained review-safe. | No Riot runtime, no profile publishing. |
| PR10.3 | `docs(product): audit theme surfaces by route` | Merged | Captured route-level theme audit and contract follow-up. | Documentation/tooling only. | No route or provider changes. |
| PR10.4 | `fix(generator): align dynamic generator theme surfaces` | Merged | Brought dynamic generator pages into the theme surface contract. | Public generators kept working with improved theme consistency. | No SEO data, auth, or provider changes. |
| PR10.5 | `fix(generator): prioritize dynamic name tools` | Merged | Prioritized dynamic generator tools over editorial content and removed the global `GhostVCT` fallback. | Tool surfaces became easier to reach. | No programmatic data, routes, or provider work. |
| PR10.6 | `chore(audit): add tool container visual audit` | Merged | Added Chrome-based visual audit for cards, buttons, lineup, drawer, trending, and feature generator surfaces. | Local audit tooling only. | No runtime visual redesign. |
| PR10.7 | `fix(generator): refine name cards and lineup visuals` | Merged | Refined dynamic name cards and lineup visuals using the audit. | Dynamic card hierarchy and lineup coverage improved. | No route, SEO data, provider, or auth changes. |
| PR10.8 | `fix(generator): align feature generator cards` | Merged | Aligned GamerNames and RobloxNames feature generator cards with the dynamic NameCard standard. | Feature generator card wrapping and action hierarchy improved. | No dynamic `SeoTemplate` redesign or provider/runtime work. |
| PR11.1 | `feat(account): add dashboard v2 and unify saved names` | Merged | Added Account Dashboard V2, favorite-first saved-name UX, Account Hunting Guide, and removed legacy lineup/copy-pack public UX. | `/account` is more useful and public generators use star/favorite as canonical save UX. | No providers, migrations, publish runtime, or public profiles. |
| PR11.0 | `docs(product): reconcile roadmap after account dashboard merge` | Merged | Reconciled roadmap docs with actual state after PR10.8 and PR11.1. | Documentation/tests only. | No runtime work, migrations, providers, routes, or RLS changes. |
| PR12 | `feat(account): persist saved names` | Merged | Added Supabase `saved_names`, owner-only RLS, saved-name repository, local-to-account sync, and docs/tests. | Authenticated users can persist saved names under Parent Auth while signed-out users keep local fallback. | No providers, Riot/Discord OAuth, publish commands, public profiles, remote Supabase, Vercel, secrets, migrations outside local files, or RLS outside this table. |
| PR13 | `feat(account): improve private passport editor` | In progress | Adds Private Gaming Passport Editor V2, private preview, completion checklist, save-state clarity, and private Saved Names highlights through `scene_config.featuredSavedNames`. | Owners can shape a private draft more clearly inside `/account` without publishing or linking providers. | No publish commands, slug claim, public `/id/:slug`, Riot/Discord OAuth, providers, token storage, or remote service config. |

## Live Surfaces

- `/` - public home page and generator entry point.
- Public dynamic generator routes such as `/valorant/sweaty`, `/general/best`, `/minecraft/pvp`, and related programmatic pages.
- Public feature generator routes such as `/gamer-names/pro`, `/gamer-names/cool`, `/roblox-names/cool`, and `/roblox-names/tryhard`.
- `/gaming-passport` - public Gaming Passport landing page for users and Riot review.
- `/sign-in`, `/sign-up`, `/auth/callback` - Parent Auth flow. Google Auth is Parent Auth only.
- `/account` - protected Account Dashboard V2 with private draft and saved-name guidance.
- `/privacy-policy` and `/terms-of-service` - public legal surfaces.
- `/sitemap.xml` - public sitemap.

`/id/:slug` does not exist yet.

## Implemented

- Public generators remain free and public.
- PR10.x visual/tooling line is closed after PR10.8.
- Theme and visual surface contract exists.
- Tool container Chrome audit exists.
- Dynamic NameCard and lineup visual redesign exists.
- Feature generator card visual alignment exists.
- Parent Auth exists.
- Account Dashboard V2 exists.
- Private Gaming Passport draft management exists.
- Private Gaming Passport Editor V2 exists.
- Private preview V2 exists.
- Private completion checklist exists.
- Private Saved Names highlights exist through `scene_config.featuredSavedNames`.
- Account Hunting Guide exists inside the account experience.
- Favorite/star is the canonical saved-name UX.
- Saved Names Supabase persistence exists through `public.saved_names`.
- Saved Names account sync exists through `savedNamesRepository.js` and `FavoritesContext`.
- Saved names preserve local fallback for signed-out users and Supabase failures.
- Gaming Passport domain constants and pure contracts exist.
- Local schema foundation and RLS tests exist.
- Publish Policy already exists as a domain contract through `publicationPolicy.js`.
- Public Projection already exists as a domain contract through `publicProjection.js`.
- Saved names have local/legacy compatibility via `FavoritesContext`, `favoritesSoT`, `localFavoritesBridge`, `FavoriteStarButton`, and `MinimalFavoritesPeek`.
- Riot verification file, review docs, and compliance audit exist.

## Partially Implemented

- PocketBase favorite storage remains only as legacy compatibility fallback. Parent Auth/Supabase `saved_names` is now the canonical authenticated path.
- Private Gaming Passport Editor V2 is implemented as an owner-only draft editing surface. Publish runtime and public profile serving remain separate pending slices.
- Provider-neutral domain/schema is partial. Constants, statuses, local tables, and schema docs exist, but provider runtime does not.
- Linked Provider domain is partial-contract and Linked Provider schema is partial-schema. Runtime link/unlink/revoke/sync is pending.
- Verified Proof domain is partial-contract and Verified Proof schema is partial-schema. Sync runtime is pending.
- Publish Policy is partial-contract. No publish/unpublish command runtime exists.
- Public Projection is partial-contract. No public serving route/API exists.

## Not Implemented

- Publish command runtime.
- Slug claim command.
- Consent command.
- Public `/id/:slug`.
- Public profile route/API.
- Riot OAuth / Riot Sign On.
- Discord OAuth.
- Riot API calls.
- Discord API calls.
- Provider token storage.
- Provider unlink/revoke runtime.
- Provider sync jobs.
- League of Legends adapter runtime.
- Cosmetics.
- Trust/safety moderation controls.
- Launch readiness checklist execution.

## Gated

- Riot runtime remains gated by Riot Developer Portal approval and next steps.
- Provider runtime foundation is gated by token storage, unlink/revoke, sync, rate-limit, audit, and privacy contracts.
- Public profiles are gated by publish commands, consent, slug policy, and public projection serving.
- Cosmetics are gated by product review and Riot/data monetization boundaries.
- Broad launch is gated by trust/safety, privacy review, observability, and rollback readiness.

## Corrected Roadmap Order

| Proposed PR | Scope | Notes |
| --- | --- | --- |
| PR11.0 | Roadmap Reconciliation After PR10.8 and PR11.1 | Docs-only reconciliation of actual repo state, matrix, execution plan, and decision log. |
| PR14 | Publish Runtime Commands | Adds consent, slug, publish, unpublish, and status transitions. |
| PR15 | Public Gaming Passport MVP `/id/:slug` | Serves allowlisted public projection only after publish commands exist. |
| PR16 | Provider Runtime Foundation | Adds provider runtime contracts, token storage, unlink/revoke, sync scaffolding, and audit boundaries without activating a specific provider. |
| PR17 | First Provider Decision + Readiness Pack | Chooses Discord pilot or Riot readiness based on approvals and risk. |
| PR18 | Discord Pilot OR Riot Readiness | Executes the safer first provider path. Riot work remains gated if approval is not granted. |
| PR19 | Riot Provider Runtime | Gated by Riot approval. Implements Riot OAuth/runtime only after explicit approval and provider foundation. |
| PR20 | League of Legends Adapter | Normalizes LoL proofs under RiotProvider after Riot runtime is approved and implemented. |
| PR21 | Cosmetics Foundation | Adds TryhardNames-owned visual upgrades without monetizing Riot data/assets. |
| PR22 | Trust / Safety / Privacy Controls | Adds public identity abuse controls, takedown paths, and privacy controls. |
| PR23 | Launch Readiness | Production smoke, observability, rollback, policy review, and launch checklist. |

## Removed Stale Recommendations

The previous recommendation to start a Riot review response playbook as PR11 and a Riot provider runtime planning PR as PR12 has been replaced. Riot follow-up docs remain useful only if Riot asks for more context, and Riot runtime should not begin before approval. The next cycle should move the real product forward in this order: saved-name persistence, private Passport editing, publish runtime, public profile, provider runtime, proofs, cosmetics, trust, and launch.

## Do-Not-Build-Yet List

- Live Riot OAuth.
- Live Discord OAuth.
- Production Riot key assumptions.
- Fake Riot data.
- Riot profile publishing before explicit publish runtime.
- Public `/id/:slug` without consent and allowlisted projection.
- Alternative ranking.
- MMR/ELO calculator.
- Match history dump.
- Hidden player inference.
- Riot assets/logos.
- Riot data behind a paywall.
- Riot or Discord as Parent Auth methods.
