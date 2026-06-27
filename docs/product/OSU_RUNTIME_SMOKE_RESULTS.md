# RM-28 osu! Runtime Smoke Results

Date: 2026-06-27

Worktree:

```txt
C:\Users\Juandi Gamer\Documents\TryhardNames-rm28-osu-runtime-smoke
```

Branch:

```txt
test/rm28-osu-runtime-smoke-owner-linking
```

Base HEAD:

```txt
8ee0ceea7b090205d5f4dc543f9f8f5ea6337337
```

## Result

Result: `partial-pass`.

Blocker: real osu! callback requires human authorization in browser. Codex can generate and verify the link-intent response locally, but cannot sign in to osu! as the owner or approve the OAuth consent.

## Local Services

Expected local services:

- Supabase local: `http://127.0.0.1:54321`;
- API local: `http://localhost:3001`;
- Web local: `http://localhost:5173`.

PocketBase was not used.

## Smoke Matrix

| Check | Result | Evidence |
| --- | --- | --- |
| HEAD matches RM-27 merge | pass | `8ee0ceea7b090205d5f4dc543f9f8f5ea6337337`. |
| Runtime status endpoint | pass | `GET /api/v1/integrations/osu` returned configured in local runtime. |
| Status response safe fields | pass | No client secret, service role key, access token, refresh token, OAuth code, or token JSON fields detected. |
| Local owner/JWT preparation | pass | Local-only Supabase owner, JWT, and private Passport draft were prepared without printing JWT. |
| Link intent | pass | `POST /link-intent` returned HTTP 201 with `authorizeUrl`, `expiresAt`, `identify public`, and `no_refresh_token_storage`. |
| Human authorizeUrl | blocked-human | Requires user to open authorize URL and authorize osu!. |
| Real callback | blocked-human | Not completed by Codex. |
| Linked provider DB verification | blocked-callback | Requires successful callback row. |
| Verified proof DB verification | blocked-callback | Requires successful callback row. |
| Token vault non-persistence | partial-pass | Token vault was not readable through REST, as expected for the protected table. DB constraints and tests keep `token_ciphertext` blocked; real callback evidence still pending. |
| Unlink/revoke | blocked-callback | Requires linked provider account id from callback. |
| Public projection revoked proof | blocked-callback | Requires linked/revoked proof from callback. |
| Negative cases | partial-pass | Link-intent without auth returned 401, link-intent without `passportId` returned 400, callback without code returned 400, callback without state returned 400, and callback with altered state returned 400. Replay and other-owner unlink require callback fixture. |

## Local Smoke Values

The local smoke produced:

```txt
STATUS_OK=true
STATUS_VALUE=configured
RUNTIME_CONFIGURED=true
TOKEN_STRATEGY=no_refresh_token_storage
LINK_INTENT_STATUS=201
LINK_INTENT_HAS_AUTHORIZE_URL=true
LINK_INTENT_HAS_EXPIRES_AT=true
LINK_INTENT_SCOPES=identify public
LINK_INTENT_TOKEN_STRATEGY=no_refresh_token_storage
INTENT_ROWS=1
CALLBACK_STATE_ROWS=1
TOKEN_VAULT_REST_READABLE=false
NO_AUTH_STATUS=401
MISSING_PASSPORT_STATUS=400
CALLBACK_MISSING_CODE_STATUS=400
CALLBACK_MISSING_STATE_STATUS=400
CALLBACK_ALTERED_STATE_STATUS=400
MANUAL_AUTHORIZATION_REQUIRED=true
```

The generated JWT, authorize URL, OAuth state, and any local secret values were not recorded in this document.

## Security Notes

The smoke and docs did not include:

- `OSU_CLIENT_SECRET`;
- `SUPABASE_SERVICE_ROLE_KEY`;
- access token;
- refresh token;
- OAuth code;
- OAuth state value;
- real osu! profile payload;
- remote Supabase data;
- Vercel configuration.

## Required Manual Follow-Up

To complete full-pass smoke, the owner must:

1. run the local services;
2. prepare `LOCAL_OWNER_JWT` and `LOCAL_PASSPORT_ID`;
3. call `POST /api/v1/integrations/osu/link-intent`;
4. open the returned `authorizeUrl`;
5. authorize osu! in the browser;
6. verify callback response;
7. verify local DB rows;
8. run unlink;
9. verify revoked/private DB rows and public projection non-leakage.

## RM-29 Recommendation

Next recommended RM:

```txt
RM-29 osu! Smoke Blocker Fixes
```

Reason: the only remaining full-pass blocker is the manual osu! authorization and callback evidence. If the owner completes that smoke successfully, RM-29 should move to owner-linking UI hardening and private account UX. If any leakage or storage issue appears, RM-29 must become runtime security fixes.
