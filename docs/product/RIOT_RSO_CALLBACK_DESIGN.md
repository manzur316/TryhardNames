# Riot RSO Callback Design

This is a design-only document for a future approved Riot runtime PR.

No callback route is implemented in PR18. No OAuth redirect is implemented in PR18. No RSO call is implemented in PR18.

## Proposed Route Shape

Future route proposal:

- `/auth/riot/callback`

This route name is not implemented in PR18. It is a placeholder for design discussion and approval review only.

## Design Inputs

The future callback should use PR16 provider runtime foundation:

- `provider_connection_intents`;
- `provider_callback_states`;
- `provider_audit_events`;
- blocked provider sync job scaffolding;
- owner-scoped repository functions;
- token vault boundary.

## State And Nonce Validation

The future callback must:

- require a valid Parent Auth owner session or server-owned continuation mapped to the same owner;
- load the provider connection intent by owner, passport, provider, and state hash;
- reject missing state;
- reject expired state;
- reject consumed state;
- reject replayed state;
- reject provider mismatch;
- mark state consumed exactly once;
- record audit events for accepted and rejected callbacks;
- return safe owner-facing errors without leaking provider payloads.

## Session Owner Matching

The future callback must verify:

- current Parent Auth owner matches the provider connection intent owner;
- passport belongs to that owner;
- provider is `riot`;
- the account is not already linked to a conflicting owner;
- suspended or revoked account states cannot silently become verified.

## Error Cases

Expected safe errors:

- denied consent;
- missing authorization code;
- missing state;
- expired state;
- replayed state;
- provider mismatch;
- owner mismatch;
- passport mismatch;
- account already linked;
- approval missing;
- callback URL not approved;
- provider runtime not configured;
- token exchange unavailable;
- revoke/unlink required before relink.

Errors must not expose tokens, raw provider payloads, internal account IDs, or secret configuration.

## Token Handling Design

Future token handling must be server-side only:

- exchange code server-side;
- encrypt token material before storage;
- never return token material to browser;
- never log token material;
- store token metadata separately from public projection;
- track token version and status;
- support revocation/deletion;
- record audit events.

PR18 does not implement token exchange, token storage runtime, or token encryption runtime.

## Revoke And Unlink Design

Future revoke/unlink behavior:

- owner requests unlink/revoke from private account surface;
- server validates owner and passport;
- linked provider is marked revoked;
- provider-derived proofs are revoked or excluded from public projection;
- provider token vault entry is revoked/deleted according to accepted retention rules;
- audit event is recorded;
- public serving no longer treats the provider as verified.

The public projection must stop using revoked provider data immediately after revoke/unlink succeeds.

## Non-Goals In PR18

- No callback route.
- No Riot OAuth redirect.
- No OAuth authorize URL.
- No Riot API call.
- No token exchange.
- No token encryption runtime.
- No env vars.
- No secrets.
- No provider activation.
- No public Riot data.

