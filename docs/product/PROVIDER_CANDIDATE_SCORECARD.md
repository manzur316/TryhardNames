# Provider Candidate Scorecard

RM-25 define el scorecard para comparar providers externos antes de abrir cualquier readiness pack especifico o runtime.

GitHub/main/docs/product/PRs mergeados/CI son la fuente de verdad. El chat no es fuente de verdad. Este documento no aprueba runtime, OAuth, callbacks, tokens, env vars ni cambios de produccion.

## Proposito

El scorecard existe para que TryhardNames compare candidatos con una misma regla: readiness-before-runtime.

Un puntaje alto permite recomendar un readiness pack. No permite implementar runtime. Runtime solo puede empezar despues de un readiness pack especifico con salida go, revision oficial de docs, alcance de OAuth/API, privacidad, unlink/revoke, public projection, trust/safety y aprobacion de producto.

## Escala

| Score | Meaning | Interpretation |
| --- | --- | --- |
| 0 | blocker / unknown | No usar para readiness sin investigacion oficial adicional. |
| 1 | high risk | Posible, pero requiere mitigacion fuerte o aprobacion externa. |
| 2 | medium risk | Viable para readiness con follow-up claro. |
| 3 | good fit | Buen candidato para readiness si los demas gates tambien pasan. |

Los puntajes son decision-support, no verdad absoluta.

## Pesos

| Criterion | Weight | Why it matters |
| --- | --- | --- |
| Official docs clarity | 3 | Sin docs oficiales claras no hay base auditable. |
| Account ownership verification | 3 | Gaming Passport necesita proof de ownership, no solo busqueda publica. |
| Public profile fields | 2 | La proyeccion publica debe seguir allowlisted y minima. |
| OAuth/API model | 3 | El modelo de autorizacion define callbacks, scopes y riesgo de tokens. |
| Token storage complexity | 2 | Tokens deben evitarse o vivir solo server-side con retencion/revoke. |
| Revoke/unlink model | 2 | El usuario debe poder desconectar y retirar efectos publicos. |
| Rate limit clarity | 2 | Sync y proof freshness necesitan backoff y limites claros. |
| Branding/assets risk | 2 | Nombres, logos y assets de terceros no deben crear riesgo de aprobacion. |
| Monetization restrictions | 2 | Provider data/assets no deben terminar en paywall ni venta indirecta no permitida. |
| Privacy risk | 3 | Provider proofs pueden exponer identidad externa o actividad sensible. |
| Trust/safety risk | 3 | Public proof puede aumentar impersonation, harassment o doxxing. |
| Proof value | 3 | El provider debe aportar proof real, no solo decoracion social. |
| Implementation friction | 2 | Un readiness candidate debe ser investigable sin bloquear el roadmap completo. |
| Product fit | 3 | Debe reforzar Gaming Passport como resume verificable. |
| Dependency on approval | 3 | Dependencias externas fuertes reducen predictibilidad. |
| Risk of becoming tracker/ranking clone | 3 | TryhardNames no debe convertirse en tracker, OP.GG clone o ranking alternativo. |

## Como interpretar totales

| Weighted range | Posture |
| --- | --- |
| 90+ | Strong readiness candidate, still not runtime. |
| 70-89 | Useful future readiness candidate with scope caveats. |
| 50-69 | Gated or risky candidate; readiness only if blocker is understood. |
| Below 50 | Future/high-friction candidate or manual review required first. |

Un candidato puede tener buen puntaje total y aun ser no-go si falla un criterio critico como ownership verification, approval evidence, token safety o public projection safety.

## Required Readiness Checks

Antes de runtime, todo provider debe completar:

- official documentation review;
- account ownership verification review;
- allowed public fields review;
- OAuth/API model review;
- token storage review;
- unlink/revoke review;
- stale/revoked proof behavior review;
- public projection safety review;
- trust/safety review;
- monetization and branding review;
- no tracker/ranking clone review.

## RM-25 Non-Goals

RM-25 no implementa:

- provider runtime;
- Riot OAuth/API/runtime;
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
- store, checkout, billing, subscriptions, inventory purchase, marketplace or payments;
- Stripe or MercadoPago;
- DB migrations;
- Supabase remote changes;
- Vercel, Google Cloud or Riot Portal changes.
