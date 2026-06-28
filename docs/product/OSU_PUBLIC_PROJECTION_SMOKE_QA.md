# osu! Public Projection Smoke QA

RM-33 validates the full public projection pipeline for an owner-public osu! profile proof.

## Decision

Decision: Option B, enable the safe local projection gate for smoke and QA.

This is not a production launch. RM-33 adds local domain, RPC, docs, and tests proving that osu! can enter public projection only after every RM-31 and RM-32 gate passes. The default domain path still blocks osu! unless the projection caller explicitly enables the osu! allowlist for the public projection pipeline.

Next milestone:

```txt
RM-35 osu! Production Readiness / Staging Go-No-Go
```

RM-34 result: public profile trust-safety QA passed after a minimum public renderer/mapper fix for the osu! allowlisted DTO shape. Production remains blocked.

## Required Gates

osu! public projection is allowed only when all conditions are true:

- Passport is published.
- Owner publication consent is true.
- No suspension block or report block applies.
- Linked provider account provider is `osu`.
- Linked provider account status is `verified`.
- Linked provider account visibility is `public`.
- Linked provider account is not stale or revoked.
- Verified proof source key is `osu:profile_linked`.
- Verified proof status is `current`.
- Verified proof visibility is `public`.
- Verified proof source is `linked_provider`.
- Verified proof verification method is `oauth`.
- Verified proof is not stale or revoked.
- The explicit public projection allowlist is enabled for the projection pipeline.

Public preference alone does not bypass the allowlist.

## Public Output

The osu! provider object is limited to:

```json
{
  "providerId": "osu",
  "displayName": "osu!",
  "externalUsername": "...",
  "profileUrl": "...",
  "verifiedAt": "..."
}
```

The osu! proof object is limited to:

```json
{
  "type": "profile_linked",
  "label": "Linked osu! account",
  "source": "osu",
  "observedAt": "...",
  "visibility": "public"
}
```

## Blocked Fields

RM-33 tests that public projection never exposes:

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

## DB/RPC Result

RM-33 adds a local migration that redefines `public.get_public_gaming_passport_projection(public_slug text)`.

The RPC keeps generic non-osu provider and proof builders unchanged, keeps generic osu rows excluded from those builders, and adds separate osu-specific allowlist builders. Featured proofs cannot bypass the osu gate because the featured and fallback branches both require the same provider/proof/current/public checks before emitting the osu proof DTO.

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
- No rank, PP, score, match-history, best-play, beatmap, or live tracker behavior.

## RM-34 Trust-Safety Follow-Up

RM-34 reviewed this local projection smoke output against public UX, privacy, branding, and rollback requirements.

RM-34 fixed the narrow web public profile issue where the public mapper and renderer still expected the old generic provider/proof DTO shape. The public profile now renders the osu! allowlisted DTO with neutral copy, strips unsafe profile URLs, and does not expose raw ids, metadata, token state, or tracker/ranking fields.

This does not launch production. RM-35 must provide production readiness and staging go/no-go evidence before any production enablement.
