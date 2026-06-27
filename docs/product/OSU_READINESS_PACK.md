# RM-26 osu! Readiness Pack

RM-26 evalua osu! como candidato oficial de linked provider para TryhardNames Gaming Passport bajo la politica readiness-before-runtime.

Este PR no implementa runtime. No crea OAuth real, callback route, tokens, env vars, secrets, DB migrations, Supabase remoto, Vercel, provider linking UI, store/payment ni `/cosmetics`.

## Executive Summary

Decision: `conditional-go` para RM-27 osu! Runtime Foundation.

osu! es buen candidato para el siguiente provider-specific readiness porque la documentacion oficial publica cubre API v2, OAuth, Authorization Code Grant, Client Credentials Grant, scopes, `/me`, user profile data, refresh tokens, revoke current token y terminos de uso de API. El modelo de ownership es viable con Authorization Code + `identify` + `/me`, pero RM-27 debe resolver implementacion segura antes de cualquier runtime.

RM-26 no aprueba activacion. El resultado solo permite planear RM-27 si se cumplen las condiciones de token handling, revoke/unlink, stale proof, rate limit/backoff, privacy copy, public projection allowlist y source guards.

official_docs_review: run - official osu! docs reviewed on 2026-06-27.

## Official Docs Reviewed

| URL oficial | Seccion revisada | Conclusion | Impacto en TryhardNames | Preguntas abiertas |
| --- | --- | --- | --- | --- |
| https://osu.ppy.sh/docs/ | Introduction, Terms of Use, Endpoint/Base URL | API v2 es documentada oficialmente. Los terminos piden uso respetuoso, cache y evitar polling abusivo. | RM-27 debe usar polling irregular/minimo y caching. No tracker/ranking clone. | Confirmar si el volumen de TryhardNames requiere contacto previo con osu! antes de produccion. |
| https://osu.ppy.sh/docs/ | Authentication, registering OAuth application, Authorization Code Grant | El flujo de usuario existe y requiere callback URL registrada. El `state` debe validarse contra CSRF. | Ownership verification debe usar Authorization Code, no Client Credentials. | RM-27 debe definir callback URL exacta y state storage server-side. |
| https://osu.ppy.sh/docs/ | Client Credentials Grant, Resource Owner | Client Credentials no tiene Resource Owner y actua como guest user salvo delegacion especial. | No sirve para probar ownership del usuario. | Ninguna para RM-26; usarlo para ownership queda descartado. |
| https://osu.ppy.sh/docs/ | Scopes | `identify` permite leer `/me`; `public` permite datos publicos. Chat/forum/friends/delegate son innecesarios. | Scopes minimos conceptuales: `identify public`. | Confirmar si `identify` implicito basta o si RM-27 debe pedirlo explicitamente para claridad de consentimiento. |
| https://osu.ppy.sh/docs/ | Get Own Data `/me/{mode?}` | `/me` devuelve datos del usuario autenticado y requiere OAuth + `identify`. | Soporta account ownership verification. | Confirmar campos exactos almacenables despues de probar respuesta real en RM-27. |
| https://osu.ppy.sh/docs/ | Get User `/users/{user}/{mode?}` and user/profile data | Datos de usuario y perfil existen via API publica/autenticada, pero son mas amplios que el proof minimo. | Public projection debe ser allowlisted. | Definir si profile URL se deriva localmente desde username/id o desde un campo API permitido. |
| https://osu.ppy.sh/docs/ | OAuth Tokens, Revoke current token | Existe endpoint para revocar el token autenticado actual. | Unlink futuro debe intentar revoke, invalidar proof y borrar/retener tokens segun politica aprobada. | Confirmar semantica de refresh token despues de revoke en implementacion real. |
| https://osu.ppy.sh/legal/en/Terms | Terms of Service | El uso del sitio/API debe ser legal y no prohibido; osu! no garantiza exactitud permanente de informacion. | TryhardNames debe evitar endorsement implicito y claims de rank/estado no permitidos. | Revisar branding oficial si osu! publica reglas especificas separadas antes de RM-27. |
| https://osu.ppy.sh/legal/en/Privacy | Privacy Policy | Perfiles y algunas contribuciones pueden ser publicos; datos personales y controles del usuario tienen condiciones propias. | Public proof debe minimizar exposicion y permitir unlink/deletion de TryhardNames. | Privacy copy de RM-27 debe explicar que el perfil osu! enlazado puede exponer datos publicos gestionados en osu!. |

## Product Fit

osu! encaja como gaming proof provider porque:

- el usuario puede consentir una conexion;
- existe un perfil publico reconocible;
- el proof de cuenta enlazada tiene valor para Gaming Passport;
- la dependencia de aprobacion externa parece menor que Riot, aunque no elimina revision legal/producto;
- los limites oficiales desalientan polling agresivo, lo cual coincide con el modelo de Passport y no tracker.

Limite de producto: TryhardNames no debe convertirse en ranking alternative, match-history dump, live-game advice tool, hidden-player inference product ni osu! tracker. El proof propuesto es identidad de cuenta enlazada, no performance scoring.

## Account Ownership Model

Decision: usar Authorization Code Grant con user consent, scope `identify` y llamada futura a `/me/{mode?}` para obtener el usuario autenticado.

Modelo conceptual:

1. El owner inicia linking desde `/account`.
2. TryhardNames genera state server-side.
3. El usuario autoriza la aplicacion osu!.
4. osu! redirige a la callback registrada.
5. RM-27 intercambiaria el code server-side.
6. RM-27 consultaria `/me/{mode?}` con el token del usuario.
7. TryhardNames guardaria solo la identidad externa necesaria y metadata minima de verificacion.

Client Credentials queda descartado para ownership porque no representa al usuario. Puede obtener datos publicos, pero no prueba que la cuenta externa pertenece al owner de TryhardNames.

Ownership verification decision: conditional-go. El modelo oficial existe, pero RM-27 debe implementar state, callback, token exchange, storage, revoke y error handling antes de activacion.

## OAuth/API Model

Modelo recomendado para RM-27:

- Authorization Code Grant para ownership.
- `identify public` como scope conceptual maximo inicial.
- `/me/{mode?}` como fuente de ownership.
- `/users/{user}/{mode?}` solo si se necesita refrescar campos publicos permitidos.
- server-side token exchange only.
- no browser token exposure.
- no raw API payload public exposure.

No usar:

- Client Credentials para ownership.
- chat scopes.
- forum scopes.
- friends scope.
- delegate scope.
- lazer-only scopes.
- score/ranking endpoints para alimentar una vista publica tipo tracker.

OAuth/API decision: conditional-go para diseno de RM-27, no implementacion en RM-26.

## Scopes Review

Scopes minimos conceptuales:

| Scope | Decision | Rationale |
| --- | --- | --- |
| `identify` | allow for RM-27 design | Necesario para leer `/me` y confirmar el usuario autenticado. |
| `public` | allow if required | Puede leer datos publicos necesarios para el perfil enlazado. |
| `friends.read` | reject | No es necesario para proof de ownership y aumenta privacy risk. |
| `chat.read`, `chat.write`, `chat.write_manage` | reject | No hay caso de uso de Passport; alto riesgo de abuso. |
| `forum.write`, `forum.write_manage` | reject | No hay necesidad de escribir como usuario. |
| `delegate`, `group_permissions`, bot/delegation scopes | reject | No aplica a ownership de usuario normal. |
| `multiplayer.write_manage` | reject | No hay necesidad de gestionar rooms. |

RM-27 debe fallar cerrado si osu! cambia scopes, defaults o requisitos de `/me`.

## Public Field Review

Allowlist conceptual inicial:

- provider id conceptual: `osu`;
- display name: `osu!`;
- external username/display name visible;
- profile URL visible;
- verification timestamp;
- proof type `profile_linked`;
- source `osu`;
- public visibility only after user consent and publish policy.

No permitir publicamente:

- external account id bruto si no es necesario;
- email;
- country/location si no fue expresamente aprobado;
- friends;
- chat/forum data;
- raw API response;
- token metadata;
- internal linked provider account id;
- private proof status;
- score list, match-history dump o recent activity feed;
- rank/PP/status badges no source-backed o no permitidos.

public projection remains allowlisted.

## Token Storage And Retention Review

RM-26 no agrega token storage implementation.

Para RM-27, cualquier token debe cumplir:

- server-side only;
- encrypted at rest before persistence;
- never returned to browser;
- never logged;
- not present in public projection;
- minimal retention;
- token status tracked separately from public proof;
- refresh token rotation handled atomically;
- revoked/unlinked status terminal for token usage;
- deletion/retention behavior documented before launch.

El token no es proof publico. El proof publico depende de una verificacion derivada, allowlisted y revocable.

## Unlink/Revoke Expectations

Unlink futuro debe:

- attempt revoke current token when token exists;
- clear active token material according to accepted retention policy;
- mark linked provider account as revoked or disconnected;
- mark provider-derived proofs as revoked or not displayable;
- stop future sync;
- remove osu! from public projection unless a product-approved stale state is explicitly allowed;
- write audit event without secrets.

Si revoke falla por token ya invalido, la UX debe tratarlo como unlink local exitoso, registrar estado safe y no seguir mostrando proof activo.

## Stale/Revoked Proof Behavior

Estados conceptuales:

- `verified`: ownership was observed and token/proof policy is current.
- `stale`: proof was valid but has not been refreshed within accepted freshness window.
- `revoked`: user unlinked, token revoked, auth failed terminally, or provider access was removed.

Politica:

- revoked proof never appears in public projection;
- stale proof appears only if product explicitly accepts a visible stale label;
- if stale display is not accepted, public proof is hidden until refresh;
- failed refresh must not fabricate proof;
- disconnected provider cannot satisfy publish policy.

## Public Projection Safety

The proof model is conceptual. It must not bypass existing public projection guards.

RM-27 must preserve:

- allowlisted DTOs only;
- no internal IDs;
- no raw metadata;
- no raw provider payload;
- no token status beyond safe public proof state if approved;
- no private account data;
- no provider-derived rank unless source-backed, allowed and separately reviewed;
- no tracker/ranking clone;
- no match-history dump;
- no live-game advice;
- no hidden-player inference;
- no excessive polling.

## Rate Limit And Backoff Review

Official docs recommend caching, exponential backoff, irregular polling and no more than 60 requests per minute. They call out abusive patterns such as per-minute polling for every user and using the API as a database.

RM-27 requirements:

- no polling every minute for each linked user;
- cache profile verification result;
- refresh only for explicit owner action, scheduled low-frequency proof freshness, or required compliance state;
- implement exponential backoff on rate limit or error pressure;
- stop sync on repeated auth/rate failures;
- log aggregate errors without provider payload or token data.

## Branding, Assets And Monetization Review

Decision:

- use text label `osu!` only unless official asset permissions are accepted;
- no osu! logos/assets by default;
- no implied endorsement;
- no official partnership claim;
- no paywall of provider data;
- no selling osu! proof;
- no premium boosts from osu! data;
- no badges that imply official osu! rank/status unless source-backed and allowed.

TryhardNames-owned cosmetics may style the Passport shell, but they must not alter proof truth or imply osu! status.

## Trust, Safety And Privacy Review

Risks:

- impersonation through similar usernames;
- harassment/doxxing through public profile URL exposure;
- public profile fields controlled outside TryhardNames;
- stale proof that appears current;
- revoked proof still appearing after unlink;
- rate-limit abuse from sync loops;
- fake proof/rank claims;
- user confusion about endorsement.

Controls required for RM-27:

- explicit consent copy before linking;
- public display copy before publish;
- unlink/deletion flow;
- report abuse integration with public profile reporting;
- stale/revoked labels and hidden revoked proofs;
- provider-specific disclaimer: "Linked osu! account, not official osu! endorsement.";
- no score/ranking/beatmap history aggregation by default.

## Implementation Readiness Score

| Area | Score | Notes |
| --- | ---: | --- |
| Official docs clarity | 3 | API v2/OAuth docs are public and current enough for design. |
| Ownership verification | 3 | Authorization Code + `/me` supports user ownership. |
| OAuth/API model | 3 | Grant types, scopes and token flow are documented. |
| Public field safety | 2 | Fields are broad; TryhardNames must allowlist narrowly. |
| Token storage risk | 2 | Standard OAuth risk; must be server-side encrypted in RM-27. |
| Revoke/unlink model | 2 | Revoke current token exists, but full unlink semantics need implementation proof. |
| Rate limit/backoff | 3 | Official usage guidance is clear. |
| Branding/monetization | 2 | Safe with text-only use and no monetized provider proof. |
| Trust/safety/privacy | 2 | Manageable with consent, unlink, report and stale-state controls. |
| Product fit | 3 | Strong gaming identity value without Riot approval dependency. |

Overall: `conditional-go`.

## Go/No-Go Decision For RM-27

RM-27 may proceed only as a limited runtime foundation if it implements:

- Authorization Code ownership with CSRF-safe state;
- registered callback requirements;
- server-side token exchange;
- encrypted token storage or a documented no-refresh-token strategy;
- unlink/revoke;
- stale/revoked proof handling;
- allowlisted public projection;
- rate limit/backoff;
- privacy and public consent copy;
- source guards proving no tracker/ranking clone, no match-history dump, no live-game advice and no hidden-player inference.

RM-27 must remain blocked if any of those are not accepted before runtime.

## RM-27 Follow-Through

RM-27 accepts the `conditional-go` as a disabled-by-default server-side foundation, not a production launch.

RM-27 implements the accepted conditions with:

- `apps/api` as the server boundary for Authorization Code exchange, `/me` ownership verification and revoke-current-token handling;
- server-only `OSU_CLIENT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY` and `OSU_STATE_SECRET`;
- hashed, one-time OAuth state with short TTL and owner/passport binding;
- `identify public` as the initial allowlisted scope set;
- no-refresh-token storage strategy: the access token is used server-side for `/me`, revoked immediately and discarded;
- private `linked_provider_accounts` and `verified_proofs` rows for `profile_linked`;
- owner-only status and unlink/revoke endpoints;
- revoked/stale proofs hidden from public projection;
- no tracker/ranking clone, no match-history dump, no live-game advice and no hidden-player inference.

RM-27 still does not approve production activation, public provider linking UI, public osu! proof promotion, refresh-token retention, broad polling, store/payment, `/cosmetics`, remote Supabase changes, Vercel changes or deploy execution.

## Non-Goals

RM-26 does not implement:

- osu! OAuth;
- osu! API calls;
- osu! runtime;
- `OsuProvider`;
- callback route;
- provider linking UI;
- provider sync jobs;
- provider tokens;
- token storage implementation;
- env vars/secrets;
- DB migrations;
- Supabase remote changes;
- Vercel changes;
- Google Cloud changes;
- Riot Portal changes;
- Riot runtime;
- Discord runtime;
- Steam runtime;
- Supercell/Clash runtime;
- `/cosmetics`;
- store/payment;
- checkout;
- billing;
- subscriptions;
- inventory purchase;
- pets/companions runtime;
- 3D runtime;
- deploy execution.

No OAuth implementation. No callback route. No token storage implementation. No env vars/secrets. No osu! runtime.

## Rollback

Revert the RM-26 PR. It is docs/tests only and does not alter runtime, database, providers, auth, deployments, remote services, env vars, secrets, store/payment, `/cosmetics` or production configuration.

RM-27 status: implemented as conditional foundation
