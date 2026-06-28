# RM-32 osu! Owner Proof Visibility Controls

## Scope

RM-32 adds owner-only controls for the osu! `profile_linked` proof visibility inside the private Account Dashboard.

This PR implements:

- backend owner-authenticated proof visibility mutation;
- private `/account` UI controls for `private` and `public` preference;
- confirmation before public preference;
- backend validation for owner, Passport, provider, proof, stale/revoked state, and publish readiness;
- safe owner status payload that includes proof visibility but no internals;
- policy update so owner visibility controls are present;
- continued public projection block through the disabled allowlist and local RPC exclusion;
- docs and tests for RM-32.

## Chosen Architecture

RM-32 uses an API route instead of a Supabase RPC:

```txt
POST /api/v1/integrations/osu/proof-visibility
```

Reason: osu! runtime already lives behind `apps/api`, where client secret handling, service-role writes, token exchange, callback completion, and unlink/revoke are server-side. Keeping the visibility mutation in the same boundary avoids direct browser DB writes and keeps the security review localized.

## Policy Decision

Default visibility remains `private`.

An owner may request `public` only when:

- the Passport belongs to the owner;
- the Passport is published;
- publication consent is true;
- the linked provider account is osu!;
- the linked provider account is verified and current;
- the profile proof is `osu:profile_linked`;
- the proof is current;
- no stale or revoked state exists.

Even after that owner preference is recorded, public projection remains blocked until RM-33 validates the public projection path.

## Public Projection Status

Public osu! projection is still gated.

The policy blocker after RM-32 is:

```txt
public_projection_allowlist_disabled
```

The RM-31 local projection RPC still excludes osu! provider and proof rows. No migration is added by RM-32.

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
- No remote Supabase changes.
- No Vercel changes.

## Exit Criteria

RM-32 passes when:

- owners can make a current verified osu! proof private or public preference through the private account UI;
- wrong owners cannot mutate visibility;
- revoked/stale providers and proofs cannot be made public;
- unpublished/no-consent Passports cannot request public preference;
- public projection remains blocked unless every policy gate and future allowlist passes;
- no blocked public fields or token fields leak;
- source guards and tests pass.

## Next RM

If RM-32 passes, the next recommended milestone is:

```txt
RM-33 osu! Public Projection Smoke / Projection QA
```
