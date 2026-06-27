# RM-26 osu! Readiness Scope

RM-26 implements the osu! Readiness Pack as docs/tests-only provider readiness.

It follows the readiness-before-runtime policy from RM-23 and the provider ordering from RM-25.

## Scope

RM-26 adds:

- `OSU_READINESS_PACK.md`;
- `OSU_PROVIDER_CONTRACT_REVIEW.md`;
- `OSU_OAUTH_API_REVIEW.md`;
- `OSU_PUBLIC_PROOF_MODEL.md`;
- `OSU_TRUST_SAFETY_PRIVACY_REVIEW.md`;
- `OSU_BRANDING_MONETIZATION_REVIEW.md`;
- RM-26 roadmap updates;
- source/docs guards.

RM-26 reviews:

- official osu! documentation;
- OAuth/API model;
- account ownership verification;
- allowed public fields;
- scopes;
- token storage/retention risk;
- unlink/revoke path;
- stale/revoked proof behavior;
- public projection safety;
- proof model;
- rate limits/backoff;
- branding/assets/monetization;
- trust/safety/privacy;
- go/no-go for RM-27.

## Official Docs Review

official_docs_review: run - official osu! docs reviewed on 2026-06-27.

Primary official docs:

- https://osu.ppy.sh/docs/
- https://osu.ppy.sh/legal/en/Terms
- https://osu.ppy.sh/legal/en/Privacy

## No Runtime

RM-26 explicitly includes:

- no osu! runtime;
- no OAuth implementation;
- no callback route;
- no token storage implementation;
- no env vars/secrets;
- no osu! API calls;
- no `OsuProvider`;
- no provider linking UI;
- no provider sync jobs;
- no DB migrations;
- no Supabase remote changes;
- no Vercel changes;
- no Google Cloud changes;
- no Riot Portal changes;
- no Riot runtime;
- no Discord runtime;
- no Steam runtime;
- no Supercell/Clash runtime;
- no `/cosmetics`;
- no store/payment;
- no checkout;
- no billing;
- no subscriptions;
- no deploy execution.

## Go/No-Go Output

RM-26 output: `conditional-go` for RM-27.

Reason:

- official docs support Authorization Code + `identify` + `/me` as ownership path;
- Client Credentials is not enough for ownership;
- minimal proof shape is safe if public projection remains allowlisted;
- runtime still requires secure callback, server-side token handling, unlink/revoke, stale proof behavior, rate-limit/backoff, privacy copy and source guards.

## RM-27 Conditional

RM-27 osu! Runtime Foundation is next only while RM-26 remains `conditional-go`.

RM-27 must stay blocked if:

- token storage/retention is not accepted;
- callback/state handling is not defined;
- public projection allowlist is not implemented;
- unlink/revoke does not remove public proof;
- stale/revoked behavior is ambiguous;
- rate-limit/backoff is missing;
- branding/monetization boundaries are not accepted;
- trust/safety/privacy copy and report abuse integration are missing.

RM-27 status: conditional-go
