# Riot Policy Compliance Audit — TryhardNames Gaming Passport

Reviewed on: June 24, 2026

## Scope

This audit covers the current TryhardNames Gaming Passport surface before submitting a Riot Developer Portal request.
It is documentation and analysis only. The repo now has a public `/id/:slug` MVP and provider-neutral PR16 foundation scaffolding, but it does not implement Riot OAuth, Discord OAuth, Riot API calls, provider activation, provider sync, keys, secrets, remote Supabase changes, or production configuration changes.

The audited product scope is TryhardNames Gaming Passport:

- public landing at `/gaming-passport`;
- Google/email Parent Auth for a private owner draft;
- future Riot linked provider account after Riot approval;
- future League of Legends GameAdapter under RiotProvider;
- public generators that remain free and usable without an account.

## Official Riot policy sources reviewed

| Source | Last updated shown by Riot | URL | Relevant sections |
| --- | --- | --- | --- |
| Riot Developer Portal General Policies | March 11, 2025 | https://developer.riotgames.com/policies/general | Core policies, Product Registration, Monetization, Game Integrity, Developer Safety |
| Riot Developer Portal Game Specific Policies | March 11, 2025 | https://developer.riotgames.com/policies/game-specific | Overview and game-specific policy index |
| League of Legends Developer API Policy | Not shown on page | https://developer.riotgames.com/docs/lol | Registration, Monetization, Security, Game Integrity, Riot ID migration, Production key use cases, RSO Integration |
| Riot Developer Portal Product Registration and API Keys | Not shown on page | https://developer.riotgames.com/docs/portal | Product registration, working site/prototype expectations, API key types, API key security |
| Riot Developer Portal FAQs | Not shown on page | https://developer.riotgames.com/docs/faqs | RSO, production key website requirement, domain verification, multiple applications |
| Riot API Terms and Conditions | December 9, 2013 | https://developer.riotgames.com/terms | API keys, Game Information, permitted use, privacy restrictions, no endorsement, API key confidentiality |
| Riot Legal Jibber Jabber | August 2018 | https://www.riotgames.com/en/legal | Riot IP use, noncommercial/default fan-project rules, trademark/logo restrictions, visible project notice |

## Executive verdict

PASS WITH CONDITIONS

Current TryhardNames Gaming Passport documentation and public landing are aligned enough to submit a Riot Developer
Portal request as a product/prototype description. The repo does not currently implement Riot OAuth, does not call Riot
APIs, does not claim production Riot credentials, and does not display real or fake Riot game data in Gaming Passport.

The request should be submitted with strict wording: Riot integration is planned and pending approval, RSO is not live,
Riot data is not live, and the current reviewed user flow is the public landing plus private Parent Auth draft. Before
any Riot provider launch, TryhardNames still needs an approved production application, RSO access, server-side token
storage, explicit unlink/revoke flows, privacy policy updates for Riot data, and a Riot-data public projection review.

## Compliance matrix

| Policy area | Riot requirement | Current TryhardNames behavior | Evidence in repo | Verdict | Required action |
| --- | --- | --- | --- | --- | --- |
| Product registration / auditability | Products should be registered and kept current; Riot expects a working site, prototype, mockup, or clear user flow. | `/gaming-passport` is public, explains current and future flows, and PR7 documents production URLs and smoke results. | `apps/web/src/pages/GamingPassportPage.jsx`; `docs/product/RIOT_REVIEW_SUBMISSION_PACK.md`; `apps/web/public/sitemap.xml` | PASS | Submit only the current scoped flow. Keep Developer Portal metadata updated after every material product change. |
| Product completeness | Riot may reject incomplete or unclear sites; reviewers need to understand user flows. | Landing, sign-in, account draft, private draft editing, route registration, navigation, and sitemap are present. Riot provider runtime is intentionally absent. | `apps/web/src/App.jsx`; `apps/web/src/core/components/Navigation.jsx`; `docs/product/RIOT_REVIEW_SUBMISSION_PACK.md` | PASS WITH CONDITIONS | In the submission, label this as current product/prototype plus planned Riot integration, not as live Riot functionality. |
| Legal / Riot IP | Product must avoid implying Riot endorsement and use visible legal notice; Riot logos/trademarks should be limited. | Gaming Passport landing includes a visible Riot notice and does not use Riot logos/assets. | `apps/web/src/pages/GamingPassportPage.jsx`; `docs/product/GAMING_PASSPORT_RIOT_REVIEW_LANDING.md` | PASS | Keep the notice visible on future Riot-data pages. Do not add Riot logos/assets unless policy and approval support it. |
| Brand confusion | Product cannot closely resemble Riot games/products or imply official status. | Product name is `TryhardNames Gaming Passport`; copy says Riot approval is pending and Riot OAuth/data are not live. | `apps/web/src/pages/GamingPassportPage.jsx` | PASS | Avoid phrases that suggest official Riot affiliation, certification, or endorsement. |
| Game integrity | No unfair advantage, live-game advantage, game-session-specific hidden information, in-game decision dictation, or "solve the game" behavior. | Gaming Passport is a resume/profile concept, not live-game guidance. Landing denies live-game advantage and in-game recommendations. | `apps/web/src/pages/GamingPassportPage.jsx`; `docs/product/RIOT_REVIEW_SUBMISSION_PACK.md` | PASS | Do not add overlays, live match recommendations, hidden cooldown tracking, or in-game coaching under this product. |
| Ranking integrity | No alternative official skill ranking system; MMR/ELO calculators are prohibited. | Landing and docs explicitly say no custom MMR/ELO and no alternative ranking system. Planned LoL proofs are official standings only. | `apps/web/src/pages/GamingPassportPage.jsx`; `docs/product/GAMING_PASSPORT_ARCHITECTURE.md`; `docs/product/RIOT_REVIEW_SUBMISSION_PACK.md` | PASS | If ranks are later displayed, label them as official Riot-sourced standing with sync/source timestamp. |
| De-anonymization / hidden data | Products cannot identify or analyze players deliberately hidden by the game; no hidden-player data. | Landing says no hidden player data and no hidden-player de-anonymization. No Riot public profile route is active. | `apps/web/src/pages/GamingPassportPage.jsx`; `apps/web/src/gaming-passport/domain/publicProjection.js` | PASS | Future adapters must only use authorized, documented data and never infer hidden identities. |
| Match history | League policy restricts custom match history public display unless player opts in; avoid dumping match history. | Gaming Passport explicitly denies match-history dumping and plans only selected proofs. | `apps/web/src/pages/GamingPassportPage.jsx`; `docs/product/RIOT_REVIEW_SUBMISSION_PACK.md` | PASS | Keep match-history feeds out of Gaming Passport unless a future policy review approves a narrow opt-in scope. |
| Riot ID model | Player-facing fields should use Riot IDs rather than legacy Summoner Name assumptions. | Landing plans Riot ID display; domain models League as a GameAdapter under RiotProvider. | `apps/web/src/pages/GamingPassportPage.jsx`; `docs/product/GAMING_PASSPORT_ARCHITECTURE.md`; `apps/web/src/gaming-passport/domain/constants.js` | PASS | Future Riot adapter should canonicalize account identifiers server-side and avoid legacy Summoner Name dependency. |
| Data usage / privacy | Riot data should be accessed only through approved/authorized means; privacy rights must be respected. | Riot integration is not live. Docs require explicit authorization, server-side tokens, allowlisted public projection, and no hidden data. | `docs/product/RIOT_REVIEW_SUBMISSION_PACK.md`; `docs/product/GAMING_PASSPORT_SCHEMA_RUNBOOK.md`; `apps/web/src/gaming-passport/domain/publicProjection.js` | PASS WITH CONDITIONS | Before provider launch, update privacy policy and implement unlink/revoke/data deletion handling. |
| Consent and public profile | Public disclosure must be user-controlled and not expose private data by default. | Passport starts as a private draft; publishing is explicit; `/id/:slug` serves only allowlisted public projection data for policy-valid published Passports. | `apps/web/src/pages/AccountPage.jsx`; `docs/product/GAMING_PASSPORT_UI_CONTRACT.md`; `apps/web/src/gaming-passport/domain/publicationPolicy.js` | PASS | Publish command must remain explicit and server-side reviewed. |
| Provider/proof visibility | Public projection should only expose approved fields/proofs. | Domain public projection uses allowlisted DTOs and excludes internal IDs, source keys, tokens, external IDs, raw payloads, and generic metadata. | `apps/web/src/gaming-passport/domain/publicProjection.js`; `apps/web/src/gaming-passport/domain/constants.js` | PASS | Future Riot adapter must define explicit public proof schemas before any new field is exposed. |
| Monetization | Monetized content must be registered/approved, free tier must exist, and charged content must be transformative. | Public generators are free; landing says Riot data/assets are not monetized directly and future monetization is TryhardNames-owned cosmetics/themes/borders/animations. | `apps/web/src/pages/GamingPassportPage.jsx`; `docs/product/RIOT_REVIEW_SUBMISSION_PACK.md` | PASS WITH CONDITIONS | Keep Riot-owned data out of paywalls. Before selling cosmetics, document why they are TryhardNames-owned and transformative. |
| API keys / security | No API keys in code; production keys are one product/key; use HTTPS; secure keys. | No Riot keys or secrets were found in reviewed source. API integration routers for Riot/Discord are 501 reserved stubs. Production URLs use HTTPS. | `apps/api/src/integrations/riot/routes.js`; `apps/api/src/integrations/_stubNotImplemented.js`; `apps/web/src/lib/supabase/config.js` | PASS | Never ship Riot API keys to the browser. Future Riot tokens/keys must be server-side only. |
| RSO | RSO is OAuth-based account/data authorization and is only available after approved production application / RSO client. | Product copy says RSO is future/pending approval. No Riot OAuth button or runtime exists. | `apps/web/src/pages/GamingPassportPage.jsx`; `apps/api/src/integrations/riot/routes.js` | PASS | Do not implement or advertise RSO as live until Riot approval and credentials exist. |
| Google Parent Auth vs Riot linked provider | Riot should not be confused with parent login. | Google is Parent Auth only; Riot and Discord are future linked provider accounts; LoL is a GameAdapter inside RiotProvider. | `docs/product/GAMING_PASSPORT_ARCHITECTURE.md`; `apps/web/src/pages/GamingPassportPage.jsx`; `apps/web/src/pages/auth/SignInPage.jsx` | PASS | Keep Riot/Discord out of Parent Auth UI. |
| SEO / indexing | Public product pages may be indexable; private/public profiles must not expose data prematurely. | `/gaming-passport` is in sitemap; auth/account routes are noindex; `/id/:slug` is a dynamic route and only policy-valid profiles are indexable. | `apps/web/src/utils/sitemapGenerator.js`; `apps/web/src/pages/auth/SignInPage.jsx`; `apps/web/src/pages/AccountPage.jsx`; `apps/web/src/pages/PublicGamingPassportPage.jsx` | PASS | Re-audit SEO before broad public profile launch. |
| Out-of-scope providers | Avoid adding unrelated providers into the Gaming Passport Riot submission. | Gaming Passport domain only approves Discord/Riot and LoL. Existing site has public generator pages for other games, but they are not provider integrations. | `apps/web/src/gaming-passport/domain/constants.js`; `apps/web/src/core/components/Navigation.jsx` | PASS WITH CONDITIONS | In the Developer Portal request, scope the product to Gaming Passport and planned Riot/League integration only. |

## Detailed findings

### Product registration

Riot expects developers to register products and keep descriptions/metadata current. For production applications, Riot
expects a functioning site or clearly testable prototype/user flow. TryhardNames currently has a public landing,
documented production URLs, auth/draft flow, sitemap entry, and smoke checklist. This is sufficient for a scoped
submission as long as the request accurately says the Riot integration is planned, not live.

Required before/after submission:

- register TryhardNames Gaming Passport in the Developer Portal with current public URLs;
- keep the landing and Developer Portal description synchronized;
- update Riot before launching Riot OAuth, Riot API data, public profiles, or monetized Passport cosmetics.

### Legal notice / IP

The Gaming Passport landing has a visible Riot legal notice and uses the product name `TryhardNames Gaming Passport`.
The reviewed page does not use Riot logos or official Riot assets. This aligns with Riot's legal/IP expectations for
the currently reviewed surface.

Required before provider launch:

- keep the notice visible on `/gaming-passport`;
- add equivalent notice to any future Riot-data public page;
- avoid Riot logos/assets unless policy and approval make the usage unavoidable and permitted.

### Game integrity

The current product does not provide live-game assistance, game-session hidden data, in-game recommendations, coaching,
match-history dumping, hidden-player identification, custom MMR/ELO, or a ranking ladder. The landing explicitly denies
those categories.

Required before provider launch:

- keep Gaming Passport proof display asynchronous/profile-oriented;
- do not add overlays, live game advice, hidden cooldown tracking, or hidden player analysis;
- display only official Riot-sourced rank fields if approved.

### Data usage and privacy

Gaming Passport is private-draft-first. The domain separates owner publishability from anonymous public serving and
uses minimal public DTOs. The database runbook says public reads must use allowlisted backend/RPC behavior later and
must not query owner tables directly. Riot data is currently not accessed.

Required before provider launch:

- implement RSO only after Riot approval;
- store provider tokens server-side only;
- implement unlink/revoke before launch;
- update privacy policy for Riot data categories, retention, deletion, and user controls;
- define Riot/LoL public proof schemas before exposing data.

### Monetization

Current public generators remain free. Gaming Passport says Riot-owned data/assets are not monetized directly. Future
monetization is limited to TryhardNames-owned cosmetics/themes/borders/animations. This is likely acceptable only if
cosmetics remain independent from Riot-owned data/assets and do not gate Riot data.

Required before monetization:

- keep all Riot data visible in a free tier if used;
- do not put Riot data or Riot assets behind a paywall;
- document cosmetics as TryhardNames-owned presentation layers, not paid access to Riot data;
- ask Riot through the Developer Portal if monetization design changes.

### API key/security

No Riot API key is present in the audited source. The existing Riot API route is a 501 reserved stub and does not call
Riot. Supabase browser config rejects service-role-like values, which is relevant to general secret hygiene but separate
from Riot credentials.

Required before provider launch:

- use production Riot credentials only for the approved product;
- keep Riot keys, RSO client secrets, refresh tokens, and provider tokens off the browser;
- serve through HTTPS;
- monitor rate limits and handle non-200 responses by status code, not fragile response body assumptions.

### Provider model

The provider model is clear and low risk for Riot review:

- Google is Parent Auth Account only;
- Riot is a future linked provider account;
- Discord is a future linked provider account;
- League of Legends is a GameAdapter inside RiotProvider;
- League of Legends is not a standalone provider.

This separation should be repeated in the Developer Portal wording.

### Public profile consent

The public `/id/:slug` MVP exists after PR15. It serves only allowlisted projection data for policy-valid published Passports and returns safe unavailable behavior for private, draft, unpublished, suspended, missing-provider, or nonexistent profiles. PR16 does not expand that public projection.

Required before provider-backed public profile expansion:

- keep publish commands server-side and explicit;
- require consent, slug, non-suspended status, and verified provider policy;
- keep public projection allowlisted and minimal;
- re-audit indexing, proof fields, and provider visibility before broad launch.

### SEO/indexing

`/gaming-passport` is intentionally indexable and present in sitemap. Auth/account routes are noindex. There is no
indexable `/id/:slug` route. This is acceptable for the current landing/review packet.

## Submission wording constraints

### Safe phrases to use

- "TryhardNames Gaming Passport is a visual, verifiable, shareable gaming resume."
- "The current public page is `/gaming-passport`."
- "Google is Parent Auth only and does not appear as a public proof."
- "Riot is a planned linked provider account, pending Riot approval."
- "League of Legends will be modeled as a GameAdapter under RiotProvider."
- "Users will explicitly authorize Riot access through Riot Sign On after approval."
- "The current product does not call Riot APIs or display real Riot data."
- "Future public proofs will use allowlisted fields only and require user consent."
- "TryhardNames does not calculate custom MMR/ELO or create an alternative ranking system."
- "Riot-owned data and assets will not be monetized directly."

### Avoid saying

- "Riot OAuth is live."
- "Production Riot key exists."
- "Real Riot data is live."
- "TryhardNames tracks all match history."
- "TryhardNames predicts MMR/ELO."
- "TryhardNames recommends in-game decisions."
- "TryhardNames ranks players globally."
- "TryhardNames is official, endorsed, certified, or approved by Riot."
- "League of Legends is a separate provider."
- "Riot or Discord are login methods for Parent Auth."
- "Paid users get better Riot data."

### Suggested concise Developer Portal summary

TryhardNames Gaming Passport is a private-first visual gaming resume. The current public site shows the product concept
and lets users sign in with Parent Auth to manage a private draft. Riot integration is not live. After Riot approval,
players will explicitly link Riot through Riot Sign On, and League of Legends proofs will display only approved,
user-authorized fields such as Riot account ownership, Riot ID display, Ranked Solo/Duo standing, Ranked Flex standing,
sync timestamp, and source. The product does not provide live-game advice, custom MMR/ELO, alternative rankings,
hidden-player identification, match-history dumping, or public profiles without consent.

## Risks before submission

- The application must be positioned as a current public landing plus private draft flow with planned Riot integration,
  not as a live Riot-data product.
- Riot may ask for clearer proof of user flow beyond the landing. Use `/gaming-passport`, `/sign-in`, and `/account`
  screenshots or a short video if needed.
- The broader TryhardNames site includes public game-name generator pages for multiple games. The Developer Portal
  submission should scope the requested product to Gaming Passport and planned Riot/League integration only.
- Existing Riot/Discord API modules are 501 reserved stubs. They are not runtime integrations today, but should stay
  nonfunctional until approved implementation work begins.
- The legal notice is visible on `/gaming-passport`; future Riot-data public pages will need equivalent visibility.
- The privacy policy should be updated before any Riot data is collected or displayed.
- Provider-neutral foundation now includes local intent/callback/sync/audit scaffolding and a token vault placeholder, but provider-specific unlink/revoke execution, data retention, deletion workflows, and real token storage usage are still not live.
- Future monetization must keep Riot data/assets out of paywalls and should be re-reviewed with Riot if unclear.

## Go / No-Go

GO WITH CONDITIONS.

TryhardNames can submit the Riot Developer Portal request now if the submission stays within the documented scope:
public Gaming Passport landing, Parent Auth private draft, and planned Riot linked-provider integration pending approval.

No code/copy changes are required before submission based on this audit. Do not implement Riot OAuth, request live Riot
data, or claim production Riot credentials until Riot approves the product and provides the appropriate next steps.

## PR17 Provider Decision Update

PR17 reviewed repo evidence and did not find explicit Riot approval, approved scopes, callback URLs, product credentials, production Riot keys, or a product-owner instruction to start Riot runtime.

Decision:

- Riot Runtime: blocked.
- PR18 = Riot Readiness.
- No OAuth launch.
- Discord Pilot remains an alternate future path, not the selected PR18 path.

PR18 should remain readiness-only: compliance refresh, RSO callback design, token retention plan, revoke/unlink UX design, provider adapter contract review, portal checklist, and smoke plan. It must not add Riot OAuth, Riot API calls, RSO runtime, secrets, env vars, provider activation, or public Riot data.

## PR18 Riot Readiness Update

PR18 implements the readiness-only path selected by PR17.

- Riot Runtime: blocked.
- PR18 is not Riot runtime.
- No OAuth launch.
- No Riot API calls.
- No secrets/env vars.
- No callback route.
- No RSO redirect.
- No provider activation.
- No public Riot data.

PR18 adds:

- Riot approval checklist.
- Design-only RSO callback plan.
- Token retention and encryption requirements.
- Unlink/revoke UX requirements.
- RiotProvider and LeagueOfLegendsAdapter contract review.
- Public projection review criteria.
- Manual Riot Portal checklist for a human owner.
- PR19 preconditions.

PR19 remains the earliest possible Riot runtime PR, only if explicit approval exists.
