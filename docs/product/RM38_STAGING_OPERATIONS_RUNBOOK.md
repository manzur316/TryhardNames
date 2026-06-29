# RM-38 Staging Operations Runbook / Environment Hygiene

## Objective

RM-38 documents the staging operating model after RM-36 and RM-37. It is intentionally docs-only.

The goal is to prevent confusion between the production Vercel project, the staging Vercel project, preview deployments, the `production` target inside the staging project, Supabase staging, Google Parent Auth staging, and osu! staging callbacks.

## Non-goals

- No code changes.
- No migrations.
- No remote Supabase changes.
- No Vercel project changes.
- No environment variable value changes.
- No secrets, OAuth codes, OAuth states, JWTs, access tokens, refresh tokens, database passwords, service role keys, or env files committed.
- No production go/no-go.
- No Riot runtime activation.
- No additional osu! feature work.
- No `/cosmetics`, store, checkout, billing, payments, tracker, ranking, MMR/ELO, match history dump, live tracker, hidden data surface, or official endorsement claim.

## Current audited snapshot

Snapshot date: 2026-06-29.

| Area | Current state |
| --- | --- |
| GitHub repo | `manzur316/TryhardNames` |
| Default branch | `main` |
| Current `main` HEAD | `083e164a7ca2aaa17961e08b36342964b422132a` |
| RM-37 PR | `#44`, merged into `main` |
| Vercel production project | `tryhard-names-web` |
| Vercel staging project | `tryhardnames-staging` |
| Supabase production project | probable `TryhardNamesProyect`; do not touch without explicit approval |
| Supabase staging project | `tryhardnames-staging` |
| Supabase staging ref | `qedsegxdsxehswmkiyvv` |
| osu! staging smoke | full-pass practical in RM-36 |
| osu! production | no-go |
| Riot runtime | blocked pending Riot review/approval |

### `staging` branch status

At the RM-38 audit point, the GitHub branch named `staging` was not aligned with `main`:

```txt
staging: ahead of merge base by 1 commit
staging: behind main by 7 commits
staging HEAD: ed0d1341f2e8d41a9f97a1d1c8136a2629c8f27d
staging-only commit: chore(staging): trigger staging deployment
merge base: 541074a876094f93e05e6df32f158c7d878b6569
```

Do not treat the `staging` branch as current source of truth until a future RM explicitly aligns, replaces, or retires it.

## Environment model

### Project names are not environments by themselves

The same Git branch can deploy to more than one Vercel project. Read the project name and deployment target together.

| Concept | Meaning |
| --- | --- |
| `tryhard-names-web` | Production Vercel project. This is the real public product surface. |
| `tryhardnames-staging` | Separate Vercel project used for staging. |
| Preview deployment | Temporary deployment generated from a PR/branch. Not the canonical staging environment. |
| `target: production` inside `tryhardnames-staging` | The production target of the staging project. This is still staging because the project is staging. |
| `target: production` inside `tryhard-names-web` | Real production deployment target. Requires production-safe configuration. |

Rule: when reviewing a Vercel deployment, always record both `project` and `target`. `target: production` is ambiguous unless the project name is included.

## Branch policy

### Source of truth

- `main` is the code and documentation source of truth after PR merge.
- RM branches must start from current `origin/main`.
- PRs must stay small, auditable, and scoped to one RM.
- Draft PR first if there is uncertainty.
- Merge only after CI is green and owner approval exists, unless the owner explicitly authorizes a different flow.

### Staging deployments

Current recommended policy for the Vercel staging project:

1. Deploy `main` to the separate Vercel project `tryhardnames-staging` for canonical staging validation.
2. Use PR preview deployments only for review of unmerged work.
3. Do not rely on the historical GitHub `staging` branch unless a future RM updates the branch policy and realigns it with `main`.
4. Do not use production domains for staging smoke tests.
5. Do not run staging smoke against `tryhard-names-web`.

### Production deployments

The production Vercel project is `tryhard-names-web`.

Even if `main` deploys there automatically, production feature enablement remains no-go unless the specific RM has explicit owner approval, environment review, callback review, rollback acceptance, and source guard pass.

## Vercel deployment identification checklist

Before any smoke test or runtime diagnosis, capture this safe metadata:

- Vercel project name.
- Deployment URL.
- Deployment state.
- Deployment target.
- GitHub repo.
- GitHub commit ref.
- GitHub commit SHA.
- GitHub commit message.
- Branch alias, if present.

Do not paste runtime logs containing secrets, OAuth callback query values, JWTs, tokens, service role keys, raw OAuth payloads, raw provider API payloads, database URLs with passwords, or env files.

## Environment variable hygiene

This section lists variable names and boundaries only. It intentionally contains no values.

### API/server variables

| Variable | Boundary | Staging rule | Production rule |
| --- | --- | --- | --- |
| `PORT` | server | Optional platform/runtime value. | Optional platform/runtime value. |
| `CORS_ORIGIN` | server | Must allow only the staging web origin unless explicitly approved. | Must allow only production origins unless explicitly approved. |
| `TRUST_PROXY` | server | Optional override; default on Vercel is handled by RM-37. | Optional override; default on Vercel is handled by RM-37. |
| `SUPABASE_URL` | server | Must point to Supabase staging. | Must point to Supabase production only after approval. |
| `SUPABASE_SERVICE_ROLE_KEY` | server secret | Staging-only key, never exposed to browser/docs/logs. | Production key, never exposed; do not touch without approval. |
| `OSU_PROVIDER_ENABLED` | server | Allowed for staging smoke after approval. | Must remain disabled until production go/no-go. |
| `OSU_CLIENT_ID` | server | Staging osu! OAuth app only. | Production osu! OAuth app only after approval. |
| `OSU_CLIENT_SECRET` | server secret | Staging secret only; never expose. | Production secret only after approval; never expose. |
| `OSU_REDIRECT_URI` | server | Must exactly match staging callback. | Must exactly match production callback after approval. |
| `OSU_STATE_SECRET` | server secret | Long random staging-only value. | Long random production-only value after approval. |
| `OSU_AUTHORIZATION_URL` | server | Official osu! authorization endpoint unless explicitly overridden for test. | Official osu! endpoint. |
| `OSU_TOKEN_ENDPOINT` | server | Official osu! token endpoint unless explicitly overridden for test. | Official osu! endpoint. |
| `OSU_API_BASE_URL` | server | Official osu! API base unless explicitly overridden for test. | Official osu! API base. |
| `OSU_SCOPES` | server | Minimal scopes only: `identify public`. | Minimal scopes only: `identify public`, after approval. |
| `RIOT_PROVIDER_ENABLED` or equivalent Riot runtime gate | server | Must remain disabled unless a future Riot RM approves runtime. | Must remain disabled until Riot approval and owner go/no-go. |

### Browser/public variables

Browser variables are not secrets, but they still must be environment-specific.

| Variable/category | Boundary | Rule |
| --- | --- | --- |
| Supabase public URL / anon key | browser-public | Must point to the matching Supabase project for the Vercel project. Never use service role in browser. |
| API base/origin value | browser-public | Must point to the matching API origin for staging or production. |
| Provider client secrets | forbidden in browser | Never expose osu!, Riot, Google, or other provider client secrets. |
| Provider access/refresh tokens | forbidden in browser | Never persist or expose provider tokens in browser env, localStorage, public DTOs, or docs. |

### Platform-provided Vercel variables

Vercel can provide runtime metadata such as `VERCEL` and `VERCEL_ENV`. RM-37 uses these to default Express `trust proxy` to one hop on Vercel. Operators should not rely on these as a substitute for project/environment review.

## Supabase staging hygiene

Staging Supabase is separate from production.

Staging project identity:

```txt
project name: tryhardnames-staging
project ref: qedsegxdsxehswmkiyvv
```

Rules:

- Do not run migrations remotely without explicit action-level approval.
- Do not use production service role keys in staging.
- Do not use staging service role keys in production.
- Do not paste SQL secrets, connection strings, JWTs, access tokens, refresh tokens, or service role keys in chat/docs.
- Safe reports may include table counts and status summaries only.
- Provider token vault must remain empty for osu! runtime strategy.
- If a smoke requires DB inspection, report sanitized counts and state transitions only.

## Google Parent Auth staging

Google Auth is Parent Auth only.

Rules:

- Google Sign-In is used for owner/parent authentication.
- Do not request Gmail, Drive, Calendar, or unrelated Google scopes.
- Do not enable Gmail API for this project.
- Do not paste Google Client Secret, OAuth code, OAuth state, tokens, JWTs, or Supabase session values.
- Staging Google OAuth callbacks must target staging Supabase/Auth configuration, not production.
- Production Google Auth changes require explicit owner approval.

## osu! staging callback hygiene

osu! is a gaming proof provider, not Parent Auth.

Current staging runtime has already passed a practical smoke in RM-36. Future production remains no-go.

Callback rules:

- Staging callback must point to the staging API origin.
- Production callback must point to the production API origin only after production go/no-go.
- Do not mix localhost, staging, and production callbacks.
- Do not copy callback query strings into tickets, docs, screenshots, PR comments, or chat.
- Keep `OSU_SCOPES` minimal: `identify public`.
- Keep token strategy as `no_refresh_token_storage`.
- Never claim official osu! endorsement.

## Riot hygiene

Riot runtime remains blocked.

Allowed before Riot approval:

- Docs/readiness work.
- Policy review.
- Static copy that avoids endorsement claims.
- Runtime guards that keep Riot disabled by default, if explicitly scoped in a future RM.

Not allowed before Riot approval:

- Runtime activation.
- Public Riot verification claims.
- Riot account linking smoke.
- Riot API calls from production/staging runtime.
- Ranking, MMR/ELO, live tracking, match history dumps, hidden-player inference, in-game recommendations, or OP.GG-style replacement surfaces.

## Staging smoke runbook

Use this only against the Vercel staging project and staging Supabase.

### Pre-flight

1. Confirm GitHub `main` HEAD.
2. Confirm target deployment belongs to `tryhardnames-staging`.
3. Confirm deployment state is `READY`.
4. Confirm deployment GitHub ref and SHA.
5. Confirm the web URL is a staging URL.
6. Confirm Supabase project is `tryhardnames-staging` / `qedsegxdsxehswmkiyvv`.
7. Confirm no production project, production Supabase, or production OAuth callback is in scope.
8. Confirm no secrets will be pasted, printed, committed, or screenshotted.

### Safe endpoint checks

Use staging URLs only.

- Open home page.
- Open sign-in flow.
- Sign in with Google Parent Auth.
- Confirm return to staging domain.
- Confirm `/account` is reachable for the signed-in owner.
- Confirm private Passport/dashboard state loads.
- Hit `/api/v1/integrations/osu` once if osu! runtime health must be checked.

Do not run provider callback flows unless the RM explicitly requires a real manual smoke.

### osu! real smoke gate

A real osu! link/callback/unlink smoke is high-risk and should only run when the RM requires it.

If approved, verify the same safe sequence from RM-36:

1. Private owner starts `Connect osu!` from staging `/account`.
2. Human completes osu! authorization.
3. Callback returns to staging.
4. `linked_provider_accounts` transitions `verified/private`.
5. `verified_proofs` transitions `current/private`.
6. Owner explicitly changes proof visibility to public.
7. Public projection shows only allowlisted fields.
8. Owner disconnects osu!.
9. Connection/proof return to revoked/private.
10. Public projection no longer serves osu!.
11. `provider_token_vault` remains `0`.

Only sanitized counts and statuses may be recorded.

## Production go/no-go remains blocked

Production remains no-go for osu! and Riot.

Production may be considered only after all of these exist:

- staging evidence current enough for the release;
- production environment review;
- production callback review;
- rollback plan accepted;
- owner production go/no-go;
- source guard pass;
- monitoring/log redaction review;
- confirmation that production does not contain staging callbacks, localhost callbacks, test origins, test secrets, or preview URLs.

## Rollback guidance

For staging-only issues:

1. Disable the affected provider runtime in staging environment config.
2. Revert the Vercel staging deployment if needed.
3. Keep owner records private or revoked by default.
4. Rotate staging OAuth secrets if exposure is suspected.
5. Re-run source guards before another smoke.

For production issues after a future approved launch:

1. Disable the affected provider runtime in production environment config.
2. Revert the Vercel production deployment if needed.
3. Remove or disable public projection for the affected provider.
4. Rotate production secrets if exposure is suspected.
5. Preserve private audit data unless deletion is explicitly approved.
6. Record sanitized incident evidence only.

## RM-38 acceptance checklist

- Docs-only PR.
- Branch created from current `main`.
- No production changes.
- No Supabase remote changes.
- No Vercel project changes.
- No secrets or env values committed.
- Staging branch divergence documented.
- Staging project vs production project distinction documented.
- Preview vs staging vs production-target terminology documented.
- Environment variables documented by name/boundary only.
- Google Parent Auth staging documented.
- osu! staging callback hygiene documented.
- Riot runtime block preserved.
- Production no-go preserved.
