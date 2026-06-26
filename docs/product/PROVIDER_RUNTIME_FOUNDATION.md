# Provider Runtime Foundation

PR16 adds the provider-neutral runtime foundation for future linked providers.

No provider is live after this PR. No Discord account linking is live. No Riot account linking is live. The work is intentionally contract, schema, repository, audit, and private status UI foundation only.

## Why This Exists

TryhardNames now has Parent Auth, saved names, private Gaming Passport editing, publish commands, and the public `/id/:slug` allowlisted projection. The next product dependency is a provider-neutral layer that can later support linked providers without hard-coding Discord or Riot into the account model.

This PR creates that layer before any provider-specific launch decision.

## What PR16 Adds

- Provider runtime domain contracts in `providerRuntime.js`.
- Connection intent and callback state lifecycle contracts.
- Replay/expiry guard contracts for future callbacks.
- Token vault envelope contract without live token use.
- Owner-scoped repository scaffolding in `providerRuntimeRepository.js`.
- Local Supabase foundation tables for intents, callback states, token vault placeholder, sync jobs, and audit events.
- Owner-only RLS for user-scoped provider runtime tables.
- Token vault table without authenticated client grants.
- Private `/account` Provider Runtime Foundation panel.
- Source, domain, and DB tests.

## What Remains Not Live

- Discord account linking.
- Riot account linking.
- Provider-specific adapters.
- OAuth redirects or callbacks.
- Riot API calls.
- Discord API calls.
- Real provider token storage usage.
- VerifiedProof sync runtime.
- GameAdapter runtime.
- Public provider linking UI.

Riot remains gated by approval before any Riot runtime work.

## Data And RLS Shape

The local schema adds:

- `provider_connection_intents`
- `provider_callback_states`
- `provider_token_vault`
- `provider_sync_jobs`
- `provider_audit_events`

Every owner-scoped table includes `owner_id` and, where relevant, `passport_id`. RLS is enabled. Authenticated clients can work only with their own intent/callback/sync/audit scaffolding. The token vault table is present as a placeholder and is not selectable, insertable, updateable, or deletable by authenticated clients.

`provider_token_vault.token_ciphertext` is constrained to `null` in PR16. This prevents the foundation from becoming real token storage before a later provider implementation defines server-side encryption, retention, revocation, and operational controls.

## Public Projection Boundary

PR16 does not expand the public `/id/:slug` projection. Public profiles remain allowlisted and must not expose:

- external account IDs
- provider token fields
- private metadata
- raw payloads
- owner IDs
- account emails

## Account UI

`/account` includes a read-only Provider Runtime Foundation panel. It says providers are not live and does not render connection buttons or redirects.

## Next Roadmap Blocks

- PR17: First Provider Decision + Readiness Pack.
- PR18: Discord pilot or Riot readiness.
- PR19+: Riot runtime only if approved.

## Non-Goals

- No Discord OAuth live.
- No Riot OAuth live.
- No Riot API calls.
- No Discord API calls.
- No provider-specific adapter runtime.
- No real token storage usage.
- No provider token exposure.
- No VerifiedProof sync runtime.
- No GameAdapter runtime.
- No Vercel, Google Cloud, Riot Portal, secrets, env vars, or remote Supabase changes.
- No match history, MMR/ELO, ranking alternative, live-game advice, or hidden-player de-anonymization.
