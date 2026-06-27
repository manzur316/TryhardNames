# Roadmap Governance

RM-23 establishes the roadmap governance model for TryhardNames.

## Source Of Truth

GitHub/main/docs are the source of truth.

The authoritative state is:

- `main`;
- merged GitHub pull requests;
- `docs/product`;
- CI results;
- local migration files and database tests when schema changes exist;
- commit history.

The chat is not a source of truth. Chat can propose work, but only merged GitHub state and versioned docs define product reality.

## GH PR Number Versus RM Milestone

`GH PR #N` means the automatic pull request number assigned by GitHub.

`RM-XX` means a stable Roadmap Milestone defined in `docs/product`.

They are not the same identifier.

Rules:

- A GitHub PR can implement one RM.
- A GitHub PR can be a follow-up to an RM.
- A docs-only GitHub PR can implement an RM when the milestone is governance, readiness, policy, or compliance.
- One RM can have more than one GitHub PR if fixes or audits are needed.
- Future roadmap planning must not depend on GitHub's automatic PR number.

## Real Repo Examples

| GitHub PR | Product roadmap block | Notes |
| --- | --- | --- |
| GH PR #23 | RM-14 Publish Runtime Commands | Added consent, slug, publish, and unpublish commands. |
| GH PR #24 | RM-15 Public Gaming Passport MVP | Added public `/id/:slug` allowlisted projection route. |
| GH PR #25 | RM-16 Provider Runtime Foundation | Added provider-neutral scaffolding without provider activation. |
| GH PR #26 | RM-17 First Provider Decision Readiness | Selected Riot Readiness as the safe next provider path. |
| GH PR #27 | RM-18 Riot Readiness Pack | Added Riot readiness docs and source guards. |
| GH PR #28 | RM-21 Passport Cosmetics Foundation | Added visual-only Passport cosmetics foundation. |
| GH PR #29 | RM-22 Trust / Safety / Privacy Controls | Added public profile report and privacy/safety controls. |

## Branch Naming

Branch names should include the RM identifier when useful:

- `docs/rm23-roadmap-governance-provider-expansion`
- `docs/rm24-launch-readiness`
- `docs/rm26-osu-readiness-pack`

Feature branches can keep conventional prefixes, but the PR body must declare the RM.

## PR Body Rules

Every future PR body should include:

- `Implements: RM-XX`;
- `Roadmap block: <name>`;
- `Source of truth: GitHub/main/docs/product/merged PRs/CI`;
- `Scope`;
- `Non-goals`;
- `Tests`;
- `Rollback`.

When a PR is a follow-up, use:

- `Follows up: RM-XX`;
- `Reason`;
- `Files touched`;
- `Risk`.

## Roadmap Update Rules

When an RM changes product state, update:

- `docs/product/ROADMAP_INDEX.md`;
- `docs/product/ROADMAP_MILESTONE_REGISTRY.md`;
- `docs/product/CURRENT_STATE_AND_ROADMAP.md`;
- `docs/product/PRODUCT_EXECUTION_PLAN_AFTER_PR10.md`;
- `docs/product/ROADMAP_STATUS_MATRIX.md`;
- `docs/product/DECISION_LOG.md`.

Docs-only readiness PRs must still add tests when they change the roadmap.

## Follow-Up Rules

Follow-up PRs should not renumber the RM.

Examples:

- a migration fix for RM-12 remains an RM-12 follow-up;
- a smoke-test fix for RM-21 remains an RM-21 follow-up;
- a governance correction after RM-23 remains an RM-23 follow-up.

## External Blockers

External approvals are gates, not roadmap guesses.

Riot runtime remains gated until explicit approval exists in repo evidence. Provider runtime cannot be started because a chat message speculates approval. The repo must contain approval evidence, approved scopes, approved callback URLs, and accepted token/revoke/privacy requirements before runtime.

## Readiness Before Runtime

No provider runtime without a readiness pack first.

Every provider path must pass:

- official documentation review;
- account ownership verification review;
- allowed public fields review;
- OAuth/API model review;
- token storage review;
- unlink/revoke review;
- stale/revoked proof behavior review;
- public projection safety review;
- trust/safety review;
- monetization and branding review.

## Current RM Sequence

- RM-23 Roadmap Governance + Provider Expansion Plan.
- RM-24 Launch Readiness.
- RM-25 Provider Expansion Readiness Matrix.
- RM-26 osu! Readiness Pack.
- RM-27 osu! Runtime Foundation, conditional on RM-26 and official review.

RM-24, RM-25, RM-26, and RM-27 are not implemented by RM-23.
