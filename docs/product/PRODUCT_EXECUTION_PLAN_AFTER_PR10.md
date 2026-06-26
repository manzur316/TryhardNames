# Product Execution Plan After PR10.x

This is the living execution plan after PR10.8, PR11.1, PR12, PR13, PR14, PR15, PR16, PR17, PR18, and PR21.

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

## Current Principle

The next product cycle should move from polished acquisition surfaces into account-backed value:

Riot Readiness -> Cosmetics Foundation -> approved provider runtime -> Proofs -> Trust -> Launch.

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
- Already exists: Privacy and Riot safety boundaries.
- Missing: Reports, takedown, suspension, visibility controls, moderation runbook.
- Non-goals: No provider launch expansion.
- Exit criteria: Public profile abuse and privacy paths are documented and testable.

### PR23 Launch Readiness

- Goal: Prepare for a controlled public launch.
- Why now: Launch should follow working product, provider/privacy controls, and rollback paths.
- Already exists: Validation command discipline and roadmap gates.
- Missing: Production smoke, observability, rollback, policy final review, portal metadata sync.
- Non-goals: No new product scope.
- Exit criteria: Launch checklist is complete and risks are explicitly accepted or mitigated.
