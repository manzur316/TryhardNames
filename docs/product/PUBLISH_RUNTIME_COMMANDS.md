# Publish Runtime Commands

PR14 adds owner-controlled runtime commands for the private Gaming Passport.

## What PR14 Implements

- Publication consent command.
- Slug claim/update command.
- Publish attempt command.
- Unpublish command.
- Private `/account` controls for command state and policy requirements.
- Owner-only SQL RPC functions for command mutations.
- Client repository functions that call RPCs instead of directly updating status fields.

## Policy Gates

Commands enforce the existing `publicationPolicy.js` contract:

- Parent Auth is required.
- The caller must own the Passport.
- `publication_consent` is required before publish.
- A canonical, non-reserved slug is required before publish.
- Suspended Passports cannot publish.
- A verified linked provider is required before publish.

Because provider runtime is not implemented yet, normal user publish attempts remain blocked by `verified_linked_provider`.

## Slug Rules

Slug input is normalized before persistence:

- lowercase;
- spaces and punctuation become hyphens;
- duplicate hyphens collapse;
- leading/trailing hyphens are removed;
- reserved slugs are rejected.

Slug changes are blocked while a Passport is `published` until public serving and cache semantics exist.

## Status Transitions

- `draft_private` or `unpublished` can become `published` only when policy requirements pass.
- `published` can become `unpublished`.
- `unpublish` on non-published safe states is idempotent.
- `suspended` cannot publish or unpublish through PR14 commands.
- Re-publish refreshes `published_at` and clears `unpublished_at`.
- Unpublish sets `unpublished_at` and revokes publication consent.

## Non-Goals

- No Riot OAuth.
- No Riot API calls.
- No Discord OAuth.
- No provider runtime.
- No provider token storage.
- No VerifiedProof sync runtime.
- No Vercel, Google Cloud, Riot Portal, secrets, env vars, or remote Supabase changes.

## Next

PR15 adds the public Gaming Passport MVP at `/id/:slug` using only the allowlisted public projection and only after explicit owner commands plus policy requirements are satisfied. Provider runtime remains the next major product foundation.
