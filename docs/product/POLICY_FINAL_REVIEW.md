# Policy Final Review

RM-24 reviews launch policy boundaries for the current TryhardNames product state. It does not replace legal counsel, execute launch, or modify legal documents.

## Privacy Policy Alignment

Current launch-readiness expectations:

- Parent Auth account data remains private to the owner.
- Saved Names are owner-scoped when authenticated and local-only/fallback when signed out or offline.
- Public `/id/:slug` uses allowlisted projection only.
- Reports collect only public slug, category, optional details, and authenticated reporter owner id when present.
- Reports do not collect email, IP address, user agent, device fingerprint, payment data, provider tokens, external account ids, or raw provider metadata.

Review status: ready for owner review, with future updates required before any provider runtime or payment system.

## Terms Alignment

Current terms boundaries should cover public generators, accounts, public profile availability, user-controlled publishing, report handling, and acceptable use.

Potential future terms updates:

- provider-specific terms before Riot/Discord/osu!/Steam/Supercell runtime;
- payment terms before any store, checkout, subscription, or purchased inventory;
- moderation process details if an admin/report queue launches.

## Auth And Provider Status

- Google remains Parent Auth only.
- Google is not a public proof.
- Riot is not live.
- Discord is not live.
- osu!, Steam, and Supercell / Clash are future readiness candidates, not runtime.
- Riot runtime remains gated by explicit approval and accepted token/revoke/privacy requirements.

## Riot And Provider Boundaries

The current product must not claim:

- Riot OAuth is live;
- Riot API calls are live;
- public Riot data exists;
- production Riot key exists;
- Riot data is behind a paywall;
- Riot endorses or approves TryhardNames;
- Discord, osu!, Steam, or Supercell are live providers.

## Competitive Integrity Boundaries

TryhardNames must not become:

- OP.GG clone;
- tracker;
- match-history dump;
- custom MMR/ELO product;
- ranking alternative;
- live-game advice tool;
- hidden-player inference or de-anonymization surface.

## Public Projection Review

Public Gaming Passport projection remains allowlisted and must not expose:

- owner id;
- owner email;
- internal Passport id;
- publication consent internals;
- private Saved Names;
- raw provider metadata;
- private metadata;
- provider tokens;
- external account ids;
- report records.

## Cosmetics Review

Cosmetics remain visual-only.

Allowed:

- TryhardNames-owned visual styling;
- Obsidian Pulse as a free foundation preview;
- earned-ready internal milestone styling.

Not allowed:

- fake proof;
- fake rank;
- proof boost;
- Riot/League/Valorant/Discord assets;
- Riot data monetization;
- store, checkout, payment, subscription, purchased inventory, loot boxes, gacha, or marketplace in RM-24.

## Report Privacy Review

Reports remain private operational records.

They must not:

- create a public report list;
- expose report id, owner id, Passport id, reporter id, or moderation status to the reporter;
- collect private contact details;
- collect device fingerprints;
- weaken unavailable behavior for private/suspended profiles.

## Takedown And Privacy Requests

Current foundation:

- report categories include privacy requests and impersonation;
- suspended/unpublished/private profiles are unavailable publicly;
- moderation runbook exists;
- public projection remains generic for unavailable profiles.

Future operational work:

- report rate limits;
- report queue;
- moderation dashboard;
- documented privacy request SLA;
- owner notification workflow, if approved.

## Monetization Boundaries

Current launch does not include:

- store;
- checkout;
- billing;
- payments;
- Stripe;
- MercadoPago;
- subscription;
- purchased inventory;
- paid provider data;
- paid Riot data/assets.

Future monetization must be reviewed separately and must keep provider/Riot data out of paywalls.

## Policy Review Result

RM-24 policy review result: ready for controlled launch readiness review, not launch execution.

Blocking conditions before launch:

- any provider runtime activation without readiness/approval;
- any public projection private-field leak;
- any auth protection leak;
- any store/payment runtime activation;
- any Riot boundary violation;
- any fake proof/rank behavior;
- any public report list or report-private-data leak.
