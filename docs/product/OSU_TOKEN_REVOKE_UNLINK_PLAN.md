# RM-27 osu! Token, Revoke And Unlink Plan

## Token Strategy

RM-27 uses `no_refresh_token_storage`.

Reason:

- RM-26 identified token storage as a critical condition;
- the existing token vault intentionally blocks ciphertext;
- RM-27 can prove ownership with one Authorization Code exchange and `/me`;
- immediate revoke avoids long-lived token retention in this foundation.

## Callback Token Lifecycle

1. Exchange OAuth code server-side.
2. Receive access/refresh token response in API memory.
3. Call osu! `/me`.
4. Revoke current token server-side.
5. Discard token response.
6. Persist only minimal account/proof data.

No access token or refresh token is returned to browser.

## Storage

RM-27 does not store:

- access token;
- refresh token;
- raw token response;
- token ciphertext;
- provider raw payload.

`provider_token_vault_no_ciphertext_in_pr16` remains active.

If future RM work needs refresh token storage, it must add:

- server-side encryption;
- key management;
- rotation handling;
- no direct client grants;
- revoke/delete policy;
- DB tests.

## Unlink/Revoke

Owner-only unlink:

- validates Parent Auth bearer token server-side;
- checks owner owns the Passport;
- checks linked provider account is `osu`;
- marks linked provider account `revoked`;
- sets visibility `private`;
- marks provider proofs `revoked`;
- sets proof visibility `private`;
- updates any existing token vault row to `revoked`;
- inserts audit event without secrets;
- returns idempotent success for already revoked account.

Because RM-27 stores no token, unlink cannot call osu! revoke later. Revoke is attempted during callback while token exists in memory.

## Stale Proof Behavior

RM-27 creates profile-linked proof as private and current at observation time.

Stale rules:

- no background refresh exists in RM-27;
- no public stale osu! proof is shown by default;
- future RM-28 smoke/QA must define a freshness window before public display;
- if stale is introduced later, it must be explicit and not silently current.

Revoked rules:

- revoked provider cannot satisfy publish policy;
- revoked proof never appears publicly;
- unlink makes proof private and revoked.

## Failure Behavior

Fail closed when:

- token exchange fails;
- `/me` fails;
- immediate revoke fails;
- state is invalid;
- external osu! account is already linked to another owner.

No partial public proof should be created on failure.
