# RM-25 Provider Expansion Readiness Matrix

RM-25 compara candidatos de providers externos usando la politica readiness-before-runtime definida en RM-23 y reforzada por RM-24.

Este PR implementa una matriz auditable. No implementa runtime, OAuth, callbacks, tokens, env vars, migraciones, Supabase remoto, Vercel, Google Cloud, Riot Portal, `/cosmetics`, store, checkout, pagos ni inventory.

## Executive Summary

Decision propuesta:

- RM-26 es osu! Readiness Pack.
- RM-27 permanece como osu! Runtime Foundation condicional, porque RM-26 sale `conditional-go` despues de revision oficial.
- Riot sigue gated por aprobacion explicita.
- Steam queda como candidato futuro de identidad.
- Supercell / Clash queda bloqueado hasta documentar ownership verification desde fuentes oficiales.
- Discord queda como candidato social/community, no achievement proof.
- Xbox / PlayStation / Nintendo / Epic quedan como candidatos futuros/high-friction.

El resultado no aprueba ningun runtime. El resultado solo ordena el siguiente bloque de readiness.

## Methodology

Inputs:

- GitHub/main/docs/product/PRs mergeados/CI;
- `ROADMAP_GOVERNANCE.md`;
- `PROVIDER_EXPANSION_ROADMAP.md`;
- `LAUNCH_READINESS.md`;
- Riot readiness docs existentes;
- official docs publicas disponibles al 2026-06-27;
- source guards del repo.

Escala:

- 0 = blocker / unknown;
- 1 = high risk;
- 2 = medium risk;
- 3 = good fit.

Los puntajes son decision-support. Un total alto no elimina gates criticos como approval evidence, token safety, public projection safety o privacy review.

## Scorecard

| Criterion | Weight | Riot | osu! | Steam | Supercell/Clash | Discord | Console/Epic |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Official docs clarity | 3 | 2 | 3 | 2 | 1 | 3 | 1 |
| Account ownership verification | 3 | 2 | 3 | 3 | 0 | 2 | 1 |
| Public profile fields | 2 | 2 | 3 | 2 | 2 | 2 | 1 |
| OAuth/API model | 3 | 1 | 3 | 2 | 1 | 3 | 1 |
| Token storage complexity | 2 | 1 | 2 | 3 | 2 | 2 | 1 |
| Revoke/unlink model | 2 | 1 | 2 | 2 | 1 | 2 | 1 |
| Rate limit clarity | 2 | 2 | 3 | 2 | 1 | 3 | 1 |
| Branding/assets risk | 2 | 1 | 2 | 2 | 1 | 2 | 1 |
| Monetization restrictions | 2 | 1 | 2 | 2 | 1 | 2 | 1 |
| Privacy risk | 3 | 1 | 2 | 2 | 1 | 2 | 1 |
| Trust/safety risk | 3 | 2 | 2 | 2 | 1 | 2 | 1 |
| Proof value | 3 | 3 | 3 | 2 | 2 | 1 | 2 |
| Implementation friction | 2 | 1 | 3 | 2 | 1 | 1 | 0 |
| Product fit | 3 | 3 | 3 | 2 | 2 | 1 | 2 |
| Dependency on approval | 3 | 0 | 2 | 2 | 1 | 2 | 0 |
| Risk of becoming tracker/ranking clone | 3 | 1 | 2 | 2 | 2 | 3 | 2 |
| Weighted total | 41 | 63 | 103 | 87 | 51 | 85 | 45 |

## Recommended Ranking

1. osu! - reviewed next readiness candidate. Strong product fit, public official docs, and useful proof value. Still no runtime until RM-27 implements RM-26 accepted conditions.
2. Steam - strong future identity candidate. Better for identity than achievement proof; privacy/public-field review is required.
3. Riot - high product fit but approval-gated. Existing readiness remains valid; runtime cannot start without explicit approval evidence.
4. Discord - useful social/community identity candidate. Not achievement proof, so it should not be the next proof-focused readiness pack.
5. Supercell / Clash - good game relevance but blocked until ownership verification strategy is documented from official sources.
6. Xbox / PlayStation / Nintendo / Epic - future/high-friction candidates. Partner access and platform policy review are too heavy for first wave.

## Comparative Table

| Candidate | Type | Posture | Go/No-Go | Primary blockers | Required follow-up |
| --- | --- | --- | --- | --- | --- |
| Riot | Approval-gated gaming provider | Existing readiness pack; runtime blocked | No-go for runtime | No explicit approval evidence, approved scopes, callback URLs or production credentials in repo | Collect approval evidence, confirm scopes/callbacks, update token/revoke/privacy plan before RM-19 |
| osu! | Gaming proof candidate | RM-26 readiness pack exits `conditional-go` | Conditional-go for RM-27, no runtime in RM-26 | Needs runtime implementation of callback/state, token safety, unlink/revoke, stale-proof, projection, privacy and rate-limit controls | RM-27 osu! Runtime Foundation if conditions are accepted |
| Steam | Identity provider candidate | Future readiness candidate | Not first wave | Per-game proof inconsistency, profile privacy, Web API/OpenID boundary | Future Steam Identity Readiness |
| Supercell / Clash | Game candidate | Blocked | No-go until ownership strategy | Player tag alone is insufficient; official ownership verification needs manual review | Document ownership verification and safe public fields |
| Discord | Social/community candidate | Future alternate | Not proof-first | Social identity is not achievement proof; guild/member data has privacy risk | Future social/community readiness only if product direction chooses it |
| Xbox / PlayStation / Nintendo / Epic | Platform candidates | Future/high friction | No-go for first wave | Partner access, platform policies, limited public docs, approval friction | Manual official platform review |

## Candidate Go/No-Go

### Riot

Readiness state: existing Riot readiness pack is done.

Decision:

- go for continued readiness/compliance maintenance;
- no-go for runtime.

Blockers:

- no explicit Riot approval evidence in repo;
- no approved scopes;
- no approved callback URLs;
- no production key;
- no accepted token/revoke/privacy requirements for runtime.

Required follow-up:

- PR19/RM-19 only after explicit approval evidence;
- update public projection tests before any Riot field appears;
- keep no tracker, no custom MMR/ELO, no match-history dump, no live-game advice.

### osu!

Readiness state: RM-26 readiness pack reviewed official docs and exits `conditional-go`.

Decision:

- conditional-go for RM-27 osu! Runtime Foundation;
- no-go for runtime in RM-26.

Conditions before runtime:

- Authorization Code ownership with `identify` + `/me`;
- exact callback URL and CSRF-safe state handling;
- allowed public fields;
- scopes and token retention;
- unlink/revoke;
- stale/revoked proof states;
- rate-limit/backoff;
- anti-tracker guardrails.

Required follow-up:

- RM-27 may implement runtime only if these conditions are accepted and source guards remain clean.

### Steam

Readiness state: future identity readiness candidate.

Decision:

- not first wave;
- keep as future identity provider candidate.

Blockers:

- per-game proof inconsistency;
- public/private profile visibility;
- Web API key and server boundary review;
- unlink/revoke semantics for identity proof.

Required follow-up:

- Steam Identity Readiness after osu! readiness or if product direction changes.

### Supercell / Clash

Readiness state: blocked.

Decision:

- no-go until ownership verification strategy is documented.

Blockers:

- player tag alone is insufficient;
- official ownership verification flow must be confirmed from official docs/portal;
- privacy and harassment risk around player tags must be reviewed.

Required follow-up:

- manual official API/portal review;
- one-time token or equivalent ownership proof strategy;
- no persistent secret storage unless a later readiness pack approves it.

### Discord

Readiness state: future social/community provider.

Decision:

- no-go as next achievement proof provider;
- possible future social/community readiness if product direction explicitly selects it.

Blockers:

- proves social identity, not gaming skill/accomplishment;
- guild membership and public identity create privacy/trust/safety risk;
- must not be Parent Auth.

Required follow-up:

- define social proof boundaries;
- confirm scopes;
- document unlink/revoke/data deletion;
- avoid skill/rank/accomplishment language.

### Xbox / PlayStation / Nintendo / Epic

Readiness state: future/high friction.

Decision:

- no-go for first wave.

Blockers:

- partner access and platform policy friction;
- limited unauthenticated public docs for some platforms;
- ownership/public field model unclear;
- higher approval burden.

Required follow-up:

- manual official platform review;
- platform-specific readiness pack only after docs/access are available.

## Component-Level Product Implications

NameCard, public generators, Account Dashboard V2, `/gaming-passport`, `/id/:slug`, provider runtime foundation, public projection and cosmetics are not changed by RM-25.

Future provider readiness must preserve:

- Parent Auth as the TryhardNames login boundary;
- linked providers as external proof only;
- public projection as allowlisted output only;
- private draft by default;
- user consent before public serving;
- no provider data behind paywall;
- no tracker/ranking clone behavior.

## Official Docs Review

official_docs_review: run for publicly available official docs on 2026-06-27.

Manual follow-up remains required for provider-specific implementation details that are behind portals, approval workflows or partner access. Supercell / Clash, PlayStation, Nintendo and some console/Epic details require manual official review before any readiness pack can claim implementation-ready facts.

RM-26 official osu! docs review is recorded in `OSU_READINESS_PACK.md` and exits `conditional-go` for RM-27. It does not activate osu! runtime, OAuth implementation, callback route, token storage implementation, env vars/secrets, DB migrations, provider linking UI, store/payment or `/cosmetics`.

## Non-Goals

RM-25 does not implement:

- Riot OAuth/API/runtime;
- RiotProvider runtime;
- League of Legends adapter;
- Discord OAuth/API/runtime;
- osu! OAuth/API/runtime;
- Steam OpenID/API/runtime;
- Supercell/Clash runtime;
- provider tokens;
- provider callback routes;
- provider linking UI;
- provider sync jobs;
- secrets or env vars;
- `/cosmetics`;
- store, checkout, billing, payments, subscriptions, inventory purchase or marketplace;
- Stripe or MercadoPago;
- pets/companions runtime;
- 3D runtime;
- report admin dashboard;
- public report list;
- moderation dashboard;
- DB migrations;
- Supabase remote changes;
- Vercel changes;
- Google Cloud changes;
- Riot Portal changes;
- deploy execution.

## Rollback

Revert the RM-25 PR. It is docs/tests only and should not require runtime rollback, DB rollback, secret rotation, provider portal rollback, Vercel rollback, Google Cloud rollback or Supabase remote rollback.
