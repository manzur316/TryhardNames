# TryhardNames Current State And Roadmap

## Current Status After RM-26

This supersedes the previous `Current Status After PR22` snapshot, the `Current Status After RM-24` launch readiness snapshot, and the `Current Status After RM-25` provider expansion matrix snapshot.

This document reflects main after PR22, RM-23 roadmap governance, RM-24 Launch Readiness, RM-25 Provider Expansion Readiness Matrix, and RM-26 osu! Readiness Pack. It follows PR10.8, `fix(generator): align feature generator cards`, PR11.1, `feat(account): add dashboard v2 and unify saved names`, PR12, `feat(account): persist saved names`, PR13, `feat(account): improve private passport editor`, PR14, `feat(passport): add publish runtime commands`, PR15, `feat(passport): add public gaming passport profile`, PR16, `feat(passport): add provider runtime foundation`, PR17, `docs(provider): add first provider decision readiness pack`, PR18, `docs(riot): add readiness pack`, PR21, `feat(passport): add cosmetics foundation`, PR22, `feat(trust): add public profile safety controls`, RM-23, Roadmap Governance + Provider Expansion Plan, RM-24, Launch Readiness, RM-25, Provider Expansion Readiness Matrix, and RM-26, osu! Readiness Pack.

TryhardNames has public generators, a public `/gaming-passport` landing page, Parent Auth for TryhardNames accounts, a protected `/account` Account Dashboard V2, Supabase-backed saved names for authenticated users, local saved-name fallback for signed-out users, Private Gaming Passport Editor V2 for owner-only draft editing, owner-controlled Publish Runtime Commands for consent, slug claim, publish attempt, and unpublish, a public `/id/:slug` Gaming Passport MVP backed by allowlisted projection data, provider-neutral runtime foundation contracts/schema/repository scaffolding, a first-provider decision record, a Riot Readiness Pack, Passport Cosmetics Foundation, Trust / Safety / Privacy Controls Foundation, RM-24 Launch Readiness, RM-25 Provider Expansion Readiness Matrix, and RM-26 osu! Readiness Pack.

Riot integration is not live. Discord integration is not live. No public Riot data is live. The public `/id/:slug` route serves only policy-valid published Passports and does not activate provider runtime. No Riot OAuth button exists. No Riot API calls exist. No production Riot key exists in the repo or runtime. PR18 implements Riot readiness only. Riot Runtime remains blocked until explicit approval exists.

Gaming Passport remains a private-first, verifiable, shareable gaming resume. It is not a tracker, OP.GG alternative, custom MMR/ELO product, match-history dump, live-game advantage tool, hidden-player de-anonymization surface, or alternative ranking system.

## PR History Through PR22

The repo history is summarized through PR22.

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
| PR17 | `docs(provider): add first provider decision readiness pack` | Merged | Adds the first-provider decision record, provider readiness checklist, and PR18 Riot Readiness scope. | Documentation/tests only. PR18 is selected as Riot Readiness because Riot approval is not evidenced. | No OAuth launch, provider runtime activation, API calls, secrets, env vars, routes, migrations, or UI changes. |
| PR18 | `docs(riot): add readiness pack` | Merged | Adds Riot readiness pack, design-only RSO callback plan, token-retention requirements, adapter contract review, public projection review criteria, portal checklist, and source guards. | Documentation/tests only. Riot Runtime remains blocked. | No Riot OAuth, RSO redirect, callback route, Riot API calls, client secret, production key, env vars, provider activation, adapters, proof sync, public Riot data, routes, migrations, or remote service changes. |
| PR21 | `feat(passport): add cosmetics foundation` | Merged | Adds Passport Cosmetics Foundation, local cosmetic catalog, visual-only policy, loadout sanitizer, private account panel, Obsidian Pulse foundation preview, and safe public scene rendering. | Owner drafts can equip TryhardNames-owned visual cosmetics through `scene_config`; public profiles render only allowlisted scene ids. | No store, payments, checkout, purchased inventory, `/cosmetics` route, pets/companions runtime, Riot assets, fake proofs, fake ranks, provider runtime, or Riot/Discord OAuth. |
| PR22 | `feat(trust): add public profile safety controls` | Merged | Adds Trust / Safety / Privacy Controls Foundation, public profile report intent, safe report RPC, private report storage, cosmetic abuse policy, blocked visual identity terms, and moderation runbook. | Valid public `/id/:slug` profiles can be reported without exposing private report state or weakening public projection safety. | No Riot/Discord runtime, provider launch expansion, `/cosmetics`, store, payments, inventory purchases, pets/companions runtime, admin dashboard, public report list, or email notification service. |

## Roadmap Governance Convention

GitHub/main/docs are the source of truth. GitHub PR numbers are automatic GitHub records; RM-XX is the stable product roadmap milestone identifier versioned in `docs/product`.

The chat is not a source of truth.

Examples from the repo:

- GitHub PR #23 implemented RM-14 Publish Runtime Commands.
- GitHub PR #24 implemented RM-15 Public Gaming Passport MVP.
- GitHub PR #25 implemented RM-16 Provider Runtime Foundation.
- GitHub PR #26 implemented RM-17 First Provider Decision Readiness.
- GitHub PR #27 implemented RM-18 Riot Readiness Pack.
- GitHub PR #28 implemented RM-21 Passport Cosmetics Foundation.
- GitHub PR #29 implemented RM-22 Trust / Safety / Privacy Controls.

RM-23 adds roadmap governance and provider expansion planning. RM-24 adds launch readiness docs, smoke checklist, observability checklist, rollback plan, go/no-go matrix, and policy final review. The legacy product label "PR23 Launch Readiness" is deprecated and replaced by RM-24 Launch Readiness.

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
- Riot Readiness Pack exists.
- RSO callback design exists as design-only documentation.
- Riot provider adapter contract review exists as design-only documentation.
- Passport Cosmetics Foundation exists.
- Local TryhardNames-owned cosmetic catalog exists.
- Obsidian Pulse is equipable as a free foundation preview.
- Private account Passport Cosmetics panel exists.
- Public `/id/:slug` scene projection allows only safe `themeId` and `equippedCosmeticIds`.
- Trust / Safety / Privacy Controls Foundation exists.
- Public profile report intent exists on valid `/id/:slug` profiles.
- `public_profile_reports` and `submit_public_profile_report` exist for safe local report submission.
- Cosmetic abuse, blocked visual identity terms, impersonation, takedown/suspension, and privacy request policy exists.
- Launch Readiness Pack exists with production smoke, observability, rollback, go/no-go, and policy final review docs.
- RM-24 docs/source tests verify launch readiness does not activate provider runtime, OAuth, `/cosmetics`, store, payments, DB migrations, or remote service changes.
- RM-25 Provider Expansion Readiness Matrix exists with provider candidate scorecard, candidate notes, RM25 scope doc, and docs/source tests.
- RM-25 recommends RM-26 osu! Readiness Pack as the next provider-specific readiness milestone.
- RM-26 osu! Readiness Pack exists with official docs review, OAuth/API model, ownership verification decision, minimal scope review, public proof model, token/revoke/stale-proof review, rate limits/backoff, trust/safety/privacy review, branding/monetization review, and RM-27 `conditional-go`.
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
- Future `/cosmetics` showcase route.
- Cosmetics store, payments, checkout, purchased inventory, and companions/3D runtime.
- Full moderation/admin dashboard and report queue tooling.
- Launch execution/deploy.
- RM-27 osu! Runtime Foundation.
- osu! OAuth/API/runtime.
- osu! callback route.

## Gated

- Riot runtime remains gated by Riot Developer Portal approval and next steps. PR17 found no explicit Riot approval evidence in the repo.
- PR18 readiness does not change the approval gate. PR19 is the earliest possible Riot runtime PR, only if approval exists.
- Provider activation is gated by first-provider decision, provider-specific implementation, secure token handling, unlink/revoke operations, sync runtime, rate limits, audit, and privacy controls.
- Public profile expansion remains gated by provider runtime, verified proof sync, trust/safety, and privacy controls.
- Future cosmetics monetization, inventory, and companion/3D work are gated by product review, trust/safety, payment boundaries, and Riot/data monetization boundaries.
- Broad launch execution is gated by actual production smoke, owner go/no-go acceptance, observability review, rollback readiness, and policy final review.

## Corrected Roadmap Order

| RM | Scope | Notes |
| --- | --- | --- |
| RM-23 | Roadmap Governance + Provider Expansion Plan | Docs/tests-only. Defines GH PR # versus RM-XX, source-of-truth rules, roadmap index, milestone registry, and provider expansion readiness policy. |
| RM-24 | Launch Readiness | Implemented as docs/tests-only readiness pack: production smoke, observability, rollback, policy review, privacy review, and operational go/no-go checklist. |
| RM-25 | Provider Expansion Readiness Matrix | Implemented as docs/tests-only decision support. Compares Riot, osu!, Steam, Supercell/Clash, Discord, and future providers using readiness-before-runtime criteria. |
| RM-26 | osu! Readiness Pack | This PR. Docs/tests-only official osu! readiness review; no osu! runtime, OAuth, API calls, callbacks, tokens, env vars, secrets, DB migrations, `/cosmetics`, store/payment, or remote service changes. |
| RM-27 | osu! Runtime Foundation | Conditional next runtime only if RM-26 accepted conditions are implemented safely. |
| RM-19 | Riot Provider Runtime | Still gated by explicit Riot approval. Implements Riot OAuth/runtime only after approval and provider foundation. |
| RM-20 | League of Legends Adapter | Still gated by approved Riot runtime. Normalizes LoL proofs under RiotProvider after Riot runtime is approved and implemented. |

Legacy product labels such as "PR23 Launch Readiness" are deprecated. Use RM-24 Launch Readiness.

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
