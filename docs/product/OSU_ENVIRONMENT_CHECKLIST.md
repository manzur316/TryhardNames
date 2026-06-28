# osu! Environment Checklist

## Scope

This checklist lists the environment configuration required before staging or production osu! runtime can be enabled. It intentionally contains no real secret values.

Do not commit env files, print secrets, paste runtime values into docs, or expose server-only variables to the browser.

## API Environment Variables

| Variable | Required For Staging | Required For Production | Boundary | Notes |
| --- | --- | --- | --- | --- |
| `OSU_PROVIDER_ENABLED` | yes | yes, only after go/no-go | server | Must remain disabled where osu! should not run. |
| `OSU_CLIENT_ID` | yes | yes | server | OAuth app identifier. Do not expose in docs with real values. |
| `OSU_CLIENT_SECRET` | yes | yes | server secret | Never expose to browser, logs, screenshots, or docs. |
| `OSU_REDIRECT_URI` | yes | yes | server | Must exactly match the registered callback for that environment. |
| `OSU_STATE_SECRET` | yes | yes | server secret | Must be long, random, environment-specific, and rotated if exposed. |
| `OSU_AUTHORIZATION_URL` | yes | yes | server | Should point to the official osu! OAuth authorization endpoint. |
| `OSU_TOKEN_ENDPOINT` | yes | yes | server | Should point to the official osu! token endpoint. |
| `OSU_API_BASE_URL` | yes | yes | server | Used only by API server-side code. |
| `OSU_SCOPES` | yes | yes | server | Initial scope remains minimal: identify and public. |
| `SUPABASE_URL` | yes | yes | server | Use the environment-specific Supabase project. |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | yes | server secret | Service role stays server-side only. |
| CORS/API origin config | yes | yes | server | Must allow only the matching web origin for the environment. |

## Browser Environment Guard

The web app must not contain:

- osu! client secret;
- Supabase service role key;
- provider access token;
- provider refresh token;
- raw OAuth payload;
- raw osu! API payload;
- direct osu! API call;
- provider token state;
- internal owner or provider row ids in public output.

## OAuth Callback Checklist

Callbacks must match exactly in osu!. Query values are runtime-only and must not be copied into docs or tickets.

| Environment | Callback |
| --- | --- |
| Local | `http://localhost:3001/api/v1/integrations/osu/callback` |
| Staging placeholder | `https://staging.tryhardnames.com/api/v1/integrations/osu/callback` |
| Production placeholder | `https://tryhardnames.com/api/v1/integrations/osu/callback` |

Rules:

- no localhost callback in production;
- no staging callback in production;
- no production callback in local tests;
- one callback per environment unless osu! app registration explicitly supports multiple reviewed callbacks;
- callback path must stay under `/api/v1/integrations/osu/callback`.

## Supabase Checklist

Before staging smoke:

- use an isolated staging Supabase project;
- apply migrations only after explicit owner approval;
- verify owner-only RLS and API auth behavior;
- verify public projection RPC output contains only allowlisted fields;
- verify service role use stays inside `apps/api`;
- verify token vault non-persistence for osu!;
- do not use PocketBase for osu! runtime or smoke.

Before production:

- repeat the same checks against production only after explicit owner approval;
- verify migration plan and rollback plan;
- confirm private owner data remains private by default;
- confirm public projection allowlist cannot be enabled accidentally.

## CORS And Origin Checklist

Staging:

- staging API allows staging web origin;
- local origins are not required in staging unless explicitly approved;
- production origin is not required in staging unless explicitly approved.

Production:

- production API allows production web origin;
- no localhost origin;
- no staging-only origin unless explicitly approved for a rollout window.

## Logging Checklist

Logs may include safe route names, high-level status, and opaque request ids.

Logs must not include:

- secrets;
- service role keys;
- access tokens;
- refresh tokens;
- full callback code;
- full callback state;
- raw OAuth payloads;
- raw osu! API payloads;
- token vault data.

## Readiness Result

Staging is conditional-go after this checklist is satisfied and the staging smoke runbook passes.

Production remains no-go until staging evidence and owner go/no-go acceptance exist.
