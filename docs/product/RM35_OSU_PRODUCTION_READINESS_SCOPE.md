# RM35 osu! Production Readiness / Staging Go-No-Go Scope

## Objective

RM-35 prepares the osu! staging and production readiness package after RM-34 trust-safety passed the local public profile output.

It decides go/no-go state without activating production.

## Scope

- Document staging and production readiness status.
- Document server-side environment requirements without values.
- Document local, staging, and production callback requirements.
- Document the manual staging smoke runbook.
- Document monitoring and logging minimums.
- Document rollback steps for runtime and public projection.
- Update roadmap docs with RM-35 as this PR.
- Add source tests that ensure the readiness package contains the required gates and no secret-like examples.

## Decision

Staging decision: conditional-go.

Production decision: no-go.

Staging can proceed only after explicit owner approval for staging configuration, isolated staging services, exact callback registration, and full manual smoke.

Production cannot proceed until staging smoke evidence, owner production go/no-go, final env/callback review, monitoring review, rollback acceptance, and source guards pass.

## Non-Goals

- No production launch.
- No secret changes.
- No remote Supabase changes.
- No Vercel changes.
- No Parent Auth via osu!.
- No refresh-token storage.
- No direct osu! browser API call.
- No public provider UI outside `/account`.
- No `/cosmetics`.
- No store, checkout, billing, or payments.
- No rank, PP, score, match-history, best-play, beatmap, or live tracker.
- No hidden-player inference.
- No official osu! endorsement claim.

## Exit Criteria

- `OSU_PRODUCTION_READINESS_GO_NO_GO.md` exists.
- `OSU_STAGING_SMOKE_RUNBOOK.md` exists.
- `OSU_ENVIRONMENT_CHECKLIST.md` exists.
- Roadmap docs identify RM-35 as this PR.
- Production remains no-go.
- Next RM is RM-36 osu! Staging Configuration / Manual Smoke.
- Source guard tests pass without real secrets, tokens, callback code, or callback state examples.

## Next RM

RM-36 osu! Staging Configuration / Manual Smoke.
