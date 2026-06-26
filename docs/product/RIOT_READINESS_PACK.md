# Riot Readiness Pack

PR18 prepares Riot readiness, compliance, and implementation-design artifacts. It does not activate Riot runtime.

## Executive Summary

Riot Runtime: blocked.

PR18 is not Riot runtime. It is not Riot OAuth. It does not add Riot Sign On redirects, callback routes, Riot API calls, secrets, env vars, provider activation, or public Riot data.

The repo still has no explicit evidence of Riot production approval, approved RSO scopes, approved callback URLs, production credentials, production Riot key, or product-owner instruction to start Riot runtime. PR19 is the earliest possible Riot runtime PR, and only if explicit approval exists.

## Current Status

- Riot integration is planned and pending approval.
- Riot OAuth / Riot Sign On is not live.
- No OAuth launch.
- No Riot API calls are active.
- No production Riot key exists in the repo.
- No Riot data is live.
- No secrets/env vars are added.
- Provider Runtime Foundation exists, but no provider is live.
- `/id/:slug` remains an allowlisted public projection surface.
- Google remains Parent Auth only.
- Riot remains a future linked provider, not Parent Auth.

## Approval Checklist

Before Riot runtime work can begin, the repo must have explicit evidence for:

- production Riot application approval;
- Riot Sign On approval;
- approved scopes and data categories;
- approved callback URLs;
- approved product metadata and user-facing copy, if Riot requires review;
- approved data use and public display boundaries;
- approved branding/assets usage, if any Riot-owned assets are ever required;
- approved operational plan for revoke, unlink, deletion, token retention, audit, and abuse handling.

Missing approval keeps runtime blocked. Readiness work may continue without secrets, env vars, redirects, or provider calls.

## RSO Callback Design Summary

The future RSO callback must be implemented server-side after approval. PR18 only records the design.

Expected design properties:

- validate provider connection intent from PR16;
- validate owner session and passport ownership;
- validate opaque state hash and nonce;
- reject expired state;
- reject consumed/replayed state;
- reject provider mismatch;
- reject account collision or already-linked account states;
- handle user-denied consent safely;
- write audit events for success and failure;
- never expose tokens to browser code;
- never create public proof data directly from callback completion;
- require a later sync/proof command to produce verified proofs.

No callback route is implemented in PR18.

## Token Retention And Encryption Plan

Future Riot tokens, if approved, must be handled only by server-side code.

Requirements:

- no tokens in browser code;
- no tokens in public projection;
- no tokens in logs;
- encrypted at rest with an approved server-side boundary;
- key rotation plan before runtime;
- token versioning before runtime;
- refresh-token retention period documented before runtime;
- deletion on unlink/revoke where provider rules and product requirements permit;
- revoke attempts audited;
- failed revocation states visible to the owner without leaking secrets;
- no real token storage usage in PR18.

PR16's token vault placeholder remains a schema boundary. PR18 does not make it usable token storage.

## Unlink And Revoke UX Requirements

Future Riot runtime must include owner-controlled unlink and revoke flows before public provider serving is considered complete.

Requirements:

- owner can unlink a Riot linked account;
- owner can revoke provider-derived public serving;
- revoked Riot provider cannot satisfy publish/public serving policy;
- revoked proofs are excluded from public projection;
- token deletion/revoke path is attempted server-side;
- audit event is recorded;
- owner-facing copy explains whether provider data remains unavailable, stale, revoked, or deleted;
- failure state does not expose provider secrets or raw payloads.

No live unlink or revoke flow is added in PR18.

## Provider Adapter Contract Review

Future RiotProvider role:

- own Riot authorization boundary;
- normalize approved Riot account ownership signal;
- expose only approved, minimized fields to proof builders;
- produce provider metadata safe enough for private account surfaces;
- avoid raw provider payloads in public projection;
- never expose external account IDs publicly.

Future LeagueOfLegendsAdapter role:

- depend on RiotProvider;
- normalize only approved League of Legends proof fields;
- model proof freshness and staleness;
- avoid match-history dumps;
- avoid custom MMR/ELO;
- avoid ranking alternatives;
- avoid live-game advice;
- avoid hidden-player or game-session inference.

No RiotProvider or LeagueOfLegendsAdapter runtime is implemented in PR18.

## Public Projection Review Criteria

`/id/:slug` must remain allowlisted.

Public projection must not expose:

- `owner_id` or `ownerId`;
- owner email;
- external Riot account IDs;
- token fields;
- raw provider payloads;
- private metadata;
- private proofs;
- hidden/internal account data;
- private Saved Names;
- unapproved Riot data.

Public projection may only expand in a later PR after approval, adapter design, proof schema, privacy copy, and tests are complete.

## Compliance Guardrails

TryhardNames must not become:

- OP.GG clone;
- tracker;
- match-history dump;
- custom MMR/ELO product;
- ranking alternative;
- live-game advice tool;
- hidden-player de-anonymization surface.

Riot-specific guardrails:

- no Riot OAuth before approval;
- no Riot API calls before approval;
- no production Riot key in repo;
- no Riot data behind a paywall;
- no monetization of Riot data/assets;
- no Riot logos/assets unless policy and approval allow it;
- no League of Legends adapter runtime in PR18.

## Manual Riot Portal Checklist

This checklist is for a human owner. Codex must not execute these steps and must not receive secrets.

- Confirm Riot application review status.
- Confirm whether RSO is approved.
- Confirm allowed scopes.
- Confirm approved callback URLs.
- Confirm product description/copy requirements.
- Confirm data categories allowed for public display.
- Confirm branding/assets restrictions.
- Confirm production key handling process.
- Store credentials only in approved secret managers, never in chat or repo.
- Do not enable production runtime from this readiness PR.

## PR19 Preconditions

PR19 can be Riot Provider Runtime only if all of these are true:

- explicit Riot approval evidence exists;
- approved scopes are documented;
- approved callback URLs are documented;
- token storage implementation plan is accepted;
- unlink/revoke UX is accepted;
- privacy copy is accepted;
- public projection impact is reviewed;
- source guard tests are updated to distinguish design docs from runtime code;
- no product guardrail is weakened.

If any item is missing, PR19 must remain blocked or become another readiness/compliance PR.

## Future Smoke Plan

For a future approved Riot runtime PR:

- `/` loads.
- `/gaming-passport` loads.
- `/account` remains Parent Auth protected.
- Riot connect action appears only when runtime is approved and configured.
- RSO redirect uses only approved callback URL.
- callback rejects missing/expired/replayed state.
- callback rejects wrong owner/passport.
- tokens never appear in browser.
- linked provider can be revoked.
- revoked provider stops public serving.
- `/id/:slug` exposes only allowlisted public projection fields.
- no match history, MMR/ELO, ranking, live-game advice, or hidden-player data appears.

## Rollback Plan

Revert PR18 docs and tests.

No runtime rollback, DB rollback, route rollback, secret rotation, env-var rollback, remote Supabase rollback, Vercel rollback, Google Cloud rollback, or Riot Portal rollback should be required because PR18 is readiness-only.
