# RM-30 osu! Owner Linking UI Hardening / Private Account UX

RM-30 implements owner-only private UX for the osu! linked provider in the Account Dashboard.

## Status

Status: `this PR`.

RM-30 follows RM-29, which completed full-pass local smoke for callback, DB verification, token vault non-persistence, unlink/revoke, public projection non-leakage, and negative cases.

## Goal

Give authenticated owners a safe `/account` control surface to understand and operate osu! linked-provider state without changing public projection or token strategy.

Implemented scope:

- private osu! linking card inside `/account`;
- safe runtime status display for disabled, not configured, configured/ready, verified/private, revoked/disconnected, and stale/error states;
- Connect osu! button only when the server runtime is configured and the owner Passport is available;
- backend-only link-intent call;
- same-tab redirect to the backend-generated authorization URL;
- owner-only status call;
- visual confirmation before unlink;
- backend-only unlink call;
- copy that explains privacy, no refresh-token storage, and no official endorsement;
- source/docs tests for security boundaries.

## Non-Goals

RM-30 does not implement:

- No production launch;
- No public provider UI;
- No public osu! proof;
- No public `/id/:slug` provider projection changes;
- No Parent Auth via osu!;
- No refresh-token storage;
- No direct osu! browser API call;
- No provider polling or sync jobs;
- No rank, PP, score, best-play, beatmap, match-history, or live tracker surfaces;
- No `/cosmetics`;
- No store, checkout, billing, subscriptions, payments, inventory, or proof boosts;
- No remote Supabase changes;
- No Vercel changes;
- No deploy.

## Security Requirements

The web app must not include:

- real secrets;
- provider access material;
- provider refresh material;
- client secret values;
- service-role key values;
- raw provider metadata display;
- external account id display;
- owner id display.

The web app must not call:

- osu! token endpoints;
- osu! API endpoints;
- `/me` directly;
- revoke directly.

Those operations remain server-side in `apps/api`.

## Files

Primary implementation files:

- `apps/web/src/gaming-passport/components/OsuProviderLinkingCard.jsx`;
- `apps/web/src/gaming-passport/data/osuRuntimeRepository.js`;
- `apps/web/src/pages/AccountPage.jsx`;
- `apps/web/src/gaming-passport/components/ProviderRuntimeFoundationPanel.jsx`.

Primary tests:

- `apps/web/tests/seo/osu-owner-linking-ui.test.js`;
- `apps/web/tests/gaming-passport/domain.test.js`.

## Exit Criteria

RM-30 is complete when:

- `/account` has owner-only private osu! status/actions;
- Connect uses `POST /api/v1/integrations/osu/link-intent`;
- status uses `GET /api/v1/integrations/osu/status`;
- unlink uses `POST /api/v1/integrations/osu/unlink`;
- disabled runtime state disables Connect osu!;
- connected state enables Disconnect osu!;
- unlink confirmation explains the proof is revoked/private and public serving is blocked;
- tests prove no new public route, public proof, secrets, direct osu! browser API call, store/payment, `/cosmetics`, or tracker/ranking behavior.

## Next RM

If RM-30 passes:

```txt
RM-31 osu! Private Proof Publish Policy / Public Projection Gate
```

If RM-30 reveals leakage or owner-isolation issues, RM-31 must instead become osu! Runtime Security Fixes.
