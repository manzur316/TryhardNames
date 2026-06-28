# RM-34 osu! Public Profile Trust-Safety QA

## Decision

Decision: pass after a minimum public rendering fix.

RM-34 audits the RM-33 safe local osu! public projection output before any production go/no-go. The review found one public profile integration issue: the public web mapper and renderer still assumed the older generic provider/proof DTO shape, while RM-33 emits osu!-specific allowlisted DTOs.

RM-34 fixes only that trust-safety issue:

- the public repository accepts osu! only through the RM-31/RM-33 allowlisted DTO fields;
- the public profile renderer displays osu! with neutral copy;
- unsafe `profileUrl` values are stripped before any link renders;
- external usernames are rendered as text;
- the public proof card uses `Linked osu! account`;
- the copy says `TryhardNames verified account ownership through osu! OAuth`;
- no copy says verified by osu!, official osu!, endorsed by osu!, or official endorsement;
- no rank, PP, score, match-history, beatmap, best-play, or live tracker data is displayed.

Production remains blocked. RM-34 does not deploy, touch remote Supabase, touch Vercel, add a public provider linking UI, or launch osu! publicly.

Next milestone:

```txt
RM-35 osu! Production Readiness / Staging Go-No-Go
```

## Public Output Reviewed

The public osu! provider DTO remains limited to:

```json
{
  "providerId": "osu",
  "displayName": "osu!",
  "externalUsername": "...",
  "profileUrl": "...",
  "verifiedAt": "..."
}
```

The public osu! proof DTO remains limited to:

```json
{
  "type": "profile_linked",
  "label": "Linked osu! account",
  "source": "osu",
  "observedAt": "...",
  "visibility": "public"
}
```

## Branding And Endorsement Review

Public copy is neutral:

- accepted: `Linked osu! account`;
- accepted: `TryhardNames verified account ownership through osu! OAuth`;
- blocked: `verified by osu!`;
- blocked: `official osu!`;
- blocked: `endorsed by osu!`;
- blocked: official endorsement claims.

The public profile does not claim that osu! endorses TryhardNames, the Passport, the owner, or the proof.

## Privacy Review

Public output must never expose:

- raw external account id;
- owner id;
- internal Passport id;
- linked provider account id;
- proof id;
- provider token state;
- token metadata;
- raw API payload;
- raw OAuth payload;
- access token;
- refresh token;
- email;
- country or location;
- friends, chat, or forum data;
- score history;
- match history;
- beatmap history;
- rank;
- PP;
- best plays;
- live status;
- hidden-player inference data.

RM-34 keeps the no-refresh-token-storage strategy intact and does not add any browser-side osu! API call.

## Public Rendering Review

The public `/id/:slug` profile now handles both DTO shapes safely:

- generic historical provider/proof DTOs;
- osu!-specific allowlisted provider/proof DTOs from RM-33.

The osu! public renderer:

- treats `externalUsername` and display fields as React text;
- does not use raw HTML injection;
- does not dump raw JSON;
- uses a safe profile link only when the repository keeps an HTTPS osu! profile URL with `/users/{numericId}` and no query or hash;
- does not render raw ids, metadata, token state, or provider internals.

## Owner Control Review

RM-32 owner controls remain the only way for an owner to request public preference.

RM-34 does not change owner mutation behavior:

- public preference is still explicit;
- owner can revert to private;
- stale or revoked provider/proof states remain non-public;
- public projection still requires published Passport, publication consent, current verified provider/proof state, no trust-safety block, and the projection allowlist.

## Launch Readiness Result

RM-34 is trust-safety QA, not launch execution.

Before production enablement, RM-35 must provide:

- staging go/no-go evidence;
- owner acceptance;
- production environment review;
- rollback confirmation;
- source guard results;
- public profile smoke evidence;
- no-secrets/no-token verification;
- final decision on whether the RM-33 local projection path should be enabled in production.

## Non-Goals

- No production launch.
- No automatic public osu! proof without owner controls.
- No public provider UI outside `/account`.
- No Parent Auth via osu!.
- No refresh-token storage.
- No direct osu! browser API call.
- No secrets in web.
- No `/cosmetics`.
- No store, checkout, billing, or payments.
- No rank, PP, score, match-history, beatmap, best-play, or live tracker.
- No hidden-player inference.
- No official osu! endorsement.
