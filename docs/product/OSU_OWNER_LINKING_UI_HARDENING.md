# osu! Owner Linking UI Hardening

RM-30 adds owner-only private UX for the osu! Runtime Foundation after RM-29 completed the full local smoke.

This is not a production launch and not a public provider UI. The UI lives inside `/account`, uses Parent Auth for the TryhardNames owner session, and talks only to the TryhardNames API routes under `/api/v1/integrations/osu`.

## Result

Status: `this PR`.

RM-30 implements a private Account Dashboard card that can:

- read safe runtime/configuration state;
- read owner-only osu! status for the current private Gaming Passport;
- start link-intent only when the server runtime is configured;
- redirect the owner to the backend-generated authorization URL;
- show verified/private, revoked/disconnected, stale/error, ready, and not-configured states;
- confirm before unlink;
- call owner-only unlink and refresh state after revoke.

## Private UX Contract

The owner card may display only safe fields returned by the backend:

- provider label;
- display name;
- status;
- visibility;
- proof visibility;
- verified timestamp;
- revoked or stale timestamp;
- safe profile URL.

The owner card must not display:

- external account id;
- owner id;
- internal token state;
- raw provider metadata;
- provider token material;
- service-role credentials;
- OAuth code or full state.

## Copy Requirements

RM-30 account copy states:

- osu! is a linked provider, not Parent Auth;
- TryhardNames verifies ownership with osu!;
- the proof stays private by default;
- no refresh tokens are stored;
- unlink retires the TryhardNames proof and blocks public serving;
- this is not official endorsement by osu!.

## Backend Boundary

The web client calls only:

```txt
GET /api/v1/integrations/osu
GET /api/v1/integrations/osu/status?passportId=...
POST /api/v1/integrations/osu/link-intent
POST /api/v1/integrations/osu/unlink
```

The SPA does not call osu! APIs directly. Token exchange, `/me`, immediate revoke, service-role writes, state validation, and unlink mutation remain server-side.

## Security Notes

RM-30 keeps:

- `no_refresh_token_storage`;
- no provider token storage in browser;
- no provider token storage in web source;
- no client secret in web source;
- no Supabase service-role key in web source;
- no direct `osu.ppy.sh` browser API call from app code;
- no public `/id/:slug` osu! proof changes;
- no public provider linking route.

The Parent Auth bearer is used only as the owner session credential for TryhardNames API calls. It is not logged, stored by the RM-30 repository, or shown in UI.

## Non-Goals

RM-30 does not implement:

- No production launch;
- No public provider UI;
- No public osu! proof;
- No Parent Auth via osu!;
- No refresh-token storage;
- No direct osu! browser API calls;
- No rank, PP, score, best-play, beatmap, match-history, or live tracker surfaces;
- No `/cosmetics`;
- No store, checkout, billing, subscriptions, payments, or inventory;
- No remote Supabase changes;
- No Vercel changes.

## Validation

Required validation:

- source guard for web secrets and token field names;
- source guard against direct osu! API calls from `apps/web/src`;
- source guard against `/cosmetics`, store, checkout, and billing routes;
- owner UI source tests for disabled/configured/connected/revoked/stale states;
- repository source tests for backend endpoints;
- public projection domain test confirming private osu! proof remains absent by default;
- build and lint.

## RM-31 Follow-up

RM-31 implements the policy gate requested after RM-30:

```txt
RM-31 osu! Private Proof Publish Policy / Public Projection Gate
```

RM-31 keeps public osu! projection blocked until owner proof visibility controls exist. The next recommended milestone is:

```txt
RM-32 osu! Owner Proof Visibility Controls
```

## RM-32 Update

RM-32 extends the same private owner card with proof visibility controls:

- `Make Public` records owner public preference only after the Passport is published, publication consent is true, and the proof/provider are current;
- `Confirm Public` explains that public projection still waits for policy gates and RM-33 smoke;
- `Make Private` lets the owner revert the proof to private;
- the UI still uses only TryhardNames backend routes and does not call osu! APIs from the browser.

Public osu! projection remains gated by allowlist after RM-32. The next recommended milestone is:

```txt
RM-33 osu! Public Projection Smoke / Projection QA
```
