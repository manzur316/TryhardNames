# RM-39 Staging Branch Alignment / Deployment Policy Enforcement

## Objective

RM-39 closes the operational gap found in RM-38: the historical GitHub branch named `staging` was behind `main` and contained one staging-only deployment trigger commit.

The goal is to align `staging` with current `main`, document the branch policy, and prevent future confusion between Git branches, Vercel projects, preview deployments, and production targets.

## Actions performed

Snapshot date: 2026-06-29.

| Action | Result |
| --- | --- |
| Confirmed RM-38 merge | PR `#45` merged into `main` |
| Confirmed current `main` HEAD | `db9c41626dbdd560a220ae2dcf2600bdad863334` |
| Audited `staging` before alignment | diverged: ahead by 1, behind by 8 |
| Preserved old `staging` HEAD for rollback reference | `ed0d1341f2e8d41a9f97a1d1c8136a2629c8f27d` |
| Aligned `staging` branch | moved `staging` to `db9c41626dbdd560a220ae2dcf2600bdad863334` |
| Verified post-alignment comparison | `main` and `staging` are identical |

No code, Supabase, Vercel configuration, OAuth configuration, secrets, environment values, or production feature flags were changed by this documentation PR.

## Branch policy

### Source of truth

`main` remains the source of truth for code and documentation after PR merge.

### Staging branch

The `staging` branch is no longer a divergent deployment trigger branch. It is aligned to `main` and should remain aligned unless a future RM explicitly changes this policy.

Rules:

- Do not commit directly to `staging`.
- Do not use `staging` for feature work.
- Do not use `staging` as a long-lived integration branch.
- Do not add empty trigger commits to `staging`.
- If `staging` diverges again, stop and open an alignment RM before running smoke tests.
- Any future movement of `staging` must record old SHA, new SHA, reason, and post-compare result.

### RM branches

All RM branches must start from current `origin/main`.

Required flow:

1. Audit `main` HEAD.
2. Create a short-lived RM branch from `main`.
3. Keep the PR small and scoped to one RM.
4. Let CI/Vercel checks complete.
5. Merge only after owner approval.
6. Confirm `main` HEAD after merge.
7. Align `staging` only if the RM requires it.

## Vercel deployment policy

Vercel staging and production are separated by project, not by the old `staging` branch.

| Project | Purpose | Canonical source |
| --- | --- | --- |
| `tryhardnames-staging` | staging environment | current `main` after merge |
| `tryhard-names-web` | production project | current `main`, with production runtime gates still requiring explicit approval |

Preview deployments remain temporary branch/PR deployments. They are not the canonical staging environment.

`target: production` must always be interpreted together with the Vercel project name:

- `target: production` in `tryhardnames-staging` means the production target of the staging project.
- `target: production` in `tryhard-names-web` means real production target.

## Deployment policy enforcement

Before smoke or runtime checks, record:

- GitHub source branch.
- GitHub commit SHA.
- Vercel project name.
- Vercel deployment URL.
- Vercel target.
- Supabase project/ref in scope.
- Provider runtime gates in scope.

Smoke must not proceed if any of these are true:

- source branch is not the expected branch for the RM;
- staging smoke points to `tryhard-names-web`;
- production smoke points to `tryhardnames-staging`;
- Supabase staging and production identifiers are mixed;
- localhost, preview, staging, and production callbacks are mixed;
- OAuth query values, tokens, secrets, env files, or service role keys appear in logs/docs/chat.

## Production status

Production remains no-go for osu! and Riot.

RM-39 does not approve:

- production osu! runtime;
- Riot runtime;
- new provider linking;
- public verification claims;
- `/cosmetics`, store, checkout, billing, or payments;
- tracker, ranking, MMR/ELO, match-history dump, live tracker, hidden-player inference, OP.GG replacement, or official endorsement claims.

## Rollback

If the `staging` branch alignment needs to be reverted for audit only, the previous branch head was:

```txt
ed0d1341f2e8d41a9f97a1d1c8136a2629c8f27d
```

Do not roll back `staging` unless a future RM explicitly approves it. The old commit was an empty deployment trigger, not a code-bearing branch head.

## Acceptance checklist

- RM-38 merge verified.
- `main` HEAD verified.
- `staging` divergence verified before alignment.
- Old `staging` SHA recorded.
- `staging` moved to current `main`.
- Post-alignment compare shows `main` and `staging` identical.
- Deployment policy documented.
- Production no-go preserved.
- No Supabase remote changes.
- No Vercel config changes.
- No secrets or env values committed.
