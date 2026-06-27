# RM-27 osu! Runtime Scope

RM-27 implements osu! Runtime Foundation as a disabled-by-default, server-side-only foundation.

## Implements

- provider id `osu`;
- server-side config schema;
- disabled-by-default runtime gate;
- OAuth Authorization Code link intent;
- CSRF-safe state hash with TTL and one-time use;
- callback endpoint in `apps/api`;
- server-side token exchange;
- server-side `/me` ownership verification;
- immediate token revoke;
- no-refresh-token storage strategy;
- owner-only connection status;
- owner-only unlink/revoke-local command;
- private `profile_linked` proof foundation;
- migration to allow provider `osu` and minimal scopes;
- docs and tests.

## Server Boundary

Runtime path: `apps/api`.

Not allowed in SPA:

- `OSU_CLIENT_SECRET`;
- token exchange;
- access token;
- refresh token;
- provider `/me` call;
- service role key;
- revoke call.

## Runtime Gate

Default: disabled.

Required before local/staging operation:

- `OSU_PROVIDER_ENABLED=true`;
- `OSU_CLIENT_ID`;
- `OSU_CLIENT_SECRET`;
- `OSU_REDIRECT_URI`;
- `OSU_STATE_SECRET`;
- `SUPABASE_URL`;
- `SUPABASE_SERVICE_ROLE_KEY`.

No real values are committed.

## Non-Goals

RM-27 does not implement:

- production launch;
- public provider linking UI;
- public proof display by default;
- refresh-token storage;
- encrypted token vault runtime;
- background sync jobs;
- rank/PP/score proof;
- match-history dump;
- live tracker;
- hidden-player inference;
- `/cosmetics`;
- store/payment;
- checkout;
- billing;
- Supabase remote changes;
- Vercel changes;
- deploy.

## RM-28

Next milestone if RM-27 passes CI and audit:

```txt
RM-28 osu! Runtime Smoke / Owner Linking QA
```

RM-28 should test local/staging env, registered callback, owner-only link, callback, unlink, revoked proof, public projection non-leakage and operational rollback.
