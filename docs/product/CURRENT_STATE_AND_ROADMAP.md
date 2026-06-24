# TryhardNames Current State And Roadmap

## Current Status

This document reflects `main` after PR8.

TryhardNames currently has public generators, a public `/gaming-passport` landing page, Parent Auth for TryhardNames accounts, and a protected `/account` route that manages a private Gaming Passport draft. Riot project registration has been submitted in Riot Developer Portal and is awaiting Riot confirmation/review.

Riot integration is not live. Discord integration is not live. No public Riot data is live. No public Gaming Passport profile route is implemented. No Riot OAuth button exists. No Riot API calls exist. No production Riot key exists in the repo or runtime.

Gaming Passport is a visual, verifiable, shareable gaming resume. It is not a tracker, OP.GG alternative, custom MMR/ELO product, match-history dump, live-game advantage tool, or alternative ranking system.

## PR History

| PR | Title | Status | Outcome | Runtime impact | Non-goals |
| --- | --- | --- | --- | --- | --- |
| PR1 | `chore: secure repository and ensure reproducible builds` | Merged | Removed sensitive/generated files from version control and stabilized reproducible local/CI builds. | Build/test hygiene improved. | No product feature launch, no provider integration. |
| PR2 | `feat: define Gaming Passport domain foundation` | Merged | Added pure Gaming Passport domain contracts, policies, constants, and tests. | Domain logic available locally. | No routes, OAuth, API calls, database writes, public profiles, or providers. |
| PR3 | `feat: define Gaming Passport database foundation` | Merged | Added local Supabase migration/tests for core Passport tables and RLS. | Local schema foundation and DB tests exist. | No remote Supabase changes, no production rollout, no provider token storage. |
| PR4 | `feat: add Parent Auth and private Gaming Passport drafts` | Merged | Added Parent Auth flow and `/account` private draft management. | Users can sign in and manage a private draft when auth is configured. | No public profiles, linked providers, Riot OAuth, Discord OAuth, or proof sync. |
| PR5 | `chore: add Riot verification file` | Merged | Added Riot site verification file. | Supports Riot Developer Portal verification. | No Riot runtime integration. |
| PR6 | `feat(passport): add public Gaming Passport landing for Riot review` | Merged | Added public `/gaming-passport` landing and review-safe copy. | Public product page is live. | No Riot OAuth, Discord OAuth, Riot data, profile publishing, or provider activation. |
| PR7 | `docs(passport): add Riot review submission pack` | Merged | Added Riot submission support packet with URLs, smoke results, and safe wording. | Documentation only. | No credentials, API calls, OAuth, production keys, or service config. |
| PR8 | `docs(passport): audit Riot policy compliance` | Merged | Added compliance audit with `PASS WITH CONDITIONS` verdict. | Documentation only. | No runtime work, no secrets, no migrations, no RLS changes. |

## Live Surfaces

- `/` - public home page and generator entry point.
- `/gaming-passport` - public Gaming Passport landing page for users and Riot review.
- `/sign-in` - Parent Auth sign-in. Google Auth is Parent Auth only.
- `/account` - protected private draft dashboard. Unauthenticated users redirect to `/sign-in`.
- `/privacy-policy` - public privacy policy.
- `/terms-of-service` - public terms.
- `/sitemap.xml` - public sitemap including `/gaming-passport`.

## Implemented

- Public generators remain public.
- Parent Auth.
- Private Gaming Passport draft.
- `/account` protection.
- Gaming Passport landing.
- Gaming Passport domain model.
- Local schema foundation.
- RLS tests.
- Riot verification file.
- Riot review docs.
- Riot policy compliance audit.

## Not Implemented

- Riot OAuth / Riot Sign On.
- Discord OAuth.
- Riot API calls.
- Provider token storage.
- Unlink/revoke.
- Proof sync.
- Public `/id/:slug`.
- Publish command.
- Public profiles.
- Monetized cosmetics.
- Riot data display.

## Pending External Dependency

Riot Developer Portal confirmation/review is pending.

No Riot runtime work should start until approval and next steps are clear. Do not assume production Riot credentials, RSO access, callback requirements, scopes, or approved data surfaces before Riot responds.

## Next Recommended PRs

Numbering may change.

| Proposed PR | Scope | Notes |
| --- | --- | --- |
| PR10 | `docs/legal: align privacy and terms for Gaming Passport` | Keep public policies synchronized with Gaming Passport and pending provider status. |
| PR11 | `docs/passport: add Riot review response playbook and screenshot checklist` | Prepare reviewer-response copy, screenshots, and smoke steps if Riot asks follow-up questions. |
| PR12 | `chore/passport: plan Riot provider runtime contracts after approval` | Start runtime contract planning only after Riot approval/next steps are clear. |

## Do-Not-Build-Yet List

- Live Riot OAuth.
- Production Riot key assumptions.
- Fake Riot data.
- Riot profile publishing.
- Alternative ranking.
- MMR/ELO calculator.
- Match history dump.
- Hidden player inference.
- Riot assets/logos.
- Riot data behind a paywall.
- Riot or Discord as Parent Auth methods.
