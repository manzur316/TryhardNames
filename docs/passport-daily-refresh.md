# Daily Passport refresh

Steam and osu! refresh automatically once per UTC calendar day. Vercel invokes
the protected routes at 08:00 and 08:30 UTC respectively. A database claim makes
duplicate invocations harmless. Failures retain the previous snapshot and wait
until the next day; there are no immediate API retries.

Production-only configuration:

- `CRON_SECRET`: random server-side secret of at least 32 characters.
- `PASSPORT_DAILY_REFRESH_ENABLED=true`.
- Existing provider configuration and restricted writer credentials are reused.

Production Steam uses this project's Supabase shared transaction pooler on port
6543, with the existing restricted writer and TLS certificate verification. The
direct database hostname failed DNS resolution from Vercel. Local credentials
and Preview configuration were not changed.

The migration adds execute-only permissions to the existing Steam/osu writers.
The non-login executor cannot change account identity, ownership verification,
visibility, publication selections or consent. Completion locks the parent and
account and checks the claim and original verification timestamp. Unlinking,
relinking, suspension or deletion prevents a stale worker from restoring data.

Steam refreshes the existing six-game preview, not the entire library. Each
account needs two profile/library requests and up to two achievement requests
per displayed game. Schemas are reused across accounts within the same run.
This is one daily refresh cycle, not a single HTTP request per account.
Unavailable/private achievements are never represented as zero completions.
Only three unlocked achievement names/icons per game are stored. Tokens and
OpenID assertions are not stored. Steam is private by default. Owners can separately
publish identity and optional bounded game activity; see `steam-publication.md`.

osu! uses an application token with only `public` scope, the linked immutable
account ID and its saved ruleset. It updates existing display statistics, not
the OAuth ownership proof or the user's publication selection.

Roblox is not part of this scheduler: its current identity-only flow revokes
tokens after verification. Bungie has private production linking (see
`bungie-production-linking.md`), but no daily refresh. Battle.net remains a local prototype.

## Capacity and operations

Each invocation is limited to 100 accounts and a 260-second work budget inside
a 300-second function. It reserves enough time for all requests for the next
account before claiming. Current launch volume is one active account for each
provider. A 503 with `budgetExhausted` or `rateLimited` requires operator action;
introduce durable queue workers before volume exceeds this budget. Vercel does
not automatically retry failed cron jobs. Inspect Cron Jobs and runtime logs.
Cron responses contain counts only, never provider account IDs or credentials.

Disable `PASSPORT_DAILY_REFRESH_ENABLED` and redeploy to stop refreshes. Revert
to the preceding deployment for a UI rollback. The additive migration is inert
without a worker and can remain in place; do not delete linked accounts.

## Verification

- `npm run test:passport:daily`
- `npm run test:steam:db` (isolated, network-free PostgreSQL container)
- `npm run test:providers:release`
- `npm run test:passport`
- `npm run build`

Browser fixtures cover 1440/390/320 widths, real Steam cover/schema artwork,
simulated unlocked progress, unavailable/empty libraries and existing linking
confirmation/unlink controls. Actual account progress requires Steam privacy
settings to permit access; never claim fixture progress is live account data.

## Production rollout, 2026-10-16 UTC

- Application commit: `39866f6`.
- Promoted deployment: `dpl_GQ2x7QAhZ9kVW2kmipWMUAbdHHyQ`.
- Applied migration: `20261016022904_passport_daily_refresh`.
- Vercel confirmed both cron definitions on the promoted deployment.
- Steam and osu! each completed one real refresh. Repeated calls on the candidate
  and canonical domain claimed zero accounts and made no new provider requests.
- Database checks confirmed unchanged verification timestamps and visibility.
- Anonymous cron requests returned 401 with `no-store`; both emblem assets
  returned 200. Production profile checks passed at 1440, 390 and 320 pixels.
- The tested Steam account's achievement endpoint returned `Profile is not
  public`; its schema returned 49 achievements. Real progress remains unavailable
  until the owner permits access in Steam. The UI does not substitute fixture data.
- Existing maintenance findings remain: dependency audit reports 27 findings
  (22 high), Supabase reports disabled leaked-password protection, and runtime
  logs include a Node `url.parse()` deprecation warning. These are not resolved
  by this feature release; no refresh failure was observed in the final candidate.

Previous production deployment for rollback: `dpl_GnQNsLzWkHEaRNVf6Qtq6YGTQwRF`.
