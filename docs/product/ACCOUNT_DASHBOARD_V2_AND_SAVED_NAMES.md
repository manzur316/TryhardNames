# Account Dashboard V2 and Saved Names

## Objective

PR11 turns `/account` into a real dashboard and standardizes saved names around one model:

- `Copy Name` copies a candidate.
- `Favorite` / star keeps a candidate.
- `/account` is where saved names and the private Gaming Passport draft are managed.

## Product Decision

The canonical saved-name model is the favorite-first saved names model. The source of truth remains the existing client-side favorite storage, `tryhardnames:favorites:v1`, with compatibility reads from the legacy favorites key.

No backend persistence, Supabase table, migration, or RLS change is introduced in this PR.

## Why Legacy Save/Lineup UX Is Retired

The old public tool flow mixed `Save`, `Saved`, `Lineup`, `Copy Pack`, `Recent picks`, and `Export Discord Pack` into the generator surface. That created two competing mental models:

- a temporary lineup workflow; and
- a persistent favorite/star workflow.

PR11 removes the legacy save/lineup UX from affected public generator surfaces so users have one clear path: star names to keep them, then manage them in `/account`.

## Implemented In `/account`

- Account Header with signed-in state and quick access.
- Gaming Passport Draft summary with private-by-default messaging.
- Saved Names panel backed by favorites.
- Copy Name and Remove actions for saved names.
- Quick Actions for gamer names, Roblox names, Gaming Passport, and saved names.
- Account Hunting Guide explaining how to browse, copy, star, revisit, and shape a private draft.
- Future Connections section that labels Riot and Discord as planned, not live integrations.

## Public Generator UX

Dynamic generator cards and feature generator cards now align on:

- primary action: `Copy Name`;
- secondary action: star/favorite;
- tertiary action: `Similar reads` where it remains useful.

The dynamic `SeoTemplate` no longer exposes the legacy lineup drawer, copy pack, Discord pack export, or recent picks UI.

## Future Work

- Persist saved names remotely after the account model is ready.
- Add optional grouping by source/category if metadata becomes canonical.
- Add publish controls only after Gaming Passport publishing is intentionally designed.
- Add Riot/Discord provider linking only after the external approvals and runtime contracts are ready.
