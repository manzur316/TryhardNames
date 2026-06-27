# RM-25 Provider Expansion Scope

RM-25 implements the Provider Expansion Readiness Matrix.

This milestone is docs/tests only. It compares provider candidates and recommends the next readiness milestone. It does not activate runtime.

## Implements

- `PROVIDER_EXPANSION_READINESS_MATRIX.md`;
- `PROVIDER_CANDIDATE_SCORECARD.md`;
- `PROVIDER_CANDIDATE_NOTES.md`;
- roadmap updates for RM-25/RM-26/RM-27;
- source-based tests that keep runtime/OAuth/API/callback/token/env/store/payment/DB changes out of scope.

## Decision

Recommended next RM:

- RM-26 osu! Readiness Pack.

Conditional future RM:

- RM-27 osu! Runtime Foundation, only if RM-26 exits with explicit go criteria after official docs review.

Riot:

- existing Riot readiness remains useful;
- Riot runtime remains gated by explicit approval evidence.

Steam:

- future identity readiness candidate.

Supercell / Clash:

- blocked until ownership verification strategy is documented from official sources.

Discord:

- future social/community provider candidate;
- not achievement proof.

Xbox / PlayStation / Nintendo / Epic:

- future/high-friction candidates.

## Non-Goals

RM-25 does not implement:

- Riot OAuth/API/runtime;
- RiotProvider runtime;
- League of Legends adapter;
- Discord OAuth/API/runtime;
- osu! OAuth/API/runtime;
- Steam OpenID/API/runtime;
- Supercell/Clash runtime;
- provider tokens;
- provider callback routes;
- provider linking UI;
- provider sync jobs;
- secrets or env vars;
- `/cosmetics`;
- store, checkout, billing, payments, subscriptions or inventory purchase;
- Stripe or MercadoPago;
- DB migrations;
- Supabase remote changes;
- Vercel changes;
- Google Cloud changes;
- Riot Portal changes;
- deploy execution.

## Exit Criteria

RM-25 exits when:

- the matrix exists;
- the scorecard exists;
- candidate notes exist;
- RM-26 is documented as the next readiness pack;
- RM-27 is documented as conditional;
- Riot remains gated;
- no provider runtime was added;
- source guards pass.
