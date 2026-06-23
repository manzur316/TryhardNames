# Gaming Passport Schema Runbook

This runbook covers the PR3 database foundation for Gaming Passport. It is local-only: the migration files are reviewable, CI can validate them with a local Supabase stack, and no production database is touched by this PR.

## Included Tables

PR3 creates the five MVP tables:

- `gaming_passports`;
- `linked_provider_accounts`;
- `verified_proofs`;
- `passport_featured_proofs`;
- `passport_visibility_settings`.

These tables cover owner-owned Passport state, linked provider ownership records, normalized verified proofs, owner-selected featured proofs, and private visibility preferences.

## Deliberately Aplazado

PR3 does not create:

- `owners`;
- user profile tables;
- provider token or credential tables;
- theme tables;
- cosmetic tables;
- unlock tables;
- equipped cosmetic tables;
- sync job tables;
- audit logs;
- public views;
- public RPCs.

Provider token storage still needs a separate security design. No storage strategy for provider secrets is selected in PR3.

## Owner Principal

`auth.users.id` is the parent auth principal. The product may still say "owner" when describing the authenticated person who owns one Gaming Passport, but there is no `owners` table.

A separate owner profile table should only be added if a future reviewed migration has a concrete data need beyond the Passport itself.

## RLS Model

RLS is enabled on all five tables.

Owner client access:

- `gaming_passports`: owner can select, insert, update, and delete their rows.
- `passport_visibility_settings`: owner can select, insert, update, and delete their rows.
- `passport_featured_proofs`: owner can select, insert, update, and delete their selections.
- `linked_provider_accounts`: owner can select their rows only.
- `verified_proofs`: owner can select their rows only.

There are no anon policies and no direct public table reads. Provider accounts and proofs are written by future backend code, not by the browser client.

## Owner Data vs Public Projection

The database stores owner data and verified internal state. It does not serve `/id/:slug` directly.

Public serving remains a separate future surface that must use a backend or RPC allowlist. Public projection rules from the domain still decide which providers and proofs can leave the private ownership model.

## Local Workflow

Run from the repository root:

```bash
npm run db:start
npm run db:reset
npm run test:db
npm run db:stop
```

The equivalent Supabase commands are:

```bash
supabase start
supabase db reset
supabase test db
supabase stop --no-backup
```

If the Supabase CLI is unavailable locally, do not connect to a cloud project to compensate. Use the CI `database` job, which installs a fixed CLI version and runs against local Docker services.

## CI Workflow

The `database` job:

- checks out the repository;
- installs a fixed Supabase CLI version;
- starts Supabase locally;
- resets the local database;
- runs database tests;
- stops services with `if: always()`.

The job uses no user secrets and does not connect to a hosted Supabase project.

## Production Rollout Sequence

Future production rollout should be a separate reviewed change:

1. Review migration SQL and tests.
2. Apply to staging.
3. Run staging smoke tests for auth ownership, provider uniqueness, proof invariants, and RLS.
4. Apply to production only after staging passes.

PR3 stops before this sequence. It prepares files and tests only.

## Rollback Strategy

A future production rollout needs a rollback plan paired with the exact migration version. At minimum:

- keep the previous app version deployable;
- apply destructive changes only after backups and staging rehearsal;
- prefer additive migrations before destructive cleanup;
- pause new writes to affected surfaces before reverting schema shape;
- verify RLS after rollback.

PR3 does not execute a rollback because it does not touch production.

## Migration Risks

Known risks for the future rollout:

- canonical slug rules must match the JavaScript domain contract;
- provider external identifiers are opaque and case-sensitive after adapter canonicalization;
- composite ownership constraints are required to prevent cross-owner association bugs;
- public profile reads must not query tables directly;
- metadata remains private by default until explicit GameAdapter public schemas exist;
- provider token storage is unresolved and must not be mixed into these public-adjacent tables.
