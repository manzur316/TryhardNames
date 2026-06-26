# Trust / Safety / Privacy Controls

PR22 adds a foundation for public identity abuse handling and privacy controls before broader public distribution.

## Executive Summary

Public identity requires abuse and privacy controls before broad distribution.

PR22 adds:

- public profile report intent on valid `/id/:slug` profiles;
- safe `submit_public_profile_report` RPC submission;
- private report storage with no public report reads;
- takedown, suspension, privacy, impersonation, and cosmetic abuse policy;
- source, domain, and DB tests for report safety.

PR22 does not add a moderation dashboard, report list, email notifications, providers, Riot runtime, `/cosmetics`, store, payments, inventory purchases, pets/companions runtime, or 3D runtime.

## Public Profile Reporting

The public report action is available only on a valid public profile. It is not shown on unavailable profiles so the UI does not confirm whether a private, draft, suspended, or nonexistent slug exists.

Report categories:

- `impersonation`
- `offensive_content`
- `offensive_cosmetic`
- `fake_proof_or_rank`
- `privacy_request`
- `harassment`
- `other`

Reports collect only:

- public slug;
- allowlisted category;
- optional normalized details, capped at 800 characters;
- authenticated owner id only if a signed-in user submits the report.

Reports do not collect:

- email;
- phone;
- private contact details;
- IP address;
- user agent;
- device fingerprint;
- payment data;
- provider tokens;
- external account ids;
- raw provider metadata.

The RPC returns only `{ "ok": true }` or a safe invalid response. It does not return report id, owner id, Passport id, reporter id, or moderation status.

## Takedown and Suspension

The existing public projection continues to return unavailable for:

- draft/private Passports;
- unpublished Passports;
- suspended Passports;
- missing consent;
- missing verified linked provider;
- invalid or reserved slugs.

Operational takedown path for PR22:

1. Receive report through `public_profile_reports`.
2. Review privately outside public UI.
3. If action is required, suspend or unpublish through an owner/moderator-controlled future operational path.
4. Public `/id/:slug` must continue to show generic unavailable behavior.

PR22 does not create admin moderation tooling. Suspension operations remain backend/operational future work.

## Privacy Requests

Privacy requests use the same report foundation. They should be handled privately and must not create a public report status page.

Privacy request handling must:

- avoid confirming private profile state publicly;
- avoid exposing owner identifiers;
- avoid emailing from runtime in PR22;
- preserve unavailable behavior for private/suspended profiles.

## Cosmetic Abuse Policy

Cosmetics can style identity.

Cosmetics cannot manufacture proof.

Cosmetics must not:

- imply fake verification;
- imply fake rank;
- imply official/admin/staff/moderator/support status;
- use Riot, League of Legends, Valorant, Discord, or third-party assets;
- look like official provider UI;
- hide stale, revoked, private, or unverified proof states;
- override proof truth;
- create proof boosts;
- harass or target another user.

## Blocked and Reserved Visual Identity Terms

Blocked/reserved terms for visual identity surfaces:

- riot
- valorant
- league of legends
- discord
- verified
- proof
- rank boost
- admin
- staff
- official
- moderator
- support
- challenger
- grandmaster
- master
- diamond
- platinum
- gold
- silver
- bronze
- iron
- radiant
- immortal

These terms are policy guards for visual identity surfaces. They prevent fake proof, fake rank, provider impersonation, staff impersonation, and third-party asset confusion.

## Impersonation Rules

Public identity must not impersonate:

- TryhardNames staff;
- Riot, Discord, League of Legends, Valorant, or any third-party provider;
- another player;
- official support or moderation channels;
- verified proof/rank status that is not source-backed.

Impersonation reports should not expose private owner data to the reporter.

## Moderation States

Report states:

- `new`
- `reviewing`
- `resolved`
- `dismissed`

These states are private operational state. They are not exposed on public profiles and do not create a report status page in PR22.

## Visibility and Privacy Controls Review

Public `/id/:slug` must remain an allowlisted projection:

- no owner id;
- no email;
- no private Saved Names;
- no raw provider metadata;
- no provider tokens;
- no external account ids;
- no private proof cards;
- no report records.

Report submission must not weaken this public projection boundary.

## Future `/cosmetics` Safety Requirements

The future `/cosmetics` route must not launch until it has:

- report/abuse paths;
- cosmetic policy enforcement;
- blocked/reserved visual term checks;
- no fake proof or fake rank visuals;
- no Riot/Discord assets;
- no payment or inventory claims unless a future payment/inventory PR is explicitly approved.

PR22 does not implement `/cosmetics`.

## Future Pets/Companions/3D Safety Requirements

Future pets/companions/3D work must remain visual-only and must not:

- imply proof;
- imply rank;
- imitate Riot/Discord assets;
- obscure proof state;
- add WebGL/Three.js/runtime assets without a dedicated performance and safety review.

PR22 does not implement pets/companions/3D runtime.

## Riot and Provider Boundaries

Riot runtime remains blocked until explicit approval exists.

PR22 does not add:

- Riot OAuth;
- Riot API calls;
- Riot assets;
- Discord OAuth;
- Discord API calls;
- provider runtime expansion;
- provider token storage usage.

TryhardNames remains identity tooling, not an OP.GG clone, tracker, match-history dump, custom MMR/ELO product, ranking alternative, live-game advice tool, or hidden-player de-anonymization surface.

## Moderation Runbook

1. Triage `new` reports privately.
2. Mark duplicate or invalid reports as `dismissed`.
3. Mark actionable reports as `reviewing`.
4. If content violates policy, use future operational tooling to unpublish or suspend.
5. Mark completed items as `resolved`.
6. Never disclose reporter identity, owner id, Passport id, or private profile state publicly.

## Rollback

Rollback PR22 by reverting:

- `public_profile_reports`;
- `submit_public_profile_report`;
- public report UI;
- trust/safety domain and repository files;
- docs/tests.

If rollback happens after a local migration is applied, remove the report table/RPC and restore previous public profile behavior.
