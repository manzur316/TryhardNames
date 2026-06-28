# RM-31 osu! Private Proof Publish Policy / Public Projection Gate

## Decision

RM-31 defines the publish policy for the osu! `osu:profile_linked` ownership proof.

Policy result: RM-33 enables the safe local public projection smoke path, but no production launch occurs.

RM-32 adds owner-facing controls that can set an eligible osu! linked provider account and private ownership proof to public preference. RM-32 does not invent automatic publication and does not enable public projection by default.

The default domain block reason remains `public_projection_allowlist_disabled` unless the public projection caller explicitly enables the osu! allowlist.

Next milestone: RM-34 osu! Public Profile Trust-Safety QA.

## Current Behavior

- osu! linking remains owner-only and private.
- `linked_provider_accounts.provider = 'osu'` can verify ownership locally.
- `verified_proofs.source_key = 'osu:profile_linked'` remains private by default.
- Public projection excludes osu! provider rows and profile-linked proof rows unless the explicit RM-33 allowlist path is active.
- Owners can request public preference only through the private `/account` controls and owner-authenticated API route.
- Revoked, stale, private, blocked, or missing-consent states do not project.
- `/id/:slug` remains an allowlisted projection only.

## Required Conditions

An osu! `profile_linked` proof may only become eligible for public projection after all conditions are true:

- Passport status is `published`.
- Owner publication consent is true.
- No suspension or report block applies.
- Linked provider account has `provider = 'osu'`.
- Linked provider account has `status = 'verified'`.
- Linked provider account has public visibility from an explicit owner control.
- Verified proof has `source_key = 'osu:profile_linked'`.
- Verified proof has `status = 'current'`.
- Verified proof has public visibility from an explicit owner control.
- Public projection allowlist enables osu!.
- No stale or revoked state exists on the linked account or proof.

Public preference alone does not bypass the allowlist.

## Public Allowlist

The only public provider fields are:

```json
{
  "providerId": "osu",
  "displayName": "osu!",
  "externalUsername": "...",
  "profileUrl": "...",
  "verifiedAt": "..."
}
```

The only public proof fields are:

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

The following fields are never public for osu! projection:

- raw external account id;
- owner id;
- internal passport id;
- linked provider account id;
- provider token state;
- token metadata;
- raw API response;
- raw OAuth response;
- access token;
- refresh token;
- email;
- country or location unless separately approved;
- friends, chat, or forum data;
- score history;
- match history;
- beatmap history;
- rank, PP, or best plays;
- live status;
- hidden-player inference data.

## State Handling

- `private`: hidden from public projection.
- `stale`: hidden by default for osu!.
- `revoked`: hidden from public projection.
- unpublished Passport: no public projection.
- suspended Passport: no public projection.
- missing owner consent: no public projection.
- missing owner proof visibility control: legacy blocked state for RM-31.
- disabled projection allowlist: blocked unless the explicit RM-33 public projection path enables it.

## Non-goals

- No production launch.
- No automatic public osu! proof.
- No Parent Auth via osu!.
- No refresh-token storage.
- No direct osu! browser API call.
- No secrets in web.
- No `/cosmetics`.
- No store/payments.
- No rank/PP/score/match-history/live tracker.
