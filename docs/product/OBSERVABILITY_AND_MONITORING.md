# Observability And Monitoring

RM-24 defines the monitoring checklist for a controlled launch. It does not configure Sentry, Datadog, external telemetry, Vercel, Supabase remote settings, or any third-party monitoring service.

## Currently Available Signals

Use existing project and platform evidence:

- CI result.
- Build result.
- Vercel deploy result, checked manually by the owner if applicable.
- Browser console errors during smoke.
- HTTP status for public routes.
- Supabase RPC responses during authorized local/staging smoke.
- Public unavailable behavior for `/id/nonexistent-slug`.
- Report submission success/failure on a valid profile fixture.
- Static asset load status from browser devtools or network panel.

## Manual Monitoring Checklist

During launch review and immediately after any later launch execution, watch:

- build/deploy result;
- route-level 404/500 spikes;
- runtime errors;
- auth errors;
- Supabase RPC errors;
- public projection failures;
- publish command failures;
- report submission failures;
- client console errors;
- failed asset loads;
- unusual report volume;
- provider runtime should remain inactive;
- store/payment routes should remain absent.

## Feature-Specific Signals

### Public Generators

- home and generator route load status;
- Copy Name still works in manual smoke;
- no auth requirement on public generators.

### Account And Saved Names

- signed-out `/account` remains protected;
- Parent Auth sign-in works in authorized smoke;
- Saved Names load with account state or local fallback;
- no destructive sync behavior.

### Gaming Passport Public Profile

- unavailable slugs do not leak private state;
- policy-valid fixture renders only allowlisted public projection;
- no owner id, email, raw metadata, private Saved Names, tokens, or external account ids appear;
- anti-tracker/no-MMR/no-live-game-advice copy remains visible.

### Reports

- report dialog opens only on valid public profiles;
- report submission returns safe success or safe failure;
- no report id, owner id, Passport id, or moderation state is exposed;
- no public report list or report admin UI exists.

### Cosmetics

- cosmetics remain visual-only;
- Obsidian Pulse remains a free foundation preview;
- no prices, checkout, inventory purchase, subscription, or store copy appears in runtime.

### Providers

- Riot runtime remains gated;
- Discord, osu!, Steam, and Supercell / Clash remain future readiness candidates;
- no provider OAuth URLs;
- no provider API calls;
- no provider token storage usage.

## Future Observability Improvements

Future work may add:

- structured client error reporting;
- Supabase RPC dashboard review;
- rate-limit/error alerting for reports;
- public profile availability dashboards;
- deploy smoke automation;
- moderation queue metrics;
- provider-runtime-specific monitoring only after a provider readiness pack exits with go criteria.

These improvements are not implemented by RM-24.
