# Launch Go/No-Go Matrix

RM-24 provides the launch decision matrix. It does not execute launch or deploy.

| Gate | Status | Required evidence | Go criteria | Block criteria | Owner |
| --- | --- | --- | --- | --- | --- |
| CI green | Pending manual/CI run | CI link or local equivalent. | All required checks pass. | Required checks fail without accepted mitigation. | Release owner |
| Build green | Pending command run | `npm run build` output. | Build completes without errors. | Build fails. | Release owner |
| Production public smoke | Pending manual smoke | `PRODUCTION_SMOKE_CHECKLIST.md` evidence. | Critical routes load and copy boundaries hold. | Public routes unavailable or misleading. | QA owner |
| Auth smoke | Pending authorized smoke | Parent Auth smoke record. | Sign-in/sign-up and signed-out protection work. | Account surface leaks or auth blocks launch. | QA owner |
| Account smoke | Pending authorized smoke | `/account` dashboard screenshot/evidence. | Dashboard, Saved Names, private draft, publish controls load. | Private/account data unavailable or exposed publicly. | QA owner |
| Public profile unavailable smoke | Pending manual smoke | `/id/nonexistent-slug` screenshot/status. | Generic unavailable behavior; no private state leak. | Slug existence or private state leaks. | QA owner |
| Saved names smoke | Pending authorized smoke | Saved Names local/account evidence. | Saved names load or safe fallback appears. | Destructive sync or misleading saved-state behavior. | Product owner |
| Private Passport draft smoke | Pending authorized smoke | Draft editor/preview evidence. | Draft is private and editable. | Draft fails to load or implies public serving. | Product owner |
| Cosmetics visual-only smoke | Pending authorized smoke | Cosmetics panel/public profile evidence. | Cosmetics are visual-only; no prices or proof boosts. | Store/payment/fake proof/rank behavior appears. | Product owner |
| Reports smoke | Pending valid fixture smoke | Report dialog/submission evidence. | Valid report submits safely; no public report list. | Report leaks private data or admin/report list appears. | Trust/safety owner |
| Privacy/legal copy review | Pending review | `POLICY_FINAL_REVIEW.md` sign-off. | Boundaries accepted or issues tracked. | Legal/privacy blocker found. | Product owner |
| Riot no-runtime verification | Pending source check | Source check output. | No Riot OAuth/API/runtime. | Riot runtime, API, OAuth, secrets, or live data appears. | Security owner |
| Provider runtime no-live verification | Pending source check | Source check output. | Discord/osu!/Steam/Supercell remain future. | New provider runtime, callback, API, or token path appears. | Security owner |
| Store/payments no-live verification | Pending source check | Source check output. | No `/store`, checkout, billing, Stripe, MercadoPago, purchase flow. | Payment/store runtime appears. | Product owner |
| Rollback plan accepted | Pending review | `ROLLBACK_PLAN.md` review. | Rollback owner and steps are clear. | Rollback path is unclear for risky changes. | Release owner |
| Observability checklist accepted | Pending review | `OBSERVABILITY_AND_MONITORING.md` review. | Manual/current/future monitoring expectations are clear. | Launch has no way to observe critical failure modes. | Release owner |
| Known risks accepted | Pending owner decision | Risk log or PR review comment. | Risks are accepted or mitigated. | Unaccepted critical risk remains. | Product owner |

## Decision Rule

Go requires all critical/high gates to pass or have explicit owner acceptance. Any privacy leak, provider runtime activation, public projection leak, auth protection failure, store/payment activation, or Riot boundary violation is a no-go.
