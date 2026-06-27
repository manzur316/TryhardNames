# RM-27 osu! Runtime Security Review

## RM-27 Server Boundary Audit

| Pregunta | Resultado |
| --- | --- |
| Existe backend/server/edge function seguro? | Si. `apps/api` corre server-side y Vercel enruta `/api/*` a `api/index.mjs`, que carga Express. |
| Donde se haria token exchange? | `GET /api/v1/integrations/osu/callback` en `apps/api`, nunca en la SPA. |
| Donde se guardaria client secret? | Runtime env server-side `OSU_CLIENT_SECRET`, no en `apps/web`, no en `.env.example` con valor real. |
| Donde se cifrarian tokens? | RM-27 no guarda refresh/access tokens. Si RM-29+ requiere storage, debe agregar cifrado server-side antes de levantar `token_ciphertext is null`. |
| Donde se ejecutaria revoke? | En `apps/api` inmediatamente despues de `/me`, con el access token todavia en memoria. |
| Que migraciones hacen falta? | Permitir provider `osu` en constraints existentes y permitir scopes `identify public` solo para osu! intents. |
| Que no puede hacerse en SPA? | Client secret, token exchange, `/me` con provider token, revoke, service role writes, raw token handling. |
| Que queda feature-gated? | Todo el runtime via `OSU_PROVIDER_ENABLED=false` default y env server-only completos. |

Decision: safe limited server-side foundation. No production launch.

## Threat Model

Threats:

- CSRF state replay;
- stolen/missing OAuth code;
- client secret exposure;
- access/refresh token exposure;
- raw provider payload leakage;
- link hijack to another owner;
- public projection leaking private provider data;
- unlink failing to hide proof;
- tracker/ranking drift.

RM-27 controls:

- random OAuth state;
- HMAC state hash persisted, not raw state;
- short TTL;
- one-time state consumption;
- state bound to owner and Passport;
- Parent Auth bearer validation before link intent/status/unlink;
- callback server-side;
- token exchange server-side;
- `/me` server-side;
- immediate revoke;
- no refresh-token storage;
- private proof visibility by default;
- revoked unlink hides provider/proofs.

## Secret Boundary

Server-only env names:

- `OSU_CLIENT_SECRET`;
- `OSU_STATE_SECRET`;
- `SUPABASE_SERVICE_ROLE_KEY`.

These names must not be added to `apps/web` code or any `VITE_*` variable.

`apps/api/.env.example` lists names only and contains no real values.

## Token Boundary

RM-27 never stores:

- access token;
- refresh token;
- raw token response;
- token ciphertext.

The callback can hold an access token in memory only long enough to:

1. call osu! `/me`;
2. revoke current token;
3. discard token.

If revoke fails, linking fails closed.

## Callback Safety

Callback rejects:

- missing code;
- missing state;
- unknown state;
- mismatched state;
- expired state;
- reused/consumed state;
- token exchange failure;
- `/me` failure;
- revoke failure;
- external account ownership conflict.

Callback response is sanitized and does not expose code, token, raw OAuth response, raw `/me` payload, service role key or client secret.

## Supabase Boundary

API uses service role server-side to write provider rows. Browser clients still cannot read/write token vault directly.

RM-27 migration:

- does not grant token vault select/insert/update/delete to anon/authenticated;
- does not remove RLS;
- does not permit token ciphertext;
- does not expose raw provider metadata.

## Privacy Boundary

The first proof is private:

- linked provider visibility is `private`;
- verified proof visibility is `private`;
- public projection remains allowlisted;
- external account id is not public;
- profile URL is metadata_safe for owner/runtime, not public projection by default.

## Security Decision

RM-27 is acceptable as a disabled-by-default server-side foundation.

RM-27 is not approval to:

- enable production;
- store refresh tokens;
- expose public osu! proof by default;
- build polling/sync;
- build rank/PP/score/match-history surfaces.
