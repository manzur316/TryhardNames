# RM-28 osu! Runtime Smoke QA

RM-28 validates the RM-27 osu! Runtime Foundation as a QA and operations milestone. It does not add runtime capabilities, production configuration, public provider UI, token storage, `/cosmetics`, store, payments, rank, PP, score, match history, or live tracker behavior.

Result classification for this PR: `partial-pass`.

The local runtime smoke reached the configured status and owner link-intent stages. The real osu! callback is blocked until a human owner opens the generated `authorizeUrl`, signs in to osu!, and authorizes the registered local callback.

## Scope

RM-28 covers:

- local configured status smoke;
- safe response inspection for secrets and tokens;
- owner JWT and local Passport preparation;
- owner-only link-intent smoke;
- assisted manual authorization runbook;
- callback verification criteria;
- local DB verification criteria;
- token vault non-persistence criteria;
- private proof and public projection checks;
- unlink/revoke criteria;
- negative case checklist;
- roadmap handoff to RM-29.

## Non-Goals

RM-28 does not implement:

- new OAuth behavior;
- production launch;
- remote Supabase changes;
- Vercel changes;
- public provider linking UI;
- osu! as Parent Auth;
- refresh-token storage;
- rank, PP, score, match-history, best-play, beatmap, or live tracker surfaces;
- `/cosmetics`;
- store, checkout, billing, subscriptions, payments, or inventory purchase.

## Smoke Status

| Area | Status | Notes |
| --- | --- | --- |
| Runtime status endpoint | pass | `GET /api/v1/integrations/osu` returned configured in local runtime. |
| Safe status response | pass | Response did not include service role key, client secret, OAuth code, access token, or refresh token fields. |
| Local owner/JWT preparation | pass | A local Supabase owner and Passport can be prepared without committing `.env`. |
| Link intent | pass | `POST /link-intent` can return `authorizeUrl`, `expiresAt`, `identify public`, and `no_refresh_token_storage`. |
| Manual authorizeUrl | blocked-human | Requires a human osu! login and consent in browser. |
| Real callback | blocked-human | Cannot be completed by Codex without user authorization. |
| DB linked account verification | blocked-callback | Requires successful callback. Expected provider `osu`, status `verified`, visibility `private`. |
| DB proof verification | blocked-callback | Requires successful callback. Expected `osu:profile_linked`, visibility `private`. |
| Token vault verification | partial-pass | RM-27 DB constraints and tests keep token ciphertext blocked; callback non-storage still requires real callback evidence. |
| Unlink/revoke | blocked-callback | Requires linked provider account id from successful callback. |
| Negative cases | partial-pass | Static/API tests cover disabled config, missing auth, missing passport, missing code/state, invalid state, and sanitization expectations. |

## Security Review

The RM-28 smoke keeps these security boundaries:

- never print `OSU_CLIENT_SECRET`;
- never print `SUPABASE_SERVICE_ROLE_KEY`;
- never print access tokens;
- never print refresh tokens;
- never commit `.env`;
- never store refresh tokens;
- never persist token ciphertext;
- never expose provider proof publicly by default;
- never use PocketBase for this smoke.

## RM-29 Decision

Because the real osu! callback remains blocked on human authorization, the next recommended milestone is:

```txt
RM-29 osu! Smoke Blocker Fixes
```

If a human completes the authorization smoke later and all callback, DB, token vault, unlink, and public projection checks pass, RM-29 can be reclassified as:

```txt
RM-29 osu! Owner Linking UI Hardening / Private Account UX
```

If any secret leakage, token persistence, public proof leakage, or owner isolation failure is found, RM-29 must become:

```txt
RM-29 osu! Runtime Security Fixes
```
