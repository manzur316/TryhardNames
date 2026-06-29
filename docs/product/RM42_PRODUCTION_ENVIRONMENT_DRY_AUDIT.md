# RM-42 Production Environment Dry Audit

## Objective

RM-42 records a dry audit of production environment readiness for TryhardNames after RM-41.

This milestone is strictly read-only and documentation-only. It does not activate production, change environment variables, change OAuth settings, touch Supabase remotely, change Vercel configuration, or request/print secrets.

## Decision

Production decision: **no-go**.

RM-42 confirms production and staging project separation, but production provider enablement remains blocked until a supervised production review window is explicitly approved.

## Safe audit snapshot

Snapshot date: 2026-06-29.

| Area | Result |
| --- | --- |
| GitHub repository | `manzur316/TryhardNames` |
| RM-41 status | merged |
| Current safety stance | production no-go |
| Vercel team | `tryhardnames-projects` |
| Vercel production project | `tryhard-names-web` |
| Vercel staging project | `tryhardnames-staging` |
| Supabase staging ref from prior RM evidence | `qedsegxdsxehswmkiyvv` |
| Supabase production | not queried in RM-42 |
| Google Auth | Parent Auth only |
| osu! production runtime | no-go |
| Riot runtime | blocked |

## Vercel project inventory

### Production project

| Field | Safe value |
| --- | --- |
| Project name | `tryhard-names-web` |
| Framework | `vite` |
| Node version | `24.x` |
| Latest deployment state at audit | `READY` |
| Production domains present | `tryhardnames.com`, `www.tryhardnames.com`, `tryhard-names-web.vercel.app` |

The production project is the only project that should serve real public production domains. Any future production smoke must explicitly verify that it is targeting this project and not the staging project.

### Staging project

| Field | Safe value |
| --- | --- |
| Project name | `tryhardnames-staging` |
| Framework | `vite` |
| Node version | `24.x` |
| Latest deployment state at audit | `READY` |
| Staging domains present | `tryhardnames-staging.vercel.app`, `tryhardnames-staging-tryhardnames-projects.vercel.app` |

The staging project must remain isolated from production Supabase, production OAuth callbacks, production secrets, and production public smoke decisions.

## Dry audit boundaries

The audit intentionally did not read, request, print, or modify:

- Vercel environment variable values;
- Supabase service role keys;
- Supabase connection strings;
- database passwords;
- Google Client Secret;
- osu! Client Secret;
- Riot credentials;
- OAuth callback query values;
- JWTs;
- access tokens;
- refresh tokens;
- env files.

## Production environment review checklist for a future supervised window

Before any production provider enablement, the owner must explicitly approve a production review window. During that window, review values only through secure provider dashboards or deployment UIs, not through chat.

Required checks:

1. Confirm Vercel project is `tryhard-names-web`.
2. Confirm production domain set includes `tryhardnames.com` and `www.tryhardnames.com`.
3. Confirm no staging domain is configured as production callback/origin.
4. Confirm no localhost callback is configured in production providers.
5. Confirm production Supabase project identity without exposing service role keys or database passwords.
6. Confirm production Google Parent Auth origin/callback set.
7. Confirm production osu! callback exactly matches the production API callback path before enablement.
8. Confirm `OSU_PROVIDER_ENABLED` remains disabled until owner go/no-go.
9. Confirm Riot runtime has no approved activation.
10. Confirm rollback owner acceptance before runtime enablement.
11. Confirm monitoring/log redaction review before runtime enablement.
12. Confirm source guards pass on the exact candidate commit.

## Production enablement blockers still open

| Gate | Status |
| --- | --- |
| Owner production go/no-go | missing |
| Production Supabase review | missing |
| Production env review | missing |
| Production Google Parent Auth callback/origin review | missing |
| Production osu! callback review | missing |
| Production rollback acceptance | missing |
| Production monitoring/log redaction review | missing |
| Final production smoke plan | missing |
| Riot approval | missing |

## Hard no-go conditions

Do not start production smoke or runtime enablement if any of these are true:

- owner has not explicitly approved production action;
- operator cannot distinguish `tryhard-names-web` from `tryhardnames-staging`;
- staging and production Supabase identifiers are mixed;
- staging and production OAuth callbacks are mixed;
- callback query values would be copied into chat, docs, screenshots, or logs;
- secrets or env values would be pasted into chat;
- Riot runtime is included;
- store, checkout, billing, payments, ranking, MMR/ELO, match history, live tracker, hidden-player inference, or official endorsement claims are included.

## Recommended next milestone

RM-43 — Production Runtime Gate Hardening.

Recommended scope:

- code/test work suitable for Codex CLI;
- keep provider runtime disabled by default;
- add explicit production safety predicates;
- add tests proving production provider runtime cannot enable without all required gates;
- do not touch Supabase remote;
- do not change Vercel env values;
- do not activate production.

## RM-42 non-goals

- No production launch.
- No production provider activation.
- No Supabase remote reads or writes.
- No Supabase migrations.
- No Vercel configuration changes.
- No OAuth provider configuration changes.
- No environment value changes.
- No secrets committed, requested, or printed.
- No Riot runtime activation.
- No store, checkout, billing, payments, tracker, ranking, MMR/ELO, match history, live tracker, or official endorsement claims.

## Acceptance checklist

- Vercel production and staging project names recorded.
- Production/staging project separation documented.
- Supabase remote not queried.
- Secrets and env values not requested or printed.
- Production no-go preserved.
- Future supervised production review checklist documented.
- RM-43 proposed as code/test hardening, not production activation.
