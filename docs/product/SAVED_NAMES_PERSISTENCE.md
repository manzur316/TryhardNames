# Saved Names Supabase Persistence

## Status Before PR12

PR11.1 made favorite/star canonical for saved names and added Saved Names to Account Dashboard V2. Before PR12, that state lived in local/legacy storage through:

- `FavoritesContext`;
- `tryhardnames:favorites:v1`;
- `favoritesSoT.js`;
- `localFavoritesBridge.js`;
- `FavoriteStarButton`;
- `MinimalFavoritesPeek`.

There was no Parent Auth-backed Supabase persistence for saved names.

## Product Decision

Favorite/star canonical means:

- `Copy Name` copies a candidate.
- `Favorite/star` saves a candidate.
- `/account` manages saved names and private account state.

The legacy lineup/save/copy-pack model is not the canonical saved-name model.

## Data Model

PR12 adds `public.saved_names`.

| Column | Purpose |
| --- | --- |
| `id` | Stable saved-name row id. |
| `owner_id` | Parent Auth owner, references `auth.users(id)`. |
| `name` | The exact saved name shown/copied by the UI. |
| `name_key` | Normalized owner-scoped uniqueness key. |
| `source_path` | Optional route where the name was saved. |
| `source_label` | Optional UI/source label. |
| `category` | Optional category. |
| `keyword` | Optional keyword. |
| `created_at` | Insert timestamp. |
| `updated_at` | Trigger-maintained update timestamp. |
| `last_used_at` | Optional future usage timestamp. |
| `copy_count` | Non-negative local/account copy count field. |

Uniqueness is `unique(owner_id, name_key)`, so the same user cannot duplicate one normalized name, while different users can save the same name.

## RLS

RLS is owner-only. This owner-only RLS contract means:

- authenticated users can select their own rows;
- authenticated users can insert rows only for their own `owner_id`;
- authenticated users can update their own safe fields;
- authenticated users can delete their own rows;
- anon and public have no table access.

Column privileges intentionally keep `owner_id`, `name_key`, `id`, `created_at`, and `updated_at` guarded from browser updates.

## Runtime Sync

When a user is signed out, saved names keep using local fallback.

When a Parent Auth Supabase session exists:

1. Read local names from `readUnifiedFavoriteNames()`.
2. Sync local names into `public.saved_names` idempotently.
3. Read account rows from Supabase.
4. Hydrate `FavoritesContext` from Supabase rows.
5. Mirror account names back into `tryhardnames:favorites:v1` for `MinimalFavoritesPeek`.
6. If Supabase fails, keep local fallback and retry on later account sync.

This preserves existing signed-out behavior while making Parent Auth the canonical persistence path for signed-in users.

## Repository Contract

Runtime access lives in `apps/web/src/saved-names/data/savedNamesRepository.js`.

Exported functions:

- `mapSavedNameRow`
- `buildSavedNamePayload`
- `validateSavedNameInput`
- `listSavedNames`
- `upsertSavedName`
- `deleteSavedName`
- `deleteSavedNameByName`
- `syncLocalFavoriteNamesToAccount`

The repository stores only safe saved-name/account state. It does not store provider data, Riot data, Discord data, raw payloads, tokens, or secrets.

## Account UI

Account Dashboard V2 now reads saved names from `FavoritesContext`, which hydrates from Supabase when a Parent Auth session exists. The dashboard can still show a local fallback message if account sync is unavailable.

Empty state remains:

> Star names while browsing to keep them here.

## Non-goals

- no providers;
- no Riot OAuth;
- no Discord OAuth;
- no provider token storage;
- no publish commands;
- no public `/id/:slug`;
- no remote Supabase changes;
- no Vercel, Google Cloud, Riot Portal, secrets, or env var changes.
