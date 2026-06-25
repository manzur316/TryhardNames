# NameCard And Lineup Visual Redesign

PR10.7 applies the first runtime visual follow-up from the PR10.6 Tool Container Visual Audit. It focuses on the shared dynamic generator surfaces in `SeoTemplate`: generated name cards, CopyButton hierarchy, Save, Similar Reads, the floating Lineup shelf, the open Lineup drawer, Saved names, and Recent picks.

This is a visual hierarchy and containment pass. It does not change routes, SEO metadata, programmatic data, generated-name data, auth, providers, Supabase, Vercel config, Riot integration, secrets, migrations, or RLS.

## Baseline Audit

Baseline was captured locally before code changes with `npm run audit:tool-containers --prefix apps/web` against `http://127.0.0.1:3002`.

| Metric | Baseline |
| --- | ---: |
| Total routes | 17 |
| Total runs | 136 |
| Total screenshots | 296 |
| Failures | 172 |
| Warnings | 270 |
| firstCopyNameYMax | 5992 |
| Awkward wraps | 756 |
| Button overlaps | 0 |
| Cards with too many actions | 410 |
| maxNameLines | 11 |
| Max floating shelf coverage | 84.1% |
| Max drawer height | 13588 |
| Worst route | `/minecraft/pvp` |
| Worst viewport | tablet dark |
| Mobile worst route | `/cod/funny light` |
| Desktop worst route | `/valorant/aesthetic dark` |

## Changes

- NameCard now uses a stable flex column with consistent minimum height, compact badges, clamped name typography, metadata, primary Copy Name, secondary Save, and tertiary Similar Reads.
- Name text is visually clamped to two lines with `title={s}` so the full generated value remains available and copied values are unchanged.
- CopyButton keeps its existing default behavior and adds compact `card` and `drawer` variants for hierarchy-sensitive contexts.
- Similar Reads uses a quiet tertiary pill class instead of competing visually with Copy Name and Save.
- The closed Lineup shelf has a capped height of `18vh` on small screens and `14vh` on desktop widths.
- The open Lineup drawer has a capped height of `60vh` on small screens and `55vh` on desktop widths, with internal scrolling.
- Saved and Recent picks use compact pill rows with drawer-sized copy controls.
- Empty lineup state remains `Save a name to build a pack.`

## After Audit

After-audit metrics are captured locally after the redesign and before PR creation.

| Metric | After |
| --- | ---: |
| Total routes | 17 |
| Total runs | 136 |
| Total screenshots | 296 |
| Failures | 82 |
| Warnings | 214 |
| firstCopyNameYMax | 1835 |
| Awkward wraps | 2 |
| Button overlaps | 0 |
| Cards with too many actions | 168 |
| maxNameLines | 2 |
| Max floating shelf coverage | 50.8% |
| Max drawer height | 14713 |
| Worst route by remaining first-copy/wrap issue | `/gamer-names/pro` |
| Worst viewport by remaining first-copy/wrap issue | mobile light |

Dynamic `SeoTemplate` subset:

| Metric | After |
| --- | ---: |
| firstCopyNameYMax | 926 |
| Awkward wraps | 0 |
| Button overlaps | 0 |
| maxNameLines | 1 |
| Max floating shelf coverage | 50.8% |

The audit's `lineupDrawerHeight` heuristic still picks an ancestor container on dynamic pages, so the numeric drawer height remains inflated in `audit.json`. Manual Playwright smoke measured the actual shelf and internal drawer nodes:

| Manual smoke metric | Result |
| --- | ---: |
| Worst closed shelf coverage | 6.6% |
| Worst open shelf coverage | 56.9% |
| Worst open shelf height | 60.0% |
| Worst internal drawer height | 53.8% |
| Copy Pack disabled with 0 favorites | Pass |
| Copy Pack active with 1 favorite | Pass |
| Light/dark theme class | Pass |

## Smoke Routes

Visual smoke covers desktop, tablet, and mobile in light and dark mode for:

- `/valorant/sweaty`
- `/valorant/aesthetic`
- `/general/best`
- `/general/cool`
- `/minecraft/pvp`
- `/cod/funny`
- `/fortnite/tryhard`
- `/roblox-names/cool`
- `/gamer-names/cool`

Screenshots are generated locally under `artifacts/tool-container-audit/latest/` and are not committed.

## Risks

- `SeoTemplate` is shared across many dynamic pages, so small visual changes fan out broadly.
- Name truncation is visual only; copied names remain complete, but very long decorative names may require hover/title inspection.
- The audit is heuristic. Manual smoke remains required for card feel, drawer density, and light/dark polish.

## Pending

- Use the audit output to decide whether trending cards need a separate follow-up.
- Consider a follow-up audit-script refinement so `lineupDrawerHeight` targets the internal drawer node instead of the largest ancestor containing Lineup/Saved/Recent text.
- Keep future provider, auth, route, SEO data, and generated-name data changes out of visual-only PRs.
