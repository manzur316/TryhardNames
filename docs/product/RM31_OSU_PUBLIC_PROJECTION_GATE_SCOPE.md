# RM-31 osu! Private Proof Publish Policy / Public Projection Gate Scope

## Objective

Define and enforce the policy deciding whether an osu! private ownership proof can enter public projection.

## Result

Status: this PR.

Policy decision: public osu! projection remains blocked because owner proof visibility controls do not exist yet.

Block reason: `owner_visibility_controls_missing`.

Next milestone: RM-32 osu! Owner Proof Visibility Controls.

## In Scope

- Document osu! public projection eligibility.
- Define future public allowlist fields.
- Define blocked fields.
- Block private, stale, revoked, manually public-without-controls, suspended, unpublished, and missing-consent states.
- Add a domain policy module for osu! projection.
- Mirror the closed gate in local Supabase public projection RPC.
- Add tests proving private and manually public osu! rows do not project.
- Preserve RM-30 private owner UX and RM-29 smoke guarantees.

## Out Of Scope

- Production launch.
- Automatic public osu! proof.
- Owner proof visibility controls.
- Public provider linking UI.
- Public osu! proof display on `/id/:slug`.
- Parent Auth via osu!.
- Refresh-token storage.
- Direct osu! browser API calls.
- Store/payments.
- `/cosmetics`.
- Rank/PP/score/match-history/live tracker.

## Acceptance Criteria

- `osu:profile_linked` proof stays private by default.
- A manually public osu! provider row is excluded from `linkedProviders`.
- A manually public osu! proof row is excluded from `featuredProofs`.
- Revoked or stale osu! proof rows are excluded.
- Public projection never contains raw external account id, owner id, linked provider account id, token fields, raw metadata, or provider internals.
- Docs declare RM-32 as the next owner visibility milestone.
- Tests run against domain, SEO/source guard, and local DB projection rules.
