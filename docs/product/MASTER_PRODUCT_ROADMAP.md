# Gaming Passport Master Product Roadmap

## Product North Star

Gaming Passport is a private-first, verifiable, shareable gamer identity layer built on top of TryhardNames public tools.

The final product should combine visual identity, verified provider ownership, verified proofs, user-controlled publishing, safe public projection, and TryhardNames-owned cosmetics. It must not become a tracker, OP.GG alternative, alternative ranking system, custom MMR/ELO product, live-game advice surface, hidden-player de-anonymization tool, or match-history dump.

## Strategic Product Model

The product chain is:

Public generators -> Parent Auth -> Private Draft -> Linked Providers -> Verified Proofs -> Publish Policy -> Public Projection -> Public Profile -> Cosmetics.

- Public generators remain free acquisition and utility surfaces.
- Parent Auth is the TryhardNames account entry point.
- Private Draft is the owner-only editable Passport state.
- Linked Providers are external accounts connected after sign-in.
- Verified Proofs are normalized, source-backed assertions from providers or game adapters.
- Publish Policy decides if an owner can publish.
- Public Projection exposes only allowlisted fields.
- Public Profile is the future `/id/:slug` surface.
- Cosmetics are TryhardNames-owned themes, borders, and animations.

## Current State After PR9

- Repo security and reproducibility are established.
- Gaming Passport domain foundation exists.
- Local schema foundation exists.
- Parent Auth and private draft management exist.
- Riot site verification exists.
- `/gaming-passport` public landing exists.
- Riot review submission pack exists.
- Riot policy compliance audit exists.
- Root README, public privacy/terms alignment, and current roadmap exist from PR9.

Riot integration is not live. Discord integration is not live. No Riot API calls are active. No production Riot key exists in the repo. Public `/id/:slug` profiles are not implemented.

## Main Roadmap Blocks

### Epic 10 — Roadmap and UI Theme Foundation

- PR10: Master roadmap + theme audit.
- PR10.1: Fix Account/Auth light-dark mode.
- PR10.2: Decide and normalize Gaming Passport landing theme.
- PR10.3: Legal/docs pages theme pass if needed.

### Epic 11 — Owner Dashboard V2

- Draft status clarity.
- Validation UX.
- Save states.
- Private preview.
- Provider placeholders as unavailable, not fake buttons.
- Publishability explanation without enabling publish.

### Epic 12 — Provider-Neutral Runtime Foundation

- Provider connection states.
- Token storage design.
- Unlink/revoke contract.
- Sync job contract.
- Audit/error/rate-limit contract.
- No provider activation.

### Epic 13 — Public Profile Publish Architecture

- Slug policy.
- Consent.
- Publish command.
- Public DTO.
- SEO/noindex rules.
- Revoke/stale behavior.

### Epic 14 — First Linked Provider Decision

- If Riot approved, Riot starts later.
- If Riot still pending, Discord may be considered only after provider-neutral foundation.
- No OAuth before provider security foundation.

### Epic 15 — Riot Runtime

- Only after Riot approval.
- RSO.
- Callback.
- Server-side tokens.
- RiotProvider.
- Unlink/revoke.

### Epic 16 — League of Legends Adapter

- Riot ID.
- Ownership.
- Solo/Duo.
- Flex.
- Sync timestamp/source.
- Stale/revoked handling.

### Epic 17 — Public Gaming Passport

- `/id/:slug`.
- Public projection.
- Share metadata.
- Proof visibility.
- SEO/indexing.

### Epic 18 — Cosmetics and Monetization

- Themes.
- Borders.
- Animations.
- No Riot data paywall.
- No Riot assets monetized.

### Epic 19 — Trust, Safety, Moderation

- Suspension.
- Reports.
- Takedown.
- Content restrictions.
- Abuse controls.

### Epic 20 — Launch Readiness

- Production smoke.
- Observability.
- Rollback.
- Privacy final review.
- Portal metadata sync.

## Dependency Gates

| Gate | Required before | Reason |
| --- | --- | --- |
| Theme consistency before Owner Dashboard V2 | Owner Dashboard V2 | Functional account surfaces need readable, predictable light/dark behavior before deeper dashboard work. |
| Provider-neutral foundation before Discord/Riot OAuth | Discord or Riot OAuth | OAuth should not begin until connection states, token handling, unlink/revoke, sync, and audit contracts exist. |
| Riot approval before Riot runtime | Riot Runtime | Do not assume RSO access, callbacks, scopes, API products, or production credentials before Riot approval. |
| Public projection before `/id/:slug` | Public profiles | Public profiles must serve only allowlisted data with explicit consent. |
| Privacy review before provider launch | Any linked provider launch | Provider data categories, retention, unlink/revoke, and public display need policy review. |
| Monetization review before cosmetics sale | Paid cosmetics | Paid features must not monetize Riot-owned data/assets or place Riot data behind a paywall. |
| Trust/safety before broad public profiles | Broad public profile rollout | Public identity surfaces need abuse controls, takedown paths, and suspension behavior. |

## Anti-Patch Rule

Do not open PRs that only fix a symptom when the symptom belongs to a layer without a contract.

Examples:

- No visual one-off fix without the theme contract.
- No OAuth without the provider runtime contract.
- No public profile without publish/public projection contract.
- No monetization without Riot/data boundary review.

Small fixes are still acceptable when they are scoped to an existing contract and do not imply unreviewed product behavior.
