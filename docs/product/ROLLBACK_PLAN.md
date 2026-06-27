# Rollback Plan

This rollback plan supports launch readiness review. RM-24 itself is docs/tests-only and should be rollbackable by reverting this PR.

## General Revert Strategy

1. Identify the smallest merged PR/RM responsible for the issue.
2. Prefer a normal Git revert PR over force-push or history rewriting.
3. Keep user data intact unless a database rollback is explicitly required and approved.
4. Validate public routes, account protection, public profile unavailable behavior, and report privacy after rollback.
5. Document the rollback decision, evidence, and follow-up owner.

## Recent Block Rollbacks

### RM-21 Passport Cosmetics Foundation

Rollback if cosmetics cause public rendering, privacy, or product-policy failures.

Expected approach:

- revert the cosmetics PR;
- restore previous public projection scene behavior if needed;
- verify no inventory, prices, or payment fields are exposed;
- verify public `/id/:slug` still loads/unavailable safely.

### RM-22 Trust / Safety / Privacy Controls

Rollback if report submission or report UI creates privacy, abuse, or stability risk.

Expected approach:

- revert report UI, trust/safety repository, report policy, and docs/tests;
- if the report migration has been applied remotely, remove or disable `public_profile_reports` and `submit_public_profile_report` through an approved human-run database rollback;
- verify reports are no longer visible and public profiles still render safely.

### RM-23 Roadmap Governance + Provider Expansion Plan

Rollback if roadmap governance creates planning confusion or bad source-of-truth rules.

Expected approach:

- revert docs/tests;
- keep GitHub PR numbers unchanged;
- restore previous roadmap docs only if they do not reintroduce provider/runtime ambiguity.

### RM-24 Launch Readiness

Rollback if launch readiness docs/tests are inaccurate.

Expected approach:

- revert this PR;
- no runtime, database, auth, provider, deployment, env-var, or secret rollback should be required.

## Vercel Deploy Rollback

This is a manual owner procedure. RM-24 does not touch Vercel.

If a later deploy causes a production incident:

1. Identify the last known good Vercel deployment.
2. Roll back in Vercel manually.
3. Validate public routes and account protection.
4. Keep provider/store/payment no-live checks in the smoke record.
5. Open a follow-up PR with the root cause and corrective docs/tests.

## Supabase Remote Rollback

This is a manual owner procedure. RM-24 does not touch remote Supabase.

If a remote database rollback is required:

1. Stop launch changes.
2. Confirm exact applied migration.
3. Prepare rollback SQL outside chat and never include secrets.
4. Review RLS and grants before executing.
5. Execute through approved human database process.
6. Re-run DB smoke and public projection/report checks.

## Validation After Rollback

Minimum validation:

- `/` loads;
- `/gaming-passport` loads;
- `/sign-in` loads;
- `/account` remains protected when signed out;
- `/id/nonexistent-slug` remains generic unavailable;
- dynamic generator routes load;
- public profile projection exposes no private fields;
- provider runtime remains inactive;
- store/payment routes remain absent.

## Communication Notes

Rollback communication should state:

- what changed;
- what was reverted;
- user impact;
- whether user data was affected;
- whether any remote service was touched;
- follow-up owner and timeline.
