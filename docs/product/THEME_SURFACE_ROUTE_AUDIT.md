# Theme Surface Route Audit

## Summary

PR10.1 corrected Account/Auth functional surfaces. PR10.2 restored the global light-mode baseline and made the Gaming Passport landing theme-aware. PR10.3 audits connected legacy generator, hub, and dynamic route surfaces to identify which shared templates still bypass the light/dark contract.

The main finding is that most reported broken URLs are not separate page implementations. They are dynamic/programmatic routes rendered through `DynamicPage` and the shared `SeoTemplate` route surface.

This audit is not a completion claim.

## Audit Method

- Audit date: June 24, 2026.
- Source scan: `apps/web/src`, route definitions, feature layouts, shared components, and SEO programmatic templates.
- Visual smoke: local Vite server with Chrome headless, toggling `localStorage.theme` between `light` and `dark`.
- In-app browser was unavailable during this audit, so Chrome headless was used as the visual fallback.

## Route Inventory

| Route | Source component/template | Surface type | Theme status | Risk | Notes |
| --- | --- | --- | --- | --- | --- |
| `/` | `HomePage` | Public generator/home surface | WORKS | Low | Visual smoke confirms the page container changes from soft light to dark. |
| `/identity-kit` | `IdentityKitPage` | Public generator/identity surface | WORKS | Low | Visual smoke confirms this route changes container and functional surfaces with the toggle. |
| `/gaming-passport` | `GamingPassportPage` | Marketing landing surface | WORKS | Low | PR10.2 made the full route surface theme-aware. |
| `/account` | `AccountPage` plus auth guard | Protected dashboard surface | WORKS | Medium | Unauthenticated visual smoke redirects to `/sign-in`; PR10.1 source/tests cover the protected dashboard. |
| `/sign-in` | `SignInPage` | Auth surface | WORKS | Low | PR10.1 made cards, inputs, alerts, and links theme-aware. |
| `/sign-up` | `SignUpPage` | Auth surface | WORKS | Low | PR10.1 made cards, inputs, alerts, and links theme-aware. |
| `/auth/callback` | `AuthCallbackPage` | Auth callback surface | WORKS | Low | PR10.1 made status/error surfaces theme-aware. |
| `/privacy-policy` | `PrivacyPolicyPage` | Legal/docs surface | PARTIAL | Medium | Uses `bg-gradient-dark`, dark prose, and dark panels in light mode. |
| `/terms-of-service` | `TermsOfServicePage` | Legal/docs surface | PARTIAL | Medium | Uses `bg-gradient-dark`, dark prose, and dark panels in light mode. |
| `/roblox-names` | `RobloxNamesLayout` | Feature generator surface | WORKS | Low | Visual smoke confirms the layout root changes with the toggle. |
| `/roblox-names/cool` | `RobloxNamesLayout` | Feature generator surface | WORKS | Low | Shared Roblox template is theme-aware. |
| `/roblox-names/funny` | `RobloxNamesLayout` | Feature generator surface | WORKS | Low | Shared Roblox template is theme-aware. |
| `/roblox-names/aesthetic` | `RobloxNamesLayout` | Feature generator surface | WORKS | Low | Shared Roblox template is theme-aware. |
| `/roblox-names/tryhard` | `RobloxNamesLayout` | Feature generator surface | WORKS | Low | Shared Roblox template is theme-aware. |
| `/gamer-names` | `GamerNamesLayout` | Feature generator surface | WORKS | Low | Visual smoke confirms the layout root changes with the toggle. |
| `/gamer-names/cool` | `GamerNamesLayout` | Feature generator surface | WORKS | Low | Shared Gamer Names template is theme-aware. |
| `/gamer-names/funny` | `GamerNamesLayout` | Feature generator surface | WORKS | Low | Shared Gamer Names template is theme-aware. |
| `/gamer-names/pro` | `GamerNamesLayout` | Feature generator surface | WORKS | Low | Shared Gamer Names template is theme-aware. |
| `/gamer-names/edgy` | `GamerNamesLayout` | Feature generator surface | WORKS | Low | Shared Gamer Names template is theme-aware. |
| `/league-of-legends` | `LeagueOfLegendsHubPage` | Public hub surface | WORKS | Low | Visual smoke confirms the route container changes with the toggle. |
| `/general/best` | `DynamicPage` -> `SeoTemplate` | Dynamic generator route | BROKEN | High | Root stays `th-atmosphere-shell` dark in light mode. |
| `/general/cool` | `DynamicPage` -> `SeoTemplate` | Dynamic generator route | BROKEN | High | Same shared dynamic template issue. |
| `/valorant/sweaty` | `DynamicPage` -> `SeoTemplate` | Dynamic generator route | BROKEN | High | Same shared dynamic template issue. |
| `/valorant/aesthetic` | `DynamicPage` -> `SeoTemplate` | Dynamic generator route | BROKEN | High | Same shared dynamic template issue. |
| `/fortnite/tryhard` | `DynamicPage` -> `SeoTemplate` | Dynamic generator route | BROKEN | High | Same shared dynamic template issue. |
| `/fortnite/og` | `DynamicPage` -> `SeoTemplate` | Dynamic generator route | BROKEN | High | Same shared dynamic template issue. |
| `/cod/sweaty` | `DynamicPage` -> `SeoTemplate` | Dynamic generator route | BROKEN | High | Same shared dynamic template issue. |
| `/cod/funny` | `DynamicPage` -> `SeoTemplate` | Dynamic generator route | BROKEN | High | Same shared dynamic template issue. |
| `/stylish-text-generator` | `StylishTextGeneratorPage` | Generator tool surface | NOT_VISUALLY_TESTED | Low | Source scan suggests theme-aware root classes. |
| `/nickname-symbols` | `NicknameSymbolsPage` | Generator tool surface | NOT_VISUALLY_TESTED | Low | Source scan suggests theme-driven rendering. |
| `/gamer-bio-generator` | `GamerBioGeneratorPage` | Generator tool surface | NOT_VISUALLY_TESTED | Medium | Source scan flags `bg-gradient-dark`; likely needs later classification. |
| `/about` | `AboutPage` | Static content surface | NOT_VISUALLY_TESTED | Medium | Source scan flags `bg-gradient-dark`; not a PR10.4 generator priority. |
| `/contact` | `ContactPage` | Static form/content surface | NOT_VISUALLY_TESTED | Medium | Source scan flags `bg-gradient-dark`; form styling needs later review. |
| `/competitive-gamer-names` | `TopicHubPage` | Topic hub surface | NOT_VISUALLY_TESTED | Low | Source scan suggests theme-aware page shell. |
| `/aesthetic-gaming-tags` | `TopicHubPage` | Topic hub surface | NOT_VISUALLY_TESTED | Low | Source scan suggests theme-aware page shell. |
| `/brandable-usernames` | `TopicHubPage` | Topic hub surface | NOT_VISUALLY_TESTED | Low | Source scan suggests theme-aware page shell. |
| `/edgy-gamer-tags` | `TopicHubPage` | Topic hub surface | NOT_VISUALLY_TESTED | Low | Source scan suggests theme-aware page shell. |

## Visual Smoke Results

Visual smoke confirmed the main post-PR10.1/PR10.2 surfaces work:

- WORKS: `/`, `/identity-kit`, `/gaming-passport`, `/sign-in`, `/sign-up`, `/auth/callback`, `/roblox-names`, `/roblox-names/cool`, `/gamer-names`, `/gamer-names/cool`, and `/league-of-legends`.
- WORKS with auth caveat: `/account` redirects unauthenticated users to `/sign-in`; the visible redirect surface is theme-aware.
- PARTIAL: `/privacy-policy` and `/terms-of-service` remain dark-looking in light mode.
- BROKEN: `/general/best`, `/general/cool`, `/valorant/sweaty`, `/valorant/aesthetic`, `/fortnite/tryhard`, `/fortnite/og`, `/cod/sweaty`, and `/cod/funny` keep a dark route container in light mode.

The broken dynamic routes show `html` and the global app shell changing, but the route container remains dark because `SeoTemplate` uses `th-atmosphere-shell`.

## Source Scan Findings

### Broken Route Surface

- `apps/web/src/pages/DynamicPage.jsx` renders `SeoTemplate`.
- `apps/web/src/components/SeoTemplate.jsx` uses `th-atmosphere-shell text-dark-300` as the route shell.
- `apps/web/src/index.css` defines `.th-atmosphere-shell` with a hardcoded dark background.
- This means the theme toggle changes navigation/global shell state, but the dynamic page itself remains visually dark.

### Risky Functional Surface Inside Dynamic Template

- `apps/web/src/components/SeoTemplate.jsx` contains repeated `bg-dark-*`, `text-dark-*`, `border-dark-*`, and dark-only control/card patterns.
- `apps/web/src/components/editorial/InternalLinkGrid.jsx` uses dark-only card and text styles inside dynamic/editorial content.
- These should be fixed at the shared template/component level in PR10.4.

### Feature Generator Templates

- `apps/web/src/features/robloxNames/RobloxNamesLayout.jsx` uses paired light/dark route shell classes.
- `apps/web/src/features/gamerNames/GamerNamesLayout.jsx` uses paired light/dark route shell classes.
- Reported Roblox/Gamer feature route issues are not the same as the dynamic `SeoTemplate` issue based on the visual smoke.

### Legal and Static Content

- `apps/web/src/pages/PrivacyPolicyPage.jsx` and `apps/web/src/pages/TermsOfServicePage.jsx` remain PARTIAL because they use dark legal/docs styling.
- `apps/web/src/pages/AboutPage.jsx`, `apps/web/src/pages/ContactPage.jsx`, and `apps/web/src/pages/GamerBioGeneratorPage.jsx` also contain `bg-gradient-dark` and need later visual classification.

### Allowed Dark Visual Areas

- Dark visual previews, modals, and branded scenes can remain dark when isolated from functional controls.
- The dark-integrated navigation remains documented as allowed if it does not imply the whole app is dark-only.

## Shared Template Impact

The dynamic/programmatic generator system currently exposes 86 slugs through shared routing data and `DynamicPage`:

| Category | Dynamic slugs |
| --- | ---: |
| `valorant` | 15 |
| `fortnite` | 6 |
| `roblox` | 10 |
| `minecraft` | 8 |
| `cs2` | 7 |
| `apex` | 7 |
| `gta-rp` | 7 |
| `cod` | 6 |
| `league-of-legends` | 13 |
| `general` | 7 |

Fixing `SeoTemplate` and its nested editorial components should address most dynamic route failures at once.

## Affected Templates

- `apps/web/src/pages/DynamicPage.jsx`
- `apps/web/src/components/SeoTemplate.jsx`
- `apps/web/src/index.css` via `.th-atmosphere-shell`
- `apps/web/src/components/editorial/InternalLinkGrid.jsx`

## Recommended PR10.4 Scope

PR10.4 should fix shared generator/dynamic templates, not individual URLs one by one.

Recommended scope:

- Replace or theme-scope `th-atmosphere-shell` for dynamic route surfaces.
- Convert `SeoTemplate` root, cards, headings, badges, filters, CTA rows, name cards, and floating sections to paired light/dark classes.
- Convert `InternalLinkGrid` to paired light/dark card and text classes.
- Preserve intentionally dark visual scenes only when they are isolated and documented.
- Keep copy, routing behavior, generated data, SEO metadata, and product logic unchanged.

## Non-Goals

- No broad runtime UI fix in PR10.3.
- No provider runtime.
- No Riot or Discord OAuth.
- No Riot API calls.
- No Supabase, Vercel, Google Cloud, or Riot Developer Portal changes.
- No migrations or RLS changes.
- No secrets or environment variables.
