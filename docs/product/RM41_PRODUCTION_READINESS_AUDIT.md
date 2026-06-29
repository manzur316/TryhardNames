# RM-41 Production Readiness Audit

## Objective

RM-41 audits whether TryhardNames is ready for production provider enablement after RM-36 through RM-40.

This is an audit-only milestone. It does not enable production, change environment values, touch Supabase remotely, change Vercel configuration, configure OAuth callbacks, activate Riot runtime, or launch any public provider feature.

## Executive decision

Production decision: **no-go**.

Staging decision: **stable for controlled validation**.

The application has stronger staging evidence and source guards than before, but production provider enablement still requires explicit owner go/no-go, production environment review, production callback review, rollback acceptance, monitoring review, and a final production-safe smoke plan.

## Current audited state

Snapshot date: 2026-06-29.

| Area | Status |
| --- | --- |
| GitHub repo | `manzur316/TryhardNames` |
| `main` HEAD | `c7a8a132e07f43759fd12111bacf6f57db749565` |
| `staging` branch | aligned with `main` |
| Open PRs before RM-41 | none |
| Vercel staging check for `main` HEAD | success |
| Vercel production-project check for `main` HEAD | success |
| Supabase staging | `tryhardnames-staging`, ref `qedsegxdsxehswmkiyvv` |
| Supabase production | probable `TryhardNamesProyect`; not touched |
| Google Auth | Parent Auth only |
| osu! staging | full-pass practical smoke recorded in RM-36 |
| osu! production | no-go |
| Riot runtime | blocked |

## Evidence reviewed

### RM-35 production readiness baseline

RM-35 set the original production decision to no-go and required staging smoke evidence, owner go/no-go, production environment review, callback review, rollback acceptance, monitoring review, and source guard results before enabling production.

Relevant readiness blockers from RM-35 remain valid:

- production callback must be registered exactly in osu!;
- production secrets must be reviewed without printing or committing values;
- production rollback must be accepted by owner;
- monitoring and log redaction must be reviewed;
- production must not contain localhost, staging callback, or test origins;
- production public projection allowlist must be intentionally enabled only after approval.

### RM-36 staging smoke evidence

RM-36 recorded a full-pass practical staging smoke against isolated staging services.

Evidence included:

- Google Parent Auth in staging;
- real osu! callback completion;
- `linked_provider_accounts` verified/private, verified/public, then revoked/private;
- `verified_proofs` current/private, current/public, then revoked/private;
- public projection allowlist serving only after owner visibility and publication gates;
- disconnect removing osu! from public projection;
- provider token vault staying at `0`;
- no production services touched.

### RM-37 Vercel trust proxy hardening

RM-37 resolved the non-blocking Vercel forwarded-header warning by applying Express trust proxy configuration before route/rate-limit middleware.

Current state:

- Vercel defaults to one trusted proxy hop;
- local/default runtime remains conservative;
- `TRUST_PROXY` exists only as an explicit override;
- OAuth, Supabase, providers, and production runtime behavior were not changed.

### RM-38 staging operations runbook

RM-38 documented environment hygiene and clarified:

- `tryhardnames-staging` is the staging Vercel project;
- `tryhard-names-web` is the production Vercel project;
- `target: production` must always be read together with the project name;
- preview deployments are not canonical staging;
- production remains no-go without explicit approval;
- Supabase staging and production must not be mixed.

### RM-39 staging branch alignment

RM-39 aligned the historical `staging` branch policy.

Current policy:

- `main` is source of truth;
- `staging` must remain aligned with `main` unless a future RM explicitly changes it;
- no direct commits or empty trigger commits to `staging`;
- staging/prod separation is by Vercel project, not by a long-lived divergent branch.

### RM-40 source guards

RM-40 added source safety guards in API tests.

The guards cover:

- server secrets and provider token names out of browser source;
- osu! runtime scopes constrained to `identify public`;
- Riot runtime remaining a stub with no OAuth/API/token surface;
- forbidden public surfaces staying out of runtime source;
- no official endorsement claims;
- no tracker/ranking/MMR/ELO/match-history/live-tracker behavior.

## Production readiness matrix

| Gate | Status | Evidence / blocker |
| --- | --- | --- |
| Code merged to current `main` | pass | RM-40 merge `c7a8a132e07f43759fd12111bacf6f57db749565` |
| `main` and `staging` aligned | pass | post-RM40 alignment verified |
| Vercel checks on current `main` | pass | staging and production-project checks success |
| Staging smoke evidence | pass-practical | RM-36 full-pass practical smoke |
| Source guards | pass-current | RM-40 source guard tests added |
| Production owner go/no-go | missing | must be explicit before enablement |
| Production Supabase review | missing | production project not audited/touched in RM-41 |
| Production OAuth callback review | missing | no production callback review executed in RM-41 |
| Production env review | missing | no production env values reviewed in RM-41 |
| Production rollback acceptance | missing | rollback plan exists conceptually; owner acceptance still required |
| Monitoring/log redaction review | missing | minimum requirements exist; production review still required |
| Final production smoke plan | missing | must be approved before any production runtime action |
| Riot approval | missing | Riot runtime remains blocked |

## Required before osu! production can move from no-go to conditional-go

1. Owner explicitly approves a production go/no-go review window.
2. Production Vercel project is identified as `tryhard-names-web` for every step.
3. Production Supabase project is confirmed without exposing secrets.
4. Production environment variables are reviewed by name and boundary only unless the owner uses a secure UI flow.
5. Production osu! callback is confirmed exactly in provider settings.
6. Production Google Parent Auth callback/origin is confirmed separately from staging.
7. Rollback plan is accepted before activation.
8. Monitoring and log redaction are reviewed.
9. Source guards pass on the exact production candidate commit.
10. Final smoke steps are written and approved before touching production runtime.

## Production smoke must not start if

- owner has not explicitly approved production action;
- production and staging URLs are mixed;
- production and staging Supabase identifiers are mixed;
- OAuth callback query values would be copied into chat/docs/logs;
- service role keys, OAuth secrets, JWTs, access tokens, refresh tokens, database passwords, or env files are visible in chat/docs/screenshots;
- Riot runtime is in scope;
- `/cosmetics`, store, checkout, billing, payments, ranking, MMR/ELO, match-history, live tracker, hidden-player inference, or official endorsement claims are in scope.

## Recommended next milestone

RM-42 — Production Environment Dry Audit.

Scope should remain read-only and supervised:

- confirm production project identifiers;
- confirm callback/origin inventory by name only;
- confirm no staging callback in production;
- confirm no localhost callback in production;
- confirm rollback checklist owner acceptance;
- confirm which runtime gates remain disabled;
- do not reveal or paste secrets.

## RM-41 non-goals

- No production launch.
- No production provider activation.
- No production Supabase writes.
- No Supabase migrations.
- No Vercel configuration changes.
- No OAuth configuration changes.
- No environment value changes.
- No secrets committed or requested.
- No Riot runtime activation.
- No store, checkout, billing, or payments.
- No tracker, ranking, MMR/ELO, match-history dump, best-play, beatmap, or live tracker.
- No official Riot or osu! endorsement claim.

## Acceptance checklist

- Current `main` HEAD recorded.
- `main` and `staging` alignment recorded.
- Vercel check status recorded.
- RM-35 through RM-40 evidence summarized.
- Production no-go preserved.
- Missing production gates listed.
- Next RM proposed as dry audit only.
- No secrets or env values committed.
- No production system touched.
