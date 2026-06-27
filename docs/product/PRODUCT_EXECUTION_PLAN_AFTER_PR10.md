# Product Execution Plan After PR10.x

This is the living execution plan after PR10.8, PR11.1, PR12, PR13, PR14, PR15, PR16, PR17, PR18, PR21, PR22, RM-23, RM-24, RM-25, RM-26, RM-27, and RM-28.

## Closed Visual/Tooling Line

- PR10.1 Account/Auth theme.
- PR10.2 light baseline and Gaming Passport theme decision.
- PR10.3 route theme audit.
- PR10.4 dynamic generator theme.
- PR10.5 dynamic generator UX priority.
- PR10.6 Chrome visual audit.
- PR10.7 dynamic NameCard + Lineup redesign.
- PR10.8 feature generator card alignment.

PR10.x visual/tooling line is closed. Do not keep patching visual surfaces unless the issue is a critical bug, a comprehension blocker, a conversion blocker, or an evident accessibility problem.

## Completed Account Steps

PR11.1 added Account Dashboard V2 and made favorite/star the canonical saved-name UX. It did not add Supabase saved-name persistence, provider runtime, publish commands, or public profiles.

PR12 adds Supabase-backed saved names, owner-only RLS, local-to-account sync, account-to-local mirror, and account fallback behavior. It does not add providers, publish commands, or public profiles.

PR13 adds Private Gaming Passport Editor V2, private preview, completion checklist, save-state clarity, and private Saved Names highlights in `scene_config.featuredSavedNames`. It does not add publish commands, public profiles, providers, or provider tokens.

PR14 adds owner-controlled Publish Runtime Commands for consent, slug claim/update, publish attempt, and unpublish. It enforces the existing publication policy and keeps publish blocked until a verified linked provider exists. It does not add public `/id/:slug`, public profile serving, providers, or provider tokens.

PR15 adds the Public Gaming Passport MVP at `/id/:slug`. It serves only allowlisted public projection data for policy-valid published Passports and returns safe unavailable behavior for drafts, unpublished, suspended, missing-consent, missing-provider, or nonexistent profiles. It does not add provider runtime, Riot/Discord OAuth, proof sync, token storage, or real Riot data.

PR16 adds provider-neutral runtime foundation: provider contracts, connection intents, callback state contracts, token vault placeholder, blocked sync jobs, audit events, owner-only RLS, repository scaffolding, and a private account status panel. It does not activate Discord, Riot, OAuth, provider APIs, proof sync, real token storage usage, or public provider linking.

PR17 adds the First Provider Decision + Readiness Pack. It found no explicit Riot approval evidence in the repo and selects PR18 as Riot Readiness, not Riot Runtime. It does not activate OAuth, providers, APIs, secrets, routes, migrations, or runtime UI.

PR18 adds the Riot Readiness Pack. It documents Riot approval gates, design-only RSO callback behavior, token-retention requirements, unlink/revoke UX requirements, Riot provider adapter contract review, public projection criteria, manual Riot Portal checklist, future smoke plan, and source guards. It does not activate Riot OAuth, Riot API calls, RSO runtime, callback routes, secrets, env vars, provider activation, routes, migrations, or public Riot data.

PR21 adds Passport Cosmetics Foundation. It creates a TryhardNames-owned local cosmetic catalog, visual-only policy, loadout sanitizer, private account equip/preview panel, Obsidian Pulse as a free foundation preview, and safe public scene rendering through `themeId` and `equippedCosmeticIds`. It does not add a store, payments, checkout, purchased inventory, `/cosmetics`, pets/companions runtime, Riot assets, fake proofs, fake ranks, proof boosts, providers, or Riot/Discord OAuth.

PR22 adds Trust / Safety / Privacy Controls Foundation. It adds public profile report intent, safe report submission RPC, private report storage, report category policy, cosmetic abuse policy, blocked/reserved visual identity terms, takedown/suspension/privacy docs, and moderation runbook. It does not add provider launch expansion, `/cosmetics`, store, payments, pets/companions runtime, admin moderation dashboard, public report list, or email notifications.

RM-23 adds Roadmap Governance + Provider Expansion Plan. It separates GitHub PR # from stable RM-XX milestones, defines GitHub/main/docs as the source of truth, adds the roadmap index and milestone registry, and documents provider expansion as readiness-before-runtime. It does not add runtime, providers, OAuth, `/cosmetics`, store, payments, migrations, env vars, or secrets.

RM-24 adds Launch Readiness. It creates the launch readiness overview, production smoke checklist, observability and monitoring checklist, rollback plan, launch go/no-go matrix, policy final review, RM24 scope doc, roadmap updates, and source-based tests. It does not execute deploy, touch remote services, add runtime, add routes, add migrations, or activate providers/store/payments.

RM-25 adds Provider Expansion Readiness Matrix. It compares Riot, osu!, Steam, Supercell/Clash, Discord, and future console/Epic candidates using readiness-before-runtime criteria, recommends RM-26 osu! Readiness Pack, and keeps all runtime/OAuth/API/callback/token/env/store/payment/DB work out of scope.

RM-26 adds osu! Readiness Pack. It reviews official osu! docs, OAuth/API model, Authorization Code ownership verification, scopes, public proof shape, token storage/retention risk, unlink/revoke, stale/revoked proof behavior, public projection safety, rate limits/backoff, trust/safety/privacy, branding/monetization, and exits `conditional-go` for RM-27. It does not add osu! runtime, OAuth implementation, API calls, callbacks, token storage implementation, env vars/secrets, DB migrations, `/cosmetics`, store/payment, remote services, or provider linking UI.

RM-27 adds osu! Runtime Foundation. It uses the server-side `apps/api` boundary, disabled-by-default runtime gates, OAuth state hash storage, Authorization Code token exchange, `/me` ownership verification, immediate token revoke, no-refresh-token storage, owner-only status/unlink, private `profile_linked` proof foundation, and local migration constraints. It does not launch production, store refresh tokens, add public linking UI, expose tokens/secrets to browser, add store/payments, add `/cosmetics`, deploy, or touch remote services.

RM-28 adds osu! Runtime Smoke / Owner Linking QA as partial-pass evidence. It documents local status/config smoke, owner JWT and Passport preparation, link-intent smoke, manual authorizeUrl authorization, callback expectations, DB verification, token vault non-persistence, unlink/revoke checks, negative cases, and RM-29 handoff. Full callback evidence remains blocked on human osu! authorization. It does not add runtime behavior, public provider UI, refresh-token storage, store/payments, `/cosmetics`, tracker/ranking surfaces, remote Supabase changes, Vercel changes, deploy, or production launch.

## Current Principle

The next product cycle should move from polished acquisition surfaces into account-backed value:

Riot Readiness -> Cosmetics Foundation -> Trust/Safety Foundation -> RM-23 Governance -> RM-24 Launch Readiness -> RM-25 Provider Expansion Readiness Matrix -> RM-26 osu! Readiness -> RM-27 osu! Runtime Foundation -> RM-28 osu! Runtime Smoke / Owner Linking QA -> RM-29 osu! Smoke Blocker Fixes.

GitHub/main/docs are the source of truth. GitHub PR numbers are automatic GitHub records; RM-XX is the stable roadmap milestone identifier. Chat is not a source of truth.

## Corrected Roadmap

### PR11.0 Roadmap Reconciliation After PR10.8 and PR11.1

- Goal: Reconcile roadmap docs with actual `main`.
- Why now: Some docs still described the repo as pre-PR10.x or before Account Dashboard V2.
- Already exists: PR10.x visual/tooling work, Account Dashboard V2, publish policy contract, public projection contract, local saved names.
- Missing: Corrected status matrix, execution plan, and decision log.
- Non-goals: No runtime UI, route, provider, OAuth, database, migration, or RLS work.
- Exit criteria: Docs and source-based docs tests describe actual repo state.

### PR12 Saved Names Persistence + Account State Contract

- Goal: Persist saved names under the Parent Auth account.
- Why now: PR11.1 defines the UX and makes the state worth saving.
- Already exists: Local/legacy favorites bridge and favorite-first UI.
- Implemented by PR12: Supabase `saved_names`, owner RLS, sync strategy, local fallback, repository, docs, and tests.
- Missing: Optional future cleanup of PocketBase legacy fallback if no remaining surface needs it.
- Non-goals: No provider OAuth, public profiles, or proof sync.
- Exit criteria: Authenticated users can keep saved names across sessions/devices with owner-only access.

### PR13 Private Gaming Passport Editor V2

- Goal: Improve the private draft editor.
- Why now: Account dashboard and saved names provide enough structure for better editing.
- Already exists: Private draft repository and `/account` editing.
- Implemented by PR13: Modular private editor, private preview, completion checklist, validation/save states, and private Saved Names highlights.
- Missing: Publish commands, public profile serving, providers, and proof sync.
- Non-goals: No publish commands, public routes, or providers.
- Exit criteria: Owners can edit a private Passport draft with clear privacy and validation behavior.

### PR14 Publish Runtime Commands

- Goal: Add the command flow that changes a Passport from private draft to publishable/public.
- Why now: Public projection contract exists, but no runtime commands exist.
- Already exists: `publicationPolicy.js` and `canServePublishedPassport`.
- Implemented by PR14: Consent command, slug claim/update, publish attempt, unpublish, policy-blocked command results, owner-only SQL RPCs, repository functions, private `/account` controls, tests, and docs.
- Missing: Public profile serving, provider runtime, token storage, and verified provider sync.
- Non-goals: No public `/id/:slug` route yet, no providers.
- Exit criteria: Server-side commands enforce publish policy and update owner-controlled status safely.

### PR15 Public Gaming Passport MVP `/id/:slug`

- Goal: Serve the public allowlisted Passport view.
- Why now: It is next after explicit publish commands.
- Already exists: `buildPublicPassportProjection` and public DTO allowlist.
- Implemented by PR15: Public `/id/:slug` route, public projection RPC, public repository, public profile page, SEO/share metadata, and not-found/private-safe behavior.
- Missing: Provider runtime, verified proof sync runtime, trust/safety controls, and launch readiness.
- Non-goals: No provider OAuth launch, no hidden private fields.
- Exit criteria: A published Passport can be viewed at `/id/:slug` and only exposes allowlisted projection data.

### PR16 Provider Runtime Foundation

- Goal: Build provider-neutral runtime infrastructure before any provider goes live.
- Why now: Domain/schema exists partially, but runtime does not.
- Already exists: Provider IDs, statuses, local linked-provider schema foundation.
- Implemented by PR16: Provider runtime domain contracts, connection intent/callback state scaffolding, token vault placeholder with no client grants, blocked sync job model, provider audit events, owner-only RLS, repository scaffolding, source/domain/DB tests, and read-only account panel.
- Missing: First-provider decision, provider-specific adapter, real callback handling, secure token encryption/retention, external sync worker, and provider launch operations.
- Non-goals: No Discord or Riot activation.
- Exit criteria: Provider runtime contracts are ready without a live provider.

### PR17 First Provider Decision + Readiness Pack

- Goal: Choose the first provider path based on approvals and risk.
- Why now: Provider foundation must be paired with a deliberate launch decision.
- Already exists: Riot review docs and provider-neutral planning.
- Implemented by PR17: approval-aware decision record, provider readiness checklist, PR18 Riot Readiness scope, smoke checklist, provider-specific risk review, and docs/source tests.
- Missing: Explicit Riot approval and any provider runtime activation.
- Non-goals: No OAuth launch.
- Exit criteria: PR18 was selected as Riot Readiness because Riot approval is not evidenced in the repo.

### PR18 Riot Readiness Pack

- Goal: Prepare Riot approval-safe readiness artifacts without runtime activation.
- Why now: PR17 selected Riot Readiness because Riot runtime is still blocked by missing explicit approval evidence.
- Already exists: Provider foundation from PR16 and decision from PR17.
- Implemented by PR18: Riot readiness pack, RSO callback design doc, token retention/encryption plan, revoke/unlink UX requirements, Riot adapter contract review, public projection review criteria, manual Riot Portal checklist, future smoke plan, and source/docs guard tests.
- Missing: Explicit Riot approval and any provider runtime activation.
- Non-goals: No Riot OAuth, Riot API calls, RSO redirect, callback route, secrets, env vars, provider activation, public Riot data, or proof sync.
- Exit criteria: Riot readiness is complete while runtime remains blocked until approval.

### PR19 Riot Provider Runtime

- Goal: Implement Riot runtime after approval.
- Why now: Riot remains gated until approval is explicit.
- Already exists: Riot site verification, review docs, Provider Runtime Foundation, First Provider Decision, and Riot Readiness Pack.
- Missing: RSO, callback, server-side tokens, RiotProvider, unlink/revoke, privacy copy.
- Non-goals: No Riot as Parent Auth, no Riot data paywall, no tracker behavior.
- Exit criteria: Riot account linking works under approved scopes and can be revoked.

### PR20 League of Legends Adapter

- Goal: Normalize League of Legends proofs through RiotProvider.
- Why now: LoL proof sync depends on Riot runtime.
- Already exists: GameAdapter concept and RiotProvider product boundary.
- Missing: LoL proof mapping, source timestamp, stale/revoked handling.
- Non-goals: No OP.GG clone, custom MMR/ELO, match-history dump, or live-game advice.
- Exit criteria: Approved LoL proof fields can be synced and displayed safely.

### PR21 Cosmetics Foundation

- Goal: Add TryhardNames-owned visual identity upgrades.
- Why now: Cosmetics become useful once private/public profile surfaces exist.
- Already exists: Product boundary that cosmetics cannot monetize Riot data.
- Implemented by PR21: local cosmetic catalog, cosmetic policy, loadout sanitizer, private account equip/preview panel, Obsidian Pulse free foundation preview, safe public scene projection, docs, and tests.
- Missing: future `/cosmetics` showcase, hardened unlock entitlement system, optional inventory/payment model, pets/companions runtime, and trust/safety review for broader cosmetic distribution.
- Non-goals: No store, checkout, payments, purchased inventory, Riot assets, Riot data behind a paywall, fake proofs, fake ranks, proof boosts, or provider runtime.
- Exit criteria: Cosmetics can be equipped without changing proof truth, provider truth, or public projection safety.

### PR22 Trust / Safety / Privacy Controls

- Goal: Prepare public identity surfaces for abuse and privacy cases.
- Why now: Broad public profiles need operational controls.
- Already exists: Privacy and Riot safety boundaries, public `/id/:slug`, and Passport Cosmetics Foundation.
- Implemented by PR22: public profile report action, `submit_public_profile_report`, private report storage, report category policy, cosmetic abuse policy, blocked visual identity terms, takedown/suspension/privacy docs, moderation runbook, source/domain/DB tests.
- Missing: full moderation dashboard, report queue operations, email notifications, rate limiting, and operational takedown tooling.
- Non-goals: No provider launch expansion, `/cosmetics`, store, payments, pets/companions runtime, admin dashboard, public report list, or email notification service.
- Exit criteria: Public profile abuse and privacy paths are documented, testable, and do not weaken public projection safety.

### RM-23 Roadmap Governance + Provider Expansion Plan

- Goal: Establish stable roadmap governance and provider expansion planning.
- Why now: GitHub PR numbers no longer match product phase labels, and provider expansion needs readiness-before-runtime rules before launch readiness.
- Already exists: RM-14 through RM-22 product history, merged GitHub PRs, roadmap docs, provider readiness docs, Riot readiness docs, cosmetics docs, trust/safety docs.
- Implemented by RM-23: Roadmap governance, RM index, milestone registry, provider expansion roadmap, and source-based docs tests.
- Missing: RM-25 provider expansion matrix, RM-26 osu! readiness, and RM-27 conditional runtime.
- Non-goals: No runtime, routes, providers, OAuth, store/payments, migrations, env vars, secrets, or remote service changes.
- Exit criteria: Docs clearly distinguish GH PR # from RM-XX and define provider expansion readiness policy.

### RM-24 Launch Readiness

- Goal: Prepare for a controlled public launch.
- Why now: Launch should follow working product, provider/privacy controls, and rollback paths.
- Already exists: Validation command discipline, roadmap gates, public profile/report controls, cosmetics boundaries, and provider readiness constraints.
- Implemented by RM-24: Launch readiness overview, production smoke checklist, observability and monitoring checklist, rollback plan, launch go/no-go matrix, policy final review, RM24 scope doc, roadmap updates, and docs/source tests.
- Missing: Actual launch execution, production smoke evidence, owner go/no-go acceptance, external observability integrations, and any future portal metadata sync required by the owner.
- Non-goals: No deploy execution, runtime features, routes, providers, OAuth, `/cosmetics`, store/payments, migrations, env vars, secrets, or remote service changes.
- Exit criteria: Launch checklist is auditable and risks are explicitly accepted or mitigated before any later launch execution.

### RM-25 Provider Expansion Readiness Matrix

- Goal: Compare future linked-provider candidates with the same readiness-before-runtime scorecard.
- Why now: Riot remains approval-gated, and TryhardNames needs an auditable provider expansion path.
- Already exists: Provider Runtime Foundation, Riot Readiness Pack, trust/safety controls, public projection boundaries, and RM-23 provider expansion planning.
- Implemented by RM-25: provider expansion readiness matrix, weighted candidate scorecard, provider candidate notes, RM25 scope doc, roadmap updates, and source guards.
- Missing: RM-26 osu! provider-specific readiness pack and any future runtime approval.
- Non-goals: No provider runtime, OAuth, APIs, callbacks, tokens, env vars, `/cosmetics`, store/payments, migrations, remote services, or deploy execution.
- Exit criteria: Candidate matrix identifies osu! as the safest next readiness path without activating runtime.

### RM-26 osu! Readiness Pack

- Goal: Review osu! as the recommended first provider expansion readiness candidate.
- Why now: osu! can be evaluated independently from Riot approval, but runtime must not begin before official docs review.
- Already exists: Provider expansion roadmap, readiness policy, RM-25 matrix, provider-neutral runtime foundation, public projection guards, Riot approval gates, and trust/safety controls.
- Implemented by RM-26: official osu! docs review, OAuth/API model review, ownership verification decision, minimal scope review, public proof model, token/storage risk review, unlink/revoke expectations, stale/revoked proof behavior, trust/safety/privacy review, branding/monetization review, roadmap updates, and source/docs tests.
- Missing: RM-27 runtime implementation, exact registered callback URL, secure token exchange/storage runtime, real unlink/revoke execution, proof refresh sync, and production provider linking UI.
- Non-goals: No osu! OAuth/API/runtime, tokens, env vars/secrets, callbacks, provider linking UI, DB migrations, remote services, store/payment, `/cosmetics`, Riot/Discord/Steam/Supercell runtime, or deploy execution.
- Exit criteria: osu! readiness exits `conditional-go` for RM-27 with explicit runtime conditions.

### RM-27 osu! Runtime Foundation

- Goal: Implement a disabled-by-default server-side osu! runtime foundation only within the accepted RM-26 conditions.
- Why now: RM-26 exits `conditional-go`, and the repo has an `apps/api` server boundary that can hold client secret, service role, token exchange, `/me`, and revoke outside the browser.
- Already exists: Provider Runtime Foundation, RM-26 readiness output, public projection guards, and trust/safety controls.
- Implemented by RM-27: provider id `osu`, server env schema, `OSU_PROVIDER_ENABLED=false` default, API status/link-intent/callback/unlink endpoints, CSRF-safe state hash, server-side token exchange, `/me` ownership verification, immediate revoke, no-refresh-token storage, private `profile_linked` proof, owner-only unlink, migration constraints, docs, API tests, SEO/source tests, and DB tests.
- Missing: configured staging env, registered osu! callback, end-to-end smoke, owner UX to initiate link, public proof promotion policy, refresh-token storage if ever approved, and production go/no-go.
- Non-goals: No production launch, no public provider linking UI, no browser tokens/secrets, no refresh-token storage, no provider polling/sync, no rank/PP/score/match-history/live tracker, no `/cosmetics`, no store/payments, no remote service changes, no deploy.
- Exit criteria: Foundation remains gated, server-side only, owner-controlled, revocable, no-refresh-token, and public-projection-safe.

### RM-28 osu! Runtime Smoke / Owner Linking QA

- Goal: Verify the RM-27 foundation with configured local/staging env before any public launch.
- Why now: Runtime code exists but is disabled by default and needs operational proof.
- Already exists: RM-27 server-side foundation.
- Implemented by RM-28: smoke QA doc, owner-linking runbook, results doc, RM28 scope doc, API/web source guards, roadmap updates, status/link-intent smoke criteria, callback/DB/unlink/token vault verification criteria, negative case checklist, and RM-29 handoff.
- Missing: human-authorized osu! callback evidence, DB rows created by the real callback, unlink/revoke after a real callback, and public projection non-leakage evidence after revoke.
- Non-goals: No production launch, public provider UI, osu! Parent Auth, refresh-token storage, tracker/ranking surfaces, `/cosmetics`, store/payments, remote Supabase changes, Vercel changes, or deploy.
- Exit criteria: Partial-pass is documented without overclaiming. Full pass requires owner-only smoke with no token leakage, revoke/unlink behavior verified, and public projection clean after human authorization.

### RM-29 osu! Smoke Blocker Fixes

- Goal: Complete the blocked human-authorized smoke path and close any local JWT, browser, callback, or runbook blockers before UI hardening.
- Why now: RM-28 validates local status and link-intent but cannot complete osu! consent without a human owner.
- Already exists: RM-27 runtime foundation and RM-28 partial smoke QA.
- Missing: real callback evidence, token vault evidence after callback, unlink/revoke evidence after callback, and revoked proof public projection evidence.
- Non-goals: No production launch, public proof promotion, refresh-token storage, tracker/ranking surfaces, store/payments, or `/cosmetics`.
- Exit criteria: Either full smoke passes and RM-29 can hand off to owner-linking UI hardening, or any security/runtime defect is captured as a security fix milestone.

### Legacy PR23 Label

The old product label `PR23 Launch Readiness` is deprecated. Use RM-24 Launch Readiness.
