# osu! Public Profile Rollback Plan

## Scope

This rollback plan covers the RM-33 and RM-34 osu! public profile projection path.

RM-34 is not a production launch. It adds QA docs/tests and a minimum public renderer/mapper fix for allowlisted osu! DTOs.

## Local Rollback

To roll back RM-34 locally:

1. Revert the RM-34 PR.
2. Re-run source guards and tests.
3. Confirm `/id/:slug` no longer renders the RM-34 osu! public DTO changes.

Expected local rollback impact:

- RM-34 docs and tests are removed.
- The public renderer returns to the pre-RM-34 behavior.
- No provider secrets, tokens, or remote services are affected.

## Production Rollback

No production rollback is required by RM-34 because this PR does not deploy or enable production osu! public projection.

RM-35 keeps production no-go and adds readiness rollback criteria. If staging fails, disable staging osu! runtime, disable the staging public projection allowlist, revert the staging deploy if needed, keep affected owner data private or revoked, and re-run the staging smoke before another go/no-go attempt.

If a later RM enables production and a public profile issue is found:

1. Disable the production osu! public projection allowlist.
2. Keep owner linking and private proof state intact.
3. Revoke or hide public-serving eligibility for affected osu! proofs.
4. Verify `/id/:slug` no longer includes osu! provider/proof DTOs.
5. Confirm no raw ids, metadata, token state, or profile URLs remain in public output.
6. Publish a follow-up security/trust-safety fix before re-enabling.

If secret exposure is suspected, rotate the affected osu! OAuth app secret and relevant server-side credentials through the environment owner process. Do not print or commit rotated values.

## Rollback Verification

After rollback, verify:

- no public osu! proof appears by default;
- private, stale, or revoked osu! proofs do not appear;
- raw external account id does not appear;
- owner id does not appear;
- linked provider account id does not appear;
- proof id does not appear;
- token state and metadata do not appear;
- raw API or OAuth payloads do not appear;
- no direct osu! browser API call exists;
- no rank, PP, score, match-history, beatmap, best-play, or live tracker appears.

## Non-Goals

- No data deletion from local owner records unless a later incident response explicitly requires it.
- No remote Supabase changes in RM-34.
- No Vercel changes in RM-34.
- No production launch in RM-34.
- No remote Supabase changes in RM-35.
- No Vercel changes in RM-35.
- No production launch in RM-35.
