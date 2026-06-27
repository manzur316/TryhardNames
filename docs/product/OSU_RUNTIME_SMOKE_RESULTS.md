# osu! Runtime Smoke Results

Date: 2026-06-27

## Result

RM-28 result: `partial-pass`.

Result: `partial-pass` for the historical RM-28 smoke.

RM-29 result: `full-pass`.

RM-29 completed the RM-28 blocker by running the real human-authorized osu! callback locally and verifying DB state, token non-persistence, unlink/revoke, public projection non-leakage, and negative cases.

This was local-only smoke. It did not touch production, remote Supabase, Vercel, PocketBase, public provider UI, store/payments, `/cosmetics`, or tracker/ranking behavior.

## Local Services

Validated local services:

- Supabase local: `http://127.0.0.1:54321`;
- API local: `http://localhost:3001`;
- Web local: `http://localhost:5173`;
- registered osu! callback: `http://localhost:3001/api/v1/integrations/osu/callback`.

## RM-29 Manual Authorization

Human authorization was required and completed.

One earlier authorization attempt reached callback after the CSRF state TTL and correctly failed closed with HTTP 400. A fresh link-intent was created and authorized within the TTL; that callback completed successfully.

The authorize URL, OAuth `code`, OAuth `state`, local owner JWT, and local secret values were not recorded in this document.

## RM-29 Smoke Matrix

| Check | Result | Evidence |
| --- | --- | --- |
| Runtime status endpoint | pass | `GET /api/v1/integrations/osu` returned HTTP 200 and configured runtime. |
| Status response safe fields | pass | No client secret, service role key, access token, refresh token, OAuth code, or sensitive token JSON property was exposed. |
| Assisted smoke script | pass | `apps/api/scripts/osuManualSmoke.mjs` prepared local owner/JWT/passport context, created link-intent, opened authorization, and verified completion without printing secrets/tokens/code/state. |
| Link intent | pass | `POST /link-intent` returned HTTP 201 with authorize URL, `identify public`, and `no_refresh_token_storage`. |
| Human authorizeUrl | pass | User opened osu!, authorized the local registered callback, and reported callback completion. |
| Real callback | pass | Callback produced linked status and created the expected private local records. |
| Linked provider DB verification | pass | `linked_provider_accounts.provider = 'osu'`, `status = 'verified'`, `visibility = 'private'`. |
| Verified proof DB verification | pass | `verified_proofs.provider = 'osu'`, `source_key = 'osu:profile_linked'`, `status = 'current'`, `visibility = 'private'`. |
| Token vault non-persistence | pass | `provider_token_vault` had zero osu! token rows for the smoke link; no `token_ciphertext`, access token, or refresh token was persisted. |
| Public projection before unlink | pass | Published local Passport projection existed only to exercise `/id/:slug` policy; private osu! provider/proof did not appear and internal ids/metadata/token status were absent. |
| Callback replay | pass | Replay with the consumed state returned HTTP 400. |
| Altered state | pass | Altered state returned HTTP 400. |
| Other-owner unlink | pass | Other owner unlink attempt returned HTTP 404. |
| Missing auth | pass | Link-intent without auth returned HTTP 401. |
| Unlink/revoke | pass | Owner unlink returned revoked status and `publicServingAllowed = false`; second unlink was idempotent. |
| DB after unlink | pass | Linked account became `status = 'revoked'`, `visibility = 'private'`; proof became `status = 'revoked'`, `visibility = 'private'`. |
| Public projection after unlink | pass | Public projection returned unavailable/null because no verified provider remained; revoked proof did not appear. |

## RM-29 Smoke Values

The successful RM-29 completion produced:

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

## Security Notes

The smoke and docs did not include:

- `OSU_CLIENT_SECRET`;
- `SUPABASE_SERVICE_ROLE_KEY`;
- access token;
- refresh token;
- OAuth code;
- OAuth state value;
- local owner JWT;
- real osu! profile payload;
- remote Supabase data;
- Vercel configuration.

The token strategy remains:

```txt
no_refresh_token_storage
```

## RM-30 Recommendation

Next recommended RM:

```txt
RM-30 osu! Owner Linking UI Hardening / Private Account UX
```

Reason: RM-29 closed the human authorization smoke blocker with full local callback, DB, token vault, unlink/revoke, public projection, and negative-case evidence. The next work can harden private owner UX without changing production, public provider UI, token strategy, or proof visibility defaults.
