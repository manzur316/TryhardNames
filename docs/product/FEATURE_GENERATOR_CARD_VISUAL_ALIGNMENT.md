# Feature Generator Card Visual Alignment

PR10.8 aligns the GamerNames and RobloxNames feature generator cards with the dynamic NameCard visual standard introduced in PR10.7.

PR10.7 refined the shared dynamic `SeoTemplate` cards and lineup surfaces. The PR10.6 audit then left the feature generator subset as the next visible gap, with `/gamer-names/pro` on mobile as the remaining worst route. PR10.8 applies the same card hierarchy to the feature generator surfaces without changing routes, SEO metadata, generated-name data, or generator logic.

## Baseline Audit

Baseline was captured locally before code changes with `npm run audit:tool-containers --prefix apps/web` against `http://127.0.0.1:3002`.

Feature subset:

- `/gamer-names/pro`
- `/gamer-names/cool`
- `/roblox-names/cool`
- `/roblox-names/tryhard`

| Metric | Baseline |
| --- | ---: |
| Records | 32 |
| firstCopyNameYMax | 1835 |
| nameCardsCountMax | 13 |
| maxNameLines | 2 |
| cardsWithAwkwardWrap | 2 |
| cardsWithButtonOverlap | 0 |
| cardsWithTooManyActions | 8 |
| floatingShelfCoversViewportPercentMax | 0 |
| Worst route | `/gamer-names/pro` |
| Worst viewport | mobile dark |

Baseline by route:

| Route | firstCopyNameYMax | maxNameLines | awkward wraps | too many actions | worst viewport/theme |
| --- | ---: | ---: | ---: | ---: | --- |
| `/gamer-names/pro` | 1835 | 2 | 2 | 2 | mobile dark |
| `/gamer-names/cool` | 1795 | 2 | 0 | 2 | mobile dark |
| `/roblox-names/cool` | 1795 | 1 | 0 | 2 | mobile dark |
| `/roblox-names/tryhard` | 1783 | 1 | 0 | 2 | mobile dark |

## Changes

GamerNamesLayout:

- Adds a `th-feature-generator-shell` scope class.
- Slightly tightens the hero and article spacing so first feature generator copy actions appear earlier without moving route sections.
- Keeps route navigation, copy, SEO head, and FAQ schema unchanged.

RobloxNamesLayout:

- Adds the same `th-feature-generator-shell` scope class.
- Applies the same spacing alignment as GamerNames.
- Keeps Roblox disclaimer, route navigation, copy, SEO head, and FAQ schema unchanged.

Shared feature card surfaces:

- `NamesGrid` cards now use `th-feature-name-card` with stable min height, light/dark paired surfaces, and a clamped `th-name-card-title th-feature-name-title`.
- Name spans use `title={name}` so full values remain available even when visually clamped.
- The generated-name list exposes `id="names"` so the Chrome audit can measure the actual cards instead of the surrounding generator panel.
- Core feature `CopyButton` supports a compatible `variant="card"` that displays `Copy Name` as a compact primary action.
- Trending feature cards use the same title and Copy Name hierarchy as the generated/example name cards.
- `NameGeneratorWidget` spacing is slightly tightened so mobile users reach generated cards sooner.

## After Audit

After-audit metrics were captured locally after the redesign and before PR creation with `npm run audit:tool-containers --prefix apps/web`. The feature generator subset passed every audited viewport and theme.

| Metric | After |
| --- | ---: |
| Records | 32 |
| firstCopyNameYMax | 1777 |
| nameCardsCountMax | 25 |
| maxNameLines | 1 |
| cardsWithAwkwardWrap | 0 |
| cardsWithButtonOverlap | 0 |
| cardsWithTooManyActions | 0 |
| floatingShelfCoversViewportPercentMax | 0 |
| Worst route | `/gamer-names/pro` |
| Worst viewport | mobile light |
| Worst status | PASS |

After by route:

| Route | firstCopyNameYMax | maxNameLines | awkward wraps | too many actions | worst viewport/theme | status |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| `/gamer-names/pro` | 1777 | 1 | 0 | 0 | mobile light | PASS |
| `/gamer-names/cool` | 1737 | 1 | 0 | 0 | mobile light | PASS |
| `/roblox-names/cool` | 1737 | 1 | 0 | 0 | mobile light | PASS |
| `/roblox-names/tryhard` | 1725 | 1 | 0 | 0 | mobile light | PASS |

## Routes Tested

Automated visual smoke passed 72 route, viewport, and theme combinations locally. Feature generator visual smoke covers desktop, tablet, and mobile in light and dark mode for:

- `/gamer-names/pro`
- `/gamer-names/cool`
- `/roblox-names/cool`
- `/roblox-names/tryhard`

Dynamic regression smoke covers:

- `/valorant/sweaty`
- `/general/best`
- `/minecraft/pvp`
- `/cod/funny`

Product regression smoke covers:

- `/`
- `/identity-kit`
- `/gaming-passport`
- `/sign-in`

Screenshots remain local under `artifacts/tool-container-audit/latest/` and are not committed.

## Risks

- Feature generator layouts are separate from dynamic `SeoTemplate`, so visual alignment requires their own shared card treatment.
- `NamesGrid` and `TrendingNames` are shared feature surfaces; changes should stay focused on card hierarchy and not generator logic.
- The audit remains heuristic. Manual smoke is still required for card feel, light/dark polish, and copy behavior.

## Pending

- Consider a future audit-tool refinement for more precise feature-card parent detection.
