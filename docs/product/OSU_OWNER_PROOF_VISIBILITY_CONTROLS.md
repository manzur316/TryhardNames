# osu! Owner Proof Visibility Controls

RM-32 adds explicit owner controls for the osu! `profile_linked` proof in the private `/account` dashboard.

Status: `done`.

## Decision

The default remains private. RM-32 lets the owner request `private` or `public` visibility for the current osu! profile-linked proof, but it does not auto-publish the proof and does not open public projection by default.

Public projection remains gated by policy. RM-33 enables the safe local public projection smoke path, but public preference only appears when every policy condition passes and the projection allowlist is active.

Next milestone:

```txt
RM-34 osu! Public Profile Trust-Safety QA
```

## Architecture

RM-32 uses the existing server-side osu! integration boundary.

```txt
POST /api/v1/integrations/osu/proof-visibility
```

The route requires the Parent Auth bearer, resolves the owner with the existing API session guard, and performs the write server-side. The web app does not update Supabase directly and does not call osu! from the browser.

The backend updates both:

- the osu! linked provider account visibility; and
- the `osu:profile_linked` verified proof visibility.

This keeps the owner preference coherent for the RM-31 policy gate without adding a public projection leak.

## Backend Enforcement

The API rejects the write unless all owner and proof checks pass:

- the Passport belongs to the authenticated owner;
- the linked provider account belongs to the same Passport and owner;
- the linked provider is `osu`;
- the linked provider account is verified and current;
- the profile proof exists;
- the profile proof is `osu:profile_linked`;
- the proof is current;
- revoked or stale provider/proof states are blocked;
- the requested visibility is only `private` or `public`;
- public preference requires the Passport to be published and publication consent to be true.

The route returns only safe owner UI data. It does not return tokens, raw OAuth data, raw provider metadata, owner identifiers, internal Passport identifiers, raw external account identifiers, or token vault state.

## Owner UX

The private `/account` osu! card now shows:

- current proof visibility;
- safe connection status;
- `Make Public` when the owner can request a public preference;
- `Confirm Public` copy before changing from private to public;
- `Make Private` when the owner wants to revert;
- disabled states for missing runtime config, missing Passport, missing owner session, disconnected provider, revoked/stale provider, revoked/stale proof, unpublished Passport, or missing publication consent.

The copy states:

- private means only the owner can see the proof;
- public means eligible for a public Gaming Passport only if publish policy and projection gates pass;
- public projection remains gated unless the RM-33 projection path explicitly enables the allowlist;
- osu! is a linked provider, not Parent Auth;
- no refresh tokens are stored;
- unlink/revoke keeps public serving blocked.

## Projection Result

RM-32 removes the `owner_visibility_controls_missing` blocker from the default domain policy path because the controls now exist.

The remaining default domain blocker is:

```txt
public_projection_allowlist_disabled
```

RM-33 adds a local Supabase projection smoke migration that includes osu! only through allowlisted DTO builders. RM-32 itself did not add a migration.

## Public Allowlist

When a later milestone enables public projection smoke, the only permitted public provider fields remain:

- `providerId`
- `displayName`
- `externalUsername`
- `profileUrl`
- `verifiedAt`

The only permitted public proof fields remain:

- `type`
- `label`
- `source`
- `observedAt`
- `visibility`

## Blocked Fields

The public projection must never expose:

- raw external account identifiers;
- owner identifiers;
- internal Passport identifiers;
- linked provider account identifiers;
- provider token state;
- token metadata;
- raw API responses;
- raw OAuth responses;
- access or refresh tokens;
- email;
- country or location unless separately approved;
- friends, chat, or forum data;
- score history;
- match history;
- beatmap history;
- rank, PP, or best plays;
- live status;
- hidden-player inference data.

## Non-Goals

- No production launch.
- No automatic public osu! proof.
- No public provider UI.
- No Parent Auth via osu!.
- No refresh-token storage.
- No direct osu! browser API call.
- No secrets in web.
- No `/cosmetics`.
- No store, checkout, billing, or payments.
- No rank, PP, score, match-history, best-play, beatmap, or live tracker behavior.
- No remote Supabase or Vercel changes.

## Validation

RM-32 validation covers:

- API owner-only visibility write tests;
- wrong-owner rejection;
- unpublished/no-consent public preference rejection;
- revoked provider rejection;
- stale proof rejection;
- non-osu provider rejection;
- safe owner status payload with proof visibility;
- private Account UI controls and confirmation copy;
- domain policy with owner controls enabled and public allowlist disabled;
- source guards for secrets, token field names, direct osu! browser calls, `/cosmetics`, store/payments, and tracker/ranking surfaces.
