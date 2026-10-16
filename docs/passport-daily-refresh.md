# Daily Passport refresh

Steam and osu! refresh automatically once per UTC calendar day. Vercel invokes
the protected routes at 08:00 and 08:30 UTC respectively. A database claim makes
duplicate invocations harmless. Failures retain the previous snapshot and wait
until the next day; there are no immediate API retries.

Production-only configuration:

- `CRON_SECRET`: random server-side secret of at least 32 characters.
- `PASSPORT_DAILY_REFRESH_ENABLED=true`.
- Existing provider configuration and restricted writer credentials are reused.

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
OpenID assertions are not stored. Steam remains private to the Passport owner.

osu! uses an application token with only `public` scope, the linked immutable
account ID and its saved ruleset. It updates existing display statistics, not
the OAuth ownership proof or the user's publication selection.

Roblox is not part of this scheduler: its current identity-only flow revokes
tokens after verification. Bungie and Battle.net remain local prototypes.

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
