# RM-29 osu! Smoke Blocker Fixes Scope

RM-29 is a QA, security review, and local runtime operations milestone. It closes the RM-28 human authorization blocker by completing the real osu! owner-linking smoke locally.

## Result

Status: `full-pass`.

The user authorized osu! in the browser, the local callback succeeded, and the local smoke verified DB rows, token non-persistence, unlink/revoke, public projection non-leakage, and negative cases.

## Goal

Complete the blocked RM-28 checks without adding new product features:

- human-authorized osu! callback;
- private `linked_provider_accounts` verification;
- private `verified_proofs` verification;
- `provider_token_vault` non-persistence verification;
- owner-only and idempotent unlink;
- revoked/private DB state;
- public projection non-leakage before and after unlink;
- callback replay and altered-state failure;
- other-owner unlink failure;
- missing-auth failure;
- repeatable assisted runbook.

## Implements

- Assisted local smoke script: `apps/api/scripts/osuManualSmoke.mjs`;
- RM-29 full-pass update in `OSU_RUNTIME_SMOKE_RESULTS.md`;
- assisted runbook updates in `OSU_OWNER_LINKING_SMOKE_RUNBOOK.md`;
- source/docs guards for RM-29 criteria;
- roadmap handoff to RM-30.

## Non-Goals

RM-29 does not implement:

- production launch;
- remote Supabase changes;
- Vercel changes;
- PocketBase usage;
- public osu! provider linking UI;
- osu! as Parent Auth;
- public proof promotion;
- refresh-token storage;
- encrypted token vault activation;
- provider polling or sync jobs;
- rank, PP, score, best-play, beatmap, match-history, or live tracker surfaces;
- `/cosmetics`;
- store, checkout, billing, subscriptions, payments, or inventory;
- deploy.

## Evidence

The successful smoke produced:

```txt
RM29_COMPLETE=pass
CALLBACK_REAL=pass
LINKED_PROVIDER_ACCOUNT_STATUS=verified
LINKED_PROVIDER_ACCOUNT_VISIBILITY=private
VERIFIED_PROOF_STATUS=current
VERIFIED_PROOF_VISIBILITY=private
TOKEN_VAULT_ROWS_BEFORE_UNLINK=0
PUBLIC_PROJECTION_BEFORE_UNLINK=true
UNLINK_STATUS=revoked
UNLINK_IDEMPOTENT_SECOND_CALL=true
REVOKED_ACCOUNT_STATUS=revoked
REVOKED_ACCOUNT_VISIBILITY=private
REVOKED_PROOF_STATUS=revoked
REVOKED_PROOF_VISIBILITY=private
PUBLIC_PROJECTION_AFTER_UNLINK=false
NEGATIVE_CALLBACK_REPLAY_STATUS=400
NEGATIVE_ALTERED_STATE_STATUS=400
NEGATIVE_OTHER_OWNER_UNLINK_STATUS=404
NEGATIVE_MISSING_AUTH_STATUS=401
CONTEXT_CLEARED=true
```

No authorize URL, OAuth `code`, OAuth `state`, JWT, access token, refresh token, client secret, service role key, or real osu! profile payload is recorded.

## Exit Criteria

Full pass requires:

- status endpoint configured and safe;
- link-intent owner-only and safe;
- real osu! authorization callback succeeds;
- callback response is sanitized;
- `linked_provider_accounts` has a private verified osu! row;
- `verified_proofs` has a private current `osu:profile_linked` row;
- `provider_token_vault` stores no token ciphertext and no refresh token;
- unlink marks account/proof revoked and private;
- unlink is owner-only and idempotent;
- private proof does not appear in public projection;
- revoked proof does not appear in public projection;
- negative cases pass.

RM-29 meets these criteria locally.

## Next RM

Full smoke passed:

```txt
RM-30 osu! Owner Linking UI Hardening / Private Account UX
```

If future smoke uncovers leakage, token persistence, owner isolation failure, or revoke failure, the next RM must become osu! Runtime Security Fixes instead.
