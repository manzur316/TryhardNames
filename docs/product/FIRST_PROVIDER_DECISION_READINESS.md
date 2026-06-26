# First Provider Decision And Readiness Pack

PR17 records the first-provider decision after PR16 Provider Runtime Foundation.

## Executive Decision

Selected path:

PR18 = Riot Readiness

Riot Runtime: blocked.

Riot runtime remains gated by approval. The repo contains Riot review, policy, and submission support docs, but it does not contain explicit evidence that Riot has approved production RSO, production API access, callback URLs, scopes, product metadata, or credentials.

Discord Pilot remains a possible future path, but it is not selected for PR18 because TryhardNames is currently oriented around Riot review readiness and no product-owner instruction in the repo switches first-provider direction to Discord.

No OAuth launch is approved by this decision.

## Inputs Reviewed

- `README.md`
- `docs/product/CURRENT_STATE_AND_ROADMAP.md`
- `docs/product/PRODUCT_EXECUTION_PLAN_AFTER_PR10.md`
- `docs/product/ROADMAP_STATUS_MATRIX.md`
- `docs/product/DECISION_LOG.md`
- `docs/product/GAMING_PASSPORT_ARCHITECTURE.md`
- `docs/product/GAMING_PASSPORT_UI_CONTRACT.md`
- `docs/product/PUBLISH_RUNTIME_COMMANDS.md`
- `docs/product/PUBLIC_GAMING_PASSPORT_MVP.md`
- `docs/product/PROVIDER_RUNTIME_FOUNDATION.md`
- `docs/product/RIOT_POLICY_COMPLIANCE_AUDIT.md`
- `apps/web/src/gaming-passport/domain/providerRuntime.js`
- `apps/web/src/gaming-passport/data/providerRuntimeRepository.js`
- `apps/web/src/gaming-passport/components/ProviderRuntimeFoundationPanel.jsx`
- Provider-runtime and roadmap tests.

## Current Approval State

Repo evidence says:

- Riot integration is pending Riot approval.
- Riot OAuth / Riot Sign On is not live.
- No Riot API calls are active.
- No production Riot key exists in the repo.
- No Riot data is live.
- PR16 foundation explicitly says no provider is live.

Repo evidence does not show:

- an approved Riot production application;
- approved RSO scopes;
- approved callback URLs;
- Riot credentials;
- Riot API access approval;
- product-owner approval to start Riot runtime;
- a decision to launch Discord first.

## Decision Matrix

| Path | Status | Evidence | Risks | Decision |
| --- | --- | --- | --- | --- |
| Discord Pilot | Possible later | Provider ID and provider-neutral foundation exist. | Could distract from current Riot review path; still needs OAuth, callback, token, revoke, privacy, and abuse review. | Not selected for PR18. |
| Riot Readiness | Selected | Riot review docs exist; approval is not evidenced; product direction is Riot review readiness. | Must stay docs/design/readiness only and not drift into runtime. | Selected for PR18. |
| Riot Runtime | Blocked | Riot approval is not evidenced in repo. | Would violate approval gate if started now. | Blocked until explicit approval exists. |

## Recommendation

PR18 should be Riot Readiness Pack.

It should prepare approval-safe artifacts and implementation plans without activating Riot:

- compliance checklist refresh;
- RSO callback design, not implementation;
- token retention and encryption design, not runtime;
- unlink/revoke UX design, not live flow;
- provider adapter contract review;
- test and smoke plan;
- manual Riot Portal checklist for a human owner.

## PR18 Scope Selected

Allowed:

- readiness docs;
- Riot compliance checklist;
- RSO callback design;
- token retention plan;
- revocation and unlink UX design;
- provider adapter contract review;
- portal checklist to be executed by a human;
- smoke test plan;
- no-config source guard tests.

Forbidden:

- Riot OAuth button;
- RSO redirect;
- live callback route;
- Riot API calls;
- Riot client secret;
- production key;
- env vars;
- linked provider runtime activation;
- public Riot data;
- proof sync runtime.

## PR18 Non-Goals

- No Discord OAuth live.
- No Riot OAuth live.
- No Riot API calls.
- No Discord API calls.
- No provider-specific adapter runtime.
- No callback route live.
- No token storage runtime.
- No VerifiedProof sync runtime.
- No public provider linking UI.
- No Vercel, Google Cloud, Riot Portal, secrets, env vars, or remote Supabase changes.
- No match history.
- No MMR/ELO.
- No ranking alternative.
- No live-game advice.
- No hidden-player de-anonymization.

## PR18 Readiness Checklist

- Riot approval status is documented from repo evidence.
- Safe submission wording is reviewed.
- RSO callback design is documented as design-only.
- Token retention and encryption requirements are documented as design-only.
- Unlink/revoke UX and data deletion expectations are documented.
- Public projection impact is reviewed and kept unchanged.
- Privacy policy delta is drafted, not shipped as live provider copy.
- Rate-limit and abuse handling expectations are documented.
- No OAuth launch is present in source or docs.
- No Riot or Discord API endpoint is added.

## PR18 Smoke Checklist

- `/` loads.
- `/gaming-passport` loads.
- `/id/nonexistent-slug` returns safe unavailable behavior.
- `/account` remains protected.
- No live Riot button.
- No live Discord button.
- No OAuth redirect.
- No provider API call.
- Dynamic generator routes still load:
  - `/gamer-names/pro`
  - `/roblox-names/cool`
  - `/valorant/sweaty`

## Risk Register

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Readiness language could be misunderstood as provider launch. | High | Use blocked/not live wording and source tests. |
| Riot runtime could start before approval. | High | Keep Riot Runtime blocked and require explicit approval evidence. |
| Discord Pilot could be started without product-owner direction. | Medium | Keep Discord Pilot listed as alternate future path only. |
| Public projection could expand before provider proof policy is ready. | High | Keep `/id/:slug` allowlisted and unchanged. |
| Token vault placeholder could be mistaken for real token storage. | High | Keep PR16 `token_ciphertext` null boundary and document no runtime storage. |

## Security Checklist

- No secrets or env vars.
- No OAuth authorize URL.
- No API calls to Riot or Discord.
- No production keys.
- No client secret.
- No access token or refresh token handling for providers.
- No provider token storage runtime.
- No public exposure of external account IDs.
- No raw provider payloads.
- No remote Supabase changes.

## Compliance Checklist

- Riot remains gated by approval.
- Google remains Parent Auth.
- Discord/Riot are future linked providers.
- Public generators stay public and free.
- No Riot data behind a paywall.
- No Riot logos/assets unless separately approved.
- No OP.GG clone.
- No tracker.
- No match-history dump.
- No custom MMR/ELO.
- No live-game advice.
- No hidden-player de-anonymization.
- No ranking alternative.

## Go / No-Go

Go for PR18 Riot Readiness.

No-go for Riot Runtime.

No-go for Discord Pilot unless a later product-owner decision explicitly selects Discord and accepts its provider-specific launch work.

## Rollback Plan

Revert the PR17 docs and tests. This does not require data migration or runtime rollback because PR17 does not modify runtime, schema, routes, providers, secrets, or remote service configuration.

## Evidence References

- `README.md`: Riot integration pending approval; no Riot OAuth; no production Riot key.
- `docs/product/RIOT_POLICY_COMPLIANCE_AUDIT.md`: go with conditions for submission; do not implement Riot OAuth before approval.
- `docs/product/PROVIDER_RUNTIME_FOUNDATION.md`: no provider is live after PR16.
- `docs/product/ROADMAP_STATUS_MATRIX.md`: Riot runtime is gated and Discord runtime is pending.
- `apps/web/src/gaming-passport/domain/providerRuntime.js`: provider runtime activation is contract-only/not-live.
- `apps/web/src/gaming-passport/components/ProviderRuntimeFoundationPanel.jsx`: account panel says providers are not live.
