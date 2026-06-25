# Private Gaming Passport Editor V2

## Purpose

PR13 improves the owner-only Gaming Passport editor inside `/account`. It turns the existing private draft form into a clearer editor with modular components, explicit save states, validation feedback, a private preview, and a completion checklist.

This is not a publishing PR. The Passport remains private by default.

## What Changed

- `PrivatePassportEditor` owns the private draft form and save-state UI.
- `PrivatePassportPreview` renders the private preview with private/pending language.
- `PassportCompletionChecklist` shows owner-only draft progress.
- `SavedNameHighlightsPicker` lets owners select private Saved Names highlights.
- `scene_config.featuredSavedNames` stores selected highlights as sanitized strings.

## `scene_config.featuredSavedNames`

`featuredSavedNames` is a backward-compatible `scene_config` field.

Rules:

- array of strings only;
- values are trimmed;
- duplicate names collapse case-insensitively;
- empty, non-string, and oversized values are dropped;
- maximum is five names;
- no provider data, Riot data, Discord data, raw payloads, tokens, or public proof metadata.

Saved Names highlights are private draft presentation data. Selecting a highlight does not publish, verify, mutate Saved Names, or create a public profile.

## Privacy And Product Boundaries

- No publish command.
- No slug claim.
- No public `/id/:slug`.
- No public profile.
- No Riot OAuth.
- No Riot API calls.
- No Discord OAuth.
- No providers.
- No provider token storage.
- No VerifiedProof sync.

The preview states that it is private, not published, not a ranking, not a tracker, not match history, not custom MMR/ELO, and not live-game advice.

## Validation And Save States

The editor keeps the existing presentation limits:

- alias max length;
- avatar URL must be `http` or `https`;
- short bio max length;
- visual config must use known layout/accent/density options.

PR13 adds clearer UI states:

- loading draft;
- unsaved changes;
- saving;
- saved;
- validation blocked;
- draft load/save errors.

## Roadmap Position

PR13 completes the Private Gaming Passport Editor V2 slice. PR14 remains Publish Runtime Commands and must still implement consent, slug claim, publish, unpublish, and status transitions before any public profile route exists.
