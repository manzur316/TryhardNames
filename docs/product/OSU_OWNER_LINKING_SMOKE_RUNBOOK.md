# RM-28 osu! Owner Linking Smoke Runbook

This runbook repeats the local/staging smoke without committing secrets or touching production, remote Supabase, Vercel, PocketBase, store/payments, `/cosmetics`, public provider UI, or tracker/ranking surfaces.

## Preconditions

- Worktree is on the RM-28 branch.
- Supabase local is running at `http://127.0.0.1:54321`.
- `apps/api/.env` exists locally and is ignored by Git.
- `apps/api/.env.example` contains placeholders only.
- `OSU_PROVIDER_ENABLED=true` is set only in local/staging runtime env.
- `OSU_REDIRECT_URI` is registered in osu! as:

```txt
http://localhost:3001/api/v1/integrations/osu/callback
```

Required local-only env values:

```txt
OSU_CLIENT_ID
OSU_CLIENT_SECRET
OSU_STATE_SECRET
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY
```

Do not print those values.

## Start Local Runtime

```powershell
cd "C:\Users\Juandi Gamer\Documents\TryhardNames-rm28-osu-runtime-smoke"
npm run db:start
npx supabase@2.84.2 migration up --local
npm run dev --prefix apps/api
npm run dev --prefix apps/web -- --port 5173
```

## Status Smoke

```powershell
curl.exe http://localhost:3001/api/v1/integrations/osu
```

Expected:

- HTTP 200;
- `status` is `configured` when local env is complete;
- `runtime.tokenStrategy` is `no_refresh_token_storage`;
- response does not contain `OSU_CLIENT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `access_token`, `refresh_token`, `client_secret`, or OAuth `code`.

## Prepare Local Owner

Create or reuse a local Supabase Auth owner and a private Gaming Passport draft. Use local Supabase only.

The smoke needs:

```txt
LOCAL_OWNER_JWT
LOCAL_PASSPORT_ID
```

If the JWT cannot be created automatically, sign in through the local app and copy the local access token into the terminal session without committing it:

```powershell
$env:LOCAL_OWNER_JWT="<local owner jwt>"
$env:LOCAL_PASSPORT_ID="<local passport id>"
```

Do not print the JWT.

## Link Intent Smoke

```powershell
curl.exe -sS -X POST "http://localhost:3001/api/v1/integrations/osu/link-intent" `
  -H "Authorization: Bearer $env:LOCAL_OWNER_JWT" `
  -H "Content-Type: application/json" `
  --data "{`"passportId`":`"$env:LOCAL_PASSPORT_ID`"}"
```

Expected:

- HTTP 201;
- `status` is `link_intent_created`;
- response includes `authorizeUrl`;
- response includes `expiresAt`;
- scopes are `identify` and `public`;
- token strategy is `no_refresh_token_storage`;
- no secret, token, or code fields are returned.

## Manual Authorization

Open the returned `authorizeUrl` in a browser. The owner must sign in to osu! and approve the app.

Expected redirect:

```txt
http://localhost:3001/api/v1/integrations/osu/callback?code=...&state=...
```

Do not paste the `code`, `state`, or any token into docs or PR comments.

## Callback Expected Result

Expected callback response:

- `status` is `linked`;
- provider is `osu`;
- `tokenRevokedImmediately` is `true`;
- proof type is `profile_linked`;
- proof visibility is `private`;
- no `access_token`;
- no `refresh_token`;
- no OAuth `code`;
- no client secret;
- no service role key.

## DB Verification

Run local SQL only. Do not connect to remote Supabase.

Expected `linked_provider_accounts`:

- `provider = 'osu'`;
- `status = 'verified'`;
- `visibility = 'private'`;
- `external_account_id` exists internally only.

Expected `verified_proofs`:

- `provider = 'osu'`;
- `source_key = 'osu:profile_linked'`;
- `status = 'current'`;
- `visibility = 'private'`.

Expected `provider_token_vault`:

- no access token;
- no refresh token;
- `token_ciphertext` is null;
- no token response payload stored.

## Unlink Smoke

Use the linked provider account id from the local DB or owner status response.

```powershell
curl.exe -sS -X POST "http://localhost:3001/api/v1/integrations/osu/unlink" `
  -H "Authorization: Bearer $env:LOCAL_OWNER_JWT" `
  -H "Content-Type: application/json" `
  --data "{`"passportId`":`"$env:LOCAL_PASSPORT_ID`",`"linkedProviderAccountId`":`"$env:LINKED_PROVIDER_ACCOUNT_ID`"}"
```

Expected:

- response status is `unlinked`;
- result status is `revoked`;
- `publicServingAllowed` is `false`;
- linked provider account becomes `revoked`;
- linked provider account visibility remains `private`;
- proof becomes `revoked`;
- proof visibility remains `private`;
- public projection does not expose revoked proof.

## Negative Cases

Run these before considering the smoke complete:

- status without configured env returns safe `503` when applicable;
- link-intent without auth returns `401`;
- link-intent without `passportId` returns `400`;
- callback without `code` returns `400`;
- callback without `state` returns `400`;
- callback with altered state returns `400`;
- callback replay with same state fails;
- unlink with another owner is not allowed;
- revoked proof does not appear in public projection.

## Completion Criteria

Full pass requires:

- status pass;
- link-intent pass;
- human authorization pass;
- callback pass;
- DB account/proof verification pass;
- token vault non-persistence pass;
- unlink/revoke pass;
- public projection non-leakage pass;
- negative cases pass.

Without human osu! authorization, record the result as `partial-pass` or `blocked`, not full pass.
