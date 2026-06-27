# RM-26 osu! OAuth/API Review

RM-26 reviews osu! OAuth/API as design-only readiness. It does not implement OAuth, API calls, callback route, token exchange, token storage implementation, env vars/secrets or osu! runtime.

## Official Review Status

official_docs_review: run - official osu! docs reviewed on 2026-06-27.

Primary source:

- https://osu.ppy.sh/docs/

Related official sources:

- https://osu.ppy.sh/legal/en/Terms
- https://osu.ppy.sh/legal/en/Privacy

## Recommended Auth Flow

Recommended future flow: Authorization Code Grant.

Why:

- it is the official user authorization flow;
- it has a Resource Owner;
- it supports user redirect and callback;
- it can issue access and refresh tokens;
- it supports `/me/{mode?}` with `identify` for ownership.

Future RM-27 flow must be server-side:

1. owner starts linking from authenticated `/account`;
2. server creates state nonce and stores it with short TTL;
3. user is redirected to osu! authorization;
4. osu! returns to registered callback with code and state;
5. server validates state;
6. server exchanges code for token;
7. server calls `/me/{mode?}`;
8. server stores minimal provider identity and encrypted/approved token material;
9. public proof is derived only from allowlisted fields.

## Client Credentials Review

Client Credentials is not acceptable for account ownership verification.

Reason:

- official docs state Client Credentials tokens do not have associated user permissions and are guest-user tokens unless special delegation applies;
- guest access cannot prove the TryhardNames owner controls an osu! account;
- using public data lookup alone would allow impersonation.

Client Credentials may only be reconsidered for non-ownership public metadata after separate review, and it still must not feed public proof by itself.

## Authorization Code Review

Authorization Code applies to ownership because the authenticated user authorizes TryhardNames and `/me/{mode?}` returns the token owner's user data.

RM-27 must include:

- registered osu! OAuth application;
- exact callback URL;
- CSRF-safe state validation;
- server-side code exchange;
- token error handling;
- ownership record keyed to TryhardNames owner;
- no token in browser;
- no token in logs.

## Minimal Scopes

Initial conceptual scope set:

```txt
identify public
```

Rationale:

- `identify` supports `/me` and user identity;
- `public` supports public data reads if needed;
- no write scopes are required for Passport proof;
- no friends/chat/forum/delegate scopes are justified.

Rejected scopes:

- `friends.read`;
- `chat.read`;
- `chat.write`;
- `chat.write_manage`;
- `forum.write`;
- `forum.write_manage`;
- `delegate`;
- `group_permissions`;
- `multiplayer.write_manage`;
- lazer-only scopes.

## Callback Requirements

RM-26 does not add callback route.

RM-27 callback requirements:

- callback URL must match registered osu! application exactly;
- callback must only run server-side;
- callback must reject missing/invalid state;
- callback must reject missing code;
- callback must bind result to the authenticated TryhardNames owner;
- callback must never expose code, access token, refresh token or raw error payload in browser copy;
- callback must record safe audit event.

No `/auth/osu/callback` route is created by RM-26.

## Token Handling

RM-26 no token storage implementation.

RM-27 token handling options must be accepted before coding:

- store refresh/access token encrypted server-side with rotation; or
- avoid long-lived refresh token retention if product only needs one-time ownership proof.

Required either way:

- no raw token public exposure;
- no raw metadata public exposure;
- no token in client storage;
- no token in analytics;
- no token in logs;
- explicit retention policy;
- unlink/revoke and local deletion behavior.

## Refresh And Revoke Behavior

Official docs describe refresh token flow and a revoke-current-token endpoint.

RM-27 must:

- refresh only when necessary;
- atomically replace rotated refresh tokens;
- revoke current token on unlink when possible;
- treat already-invalid token as safe local disconnect;
- mark provider-derived proof revoked if authorization cannot be restored;
- stop public serving of revoked proof.

## Rate Limits And Backoff

Official docs recommend cache, exponential backoff and no more than 60 requests per minute. They describe abusive usage such as polling every minute for every user or using the API as a database.

RM-27 must:

- cache ownership/profile observations;
- avoid per-minute polling for linked users;
- implement exponential backoff;
- stop sync on repeated auth failures;
- never build a live tracker, ranking alternative, match-history dump, live-game advice product or hidden-player inference product.

## Known Gaps

- Exact callback URL and application registration are not present in repo.
- Token encryption/retention plan is not implemented for osu!.
- Stale proof freshness window must be selected.
- Public field allowlist must be verified against real response shape.
- Branding asset permissions are not accepted.
- Production rate-limit posture may require manual contact if usage grows.

OAuth/API decision: conditional-go for RM-27 design; no runtime approval in RM-26.
