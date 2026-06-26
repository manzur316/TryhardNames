# Provider Readiness Checklist

This checklist applies before any linked provider becomes live.

## Approval And Legal Status

- Provider approval or legal clearance is documented.
- Allowed scopes are documented.
- Callback URLs are approved or explicitly marked design-only.
- Provider branding rules are reviewed.
- Monetization boundaries are reviewed.
- For Riot, approval must be explicit before runtime begins.

## Data Minimization

- Requested scopes are minimal.
- Data categories are listed before implementation.
- Public projection fields are allowlisted.
- Raw provider payloads are not public.
- External account IDs are not public.
- Provider private metadata is not public.

## Token Storage Readiness

- Token storage design is server-side only.
- Encryption and key management are documented before runtime.
- Refresh token retention is documented.
- Token rotation is documented.
- Token deletion and revocation are documented.
- Browser code never receives provider secrets.

## Revocation And Unlink

- Users can unlink a provider.
- Users can revoke provider-derived public serving.
- Revoked providers cannot satisfy public serving policy.
- Deletion behavior is documented.
- Failure states are understandable to users.

## Privacy Copy

- Google remains Parent Auth only.
- Discord/Riot are future linked providers.
- Provider data categories are visible in privacy copy before launch.
- Public sharing requires explicit user consent.
- Public profile copy does not imply official endorsement.

## Audit Trail

- Link attempt is auditable.
- Callback completion is auditable.
- Unlink/revoke is auditable.
- Sync job creation is auditable.
- Failed provider events are auditable.
- Audit data avoids raw provider payloads and secrets.

## Rate Limits And Abuse Handling

- Provider rate limits are documented.
- Retry and backoff behavior is documented.
- Abuse and spam controls are documented.
- Replay protection exists for callback state.
- Expired/consumed state is rejected.

## Public Projection Review

- `/id/:slug` remains allowlisted.
- No owner ID, email, token, raw payload, private metadata, or external account ID is public.
- Provider display visibility is respected.
- Private proofs are excluded.
- Revoked providers/proofs are excluded.

## Product Guardrails

- No OP.GG clone.
- No tracker.
- No match-history dump.
- No custom MMR/ELO.
- No ranking alternative.
- No live-game advice.
- No hidden-player de-anonymization.
- No Riot data behind a paywall.

## Go / No-Go Gate

Provider runtime can move forward only when each checklist section is either complete or has an explicitly accepted owner decision. If approval is missing, the only safe next step is readiness work.
