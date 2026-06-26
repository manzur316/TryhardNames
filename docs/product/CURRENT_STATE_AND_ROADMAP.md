# TryhardNames Current State And Roadmap

## Current Status After PR17

This document reflects the PR17 branch after PR10.8, `fix(generator): align feature generator cards`, PR11.1, `feat(account): add dashboard v2 and unify saved names`, PR12, `feat(account): persist saved names`, PR13, `feat(account): improve private passport editor`, PR14, `feat(passport): add publish runtime commands`, PR15, `feat(passport): add public gaming passport profile`, PR16, `feat(passport): add provider runtime foundation`, and PR17, `docs(provider): add first provider decision readiness pack`.

TryhardNames has public generators, a public `/gaming-passport` landing page, Parent Auth for TryhardNames accounts, a protected `/account` Account Dashboard V2, Supabase-backed saved names for authenticated users, local saved-name fallback for signed-out users, Private Gaming Passport Editor V2 for owner-only draft editing, owner-controlled Publish Runtime Commands for consent, slug claim, publish attempt, and unpublish, a public `/id/:slug` Gaming Passport MVP backed by allowlisted projection data, provider-neutral runtime foundation contracts/schema/repository scaffolding, and a first-provider decision record.

Riot integration is not live. Discord integration is not live. No public Riot data is live. The public `/id/:slug` route serves only policy-valid published Passports and does not activate provider runtime. No Riot OAuth button exists. No Riot API calls exist. No production Riot key exists in the repo or runtime. PR17 found no explicit Riot approval evidence in the repo, so PR18 is selected as Riot Readiness, not Riot Runtime.

Gaming Passport remains a private-first, verifiable, shareable gaming resume. It is not a tracker, OP.GG alternative, custom MMR/ELO product, match-history dump, live-game advantage tool, hidden-player de-anonymization surface, or alternative ranking system.

## PR History Through PR17

The repo history is summarized through PR17.

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
| PR13 | `feat(account): improve private passport editor` | Merged | Adds Private Gaming Passport Editor V2, private preview, completion checklist, save-state clarity, and private Saved Names highlights through `scene_config.featuredSavedNames`. | Owners can shape a private draft more clearly inside `/account` without publishing or linking providers. | No publish commands, slug claim, public `/id/:slug`, Riot/Discord OAuth, providers, token storage, or remote service config. |
| PR14 | `feat(passport): add publish runtime commands` | Merged | Added owner-controlled publication consent, slug claim/update, publish attempt, unpublish, command repository, private `/account` controls, and SQL RPC command functions. | Publish Runtime Commands exist and enforce the existing publication policy. Publish remains blocked until a verified linked provider exists. | No public `/id/:slug`, public profile route/API, provider runtime, Riot/Discord OAuth, provider token storage, secrets, or remote Supabase changes. |
| PR15 | `feat(passport): add public gaming passport profile` | Merged | Added public `/id/:slug`, public projection RPC, public profile UI, not-found/private-safe behavior, SEO/share metadata, tests, and docs. | Policy-valid published Passports can be served as allowlisted public projections. | No provider runtime, Riot/Discord OAuth, token storage, proof sync runtime, real Riot data, or private field exposure. |
| PR16 | `feat(passport): add provider runtime foundation` | Merged | Added provider runtime contracts, connection intent/callback/sync/audit scaffolding, token vault placeholder, owner-only RLS, repository functions, and a private `/account` foundation panel. | Provider Runtime Foundation exists without activating any provider. | No Discord/Riot OAuth, provider API calls, provider-specific adapter runtime, real token storage usage, proof sync runtime, or public provider linking UI. |
| PR17 | `docs(provider): add first provider decision readiness pack` | In progress | Adds the first-provider decision record, provider readiness checklist, and PR18 Riot Readiness scope. | Documentation/tests only. PR18 is selected as Riot Readiness because Riot approval is not evidenced. | No OAuth launch, provider runtime activation, API calls, secrets, env vars, routes, migrations, or UI changes. |

## Live Surfaces

- `/` - public home page and generator entry point.
- Public dynamic generator routes such as `/valorant/sweaty`, `/general/best`, `/minecraft/pvp`, and related programmatic pages.
- Public feature generator routes such as `/gamer-names/pro`, `/gamer-names/cool`, `/roblox-names/cool`, and `/roblox-names/tryhard`.
- `/gaming-passport` - public Gaming Passport landing page for users and Riot review.
- `/id/:slug` - public Gaming Passport MVP for published, policy-compliant Passports.
- `/sign-in`, `/sign-up`, `/auth/callback` - Parent Auth flow. Google Auth is Parent Auth only.
- `/account` - protected Account Dashboard V2 with private draft and saved-name guidance.
- `/privacy-policy` and `/terms-of-service` - public legal surfaces.
- `/sitemap.xml` - public sitemap.

Public `/id/:slug` exists after PR15 and returns safe unavailable behavior for missing, private, draft, unpublished, suspended, or policy-blocked Passports.

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
- Publish Runtime Commands exist for consent, slug claim/update, publish attempt, and unpublish.
- Private `/account` publish controls show policy requirements and do not link to public profiles.
- Public Gaming Passport MVP `/id/:slug` exists.
- Public projection serving exists through `get_public_gaming_passport_projection`.
- Public profile UI uses allowlisted projection data only.
- Provider Runtime Foundation contracts and scaffolding exist.
- Private `/account` Provider Runtime Foundation panel exists and is read-only.
- First Provider Decision + Readiness Pack exists.
- PR18 is selected as Riot Readiness.
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
- Private Gaming Passport Editor V2 is implemented as an owner-only draft editing surface.
- Publish Runtime Commands are implemented as owner-controlled, policy-enforced commands.
- Public Profile `/id/:slug` is implemented as an MVP public projection surface.
- Provider-neutral domain/schema is partial-runtime. Constants, statuses, local tables, provider runtime contracts, repository scaffolding, intent/callback/sync/audit tables, and private account status UI exist, but no provider is live.
- Linked Provider domain is partial-runtime and Linked Provider schema is partial-schema. Runtime activation, provider-specific adapters, and real callback/token handling are pending.
- Verified Proof domain is partial-contract and Verified Proof schema is partial-schema. Sync runtime is pending.
- Publish Policy is implemented as a domain contract and enforced by PR14 command runtime.
- Public Projection is implemented as a contract and served by PR15 through an allowlisted RPC.

## Not Implemented

- Riot OAuth / Riot Sign On.
- Discord OAuth.
- Riot API calls.
- Discord API calls.
- Real provider token storage usage.
- Provider-specific unlink/revoke runtime.
- Provider sync jobs that call external providers.
- League of Legends adapter runtime.
- Cosmetics.
- Trust/safety moderation controls.
- Launch readiness checklist execution.

## Gated

- Riot runtime remains gated by Riot Developer Portal approval and next steps. PR17 found no explicit Riot approval evidence in the repo.
- Provider activation is gated by first-provider decision, provider-specific implementation, secure token handling, unlink/revoke operations, sync runtime, rate limits, audit, and privacy controls.
- Public profile expansion remains gated by provider runtime, verified proof sync, trust/safety, and privacy controls.
- Cosmetics are gated by product review and Riot/data monetization boundaries.
- Broad launch is gated by trust/safety, privacy review, observability, and rollback readiness.

## Corrected Roadmap Order

| Proposed PR | Scope | Notes |
| --- | --- | --- |
| PR11.0 | Roadmap Reconciliation After PR10.8 and PR11.1 | Docs-only reconciliation of actual repo state, matrix, execution plan, and decision log. |
| PR14 | Publish Runtime Commands | Adds consent, slug, publish, unpublish, and status transitions. |
| PR16 | Provider Runtime Foundation | Adds provider runtime contracts, token vault placeholder, unlink/revoke command contracts, sync scaffolding, and audit boundaries without activating a specific provider. |
| PR17 | First Provider Decision + Readiness Pack | Selects PR18 as Riot Readiness based on repo evidence and risk. |
| PR18 | Riot Readiness Pack | Prepares Riot approval-safe design and checklists without Riot OAuth, Riot API calls, RSO runtime, secrets, or provider activation. |
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
