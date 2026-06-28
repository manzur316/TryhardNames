# osu! Staging Smoke Runbook

## Scope

This runbook defines the manual staging smoke required after RM-35 before any production osu! enablement.

It assumes staging has an isolated Supabase project, server-side osu! environment variables, exact osu! callback registration, and deployed API/web services. Do not run this against production without explicit owner approval.

## Required Preconditions

- Staging API is reachable.
- Staging web is reachable.
- Staging Supabase migrations are applied.
- Staging callback is registered exactly in osu!.
- `OSU_PROVIDER_ENABLED` is enabled only for staging.
- Server-only secrets are present only in staging runtime configuration.
- Browser source contains no osu! client secret, service role key, access token, refresh token, raw provider internals, or direct osu! API calls.

## Evidence Rules

Capture outcomes, statuses, timestamps, and screenshots where useful.

Do not capture or paste:

- real secrets;
- service role keys;
- access tokens;
- refresh tokens;
- full callback code;
- full callback state;
- JWT values;
- raw OAuth payloads;
- raw osu! API payloads.

## Smoke Steps

1. Sign in with Google Parent Auth on staging.
2. Open `/account`.
3. Create or select a private Gaming Passport.
4. Confirm osu! runtime status is configured.
5. Click `Connect osu!`.
6. Complete osu! authorization in the browser.
7. Confirm callback success without recording callback query values.
8. Return to `/account`.
9. Confirm owner status shows osu! connected, verified, and private.
10. Confirm no external account id, owner id, linked provider account id, raw metadata, or token state appears in the UI.
11. Set the osu! proof preference to public.
12. Confirm the UI explains the proof is only eligible for public display if the Passport is published and all gates pass.
13. Publish the Passport with publication consent.
14. Open public `/id/:slug`.
15. Confirm the public profile shows only the allowlisted osu! provider and proof fields.
16. Confirm public copy uses neutral ownership language and does not imply official osu! endorsement.
17. Disconnect osu! from `/account`.
18. Confirm owner status becomes revoked or disconnected.
19. Confirm public `/id/:slug` no longer serves the osu! provider/proof.
20. Repeat the public projection check after cache expiry or refresh if staging has edge caching.

## Expected Public Fields

Provider fields:

- `providerId`
- `displayName`
- `externalUsername`
- `profileUrl`
- `verifiedAt`

Proof fields:

- `type`
- `label`
- `source`
- `observedAt`
- `visibility`

## Blocked Public Fields

The public profile must not expose:

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

## Negative Cases

Validate these before production go/no-go:

- link-intent without owner auth fails;
- callback replay fails;
- callback with altered state fails;
- proof visibility mutation by another owner fails;
- revoked provider cannot be public;
- revoked proof cannot be public;
- stale proof cannot be public;
- unpublished Passport does not serve osu! proof;
- missing publication consent does not serve osu! proof;
- suspended or report-blocked Passport does not serve osu! proof;
- private proof does not serve publicly;
- featured proof selection cannot bypass the osu! projection gate.

## Token Vault Verification

Staging verification must confirm:

- no access token is persisted;
- no refresh token is persisted;
- token vault rows do not contain ciphertext for osu!;
- unlink/revoke does not create token persistence.

Do not print vault values. Record only pass/fail and row counts or safe boolean summaries.

## Pass Criteria

Staging smoke passes only when:

- all happy-path steps pass;
- all negative cases pass;
- public output contains only the allowlist;
- unlink/revoke removes public serving;
- token vault non-persistence is confirmed;
- source guards pass;
- no secret, token, callback code, callback state, or raw payload appears in logs, docs, browser console, or screenshots.

## Fail Criteria

Stop and mark no-go if:

- any blocked field appears publicly;
- any token or secret appears in browser or logs;
- another owner can mutate proof visibility;
- private, stale, revoked, unpublished, no-consent, suspended, or report-blocked state still serves osu! proof;
- callback replay or altered state succeeds;
- public copy implies official osu! endorsement;
- rank, PP, score, match-history, beatmap, best-play, or live tracker behavior appears.

## Next RM

RM-36 osu! Staging Configuration / Manual Smoke should execute this runbook against staging.
