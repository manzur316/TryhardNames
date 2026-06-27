# RM-24 Launch Readiness

RM-24 prepares TryhardNames for a controlled public launch review of the current product state.

Launch readiness does not execute deploy. It does not change production services, remote Supabase, Vercel, Google Cloud, Riot Developer Portal, provider runtime, database schema, routes, secrets, or env vars.

## Executive Summary

TryhardNames has enough core product surface to enter a controlled launch readiness review:

- public name generators;
- public Gaming Passport landing;
- Parent Auth account shell;
- Account Dashboard V2;
- Supabase-backed Saved Names with local fallback;
- Private Gaming Passport draft/editor;
- owner-controlled publish commands;
- public `/id/:slug` MVP using allowlisted public projection;
- Passport Cosmetics Foundation with visual-only cosmetics;
- public profile report submission and trust/safety policy;
- roadmap governance and readiness-before-runtime provider policy.

RM-24 turns those pieces into launch evidence: production smoke, observability checklist, rollback plan, policy final review, public profile/reporting readiness review, migration/release review, go/no-go matrix, manual smoke runbook, and post-launch monitoring checklist.

## Controlled Launch Scope

The controlled launch scope is the current TryhardNames product only:

- public generator discovery and route health;
- Gaming Passport information surface;
- account sign-in/sign-up protection behavior;
- saved-name and private Passport account surfaces where an authorized staging/local account exists;
- public unavailable behavior for private/nonexistent profiles;
- policy-valid public profile rendering when a local or staging fixture exists;
- report submission on valid public profiles;
- no new provider runtime, store, payments, `/cosmetics`, pets/companions, or launch-only features.

## Current Product State

Ready for launch review:

- public generators are public and free;
- `/gaming-passport` explains private-first identity and provider boundaries;
- `/id/:slug` serves only policy-valid, allowlisted public projection data;
- reports are private operational records, not public report lists;
- cosmetics are TryhardNames-owned visual identity and remain visual-only;
- roadmap governance separates GH PR # from RM-XX milestones.

Not ready or intentionally inactive:

- Riot runtime remains gated by approval;
- Discord, osu!, Steam, and Supercell / Clash remain future readiness candidates, not runtime;
- `/cosmetics` remains future;
- store, checkout, billing, subscriptions, and payments remain out of scope;
- report rate limiting, report queue tooling, and moderation dashboard remain future operational work;
- external monitoring integrations are not configured by RM-24.

## Pre-Launch Gates

Minimum gates before launch execution:

- CI green.
- Build green.
- Production public smoke completed.
- Auth/account smoke completed in an authorized environment.
- Public profile unavailable behavior verified.
- Public projection allowlist verified.
- Report submission smoke completed where a valid public profile fixture exists.
- Privacy/policy final review accepted.
- Riot and provider no-runtime checks accepted.
- Store/payments no-live checks accepted.
- Rollback plan accepted.
- Observability and manual monitoring checklist accepted.
- Known risks accepted by the owner.

## Go/No-Go Matrix

The authoritative launch decision matrix lives in `LAUNCH_GO_NO_GO_MATRIX.md`.

RM-24 does not mark the product launched. It provides the evidence structure required for a later owner go/no-go decision.

## Rollback Overview

Rollback is documented in `ROLLBACK_PLAN.md`.

Expected rollback strategy:

- revert the most recent launch-affecting PR if launch readiness docs/tests are wrong;
- revert RM-22 if report submission must be removed;
- revert RM-21 if cosmetics rendering must be removed;
- use Vercel deploy rollback manually if a production deploy is bad;
- use Supabase remote rollback only through approved human-run database operations.

RM-24 itself is docs/tests-only, so reverting it should require no runtime, database, provider, auth, or remote-service rollback.

## Observability Overview

Monitoring guidance lives in `OBSERVABILITY_AND_MONITORING.md`.

Launch review must watch:

- build/deploy status;
- route-level 404/500 behavior;
- runtime client errors;
- auth errors;
- Supabase RPC errors;
- public projection failures;
- publish command failures;
- report submission failures;
- failed asset loads;
- unusual report volume;
- provider runtime staying inactive.

RM-24 does not add Sentry, Datadog, external monitoring, or production telemetry configuration.

## Privacy And Policy Review

The policy review lives in `POLICY_FINAL_REVIEW.md`.

Current policy constraints:

- Google remains Parent Auth only.
- Riot, Discord, osu!, Steam, and Supercell / Clash are not live.
- Riot data is not behind a paywall.
- No fake proof, fake rank, MMR/ELO, tracker, live-game advice, match-history dump, hidden-player inference, or alternate ranking behavior.
- Public projection remains allowlisted.
- Cosmetics remain visual-only.
- Reports remain private and do not create a public report list.

## Trust And Safety Readiness

RM-22 added:

- public profile report intent;
- safe report RPC;
- private report storage;
- report category policy;
- takedown/suspension/privacy runbook;
- cosmetic abuse policy.

Known follow-ups:

- rate limiting;
- report queue operations;
- moderation dashboard;
- report triage staffing;
- email/support workflow, if needed.

These follow-ups are not implemented by RM-24.

## Public Profile Readiness

Public `/id/:slug` must keep these launch constraints:

- serve only policy-valid published Passports;
- return generic unavailable behavior for missing, private, draft, unpublished, suspended, or policy-blocked profiles;
- expose no owner id, email, raw metadata, private Saved Names, provider tokens, external account ids, or report records;
- show report action only for valid public profiles;
- preserve anti-tracker and no-MMR/no-live-game-advice copy.

## Data And Migration Readiness

RM-24 adds no DB migration files.

Current database-affecting features that need launch awareness:

- Saved Names table and owner-only RLS from RM-12;
- publish command RPCs from RM-14;
- public projection RPC from RM-15 and cosmetics projection update from RM-21;
- public profile report table/RPC from RM-22.

Before launch execution, database validation should confirm applied migrations, RLS, report insert behavior, public projection null behavior, and rollback ownership.

## Manual Smoke Requirements

Manual smoke is documented in `PRODUCTION_SMOKE_CHECKLIST.md`.

Required route smoke:

- `/`
- `/gaming-passport`
- `/sign-in`
- `/sign-up`
- `/account`
- `/id/nonexistent-slug`
- `/gamer-names/pro`
- `/roblox-names/cool`
- `/valorant/sweaty`
- `/sitemap.xml`
- `/robots.txt`

## Post-Launch Monitoring

After a later launch execution, monitor:

- first deploy status;
- home/generator load;
- account/auth errors;
- public unavailable route behavior;
- Supabase RPC error volume;
- report submission volume;
- console errors and failed assets;
- no provider runtime activation;
- no unexpected store/payment routes;
- user feedback related to reports, privacy, and public profiles.

## Explicit Non-Goals

RM-24 does not implement:

- deploy execution;
- Riot OAuth, Riot API, Riot runtime, or League of Legends adapter;
- Discord OAuth/API/runtime;
- osu! OAuth/API/runtime;
- Steam OpenID/API/runtime;
- Supercell / Clash runtime;
- provider tokens;
- provider callback routes;
- provider linking UI;
- secrets or env vars;
- `/cosmetics`;
- store, checkout, billing, subscriptions, inventory purchases, marketplace, or payments;
- Stripe or MercadoPago;
- pets/companions runtime or 3D runtime;
- report admin dashboard;
- public report list;
- moderation dashboard;
- email notification service;
- DB migrations;
- Supabase remote changes;
- Vercel changes;
- Google Cloud changes;
- Riot Portal changes.

## Exit Criteria

RM-24 exits when:

- launch readiness docs exist;
- roadmap docs identify RM-24 as implemented and RM-25 as next;
- docs/source tests verify no provider/runtime/store/payment/DB expansion;
- required validation commands pass or failures are reported exactly;
- launch gates, rollback plan, observability checklist, policy review, and smoke checklist are auditable.
