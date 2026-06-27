# RM-27 osu! Runtime Foundation

RM-27 implementa una foundation controlada para osu! como linked provider de Gaming Passport. No es lanzamiento publico, no activa produccion y no agrega UI publica de conexion.

El runtime vive en la frontera server-side de `apps/api` y queda desactivado por default.

## Decision

Decision: conditional foundation.

El repo permite una foundation segura limitada porque existe un API server-side (`apps/api`) servido por la ruta `/api/*` de Vercel. RM-27 usa esa frontera para mantener `OSU_CLIENT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, token exchange, llamada `/me` y revoke fuera del browser.

## Runtime Gating

Default:

```txt
OSU_PROVIDER_ENABLED=false
```

El runtime solo queda configurado si existen, server-side:

- `OSU_PROVIDER_ENABLED=true`;
- `OSU_CLIENT_ID`;
- `OSU_CLIENT_SECRET`;
- `OSU_REDIRECT_URI`;
- `OSU_STATE_SECRET`;
- `SUPABASE_URL`;
- `SUPABASE_SERVICE_ROLE_KEY`.

No hay valores reales de env. No hay secretos en `apps/web`. No hay provider linking UI publica.

## API Foundation

Endpoints server-side:

- `GET /api/v1/integrations/osu` - estado seguro de configuracion;
- `GET /api/v1/integrations/osu/status` - owner-only connection status;
- `POST /api/v1/integrations/osu/link-intent` - crea state CSRF-safe y devuelve authorize URL solo si esta configurado;
- `GET /api/v1/integrations/osu/callback` - callback server-side;
- `POST /api/v1/integrations/osu/unlink` - unlink/revoke local owner-only.

Todos fallan cerrado si el provider esta disabled o incompleto.

## Ownership Flow

Modelo:

1. Owner autenticado llama `link-intent` con Bearer token de Parent Auth.
2. API valida al owner con Supabase Auth server-side.
3. API genera state aleatorio y guarda hash HMAC en Supabase.
4. API devuelve authorize URL de osu! con `identify public`.
5. osu! redirige al callback server-side con `code` y `state`.
6. API valida hash, TTL, estado pending y one-time use.
7. API intercambia code por token server-side.
8. API llama `/me` server-side.
9. API revoca inmediatamente el token actual.
10. API crea/actualiza `linked_provider_accounts` y un proof privado `profile_linked`.
11. API marca state/intent como consumed.

## Token Strategy

RM-27 usa:

```txt
tokenStrategy: no_refresh_token_storage
```

No se guarda access token ni refresh token. El token se usa solo dentro del callback para llamar `/me` y luego se revoca inmediatamente.

El token vault conserva la restriccion `token_ciphertext is null`; RM-27 no abre storage cifrado real. Si revoke inmediato falla, el callback falla cerrado y no completa el link.

## Proof Model

Proof minimo:

- type conceptual: `profile_linked`;
- provider: `osu`;
- label: `Linked osu! account`;
- source: `linked_provider`;
- verification method: `oauth`;
- visibility: `private` por default;
- no rank, PP, score, best plays, match history, beatmap history, live status ni ranking alternative.

## Public Projection

RM-27 no cambia la proyeccion publica para exponer osu! por default.

La cuenta y proof se crean como `private`. Public projection sigue allowlisted y no expone:

- external account id;
- token status internals;
- raw API payload;
- raw metadata;
- access token;
- refresh token;
- service role key;
- OAuth code.

Revoked proof never public.

## Migrations

RM-27 agrega una migracion local:

- permite `osu` como provider id en tablas provider existentes;
- permite scopes `identify` y `public` solo para osu! connection intents;
- mantiene `provider_token_vault_no_ciphertext_in_pr16`;
- no crea tablas nuevas;
- no toca Supabase remoto.

## Non-Goals

RM-27 no implementa:

- production launch;
- public provider linking UI;
- browser token exchange;
- browser client secret;
- token storage real;
- refresh token retention;
- provider sync jobs que llamen osu!;
- rank/PP/score/match-history/live tracker;
- `/cosmetics`;
- store/payment;
- Vercel changes;
- Supabase remote changes;
- deploy.

## RM-28

Si RM-27 pasa audit y CI, el siguiente milestone recomendado es:

```txt
RM-28 osu! Runtime Smoke / Owner Linking QA
```

RM-28 debe validar el flujo con env de staging, callback registrado, smoke owner-only, unlink, revoke y public projection antes de cualquier production launch.

## RM-29

RM-29 completed the human-authorized local smoke after RM-28's partial-pass blocker. The callback, private DB rows, token vault non-persistence, owner-only unlink/revoke, public projection non-leakage, and negative cases passed locally.

The next recommended milestone is:

```txt
RM-30 osu! Owner Linking UI Hardening / Private Account UX
```
