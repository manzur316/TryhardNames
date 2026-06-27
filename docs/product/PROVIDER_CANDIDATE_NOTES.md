# Provider Candidate Notes

RM-25 compara candidatos para decidir el siguiente readiness pack. Estas notas son producto/security/privacy, no runtime.

## Official Docs Review Status

Revision ejecutada el 2026-06-27 usando fuentes oficiales publicas disponibles.

| Candidate | official_docs_review | Official source posture |
| --- | --- | --- |
| Riot | run | Riot Developer Portal/API docs y docs internas de readiness existentes revisadas; runtime sigue approval-gated porque el repo no contiene approval evidence. |
| osu! | run | osu! API v2/OAuth docs oficiales revisadas; RM-26 readiness sale `conditional-go`; RM-27 agrega runtime foundation server-side gated, no production launch. |
| Steam | run | Steam OpenID/Web API docs oficiales revisadas; buen candidato futuro de identidad, proof per-game requiere cautela. |
| Supercell / Clash | partial | Landing/API docs oficiales publicas revisadas; la estrategia de ownership requiere revision manual del portal/documentacion oficial completa. |
| Discord | run | Discord OAuth2/API docs oficiales revisadas; util como identidad social/community, no achievement proof. |
| Xbox / PlayStation / Nintendo / Epic | partial | Docs/portales oficiales publicos revisados; accesso, aprobaciones y APIs de plataforma hacen el grupo high-friction. |

Fuentes oficiales usadas como base:

- Riot Developer Portal: https://developer.riotgames.com/docs/lol
- osu! API docs: https://osu.ppy.sh/docs/
- Steam Web API/OpenID docs: https://partner.steamgames.com/doc/features/auth
- Steam Web API overview: https://partner.steamgames.com/doc/webapi_overview
- Supercell Clash of Clans API: https://developer.clashofclans.com/
- Discord OAuth2 docs: https://discord.com/developers/docs/topics/oauth2
- Discord API reference: https://discord.com/developers/docs/reference
- Xbox services docs: https://learn.microsoft.com/en-us/gaming/gdk/docs/services/
- PlayStation Partners: https://partners.playstation.net/
- Nintendo Developer Portal: https://developer.nintendo.com/
- Epic Online Services docs: https://dev.epicgames.com/docs/epic-online-services

Do not use blogs, Reddit, YouTube, unofficial SDK mirrors, or third-party API references as approval evidence.

## Riot

Current posture:

- existing readiness pack exists;
- Riot site verification and Riot review support docs exist;
- approval-gated;
- no runtime;
- no OAuth;
- no API calls;
- no production Riot key;
- no public Riot data.

Decision:

- Riot remains valuable and product-fit is high.
- Riot runtime cannot start until explicit approval evidence exists in repo state.
- Future RM-19/RM-20 remain gated by approval, approved scopes, callback URLs, token/revoke/privacy acceptance, and public projection review.

Required follow-up:

- collect explicit approval evidence;
- document approved scopes and callback URLs;
- confirm allowed public display fields;
- confirm token retention/revoke requirements;
- update source guards only after runtime is approved.

## osu!

Current posture:

- reviewed first readiness candidate;
- official docs are publicly available enough for RM-26 planning;
- RM-26 osu! Readiness Pack exits `conditional-go`;
- RM-26 is readiness only, not runtime;
- RM-27 accepts the conditions as a disabled-by-default server-side foundation, not a public launch.

Why it is recommended:

- good product fit for a gaming resume;
- clear enough ownership path for readiness review;
- less dependent on Riot approval;
- proof value is higher than social-only providers;
- feasible to evaluate public profile fields, OAuth/API model, token storage, rate limits and branding before runtime.

RM-26 decision:

- ownership proof should use Authorization Code + `identify` + `/me`;
- Client Credentials is not acceptable for ownership;
- public proof should start as minimal `profile_linked`;
- public projection remains allowlisted;
- no tracker/ranking clone, no match-history dump, no live-game advice and no hidden-player inference;
- no store/payment, no `/cosmetics`, no OAuth implementation, no callback route, no token storage implementation and no env vars/secrets in RM-26.

Required follow-up:

- RM-28 must smoke-test owner linking, configured server env, callback/state failure modes, unlink/revoke, stale/revoked proof, rate-limit/backoff, privacy copy, branding boundaries and public projection guards before wider activation.

## Steam

Current posture:

- identity candidate;
- strong account identity footprint;
- proof per-game may be inconsistent;
- requires privacy/public-field review.

Decision:

- Steam is a future readiness candidate, not RM-26.
- Steam can support gaming identity, but Gaming Passport must avoid hidden ownership inference and avoid treating every Steam field as achievement proof.

Required follow-up:

- review OpenID ownership model;
- review Web API key and server boundary requirements;
- review public/private profile visibility;
- define minimal public fields;
- define unlink/revoke and stale identity behavior.

## Supercell / Clash

Current posture:

- game-specific candidate;
- blocked until ownership verification strategy is documented;
- player tag alone is insufficient;
- detailed official API review needs manual portal verification before runtime planning.

Decision:

- Supercell / Clash should not be first wave.
- It may become useful later if ownership verification can be proven without storing secrets or exposing private data.

Required follow-up:

- confirm official ownership verification mechanism;
- define whether proof tokens can be one-time and never stored;
- define safe public fields;
- define stale/revoked behavior;
- avoid hidden-player inference or harassment risk.

## Discord

Current posture:

- social/community identity candidate;
- useful for community membership and contact identity;
- not achievement proof.

Decision:

- Discord is not the recommended next Gaming Passport proof provider.
- Discord can be a future social/community provider only if product direction explicitly chooses that path.

Required follow-up:

- define whether Discord proves account identity, community membership, or both;
- avoid presenting Discord as rank/skill/accomplishment proof;
- define scopes, revocation, data deletion and server membership privacy;
- verify OAuth/API copy never becomes Parent Auth.

## Xbox / PlayStation / Nintendo / Epic

Current posture:

- future/high friction;
- not first wave;
- platform access and partner review requirements are likely heavier than osu!/Steam/Discord;
- public docs are not enough to start runtime.

Decision:

- keep as future candidates.
- do not create readiness packs until access, official docs, allowed public fields and ownership model are clear.

Required follow-up:

- manual official docs review with approved developer/partner access;
- ownership verification review;
- public field and privacy review;
- platform branding/monetization review;
- proof value review.
