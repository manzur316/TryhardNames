# RM-28 osu! Runtime Smoke Scope

RM-28 is a QA, security review, and local runtime operations milestone for the RM-27 osu! Runtime Foundation.

## Goal

Validate the configured local/staging osu! runtime path before any public launch or public provider UI:

- status/config smoke;
- owner-only link-intent smoke;
- manual authorizeUrl handoff;
- callback verification;
- local DB proof verification;
- token non-persistence verification;
- unlink/revoke verification;
- negative cases;
- repeatable runbook and results.

## Current PR Result

Status: `partial-pass`.

The local smoke can validate configured status and owner link-intent. Full callback, DB verification, unlink/revoke, and public projection proof checks are blocked until a human owner authorizes osu! in a browser.

## Implements

- `OSU_RUNTIME_SMOKE_QA.md`;
- `OSU_OWNER_LINKING_SMOKE_RUNBOOK.md`;
- `OSU_RUNTIME_SMOKE_RESULTS.md`;
- RM-28 source guard tests;
- roadmap updates from RM-27 to RM-28;
- RM-29 recommendation based on smoke result.

## Non-Goals

RM-28 does not implement:

- production launch;
- public osu! provider linking UI;
- osu! Parent Auth;
- new OAuth routes;
- new provider token strategy;
- refresh-token storage;
- encrypted token vault runtime;
- rank, PP, score, best-play, beatmap, match-history, or live tracker surfaces;
- `/cosmetics`;
- store, checkout, billing, subscriptions, payments, or inventory;
- Supabase remote changes;
- Vercel changes;
- deploy.

## Exit Criteria

Full pass requires:

- status endpoint configured and safe;
- link-intent owner-only and safe;
- real osu! authorization callback succeeds;
- callback response is sanitized;
- `linked_provider_accounts` has private verified osu! row;
- `verified_proofs` has private `osu:profile_linked` row;
- `provider_token_vault` stores no token ciphertext and no refresh token;
- unlink marks account/proof revoked and private;
- revoked proof stays out of public projection;
- negative cases pass;
- smoke results document exact outcome without secrets or tokens.

Because human authorization is still required, this PR records partial-pass and keeps production launch blocked.

## Next RM

Partial smoke result:

```txt
RM-29 osu! Smoke Blocker Fixes
```

Full smoke pass result:

```txt
RM-29 osu! Owner Linking UI Hardening / Private Account UX
```

Security failure result:

```txt
RM-29 osu! Runtime Security Fixes
```
