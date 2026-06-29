# RM-36 osu! Staging Configuration / Manual Smoke Results

## Decision

Result classification: full-pass practical staging smoke.

RM-36 executed the osu! staging smoke against isolated staging services after RM-35 production readiness. The smoke covered staging setup, Google Parent Auth, real osu! OAuth callback, private proof creation, owner public visibility controls, published public projection, unlink/revoke, and token non-persistence.

Production remains no-go. RM-36 did not touch production Supabase, production Vercel, production secrets, or production osu! runtime configuration.

## Environment Evidence

- GitHub repo: `manzur316/TryhardNames`.
- `main` source of truth: RM-35 merge `541074a876094f93e05e6df32f158c7d878b6569`.
- `staging` branch: `main` plus one empty deployment trigger commit.
- Staging deployment branch: `staging`.
- Staging deployment status: Ready.
- Staging Supabase project: separate project named `tryhardnames-staging`.
- Staging Supabase ref: `qedsegxdsxehswmkiyvv`.
- Remote production services were not touched.

No real secrets, OAuth codes, OAuth states, JWTs, access tokens, refresh tokens, service role keys, or raw OAuth/API payloads are recorded in this document.

## Smoke Steps Executed

### 1. Local and staging baseline

Passed:

- Local RM-36 baseline tests completed before remote staging actions.
- Staging Vercel deployment from branch `staging` reached Ready.
- Staging Supabase migrations were applied.
- Google Parent Auth returned to the staging URL.
- osu! runtime endpoint responded in staging.

### 2. Real osu! callback

Passed:

- Owner initiated `Connect osu!` from staging `/account`.
- Human authorization completed in osu! browser flow.
- Callback completed successfully.
- Staging database recorded one osu! linked provider account.
- Staging database recorded one osu! verified proof.
- Provider token vault remained empty.

Safe DB summary after callback:

```txt
linked_provider_accounts: provider=osu, status=verified, visibility=private, count=1
verified_proofs: provider=osu, status=current, visibility=private, count=1
provider_token_vault rows: 0
```

### 3. Owner public preference and Passport publish

Passed:

- Owner set osu! proof visibility to public through private `/account` controls.
- Owner published the Gaming Passport and granted publication consent.
- Staging public projection served the osu! provider and proof only after all gates passed.
- Public output used the RM-31/RM-33 allowlist.
- No blocked fields appeared in the public projection checks.

Safe DB summary after publish:

```txt
linked_provider_accounts: provider=osu, status=verified, visibility=public, count=1
verified_proofs: provider=osu, status=current, visibility=public, count=1
gaming_passports: published=1, publication_consent=true
provider_token_vault rows: 0
```

Public projection allowlist observed:

Provider fields:

- `providerId`
- `displayName`
- `externalUsername`
- `profileUrl`
- `verifiedAt`

Proof fields:

- `type`
- `label`
- `source`
- `observedAt`
- `visibility`

Blocked-field checks passed for:

- owner identifiers;
- internal Passport identifiers;
- linked provider account identifiers;
- proof identifiers;
- token fields;
- raw payload fields;
- metadata fields;
- email fields;
- rank, PP, score, match-history, beatmap, best-play, and live tracker fields.

### 4. Unlink / revoke

Passed:

- Owner disconnected osu! from staging `/account`.
- Linked provider account transitioned to revoked/private.
- Verified proof transitioned to revoked/private.
- `revoked_at` was present for the connection and proof.
- Active public osu! connection count returned to zero.
- Active public osu! proof count returned to zero.
- Public projection no longer served osu! provider/proof.
- Provider token vault remained empty.

Safe DB summary after unlink:

```txt
linked_provider_accounts: provider=osu, status=revoked, visibility=private, count=1
verified_proofs: provider=osu, status=revoked, visibility=private, count=1
active_osu_connections: 0
active_osu_proofs: 0
provider_token_vault rows: 0
public projection osu provider/proof counts: 0
```

## Source Guard Result

Passed:

- No production launch.
- No production Supabase changes.
- No production Vercel changes.
- No production osu! runtime activation.
- No secrets committed.
- No OAuth code/state recorded.
- No JWT recorded.
- No access token or refresh token recorded.
- No raw OAuth/API payload recorded.
- No official osu! endorsement claim.
- No rank, PP, score, match-history, beatmap, best-play, or live tracker surface added.
- No `/cosmetics`, store, checkout, billing, or payment surface added.

## Known Follow-Up

Vercel runtime logs showed a non-blocking `express-rate-limit` / `X-Forwarded-For` trust proxy warning during staging requests. The endpoint still responded successfully, and this did not block RM-36. It should be fixed before any production enablement.

Recommended next milestone:

```txt
RM-37 Vercel Runtime Hardening / Trust Proxy
```

## Production Decision

Production remains no-go.

Production must not be enabled until:

- RM-36 evidence is merged;
- Vercel trust proxy/rate-limit warning is resolved;
- production env/callback review is completed;
- owner explicitly approves production go/no-go;
- production rollback is accepted;
- source guards pass again.

## Non-Goals

- No production launch.
- No production secrets.
- No production Supabase.
- No production Vercel.
- No Parent Auth via osu!.
- No refresh-token storage.
- No direct osu! browser API call.
- No `/cosmetics`.
- No store, checkout, billing, or payments.
- No rank, PP, score, match-history, beatmap, best-play, or live tracker.
- No official osu! endorsement claim.
