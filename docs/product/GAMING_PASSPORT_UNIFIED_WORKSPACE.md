# Unified Gaming Passport Workspace

## Product decision

The owner requested one product and one editing experience, using the two supplied Nexor concept images as the visual direction. Identity Kit is no longer a separate navigation destination. `/identity-kit` redirects to `/gaming-passport`, preserving presentation-prefill query parameters until they are consumed and removed.

The concept images guide composition, not verification policy. No example rank, account, proof, game score, Discord contact, or verification badge is inserted into a real Passport. No new provider or cloud database capability is activated.

## Implemented locally

- A usable editor replaces the old marketing-first Passport page.
- Identity and appearance controls share a private profile panel, framed avatar, readable alias, private bio, linked-game highlights and explicit save state. The earlier panoramic owner header is superseded by the identity-first direction below.
- Anonymous visitors can save a validated presentation draft on their device, preview it, and download a labeled private PNG.
- The old Identity Kit alias/bio can be recovered without modifying or deleting the original storage entry. Deprecated styled-alias/symbol/SVG exports remain in the historical implementation; they are not silently converted into verified data.
- Authenticated visitors load the same owner-only Passport repository used by Account. Save sends only existing presentation fields. Importing a local draft into an account requires an explicit action.
- A change of owner remounts the editor; token refresh does not reload the form. Storage failure, invalid input, failed saves, and failed loads have explicit non-success states.
- The public route, private account preview, and new editor use the same scene component. Public bio remains excluded by the existing public DTO; this redesign does not expand that allowlist.
- Empty public provider/proof sections are omitted. Public share appears only on an actual public profile, not on private drafts.
- A published Passport is identified as published in the owner preview. Saving presentation on an already published Passport is not mislabeled as an unpublished draft.

Account remains the account/privacy/publication/provider administration surface. It is not another identity product. Its broader dashboard and provider UI still need a later consolidation pass; this change does not silently retire those existing controls.

## Assets and presentation

Project assets:

- `apps/web/public/passport/moonlit-cover.webp`
- `apps/web/public/passport/moonlit-avatar.webp`
- `apps/web/public/passport/passport-citadel.webp` (unchanged public scene only)
- `apps/web/public/passport/osu-rhythm.webp` (private osu! card)

These are original bitmap illustrations generated with the built-in image-generation tool, then encoded to WebP. They are not extracted game art. The two new assets total approximately 315 KiB; provenance is in `PASSPORT_VISUAL_ASSETS.md`. The Moonlit avatar is a local asset selected by the existing Obsidian theme, not a persisted localhost URL.

Cover prompt: an original silver-haired masked fantasy adventurer in black armor on the right of a 3:1 panorama, moonlit gothic city, quiet charcoal space on the left for HTML identity, silver metal, subtle violet and teal lighting, no UI, logos, text, badges, or rank.

Avatar prompt: a centered square close-up of an original silver-haired masked adventurer in black armor, violet eyes and rim light, charcoal background, visible face at small sizes, no text, badge, rank, or logo.

The surrounding editor supports light/dark mode. The profile panel is intentionally dark in both. The design uses existing theme identifiers for portrait defaults and keeps the existing private accent, density, and layout settings within their current scope. No additional arbitrary JSON is accepted.

## Verification and limits

- Browser smoke: alias/bio prefill, route convergence, local save/reload, avatar and cover loading, appearance choice, PNG export, discard, invalid avatar validation, keyboard focus, 375/768/1440 layouts, long text, light/dark mode, and public home/generator availability.
- New unit tests cover legacy migration, safe local payloads, storage corruption/failure, input bounds, route convergence, owner remounting, and separation of public/private scene input.
- SQL privacy changes were independently tested locally; see `GAMING_PASSPORT_RECOVERY_REVIEW.md`.
- Frontend configuration now targets the new staging project. This visual check does not claim a completed Google or persistent osu! end-to-end test against it.
- Game-specific artwork/cards, authentic competitive achievements, and any new contact features still require real provider data, rights-approved assets, and reviewed contracts. The mockups are not a promise that their three illustrated games are currently connected.
- No cloud migration, deployment, commit, push, or merge occurred as part of this local implementation.

## October 2026 visual correction

- The identity panorama is outside the inspector grid, so hiding the inspector cannot collapse the scene into a fixed-width column.
- Named grid areas keep the canvas full-width in Preview at every breakpoint. Alias and biography wrap inside responsive bounds.
- The private osu! card displays only existing account metrics; unavailable metrics are omitted. Authorization is explicitly separate from persistence and publication.
- Desktop and mobile use the same assets, with cyan for metrics, pink for osu!, green for ownership, and amber for private status. No fabricated rank badges or empty game slots were added.
- Navigation switches to its existing compact menu below 1280 px to avoid tablet overflow. Routes are unchanged.

## Identity-first profile panel (2026-10-14)

The supplied `Panel de Perfil Gaming Futurista.png` guides the latest private header: framed avatar, alias and biography on the left; actual linked-game insignias and essential metrics on the right. Following the owner's follow-up, the selected decorative background sits beneath a dark directional gradient, with the existing `passport-citadel-v2.webp` as the Original default. The image does not occupy a separate content column; identity and game data remain foreground content. Public rendering is unchanged. Existing avatar choices and all frame packs remain available.

The owner's eight-image background pack is available in the collapsible **Appearance > Background** picker. It uses native radios, named thumbnails and immediate preview. Only an allowlisted optional `backgroundId` is stored in the existing private scene config, never a URL or user-controlled style. Missing/unknown IDs and Original preserve the legacy default without adding a new persisted field. Selection participates in the existing dirty state, Save Passport, reload and Discard flows; session refresh and failed saves do not replace unsaved choices. The import does not automatically equip a background or change identity, connected-game data, consent, status or slug. No schema, policy or environment changes are required, and public projection excludes the preference.

One linked account uses a bounded 260px tile instead of reserving half the header. Multiple accounts use two columns, up to 532px total: four tiles form a 2-by-2 mosaic on desktop and tablet. Small screens stack tiles. Only the game's name, account, ruleset, PP, global rank and ownership/stale indicator appear in these compact summaries; the full details remain below. Long values wrap without expanding the grid, and missing accounts never create placeholder slots.

The owner's nine-image game-insignia pack supplies decorative art for these cards. The actual saved osu! connection uses its pink insignia both in the compact tile and in the detailed card. The compact tile remains bounded at 260px, with a 72px insignia beside its content. Other game assets remain unused until a real integration supplies eligible account data; catalog membership is never a connection, achievement, rank or ownership claim. Nothing new is persisted and no additional provider is enabled. Asset provenance and optimization are recorded in `PASSPORT_VISUAL_ASSETS.md`.

The current implementation shows only saved private osu! connections. `PersistentOsuConnections` shares its existing state through a display-only callback; there is no second status request, session store, provider call, schema change or database write. `buildPrivateGameHighlights` reuses the private osu! display validation, accepting persisted verified/stale private accounts only. It returns game, username, ruleset, PP, global rank and explicit stale state; internal IDs, parent identity and metadata do not enter the header. The detailed game card remains the source for the full snapshot and sync timestamps.

The header distinguishes linked-game count from account count: two osu! accounts are one game, not two games. Missing statistics are omitted, zero PP is preserved and stale snapshots are labeled. Without a valid connection, the whole highlight section is absent. A highlight links to the existing private game section via keyboard-accessible in-page navigation. Successful unlink removes it with the existing connection state. A different owner remounts the workspace; token refresh does not replace presentation edits.

No global performance average, fabricated rank emblem, membership date, extra game, achievement, community search, publishing action or empty game slot is inferred from the mockup. Its example LoL, Clash, Brawl Stars, Valorant and Counter-Strike data are not user data and were not implemented.

Existing assets are sufficient for this iteration: the owner's selected portrait and frame, the supplied background and insignia packs, the official osu! logo and the existing private game-card artwork. Future generated imagery may add original decorative trims, but must not imitate evidence of an earned official rank or replace verified provider data. No new image generation is required to use the panel.

Validation uses isolated browser fixtures with all external requests intercepted: 320/375/768/1440px, all frame packs, all eight backgrounds and their picker, long alias/bio/account names, keyboard navigation to game details, failed/successful save, token refresh, stale/missing stats, private export, unlink removal and logout. Background checks also cover image decoding/pixels, native keyboard focus, reload persistence, discard and reset to Original. These checks do not claim a new live staging end-to-end run. Nothing is published and no remote configuration changes are part of this design change.
