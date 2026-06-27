# RM-27 osu! Runtime Public Projection Review

RM-27 keeps public projection closed by default.

## What RM-27 Creates

Server-side callback may create:

- `linked_provider_accounts.provider = 'osu'`;
- `linked_provider_accounts.status = 'verified'`;
- `linked_provider_accounts.visibility = 'private'`;
- private `verified_proofs` row with `provider_ownership`;
- proof metadata with conceptual `profile_linked`.

## What Public Projection Exposes

No new public osu! fields are exposed by default.

Existing projection still only allows:

- public Passport allowlist;
- public linked provider allowlist;
- public featured proof allowlist.

Because RM-27 creates osu! provider/proof rows as private, they do not appear on `/id/:slug` unless future work deliberately changes visibility under publish policy.

## Forbidden Public Fields

Do not expose:

- external account id;
- raw `/me` payload;
- token status;
- access token;
- refresh token;
- OAuth code;
- service role key;
- client secret;
- raw metadata;
- rank;
- PP;
- scores;
- best plays;
- beatmap history;
- match history;
- live activity.

## Revoked And Stale

Revoked provider/proof:

- hidden from public projection;
- cannot satisfy publish policy;
- visibility set private.

Stale proof:

- not introduced publicly in RM-27;
- must be explicitly labeled if future work accepts stale display.

## Monetization Boundary

No provider data behind paywall.

RM-27 adds no:

- `/cosmetics`;
- store;
- checkout;
- billing;
- payment;
- subscription;
- inventory purchase;
- proof boost.

## Public Projection Decision

Decision: pass with conditions.

The foundation is safe because it creates private owner-linked data only, keeps public projection allowlisted, and adds tests/source guards against token/raw metadata/rank/tracker leakage.
