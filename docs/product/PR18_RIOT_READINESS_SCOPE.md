# PR18 Riot Readiness Scope

PR17 selects PR18 as Riot Readiness because Riot approval is not evidenced in the repo.

PR18 is not Riot runtime.

PR18 is now implemented as readiness-only docs/tests work. It does not change runtime, routes, migrations, provider activation, secrets, env vars, or remote services.

## Allowed In PR18

- Riot readiness docs.
- Riot compliance checklist refresh.
- RSO callback design, not implementation.
- Token retention and encryption plan, not runtime.
- Revocation and unlink UX design, not live flow.
- Provider adapter contract review.
- Public projection review.
- Smoke test plan.
- Riot Portal checklist to be executed manually by a human.
- Source-based tests that prevent accidental OAuth/API activation.

## Forbidden In PR18

- Riot OAuth button.
- Riot Sign On redirect.
- OAuth authorize URL.
- Live callback route.
- Riot API calls.
- Riot client secret.
- Production Riot key.
- Env vars.
- Linked provider runtime activation.
- Provider-specific adapter runtime.
- Riot proof sync runtime.
- Public Riot data.
- Riot data behind a paywall.
- Match history.
- MMR/ELO.
- Ranking alternative.
- Live-game advice.
- Hidden-player de-anonymization.

## Readiness Outputs

PR18 should leave the repo with:

- a clear Riot approval checklist;
- RSO design boundaries;
- token storage requirements;
- unlink/revoke requirements;
- privacy copy requirements;
- public projection review criteria;
- smoke checklist for a future approved runtime PR.

Implemented PR18 outputs:

- `RIOT_READINESS_PACK.md`;
- `RIOT_RSO_CALLBACK_DESIGN.md`;
- `RIOT_PROVIDER_ADAPTER_CONTRACT_REVIEW.md`;
- roadmap and decision-log updates;
- source/docs guard test coverage.

## Exit Criteria

- Riot Runtime remains blocked.
- No OAuth launch exists.
- No API call exists.
- No secrets or env vars are added.
- Riot remains a future linked provider until explicit approval exists.
- PR19 remains the earliest possible Riot runtime PR, and only if approval exists.
