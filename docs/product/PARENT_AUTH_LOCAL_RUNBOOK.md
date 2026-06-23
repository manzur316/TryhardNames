# Parent Auth Local Runbook

PR4 adds local Parent Auth for TryhardNames and private Gaming Passport drafts. It does not connect to a remote Supabase project and does not create cloud tables.

## Product Boundary

Parent Auth is only for entering TryhardNames. It is separate from Linked Providers.

- Parent Auth MVP: email/password.
- Parent Auth prepared behind a flag: Google OAuth.
- Linked Providers, later: Discord and Riot.

Discord and Riot are not login methods in PR4. They are not implemented here.

## Public Variables

Set these locally for the web app:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_AUTH_GOOGLE_ENABLED=false
```

The app must not receive administrative Supabase credentials. Do not set service-role, secret, or admin keys in browser environment variables.

Accepted browser keys are:

- modern publishable keys beginning with `sb_publishable_`;
- legacy anon JWT keys whose decoded payload contains `role = anon`.

Rejected browser keys include secret keys, service-role JWTs, malformed JWT-like values, empty keys, and non-http(s) URLs.

## Local Supabase

Start local Supabase from the repository root:

```bash
supabase start
supabase db reset
supabase status -o env
```

Copy values from local status:

- `API_URL` -> `VITE_SUPABASE_URL`
- `ANON_KEY` -> `VITE_SUPABASE_PUBLISHABLE_KEY`

Never commit those values.

The local Supabase config allows these callback URLs:

- `http://localhost:3000/auth/callback`
- `http://127.0.0.1:3000/auth/callback`

Production, staging, and Vercel previews need their own allowed callback URLs in their own Supabase auth configuration before OAuth is enabled there.

PR4 uses a manual PKCE callback strategy. The browser client does not auto-detect sessions from the URL; `/auth/callback` captures the returned `code`, cleans query/hash parameters, exchanges the code once, and then redirects to `/account`.

## Google OAuth

Google is disabled by default:

```bash
VITE_AUTH_GOOGLE_ENABLED=false
```

To test Google locally, a developer must configure their own Google OAuth credentials in the local Supabase auth settings and set the flag to `true`. PR4 only wires the Supabase OAuth call and callback route; it does not provide or assume Google credentials.

Do not enable Google in production or previews until both Google Cloud OAuth credentials and Supabase redirect URLs are configured for that exact environment.

## Running The App

```bash
npm ci
npm run dev
```

Expected behavior:

- public generators work without an account;
- `/sign-in` and `/sign-up` show Auth not configured when variables are absent;
- `/account` redirects to `/sign-in` without a session;
- after local sign-up/sign-in, `/account` creates or loads one private Gaming Passport draft.

## Tests

Unit tests:

```bash
npm run test:auth
```

Local integration test:

```bash
supabase start
supabase db reset
npm run test:auth:local
supabase stop --no-backup
```

The local integration test uses only the local URL and anon key. It signs up a random test user, signs in, creates a private draft, updates presentation fields, verifies it remains `draft_private`, and signs out.

If a test user remains in local auth state, run `supabase db reset` to clear local state. PR4 does not use service-role credentials for cleanup.

## Private Draft Scope

The draft remains private:

- no public profile route;
- no `/id/:slug`;
- no slug claiming;
- no publication command;
- no Discord or Riot linking;
- no linked providers;
- no verified proofs.

The browser may edit only safe presentation fields:

- `alias`;
- `avatar_url`;
- `bio_short`;
- `scene_config`.

`scene_config` is built from allowlisted UI controls (`layout`, `accent`, `density`), not raw JSON input.

## Cloud Boundary

PR4 does not:

- run remote migrations;
- link a Supabase cloud project;
- use cloud keys;
- use service role;
- deploy functions;
- alter production auth settings.

## Bundle Check

Compared against `origin/main` during PR4 hardening:

- `origin/main` entry JS: 1,262,886 bytes raw / 378,557 bytes gzip.
- PR4 entry JS: 1,271,281 bytes raw / 381,239 bytes gzip.
- Entry delta: +8,395 bytes raw / +2,682 bytes gzip.

`@supabase/supabase-js` is not loaded by the HTML entry script. It is loaded through a separate lazy chunk when Parent Auth runtime is configured or an auth/account surface is visited. PR4 also splits `/sign-in`, `/sign-up`, `/auth/callback`, and `/account` into lazy route chunks.
