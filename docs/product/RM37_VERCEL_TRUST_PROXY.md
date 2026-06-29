# RM-37 Vercel Runtime Hardening / Trust Proxy

## Objective

RM-37 fixes the non-blocking staging runtime warning found during RM-36: requests behind Vercel include forwarded client IP headers, while Express was running with the default `trust proxy` setting.

The goal is to make rate limiting work consistently behind Vercel without weakening local development defaults or changing provider behavior.

## Scope

- Add an API trust-proxy resolver.
- Default to one trusted proxy hop when running on Vercel.
- Keep local development conservative by default.
- Allow explicit operator override through `TRUST_PROXY`.
- Apply the setting before routes and rate limit middleware are registered.
- Add unit coverage for Vercel/default/override behavior.

## Non-goals

- No Supabase changes.
- No OAuth changes.
- No osu! flow changes.
- No Riot runtime work.
- No production go/no-go decision.
- No secrets or environment values committed.

## Expected Result

On Vercel, Express should use a trust-proxy value of `1`, allowing `express-rate-limit` to evaluate client IP information without the RM-36 forwarded-header warning.

Outside Vercel, the default remains `false` unless `TRUST_PROXY` is set explicitly.

## Validation

Run:

```bash
npm run test --prefix apps/api
npm run lint --prefix apps/api
npm test
npm run build
```

CI should pass `verify` and `database`.

## Follow-up

After merge, staging should be redeployed and `/api/v1/integrations/osu` should be hit once to confirm the previous forwarded-header warning no longer appears in Vercel runtime logs.
