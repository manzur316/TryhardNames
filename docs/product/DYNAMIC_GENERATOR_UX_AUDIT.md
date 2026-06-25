# Dynamic Generator UX Audit

## Production Findings

- `Copy Name` works on dynamic generator routes.
- `Save` works and adds names to the lineup.
- `Copy Pack` works after at least one favorite exists.
- Empty `Copy Pack` was defective UX because it appeared useful while the lineup had no saved names.
- `Reroll` and adjacent/evolution controls work, but could produce noisy names such as repeated strong tokens or over-concatenated candidates.
- `Copy Name` appeared too low on representative production pages because long editorial blocks rendered before the generator surface.
- The floating lineup appeared early while empty, showing `LINEUP 0`, `EXPORT DISCORD PACK`, `COPY PACK`, and `SHARE` before there was useful pack data.

## PR10.5 Change

- Reorders shared `SeoTemplate` toward a tool-first layout.
- Keeps a compact hero first, then surfaces copy-ready generated names immediately.
- Makes the names grid appear above long editorial SEO content.
- Moves refinements and quick modes after the first generated-name grid.
- Adds an educational empty lineup state: `Save a name to build a pack.`
- Keeps empty pack actions disabled or hidden until a name is saved.
- Separates page sharing from lineup pack actions.
- Adds a guard so empty `Copy Pack` and Discord export cannot copy empty or placeholder payloads.
- Adds reroll quality guardrails for repeated strong tokens, excessive concatenation, overlong candidates, and truncated fragments.
- Preserves route logic, SEO metadata, programmatic data, JSON-LD, and editorial content.

## Representative Routes

- `/valorant/sweaty`
- `/general/best`
- `/general/cool`
- `/fortnite/tryhard`
- `/cod/sweaty`

## Expected UX

Visitors should land on a dynamic route, see names ready to copy in the first or second viewport, save a name if they want a pack, and only then encounter the longer editorial SEO content and related internal links.

The floating lineup remains available, but while empty it is a low-priority reminder instead of the dominant action surface. After a save, pack actions become active and copy a useful lineup payload with category, URL, count, and saved names.
