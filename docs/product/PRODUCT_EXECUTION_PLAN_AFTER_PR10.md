# Product Execution Plan After PR10.x

This is the living execution plan after PR10.8 and PR11.1.

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

## Current Principle

The next product cycle should move from polished acquisition surfaces into account-backed value:

Private Passport Editor V2 -> Publish Runtime Commands -> Public Profile -> Provider Runtime Foundation -> Proofs -> Cosmetics -> Trust -> Launch.

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
- Missing: Better validation, preview, save states, publishability hints, and clearer draft privacy.
- Non-goals: No publish commands, public routes, or providers.
- Exit criteria: Owners can edit a private Passport draft with clear privacy and validation behavior.

### PR14 Publish Runtime Commands

- Goal: Add the command flow that changes a Passport from private draft to publishable/public.
- Why now: Public projection contract exists, but no runtime commands exist.
- Already exists: `publicationPolicy.js` and `canServePublishedPassport`.
- Missing: Consent command, slug claim, publish, unpublish, revoke/stale handling, tests.
- Non-goals: No public `/id/:slug` route yet, no providers.
- Exit criteria: Server-side commands enforce publish policy and update owner-controlled status safely.

### PR15 Public Gaming Passport MVP `/id/:slug`

- Goal: Serve the public allowlisted Passport view.
- Why now: It should come after explicit publish commands.
- Already exists: `buildPublicPassportProjection` and public DTO allowlist.
- Missing: Route/API, lookup by slug, SEO/share metadata, not-found/private behavior.
- Non-goals: No provider OAuth launch, no hidden private fields.
- Exit criteria: A published Passport can be viewed at `/id/:slug` and only exposes allowlisted projection data.

### PR16 Provider Runtime Foundation

- Goal: Build provider-neutral runtime infrastructure before any provider goes live.
- Why now: Domain/schema exists partially, but runtime does not.
- Already exists: Provider IDs, statuses, local linked-provider schema foundation.
- Missing: Token storage, link/unlink/revoke, callback state, sync jobs, audit logs, rate limits, privacy docs.
- Non-goals: No Discord or Riot activation.
- Exit criteria: Provider runtime contracts are ready without a live provider.

### PR17 First Provider Decision + Readiness Pack

- Goal: Choose the first provider path based on approvals and risk.
- Why now: Provider foundation must be paired with a deliberate launch decision.
- Already exists: Riot review docs and provider-neutral planning.
- Missing: Approval-aware decision record, smoke checklist, provider-specific risk review.
- Non-goals: No OAuth launch.
- Exit criteria: The repo has an approved first-provider plan.

### PR18 Discord Pilot OR Riot Readiness

- Goal: Execute the safer first provider step.
- Why now: It converts provider foundation into a controlled pilot/readiness slice.
- Already exists: Provider foundation from PR16 and decision from PR17.
- Missing: Provider-specific implementation or readiness artifacts.
- Non-goals: No Riot runtime without approval.
- Exit criteria: Either Discord pilot is safely live, or Riot readiness is complete while waiting for approval.

### PR19 Riot Provider Runtime

- Goal: Implement Riot runtime after approval.
- Why now: Riot remains gated until approval is explicit.
- Already exists: Riot site verification and review docs.
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
- Missing: Cosmetic model, unlock/equip behavior, theme/border/animation rules.
- Non-goals: No Riot assets, no Riot data behind a paywall.
- Exit criteria: Cosmetics can be equipped without changing proof truth.

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
