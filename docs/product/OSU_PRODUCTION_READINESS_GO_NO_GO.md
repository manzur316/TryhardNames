# RM-35 osu! Production Readiness / Staging Go-No-Go

## Decision

Staging decision: conditional-go.

Production decision: no-go.

RM-35 prepares the release readiness package for osu! after RM-34 trust-safety passed the local public profile output. It does not enable production, change real secrets, touch remote Supabase, touch Vercel, or launch osu! publicly.

Staging is conditional-go only when all of these are true:

- an isolated staging Supabase project exists;
- staging API and web origins are configured separately from production;
- staging osu! OAuth app credentials are stored only in server-side environment config;
- the staging callback is registered exactly in osu!;
- all local migrations have been applied to staging after explicit approval;
- the full staging smoke in `OSU_STAGING_SMOKE_RUNBOOK.md` passes;
- source guards confirm no secret, token, raw callback code, or state values are logged or documented.

Production is no-go until staging smoke evidence, owner go/no-go acceptance, production environment review, callback review, rollback acceptance, monitoring review, and final source guard results exist.

## What Is Ready

- RM-27 disabled-by-default server-side osu! runtime foundation.
- RM-29 full-pass local callback smoke with real human authorization.
- RM-30 owner-only private `/account` linking and unlink UX.
- RM-31 public projection gate and blocked-field policy.
- RM-32 owner proof visibility controls.
- RM-33 safe local public projection smoke with explicit allowlisted DTOs.
- RM-34 trust-safety pass for public profile rendering, branding, privacy, and rollback.
- No refresh-token storage strategy remains intact.
- Browser code does not call osu! APIs directly.
- Public output is constrained to the RM-31/RM-33 allowlist.

## What Is Missing For Staging

- Explicit owner approval to configure staging services.
- Staging Supabase project details and migration confirmation.
- Staging API runtime with server-only osu! environment variables.
- Staging web origin and CORS/API origin review.
- Staging osu! OAuth app callback registration.
- Full staging smoke evidence for link, callback, public preference, projection, unlink, negative cases, and token vault non-persistence.
- Monitoring capture for osu! endpoint failures and projection errors.

## What Is Missing For Production

- Passing staging smoke evidence.
- Owner production go/no-go.
- Production callback registered exactly in osu!.
- Production secrets reviewed without printing or committing values.
- Production rollback owner acceptance.
- Monitoring and log redaction review.
- Confirmation that no localhost callback, staging callback, or test origin is present in production.
- Confirmation that production public projection allowlist is intentionally enabled only after approval.

## Go/No-Go Matrix

| Target | Decision | Required Before Enabling |
| --- | --- | --- |
| Local | pass | Already covered by RM-29 through RM-34 local smoke, projection, trust-safety, and source guards. |
| Staging | conditional-go | Isolated staging env, exact staging callback, staging migrations, full manual smoke, owner approval, monitoring review. |
| Production | no-go | Passing staging evidence, owner production go/no-go, production env/callback review, rollback acceptance, source guard pass. |

## Environment Summary

`OSU_ENVIRONMENT_CHECKLIST.md` is the canonical environment checklist for RM-35.

Required server-side names:

- `OSU_PROVIDER_ENABLED`
- `OSU_CLIENT_ID`
- `OSU_CLIENT_SECRET`
- `OSU_REDIRECT_URI`
- `OSU_STATE_SECRET`
- `OSU_AUTHORIZATION_URL`
- `OSU_TOKEN_ENDPOINT`
- `OSU_API_BASE_URL`
- `OSU_SCOPES`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- CORS/API origin configuration

These values must not be committed, printed in logs, exposed to the browser, or copied into docs.

## Callback Summary

Callbacks must match exactly in osu!.

| Environment | Callback |
| --- | --- |
| Local | `http://localhost:3001/api/v1/integrations/osu/callback` |
| Staging placeholder | `https://staging.tryhardnames.com/api/v1/integrations/osu/callback` |
| Production placeholder | `https://tryhardnames.com/api/v1/integrations/osu/callback` |

Production must not use localhost or staging callback values.

## Staging Smoke Summary

Before production can be considered, staging must verify:

- sign in with Google Parent Auth;
- create or select a private Passport;
- connect osu! from `/account`;
- complete the osu! callback without exposing callback code, state, tokens, or secrets;
- owner status shows verified and private first;
- owner explicitly sets osu! proof public preference;
- Passport is published with publication consent;
- public `/id/:slug` shows only allowlisted osu! fields;
- unlink/revoke removes public serving;
- another owner cannot mutate the proof;
- token vault stores no access token or refresh token;
- private, stale, revoked, suspended, or no-consent states do not project.

## Monitoring And Logging Minimum

Staging and production readiness require monitoring for:

- osu! status, link-intent, callback, unlink, and proof visibility route failures;
- callback state mismatch or replay failures;
- token exchange and immediate revoke failures without logging token values;
- Supabase write failures for linked provider and proof records;
- public projection render errors;
- public profile unavailable states;
- owner-only authorization failures.

Logs must not include secrets, access tokens, refresh tokens, full callback code, full callback state, service role keys, raw OAuth payloads, or raw osu! API payloads.

## Rollback Summary

If staging or a future production enablement fails:

1. Disable osu! runtime in server-side environment config.
2. Disable the osu! public projection allowlist or feature flag.
3. Revert the web/API deploy if needed.
4. Rotate the osu! OAuth app secret if exposure is suspected.
5. Keep owner data private or revoked rather than deleting records by default.
6. Set affected osu! provider/proof visibility back to private or revoked if public serving must be cleared.
7. Verify `/id/:slug` no longer serves osu! provider/proof DTOs.
8. Re-run source guards and smoke checks before re-enabling.

Migration rollback should be avoided unless explicitly reviewed, because private owner proof records may exist.

## Non-Goals

- No production launch.
- No secret changes.
- No remote Supabase changes.
- No Vercel changes.
- No Parent Auth via osu!.
- No refresh-token storage.
- No direct osu! browser API call.
- No public provider UI outside `/account`.
- No `/cosmetics`.
- No store, checkout, billing, or payments.
- No rank, PP, score, match-history, best-play, beatmap, or live tracker.
- No hidden-player inference.
- No official osu! endorsement claim.

## Next RM

RM-36 osu! Staging Configuration / Manual Smoke.
