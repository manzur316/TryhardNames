# Gaming Passport Master Product Roadmap

## Product North Star

Gaming Passport is a private-first, verifiable, shareable gamer identity layer built on top of TryhardNames public tools.

The final product should combine visual identity, saved-name utility, verified provider ownership, verified proofs, user-controlled publishing, safe public projection, and TryhardNames-owned cosmetics. It must not become a tracker, OP.GG alternative, alternative ranking system, custom MMR/ELO product, live-game advice surface, hidden-player de-anonymization tool, or match-history dump.

## Strategic Product Model

The product chain is:

Public generators -> Parent Auth -> Private Draft -> Saved Names -> Linked Providers -> Verified Proofs -> Publish Runtime Commands -> Public Projection -> Public Profile -> Cosmetics.

- Public generators remain free acquisition and utility surfaces.
- Parent Auth is the TryhardNames account entry point.
- Private Draft is the owner-only editable Passport state.
- Saved Names are the account utility bridge from public generators into the private account surface.
- Linked Providers are external accounts connected after sign-in.
- Verified Proofs are normalized, source-backed assertions from providers or game adapters.
- Publish Policy contract decides if an owner can publish.
- Publish Runtime Commands are implemented and handle consent, status, slug, publish attempt, and unpublish transitions.
- Public Projection contract exposes only allowlisted fields.
- Public Profile `/id/:slug` is implemented as an MVP allowlisted projection surface.
- Cosmetics are TryhardNames-owned themes, borders, and animations.

## Current State After PR21

- Repo security and reproducibility are established.
- Gaming Passport domain foundation exists.
- Local schema foundation exists.
- Parent Auth and private draft management exist.
- Account Dashboard V2 exists.
- Favorite/star is the canonical saved-name UX.
- Saved Names Supabase persistence exists with owner-only RLS and local fallback.
- Private Gaming Passport Editor V2 exists inside `/account`.
- Private Saved Names highlights exist as `scene_config.featuredSavedNames`.
- Riot site verification exists.
- `/gaming-passport` public landing exists.
- Riot review submission pack and policy compliance audit exist.
- PR10.x closed the theme, visual surface, tool audit, dynamic NameCard/lineup, and feature generator card alignment line.
- Publish Policy contract is already implemented in domain code.
- Public Projection contract is already implemented in domain code.
- Provider-neutral runtime foundation is partial-runtime: contracts, local schema/RLS, repository scaffolding, audit events, blocked sync jobs, and token vault placeholder exist.
- Publish Runtime Commands are implemented as owner-controlled, policy-enforced commands.
- Public `/id/:slug` profiles are implemented as an MVP allowlisted projection surface.
- First Provider Decision + Readiness Pack is implemented.
- Riot Readiness Pack is implemented as docs/tests-only readiness work.
- Passport Cosmetics Foundation is implemented with a local TryhardNames-owned catalog, private account equip flow, Obsidian Pulse free foundation preview, safe scene projection, and safe public visual rendering.
- Riot Runtime remains blocked because explicit Riot approval is not evidenced in the repo.

Riot integration is not live. Discord integration is not live. No Riot API calls are active. No Discord API calls are active. No production Riot key exists in the repo. Public `/id/:slug` profiles do not expose provider private fields, token fields, raw metadata, or owner identifiers.

## Main Roadmap Blocks

### PR11.0 - Roadmap Reconciliation After PR10.8 and PR11.1

- Reconcile roadmap docs with actual repo state.
- Mark PR10.x visual/tooling line as closed.
- Mark Account Dashboard V2 as implemented after PR11.1.
- Add status matrix, execution plan, and decision log.
- No runtime changes.

### PR12 - Saved Names Persistence + Account State Contract

- Define and implement Supabase-backed saved names.
- Add owner RLS and account sync.
- Preserve local fallback/migration boundaries.
- Do not add providers.

### PR13 - Private Gaming Passport Editor V2

- Improve private draft editor clarity.
- Keep draft private by default.
- Add validation and private preview UX.
- Do not publish or link providers.

### PR14 - Publish Runtime Commands

- Implemented by PR14: publishability command flow.
- Implemented by PR14: consent, slug claim/update, publish attempt, unpublish, and policy-blocked handling.
- Implemented by PR14: existing Publish Policy contract is enforced at runtime.
- Do not serve public profiles yet.

### PR15 - Public Gaming Passport MVP `/id/:slug`

- Implemented by PR15: serve the existing Public Projection contract through `/id/:slug`.
- Implemented by PR15: add share metadata, public projection RPC, safe unavailable behavior, and allowlisted public DTOs.
- Implemented by PR15: respect owner consent, status, publish policy, and provider/proof visibility controls.
- Do not expose private draft data.

### PR16 - Provider Runtime Foundation

- Implemented by PR16: add provider runtime contracts before any provider launch.
- Implemented by PR16: add local connection intent, callback state, token vault placeholder, sync job, and audit-event schema with RLS.
- Implemented by PR16: add owner-scoped repository scaffolding and private account status panel.
- Still missing after PR16: provider-specific adapters, external callbacks, real encrypted token storage usage, provider API calls, and proof sync runtime.
- Do not activate Riot or Discord.

### PR17 - First Provider Decision + Readiness Pack

- Implemented by PR17: decide whether Discord pilot or Riot readiness is safer.
- Implemented by PR17: use Riot approval status and provider foundation readiness as gates.
- Implemented by PR17: document provider-specific risks, readiness checklist, smoke checklist, and rollback plan.
- Decision: PR18 = Riot Readiness. Riot Runtime is blocked without explicit approval.

### PR18 - Riot Readiness Pack

- Implemented by PR18: execute the selected readiness path.
- Implemented by PR18: document Riot compliance gates, RSO callback design, token retention plan, unlink/revoke UX requirements, provider adapter contract review, portal checklist, public projection review, and smoke plan.
- Implemented by PR18: source/docs guard tests block accidental OAuth/API/provider activation.
- Do not add Riot OAuth, Riot API calls, RSO runtime, secrets, env vars, provider activation, adapters, callback routes, or public Riot data.
- Discord Pilot remains an alternate future path only if product direction explicitly changes.

### PR19 - Riot Provider Runtime

- Pending and gated by Riot approval.
- Implement Riot OAuth/runtime only after approved scopes, callbacks, products, and credentials are clear.
- Add unlink/revoke and server-side token storage.
- Do not use Riot as Parent Auth.

### PR20 - League of Legends Adapter

- Normalize LoL proofs under RiotProvider.
- Handle Riot ID, ownership, ranked summaries, source, sync timestamp, stale, and revoked states.
- Do not build OP.GG-style tracking, hidden-player inference, or live-game advice.

### PR21 - Cosmetics Foundation

- Implemented by PR21: add a local TryhardNames-owned cosmetic catalog with core/free, earned-ready, founder/legacy-ready, seasonal-ready, and premium-preview categories.
- Implemented by PR21: add Obsidian Pulse as a free equipable foundation preview.
- Implemented by PR21: add private `/account` cosmetic selection and preview through `scene_config.themeId` and `scene_config.equippedCosmeticIds`.
- Implemented by PR21: safely render allowlisted scene cosmetics on public `/id/:slug` profiles without exposing inventory, prices, purchases, locked cosmetics, private data, or proof truth mutations.
- Future work: `/cosmetics` showcase route, inventory/entitlement hardening, monetization review, and pets/companions 3D. These are not implemented by PR21.
- Avoid Riot assets, official rank-like cosmetics, Riot data monetization, fake proofs, fake ranks, proof boosts, stores, checkout, payments, loot boxes, and user-uploaded cosmetics.

### PR22 - Trust / Safety / Privacy Controls

- Add reports, takedown paths, suspension controls, visibility controls, and privacy review.
- Prepare broad public identity surfaces for abuse cases.
- Keep public data allowlisted.

### RM-24 - Launch Readiness

- Run production smoke.
- Verify observability, rollback, policy copy, privacy controls, sitemap, and portal metadata.
- Confirm no prohibited provider or Riot behavior exists.
- RM-24 is readiness and does not execute deploy.

### RM-25 - Provider Expansion Readiness Matrix

- Compare Riot, osu!, Steam, Supercell / Clash, Discord, and future candidates with readiness-before-runtime criteria.
- Keep provider runtime, OAuth/API calls, callback routes, tokens, env vars, and secrets out of scope.

## Dependency Gates

| Gate | Required before | Reason |
| --- | --- | --- |
| PR10.x visual/tooling line closed | Account Dashboard V2 | Functional account work should build on stable visual surfaces. |
| Favorite-first saved names decision | Saved Names persistence | The persistence model needs one canonical saved-name UX before schema/runtime work. |
| Publish Policy contract | Publish Runtime Commands | Commands should enforce the pure policy already present in domain code. |
| Publish Runtime Commands | Public `/id/:slug` | Public profiles need consent, slug, status, publish, and unpublish runtime first. |
| Public Projection contract | Public profiles | Public profiles must serve only allowlisted data with explicit consent. |
| Provider-neutral runtime foundation | Discord or Riot OAuth | OAuth should not begin until token handling, unlink/revoke, sync, audit, error, and rate-limit contracts exist. |
| Riot approval | Riot runtime | Do not assume RSO access, callbacks, scopes, API products, or production credentials before Riot approval. |
| Privacy review | Any linked provider launch | Provider data categories, retention, unlink/revoke, and public display need policy review. |
| Monetization review | Paid cosmetics | Paid features must not monetize Riot-owned data/assets or place Riot data behind a paywall. |
| Trust/safety | Broad public profile rollout | Public identity surfaces need abuse controls, takedown paths, and suspension behavior. |

## Anti-Patch Rule

Do not open PRs that only fix a symptom when the symptom belongs to a layer without a contract.

Examples:

- No visual one-off fix after PR10.x unless it fixes a critical bug, comprehension blocker, conversion blocker, or evident accessibility issue.
- No OAuth without the provider runtime contract.
- No public profile without publish runtime commands and public projection serving.
- No monetization without Riot/data boundary review.

Small fixes are still acceptable when they are scoped to an existing contract and do not imply unreviewed product behavior.
