# Roadmap Status Matrix

This matrix reflects the PR15 branch after PR10.8, PR11.1, PR12, PR13, PR14, and PR15.

| Area | Status | Evidence | Already exists | Missing | Next roadmap block | Notes / guardrails |
| --- | --- | --- | --- | --- | --- | --- |
| Public generators | done | Public routes, dynamic pages, feature generators | Free name/text/symbol/generator surfaces with favorite/star save UX | Provider/runtime proof surfaces | PR13 | Public generators stay public. |
| Theme / visual surfaces | done | `UI_THEME_SURFACE_CONTRACT.md`, `THEME_AUDIT.md`, PR10.x docs | Theme contract and route audit follow-ups | Only critical visual fixes | PR23 | PR10.x visual/tooling line is closed. |
| Tool container audit | done | `scripts/audit-tool-containers.mjs`, `TOOL_CONTAINER_VISUAL_AUDIT.md` | Chrome audit, JSON/Markdown/screenshot output | CI enforcement, if desired | PR23 | Audit is local tooling, not runtime. |
| Dynamic NameCard + Lineup visual redesign | done | `NAMECARD_LINEUP_VISUAL_REDESIGN.md` | Dynamic card clamp, hierarchy, drawer coverage work | Legacy internal cleanup only if needed | PR23 | Favorite/star is now the canonical save model. |
| Feature generator visual alignment | done | `FEATURE_GENERATOR_CARD_VISUAL_ALIGNMENT.md` | GamerNames and RobloxNames card alignment | Account/editor depth | PR13 | No further visual patching unless critical. |
| Parent Auth | done | `/sign-in`, `/sign-up`, `/auth/callback`, `/account` guard | TryhardNames account login and saved-name ownership | Editor depth and future account state | PR13 | Google is Parent Auth only, not public proof. |
| Private Gaming Passport Draft | done | `AccountPage.jsx`, `passportRepository.js`, `PrivatePassportEditor.jsx` | Owner-only private draft create/read/update, Editor V2, private preview, completion checklist, private Saved Names highlights | Provider-backed proof management | PR16 | Draft stays private by default unless explicit publish policy is satisfied. |
| Account Dashboard V2 | done | PR11.1, `AccountPage.jsx`, PR13/PR14 components | Dashboard sections, favorite-first saved-name guidance, Account Hunting Guide, embedded Private Passport Editor V2, private publish controls | Provider runtime controls | PR16 | Dashboard V2 is implemented. |
| Saved Names local SoT | done | `FavoritesContext.jsx`, `favoritesSoT.js`, `localFavoritesBridge.js`, `FavoriteStarButton.jsx`, `MinimalFavoritesPeek.jsx` | Local fallback, compatibility bridge, account mirror | Future cleanup of PocketBase legacy fallback if safe | PR13 | Favorite/star is the canonical saved-name UX. |
| Saved Names Persistence | done | `savedNamesRepository.js`, `20260625170000_saved_names.sql`, `saved_names_test.sql` | Supabase `saved_names`, owner RLS, local-to-account sync, account-to-local mirror | Future richer account-state analytics if needed | PR13 | Saved Names Supabase persistence is implemented with local fallback. |
| Linked Provider domain | partial-contract | `constants.js`, architecture docs | Provider IDs and statuses | Runtime commands and provider service layer | PR16 | Linked providers are not Parent Auth. |
| Linked Provider schema | partial-schema | Local schema runbook and migration foundation | `linked_provider_accounts` local table | Token storage, remote rollout, sync metadata | PR16 | No remote Supabase changes in docs-only work. |
| Linked Provider runtime | pending | No OAuth/link runtime | None | Link, callback, unlink, revoke, state, sync | PR16 | No Discord/Riot OAuth live. |
| Verified Proof domain | partial-contract | `constants.js`, data model docs | Proof types, visibility constants | Provider-backed proof creation | PR16 | Proofs must be source-backed. |
| Verified Proof schema | partial-schema | Local schema foundation | `verified_proofs`, featured proofs, visibility settings | Remote rollout, migrations for runtime needs | PR16 | Schema is local foundation only. |
| Verified Proof sync runtime | pending | No sync jobs or provider adapters | None | Sync jobs, stale/revoked states, audit | PR16 | No fake proof data. |
| Publish Policy | done | `publicationPolicy.js`, PR14 command domain | `getPublishability`, `isPassportPublishable`, `canServePublishedPassport`, command readiness gates | Provider-backed proof runtime | PR16 | Publish Policy exists as a contract and PR14 enforces it in commands. |
| Publish Runtime Commands | done | `publishCommands.js`, `passportPublishRepository.js`, `PassportPublishControls.jsx`, `20260625200000_publish_runtime_commands.sql` | Consent, slug claim/update, publish attempt, unpublish, owner-only SQL RPCs, policy-blocked state | Provider-backed publishability in real production data | PR16 | Publish remains blocked until verified linked provider exists. |
| Public Projection | done | `publicProjection.js`, `publicPassportRepository.js`, `get_public_gaming_passport_projection` | `buildPublicPassportProjection`, allowlisted DTO, public projection RPC, defensive client allowlist | Provider-backed proof data population | PR16 | Public Projection is served without exposing private fields. |
| Public Profile `/id/:slug` | done | `App.jsx`, `PublicGamingPassportPage.jsx` | Public route, safe unavailable behavior, SEO/share metadata, allowlisted profile view | Trust/safety controls, provider-backed production profiles | PR16 | `/id/:slug` is implemented as MVP public projection serving. |
| Provider Runtime Foundation | pending | Roadmap docs only | Domain/schema pieces | Token storage, link/unlink/revoke, sync, audit, rate limits | PR16 | Provider runtime foundation must precede OAuth launch. |
| Provider token storage | pending | Data model defers provider tokens | None | Secure server-side token store and retention policy | PR16 | No secrets or env vars in repo. |
| Discord runtime | pending | Constants/docs only | Provider ID planned | OAuth, callbacks, tokens, unlink/revoke, sync | PR18 | Discord OAuth is not live. |
| Riot runtime | gated | Riot review docs, verification file | Site verification and safe copy | Approval, RSO, callbacks, tokens, RiotProvider | PR19 | Riot runtime remains gated by Riot approval. |
| League of Legends adapter | pending | Roadmap docs only | Conceptual GameAdapter placement | Riot-backed LoL proof normalization | PR20 | No tracker, OP.GG clone, live-game advice, or hidden-player inference. |
| Cosmetics | pending | Roadmap docs only | Product direction | Cosmetic schema/runtime/storefront rules | PR21 | No Riot data/assets monetization. |
| Trust/Safety | pending | Roadmap docs only | Policy boundaries | Reports, takedown, suspensions, abuse controls | PR22 | Required before broad public profiles. |
| Launch readiness | pending | Roadmap docs only | Validation command habit | Production smoke, observability, rollback, privacy final review | PR23 | No launch until gates are satisfied. |

## Summary

- Account Dashboard V2 is implemented.
- Private Gaming Passport Editor V2 is implemented as owner-only draft editing.
- Publish Policy and Public Projection already exist as contracts.
- Publish Runtime Commands are implemented as private owner-controlled commands.
- Public Profile `/id/:slug` is implemented as an MVP allowlisted public projection surface.
- Provider-neutral domain/schema is partial, but Provider Runtime Foundation is pending.
- Saved Names Supabase persistence is implemented with owner-only RLS and local fallback.
