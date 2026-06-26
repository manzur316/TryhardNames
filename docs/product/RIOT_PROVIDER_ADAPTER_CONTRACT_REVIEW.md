# Riot Provider Adapter Contract Review

PR18 reviews future Riot provider boundaries without implementing adapter runtime.

## RiotProvider Boundary

Future RiotProvider should:

- run only after explicit Riot approval;
- own Riot Sign On integration;
- use only approved scopes;
- use only approved callback URLs;
- keep tokens server-side;
- normalize approved account ownership signals;
- write audit events for link, unlink, revoke, and sync;
- expose only safe normalized fields to proof builders;
- avoid raw provider payloads in public outputs;
- avoid public external account IDs.

RiotProvider must not become Parent Auth. Google remains Parent Auth only.

## LeagueOfLegendsAdapter Boundary

Future LeagueOfLegendsAdapter should:

- depend on RiotProvider;
- map approved League of Legends data into VerifiedProof contracts;
- define proof freshness and staleness rules;
- support revoked proof behavior;
- avoid unsupported games or data products;
- avoid direct public serving outside Public Projection.

LeagueOfLegendsAdapter is not implemented in PR18.

## Data Minimization

Allowed fields must be explicitly approved before implementation.

Future adapter work should prefer:

- ownership proof;
- Riot ID display if approved;
- limited rank proof if approved;
- sync timestamp;
- source label;
- freshness/staleness status.

Future adapter work must not include:

- match history;
- live match data;
- custom MMR/ELO;
- ranking alternative;
- hidden-player inference;
- raw provider payloads;
- tokens;
- unapproved identifiers.

## Proof Freshness And Revocation

Future Riot proofs should support:

- `current`;
- `stale`;
- `revoked`.

Revoked provider accounts cannot satisfy public serving policy. Revoked proofs must be excluded from public projection. Stale proofs may be displayed only if product and compliance policy accepts the stale state and labels it clearly.

## Public Projection Impact

Before any public Riot field is exposed, tests must verify:

- public DTO allowlist changed intentionally;
- owner IDs stay private;
- emails stay private;
- external account IDs stay private;
- tokens stay private;
- raw metadata stays private;
- private proofs stay private;
- revoked providers and proofs stay excluded;
- no private Saved Names are exposed.

## Future Tests Required

PR19/PR20 should add tests for:

- approved provider-only runtime gate;
- RSO callback state validation;
- token non-exposure;
- owner-scoped link/unlink/revoke;
- no public external account ID;
- proof freshness and staleness;
- revoked proof exclusion;
- no match-history, MMR/ELO, ranking, live-game advice, or hidden-player data.

## PR18 Non-Implementation Statement

No RiotProvider runtime is implemented in PR18.

No LeagueOfLegendsAdapter runtime is implemented in PR18.

No Riot API call, OAuth redirect, callback route, secret, env var, token storage runtime, proof sync runtime, or public Riot data is added in PR18.

