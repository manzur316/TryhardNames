# Provider Expansion Roadmap

RM-23 defines how TryhardNames should evaluate providers after Provider Runtime Foundation, Riot Readiness, Cosmetics Foundation, and Trust/Safety controls. RM-25 applies that policy through the Provider Expansion Readiness Matrix. RM-26 applies it to osu! with a provider-specific readiness pack. RM-27 adds a disabled-by-default server-side osu! runtime foundation after accepting the RM-26 conditions.

Provider expansion is readiness-first. Runtime comes later.

## Purpose

TryhardNames should not depend only on Riot for long-term provider value. Riot remains important, but Riot runtime is approval-gated. The product needs a broader, documented way to evaluate future linked providers without weakening privacy, trust/safety, or public projection boundaries.

## Readiness Before Runtime

No provider runtime without a provider readiness pack first.

Every provider candidate must be reviewed for:

- official docs;
- account ownership verification;
- allowed public fields;
- OAuth/API model;
- token storage requirements;
- rate limits;
- branding/assets restrictions;
- monetization restrictions;
- unlink/revoke path;
- stale/revoked proof behavior;
- public projection safety;
- trust/safety effects.

Readiness docs may be merged as RM milestones. Runtime work may start only after readiness exits with explicit go criteria.

## Candidate Taxonomy

| Candidate | Type | Current posture | Notes |
| --- | --- | --- | --- |
| Riot | Approval-gated gaming provider | Existing readiness pack, runtime blocked | Riot runtime remains gated by explicit approval. |
| osu! | Server-gated gaming proof provider | RM-26 readiness pack exits `conditional-go`; RM-27 adds disabled-by-default runtime foundation, not production launch | Conditional foundation uses Authorization Code, server-side token exchange, no-refresh-token storage, unlink/revoke, stale-proof controls and allowlisted projection. RM-28 must smoke-test owner linking before any wider activation. |
| Steam | Identity provider candidate | Future readiness | Strong identity footprint, but OpenID/API and public field policy need review. |
| Supercell / Clash | Game candidate | Blocked until ownership verification strategy | Player tags and verification tokens need careful ownership and privacy design. |
| Discord | Social/community provider | Future alternative | Useful for community identity, not achievement proof. Discord is not a gaming skill proof. |
| Xbox / PlayStation / Nintendo / Epic | Future high-friction candidates | Future only | Likely higher platform, API, and policy friction. |

## Scorecard

Use this scorecard before selecting a provider for runtime:

| Criterion | Question |
| --- | --- |
| Official docs reviewed | Have official provider docs and terms been read and cited? |
| Ownership proof | Can the user prove account ownership without exposing secrets? |
| Public fields | Are public fields allowlisted and minimal? |
| OAuth/API model | Is the authorization/API model clear and allowed? |
| Token storage | Are tokens avoidable or server-side only with retention/revoke rules? |
| Rate limits | Are limits documented with backoff behavior? |
| Branding/assets | Are logos, names, and game assets allowed or avoided? |
| Monetization | Does the provider forbid paywalls or monetizing data/assets? |
| Unlink/revoke | Can users disconnect and remove public proof effects? |
| Stale/revoked behavior | Are stale and revoked proofs clear and safe? |
| Public projection | Does `/id/:slug` stay allowlisted? |
| Trust/safety | Does the provider increase impersonation, harassment, privacy, or abuse risk? |

The detailed RM-25 weighted scorecard lives in `PROVIDER_CANDIDATE_SCORECARD.md`. The RM-25 matrix lives in `PROVIDER_EXPANSION_READINESS_MATRIX.md`.

## RM-25 Matrix Output

RM-25 implements the provider expansion matrix as docs/tests-only decision support.

Result:

- osu! is the recommended RM-26 readiness pack.
- RM-27 osu! Runtime Foundation remains conditional on RM-26 exiting with explicit go criteria.
- Riot remains approval-gated.
- Steam remains a future identity readiness candidate.
- Supercell / Clash remains blocked until ownership verification strategy is documented from official sources.
- Discord remains a future social/community candidate, not achievement proof.
- Xbox / PlayStation / Nintendo / Epic remain future/high-friction candidates.

RM-25 does not activate runtime, OAuth, callbacks, provider tokens, provider linking UI, env vars, routes, migrations, `/cosmetics`, store, checkout, payments, or remote service changes.

## RM-26 osu! Readiness Output

RM-26 implements the provider-specific osu! readiness pack as docs/tests-only review.

Result:

- official osu! docs review status is `run`;
- ownership verification is viable through Authorization Code + `identify` + `/me`;
- Client Credentials is not acceptable for account ownership;
- minimal conceptual scopes are `identify public`;
- public proof should be limited to `profile_linked`;
- public projection remains allowlisted;
- token storage/retention, unlink/revoke, stale/revoked proof and rate-limit/backoff are required for RM-27;
- branding should be text-only unless official asset permission is accepted;
- no store/payment, no `/cosmetics`, no tracker/ranking clone, no match-history dump, no live-game advice and no hidden-player inference are allowed;
- RM-27 status: `conditional-go`.

RM-26 does not activate osu! runtime, OAuth implementation, callback route, token storage implementation, env vars/secrets, DB migrations, provider linking UI, store/payment, `/cosmetics`, remote services or deploy execution.

## RM-27 osu! Runtime Foundation Output

RM-27 implements the accepted osu! runtime conditions as a limited, disabled-by-default foundation.

Result:

- `apps/api` is the server boundary for OAuth state, token exchange, `/me` ownership verification, current-token revoke and Supabase service-role writes;
- `osu` is an accepted provider id in provider runtime data tables;
- runtime is gated by `OSU_PROVIDER_ENABLED=false` by default and requires server-only config before link intent can start;
- OAuth state is random, HMAC-hashed, short-lived, owner/passport-bound and one-time-use;
- the token strategy is `no_refresh_token_storage`: exchange code server-side, call `/me`, attempt current-token revoke, discard token and store no token ciphertext;
- owner-only status and unlink endpoints are available through the server boundary;
- unlink marks linked provider rows and proofs revoked/private and is idempotent;
- public projection remains closed for osu! until a future publish policy explicitly allows a safe public shape;
- no rank, PP, score, match history, beatmap history, live status, hidden-player inference, `/cosmetics`, store, checkout, billing or payment surface is added;
- RM-28 is osu! Runtime Smoke / Owner Linking QA.

RM-27 is not a production launch and does not add public provider linking UI, public proof promotion, refresh-token storage, provider sync jobs, remote Supabase changes, Vercel changes, real secrets or deploy execution.

## Riot

Riot has an existing readiness pack:

- `RIOT_READINESS_PACK.md`;
- `RIOT_RSO_CALLBACK_DESIGN.md`;
- `RIOT_PROVIDER_ADAPTER_CONTRACT_REVIEW.md`;
- `RIOT_POLICY_COMPLIANCE_AUDIT.md`.

Riot Runtime remains blocked until explicit approval exists in repo evidence. PR19/RM-19 cannot start as runtime without that approval.

## osu!

RM-25 established that osu! is the recommended first provider readiness candidate. RM-26 reviews osu! and exits `conditional-go`. RM-27 implements a disabled-by-default server-side foundation that accepts those conditions without launching publicly.

RM-26 reviews:

- official osu! API and OAuth docs;
- account ownership verification;
- public profile fields;
- allowed scopes;
- token retention requirements;
- rate limits;
- branding/assets restrictions;
- unlink/revoke model;
- public proof shape;
- no tracker/ranking-copy drift beyond allowed public profile proof.

RM-26 is readiness only. RM-27 is conditional runtime foundation only because RM-26 exits `conditional-go`; it implements accepted runtime conditions before activation but still requires RM-28 smoke/owner-linking QA before wider use.

## Steam

Steam is an identity provider candidate.

Future readiness should review:

- Steam OpenID account identity model;
- Steam Web API restrictions;
- profile visibility and privacy;
- public field minimization;
- no hidden ownership inference;
- unlink/revoke behavior.

Steam runtime is not implemented by RM-23.

## Supercell / Clash

Supercell / Clash is blocked until ownership verification strategy is documented.

Future readiness must answer:

- whether in-game API tokens can prove ownership safely;
- whether tokens can be one-time and never stored;
- which public fields are allowed;
- how revocation and stale proof should behave;
- how to avoid hidden-player inference or harassment.

No Supercell/Clash runtime is implemented by RM-23.

## Discord

Discord is a social/community provider candidate.

Discord can prove social identity or community membership, but it is not an achievement proof. It must not be presented as skill, rank, or game accomplishment.

Discord Pilot remains an alternate future path only if product direction explicitly selects it.

## Provider Runtime Non-Goals For RM-23, RM-25, RM-26 And RM-27

RM-23, RM-25, RM-26 and RM-27 do not implement:

- Riot OAuth/API/runtime;
- Discord OAuth/API/runtime;
- production osu! launch;
- Steam OpenID/API/runtime;
- Supercell/Clash runtime;
- refresh-token storage implementation for osu!;
- public provider linking UI;
- provider sync jobs;
- real env secret values;
- deploy execution.

## Product Guardrails

Provider expansion must not turn TryhardNames into:

- OP.GG clone;
- tracker;
- match-history dump;
- custom MMR/ELO product;
- ranking alternative;
- live-game advice tool;
- hidden-player de-anonymization surface.
