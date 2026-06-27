# Provider Expansion Roadmap

RM-23 defines how TryhardNames should evaluate providers after Provider Runtime Foundation, Riot Readiness, Cosmetics Foundation, and Trust/Safety controls.

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
| osu! | Recommended first readiness candidate | Readiness candidate, not live runtime | Good candidate for RM-26 because account identity and profile/public API surfaces can be reviewed without Riot approval dependency. |
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

## Riot

Riot has an existing readiness pack:

- `RIOT_READINESS_PACK.md`;
- `RIOT_RSO_CALLBACK_DESIGN.md`;
- `RIOT_PROVIDER_ADAPTER_CONTRACT_REVIEW.md`;
- `RIOT_POLICY_COMPLIANCE_AUDIT.md`.

Riot Runtime remains blocked until explicit approval exists in repo evidence. PR19/RM-19 cannot start as runtime without that approval.

## osu!

osu! is the recommended first provider readiness candidate.

RM-26 should review:

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

RM-26 is readiness only. RM-27 is conditional runtime foundation only if RM-26 exits with explicit go criteria.

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

## Provider Runtime Non-Goals For RM-23

RM-23 does not implement:

- Riot OAuth/API/runtime;
- Discord OAuth/API/runtime;
- osu! OAuth/API/runtime;
- Steam OpenID/API/runtime;
- Supercell/Clash runtime;
- provider tokens;
- provider callback routes;
- provider sync jobs;
- public provider linking UI;
- env vars or secrets.

## Product Guardrails

Provider expansion must not turn TryhardNames into:

- OP.GG clone;
- tracker;
- match-history dump;
- custom MMR/ELO product;
- ranking alternative;
- live-game advice tool;
- hidden-player de-anonymization surface.
