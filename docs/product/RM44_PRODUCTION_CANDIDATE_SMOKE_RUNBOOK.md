# RM-44 Production Candidate Smoke Plan / Operator Runbook

## Objective

RM-44 defines the operator runbook for a future production-candidate smoke of osu! provider runtime.

This milestone is documentation-only. It does not approve production, activate production, change environment values, change OAuth provider settings, touch Supabase remotely, change Vercel configuration, or request/print secrets.

## Decision

Production decision: **no-go**.

RM-44 creates the smoke plan only. The plan may not be executed until the owner explicitly approves a supervised production review and smoke window.

## Current source baseline

Snapshot date: 2026-06-29.

| Area | Required state before using this runbook |
| --- | --- |
| GitHub source | `main` candidate commit explicitly recorded |
| `staging` branch | aligned with `main` or explicitly out of scope |
| Vercel production project | `tryhard-names-web` |
| Vercel staging project | `tryhardnames-staging` |
| Production runtime | no-go until owner approval |
| osu! runtime gate behavior | production blocked unless all RM-43 gates are accepted |
| Riot runtime | blocked |
| Supabase production | identity must be confirmed through secure UI only |
| Secrets/env values | never copied into chat/docs/logs/screenshots |

## Production gates from RM-43

Production osu! runtime must remain blocked unless all of these gate names are intentionally satisfied in the production environment:

- `OSU_PRODUCTION_GO_NO_GO_ACCEPTED`
- `OSU_PRODUCTION_CALLBACK_REVIEWED`
- `OSU_PRODUCTION_ROLLBACK_ACCEPTED`
- `OSU_PRODUCTION_MONITORING_REVIEWED`
- `OSU_PRODUCTION_SOURCE_GUARDS_PASSED`

`OSU_PROVIDER_ENABLED=true` alone is not enough in production.

If any production gate is missing, the expected safe state is:

```txt
status: production_gate_blocked
configured: false
```

## Non-negotiable boundaries

Do not execute this runbook if any of these are true:

- owner has not explicitly approved the production smoke window;
- the operator cannot distinguish `tryhard-names-web` from `tryhardnames-staging`;
- production and staging Supabase identifiers are mixed;
- production and staging OAuth callbacks are mixed;
- localhost callbacks are present in production provider settings;
- callback query strings would be copied into chat/docs/screenshots/logs;
- env values, secrets, JWTs, access tokens, refresh tokens, service role keys, or database passwords would be copied into chat/docs/screenshots/logs;
- Riot runtime is in scope;
- store, checkout, billing, payments, ranking, MMR/ELO, match history, live tracker, hidden-player inference, or official endorsement claims are in scope.

## Required operator roles

| Role | Responsibility |
| --- | --- |
| Owner | Approves or rejects the production smoke window and rollback acceptance. |
| Operator | Executes checklist steps and records sanitized evidence only. |
| Reviewer | Confirms source commit, gates, logs, and no-go boundaries before and after smoke. |

The same person may act as operator and reviewer only if explicitly accepted by the owner.

## Preflight checklist

### 1. Source control

Record safe metadata only:

```txt
repo: manzur316/TryhardNames
candidate branch: main
candidate commit: <sha>
rm: RM-44+ approved candidate
```

Required:

- no unmerged production-affecting PRs;
- candidate commit has passing checks;
- `main` and `staging` state is known;
- rollback commit or previous known-good deployment is identified.

### 2. Vercel project identity

Confirm through the Vercel UI/API without exposing env values:

| Check | Expected |
| --- | --- |
| Production project | `tryhard-names-web` |
| Production domains | `tryhardnames.com`, `www.tryhardnames.com` |
| Staging project | `tryhardnames-staging` |
| Staging domains | staging-only domains |
| Candidate deployment | exact commit recorded |

Abort if staging domains appear in production callback/origin settings, or if production domains appear in staging-only smoke notes.

### 3. Supabase identity

Confirm through Supabase UI without exposing secrets:

- production project name/ref is the expected production project;
- staging project/ref is not selected;
- service role key is not copied;
- DB URL/password is not copied;
- owner data privacy is preserved;
- rollback data handling is understood.

Safe evidence format:

```txt
Supabase production project identity confirmed by owner/operator.
No service role key, database password, JWT, or connection string recorded.
```

### 4. Google Parent Auth

Confirm through provider dashboards or Supabase Auth UI without exposing secrets:

- Google remains Parent Auth only;
- Gmail/Drive/Calendar scopes are not requested;
- production origin/callback is production-only;
- staging callback is not configured as production callback;
- localhost callback is not configured as production callback.

### 5. osu! provider settings

Confirm through osu! provider dashboard without exposing secrets:

- production callback exactly matches the production API callback path;
- staging callback is not configured as production callback;
- localhost callback is not configured as production callback;
- scopes remain minimal: `identify public`;
- Client Secret is not copied into chat/docs/logs/screenshots.

### 6. Runtime gates

Before any enablement attempt, confirm all required RM-43 gate names have an intentional owner-approved decision.

Safe evidence format:

```txt
OSU_PRODUCTION_GO_NO_GO_ACCEPTED: reviewed by owner
OSU_PRODUCTION_CALLBACK_REVIEWED: reviewed by owner/operator
OSU_PRODUCTION_ROLLBACK_ACCEPTED: reviewed by owner
OSU_PRODUCTION_MONITORING_REVIEWED: reviewed by owner/operator
OSU_PRODUCTION_SOURCE_GUARDS_PASSED: reviewed by operator
```

Do not record values.

### 7. Monitoring and log redaction

Confirm before smoke:

- runtime errors can be inspected;
- OAuth callback failures are visible without logging callback code/state;
- token exchange failures are visible without logging token values;
- Supabase write failures are visible without logging service role keys or raw payloads;
- public projection failures are visible without exposing private proof data.

## Candidate smoke sequence

This sequence is for a future approved window only.

### Phase A — blocked-state verification

Purpose: prove production is still safe before enabling anything.

Expected with production project and `OSU_PROVIDER_ENABLED` disabled or gates missing:

```txt
osu runtime status: disabled OR production_gate_blocked
configured: false
public osu! projection: absent unless prior owner-public data is already intentionally present
Riot runtime: blocked
```

Abort if production reports osu! `configured=true` before owner gate acceptance.

### Phase B — owner-controlled enablement window

Only after owner approval:

1. Confirm production project is `tryhard-names-web`.
2. Confirm rollback has been accepted.
3. Confirm callback has been reviewed.
4. Confirm monitoring/log redaction has been reviewed.
5. Confirm source guards passed on exact candidate commit.
6. Confirm all RM-43 gates have owner-approved decisions.
7. Apply production runtime changes only through secure environment UI.
8. Do not paste env values anywhere.

### Phase C — private owner link smoke

Use a controlled owner account.

Expected steps:

1. Sign in with Google Parent Auth.
2. Open private `/account`.
3. Start `Connect osu!` from private account controls only.
4. Complete osu! authorization in browser.
5. Return through production callback.
6. Verify private linked provider and proof state through sanitized status only.
7. Confirm provider token vault remains empty.
8. Confirm proof remains private by default.

Safe evidence format:

```txt
owner auth: pass
osu callback: pass
linked_provider_accounts: provider=osu, status=verified, visibility=private, count=1
verified_proofs: provider=osu, status=current, visibility=private, count=1
provider_token_vault rows: 0
```

### Phase D — owner visibility and public projection smoke

Only if owner explicitly chooses public proof visibility and Passport publication consent.

Expected:

- owner can set osu! proof public;
- owner can publish Passport with consent;
- public projection serves only allowlisted provider/proof fields;
- no tokens, owner IDs, raw payloads, emails, callback state/code, rank, PP, score, match-history, best-play, beatmap, live tracker, or hidden-player data appears.

Allowed public provider fields:

- `providerId`
- `displayName`
- `externalUsername`
- `profileUrl`
- `verifiedAt`

Allowed proof fields:

- `type`
- `label`
- `source`
- `observedAt`
- `visibility`

### Phase E — unlink/revoke smoke

Expected:

1. Owner disconnects osu! from `/account`.
2. Linked provider account transitions to revoked/private.
3. Verified proof transitions to revoked/private.
4. Public projection no longer serves osu! provider/proof.
5. Provider token vault remains empty.

Safe evidence format:

```txt
linked_provider_accounts: provider=osu, status=revoked, visibility=private, count=1
verified_proofs: provider=osu, status=revoked, visibility=private, count=1
active_osu_connections: 0
active_osu_proofs: 0
provider_token_vault rows: 0
public projection osu provider/proof counts: 0
```

## Abort criteria

Abort immediately if any of these occur:

- callback code/state is visible in logs, screenshots, docs, or chat;
- access token or refresh token appears anywhere outside provider exchange internals;
- service role key, database password, JWT, or env file appears in chat/docs/logs/screenshots;
- production callback points to staging or localhost;
- staging callback points to production unexpectedly;
- provider token vault stores access/refresh token data;
- public projection exposes blocked fields;
- owner cannot unlink/revoke;
- Riot runtime becomes active;
- store/payments/cosmetics/tracker/ranking features appear in scope.

## Rollback plan

Preferred rollback order:

1. Disable osu! runtime gate in secure production environment UI.
2. Remove or unset production approval gates if needed.
3. Revert Vercel deployment to previous known-good deployment if runtime behavior remains unsafe.
4. Set affected provider/proof rows to private/revoked through reviewed operational tooling if public serving must be cleared.
5. Rotate osu! Client Secret only if exposure is suspected.
6. Re-run source guards and smoke checks before any future enablement attempt.

Avoid destructive database rollback unless explicitly reviewed, because private owner proof records may exist.

## Evidence packet template

Use this sanitized template only:

```txt
RM: RM-44 production candidate smoke
candidate commit: <sha>
Vercel project: tryhard-names-web
production domains confirmed: yes/no
Supabase production identity confirmed: yes/no, no secrets recorded
Google Parent Auth production origin/callback reviewed: yes/no
osu! production callback reviewed: yes/no
rollback accepted: yes/no
monitoring/log redaction reviewed: yes/no
source guards passed: yes/no
blocked-state verification: pass/fail
private owner link smoke: pass/fail/not run
public projection smoke: pass/fail/not run
unlink/revoke smoke: pass/fail/not run
provider_token_vault rows: sanitized count only
production decision after smoke: go/no-go
operator notes: sanitized only
```

## RM-44 non-goals

- No production launch.
- No production provider activation.
- No Supabase remote reads or writes by this PR.
- No Supabase migrations.
- No Vercel configuration changes.
- No OAuth provider configuration changes.
- No environment value changes.
- No secrets committed, requested, printed, or documented.
- No Riot runtime activation.
- No public Riot/Discord provider linking.
- No store, checkout, billing, payments, ranking, MMR/ELO, match-history dump, live tracker, hidden-player inference, or official endorsement claims.

## Acceptance checklist

- Production candidate smoke sequence documented.
- RM-43 production gates included.
- Abort criteria documented.
- Rollback plan documented.
- Sanitized evidence template documented.
- Production no-go preserved.
- No env values or secrets recorded.
- No remote service configuration changed.
