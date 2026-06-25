# Tool Container Visual Audit

PR10.5 prioritized dynamic name tools above editorial content. That fixed the order of the primary utility surface, but it also exposed a second layer of questions about the visual quality of the tool containers themselves: name cards, CopyButton hierarchy, Similar Reads placement, Save states, Lineup shelf, Lineup drawer, trending cards, and related generator surfaces.

This audit exists to measure those surfaces before a redesign. It is not a runtime fix, does not change layout, and does not change theme, routes, SEO data, or name generation.

## Observed problem

Current screenshots show several issues that need measurement before design work:

- NameCard content can wrap into awkward fragments, including one-to-three-character line segments.
- CopyButton can dominate a card visually, while Save and Similar Reads compete for attention.
- Some name cards have excess dead space or an uneven balance between name, metadata, and actions.
- The Lineup shelf and Lineup drawer can cover too much content, especially in dark mode.
- Saved and Recent picks can create repeated large actions that make the drawer feel dense.
- Trending cards and feature generator cards need comparison against dynamic route cards.

## How to run

Start the web app on the audit port:

```sh
npm run dev -- --host 127.0.0.1 --port 3002
```

Then run the audit from `apps/web`:

```sh
npm run audit:tool-containers --prefix apps/web
```

The script uses `AUDIT_BASE_URL` when present and defaults to `http://127.0.0.1:3002`. If the server is not reachable, it exits with `Start local server first.`

The script prefers Playwright when available, then Puppeteer, then a direct Chrome DevTools Protocol fallback using local Chrome or Edge. Set `CHROME_PATH` if Chrome is installed in a non-standard location.

Generated files are written under:

```text
artifacts/tool-container-audit/latest/
```

Those artifacts are ignored by git because screenshots and JSON reports are local audit output.

## Routes covered

Dynamic routes:

- `/valorant/sweaty`
- `/valorant/aesthetic`
- `/general/best`
- `/general/cool`
- `/fortnite/tryhard`
- `/fortnite/og`
- `/cod/sweaty`
- `/cod/funny`
- `/minecraft/pvp`
- `/league-of-legends/korean`

Feature generator routes:

- `/roblox-names/cool`
- `/roblox-names/tryhard`
- `/gamer-names/cool`
- `/gamer-names/pro`

No-regression utility pages:

- `/`
- `/identity-kit`
- `/gaming-passport`

## Viewports and themes

Every route is audited in:

- desktop: `1440x900`
- laptop: `1366x768`
- tablet: `768x1024`
- mobile: `390x844`

Each viewport runs in light mode and dark mode. The audit sets `localStorage.theme`, reloads the page, and records whether `html.dark` matches the requested theme.

## Metrics measured

The audit records:

- `firstCopyNameY`
- `firstNameGridY`
- `namesGridY`
- `firstEditorialY`
- `lineupShelfY`
- `lineupDrawerHeight`
- `copyButtonsCount`
- `saveButtonsCount`
- `similarReadsButtonsCount`
- `disabledPackButtonsCount`
- `activePackButtonsCount`
- `nameCardsCount`
- `maxNameLines`
- `cardsWithAwkwardWrap`
- `cardsWithButtonOverlap`
- `cardsWithTooManyActions`
- `cardsBelowFoldBeforeFirstTool`
- `floatingShelfCoversViewportPercent`

For each detected control it also stores text, tag or role, bounding box, visibility, colors, font size, z-index, parent card bounds, viewport overlap, above-fold state, disabled state, aria-disabled state, and overlap with other interactive controls.

## PASS/WARN/FAIL

`PASS` means no configured issue was detected for that route, viewport, and theme.

`WARN` means the surface is measurable but needs design review. Examples include awkward card wraps, mobile controls under 40px, too many dominant actions, floating shelf overlap, or theme class mismatch.

`FAIL` means the audit detected a likely behavior or usability issue. Examples include Copy Name appearing too low, names wrapping beyond three lines, overlapping controls, active Copy Pack on an empty lineup, a Lineup drawer above 65% of viewport height, or a shell background that contradicts the requested theme.

## Component interpretation

- NameCard: review card size, name wrapping, action count, and overlap metrics.
- CopyButton: review first-copy position and visual hierarchy before reducing prominence.
- Similar Reads: review placement and competition with CopyButton and Save.
- Lineup shelf: review viewport coverage and overlap with name cards.
- Lineup drawer: review height, repeated controls, Saved density, and Recent picks density.
- Trending cards: compare copy controls and card proportions against NameCard.
- Internal links: confirm editorial and related links remain below the tool hierarchy.

## Next PR

A future visual redesign PR should use this audit output to adjust NameCard min width and min height, name typography and wrap rules, CopyButton hierarchy, Similar Reads placement, Lineup shelf and drawer max height, and mobile spacing. That future PR should make runtime visual changes; this PR only adds measurement tooling and documentation.
