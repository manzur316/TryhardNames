# Gaming Passport Data Model

This is a proposed model only. It does not create SQL, views, RPC functions, Supabase projects, migrations, keys, or runtime connections.

## Proposed Entities

1. `gaming_passports`
2. `linked_provider_accounts`
3. `verified_proofs`
4. `passport_featured_proofs`
5. `passport_visibility_settings`
6. `profile_themes`
7. `cosmetics`
8. `cosmetic_unlocks`
9. `passport_equipped_cosmetics`
10. `provider_credentials` or `provider_tokens`, server-side only

## Relational Model

```mermaid
erDiagram
  owners ||--|| gaming_passports : owns
  gaming_passports ||--o{ linked_provider_accounts : has
  linked_provider_accounts ||--o{ verified_proofs : emits
  gaming_passports ||--o{ passport_featured_proofs : selects
  verified_proofs ||--o{ passport_featured_proofs : featured_as
  gaming_passports ||--|| passport_visibility_settings : configures
  gaming_passports ||--o{ passport_equipped_cosmetics : equips
  cosmetics ||--o{ passport_equipped_cosmetics : equipped
  owners ||--o{ cosmetic_unlocks : earns
  cosmetics ||--o{ cosmetic_unlocks : unlocked
  linked_provider_accounts ||--o{ provider_tokens : has_server_secret

  owners {
    uuid id
    string parent_auth_subject
  }

  gaming_passports {
    uuid id
    uuid owner_id
    string slug
    string status
    string alias
    string avatar_url
    datetime created_at
    datetime updated_at
    datetime published_at
    datetime suspended_at
  }

  linked_provider_accounts {
    uuid id
    uuid passport_id
    string provider
    string external_account_id
    string display_name
    string status
    datetime verified_at
    datetime last_synced_at
    datetime stale_at
    datetime revoked_at
  }

  verified_proofs {
    uuid id
    uuid linked_provider_account_id
    string provider
    string game
    string proof_type
    string source_key
    string mode
    string title
    string display_value
    number normalized_value
    string season
    string source
    string verification_method
    string status
    string visibility
    json metadata_safe
    string normalizer_version
    datetime verified_at
    datetime last_synced_at
    datetime stale_at
    datetime revoked_at
  }

  passport_featured_proofs {
    uuid passport_id
    uuid verified_proof_id
    number sort_order
  }

  passport_visibility_settings {
    uuid passport_id
    boolean publication_consent
    boolean show_linked_providers
    boolean show_last_updated
  }

  profile_themes {
    string id
    string name
    string status
  }

  cosmetics {
    string id
    string kind
    string name
    string source
  }

  cosmetic_unlocks {
    uuid owner_id
    string cosmetic_id
    string unlock_reason
    datetime unlocked_at
  }

  passport_equipped_cosmetics {
    uuid passport_id
    string cosmetic_id
    string slot
  }

  provider_tokens {
    uuid linked_provider_account_id
    string provider
    string encrypted_secret_ref
    datetime expires_at
    datetime revoked_at
  }
```

## Constraints

Minimum rules for a future migration:

- exactly one `gaming_passports` row per owner;
- `slug` is globally unique when present;
- `UNIQUE(provider, external_account_id)` is global;
- one external provider account cannot belong to two users;
- provider tokens are separate from public data;
- provider tokens are never accessible through frontend reads;
- public reads use an allowlist projection;
- `profile_metadata` or equivalent full JSON blobs are not exposed publicly;
- raw third-party payloads are not exposed publicly;
- timestamps are explicit;
- states are explicit;
- proof normalizers are versioned.

## Gaming Passport

`gaming_passports` is the owner-level object. It stores presentation identity and publication state. It does not store provider tokens, raw payloads, emails, auth providers, or proof payload blobs.

Suggested fields:

- `id`;
- `owner_id`;
- `slug`;
- `status`;
- `alias`;
- `avatar_url`;
- `bio_short`;
- `scene_config`;
- `created_at`;
- `updated_at`;
- `published_at`;
- `unpublished_at`;
- `suspended_at`.

Allowed `status` values:

- `draft_private`;
- `published`;
- `unpublished`;
- `suspended`.

Do not persist `publishable`; calculate it.

## Linked Provider Account

`linked_provider_accounts` stores external account ownership. It is not a proof of achievement by itself.

Suggested fields:

- `id`;
- `passport_id`;
- `owner_id`;
- `provider`;
- `external_account_id`;
- `display_name`;
- `status`;
- `verified_at`;
- `last_synced_at`;
- `stale_at`;
- `revoked_at`;
- `metadata_safe`;
- `created_at`;
- `updated_at`.

Allowed `status` values:

- `pending`;
- `verified`;
- `failed`;
- `stale`;
- `revoked`.

Riot ownership may emit a `provider_ownership` proof. It does not emit a `competitive_rank` proof unless a GameAdapter synchronizes a real game rank.

Discord ownership may emit a `social_verification` proof. It does not emit competitive proofs.

## Verified Proof

`verified_proofs` stores normalized, display-safe, verifiable facts.

Minimum contract:

- `id`;
- `linkedProviderAccountId`;
- `provider`;
- `game`;
- `proofType`;
- `sourceKey`;
- `mode`;
- `title`;
- `displayValue`;
- `normalizedValue` optional;
- `season` optional;
- `source`;
- `verificationMethod`;
- `status`;
- `verifiedAt`;
- `lastSyncedAt`;
- `staleAt`;
- `revokedAt`;
- `visibility`;
- `metadataSafe`;
- `normalizerVersion`.

Allowed `proofType` values:

- `social_verification`;
- `provider_ownership`;
- `competitive_rank`;
- `competitive_rating`;
- `progression_achievement`;
- `title_or_completion`.

Allowed `status` values:

- `current`;
- `stale`;
- `revoked`.

Manual declared data stays outside `verified_proofs`.

## Featured Proofs

`passport_featured_proofs` stores owner ordering for public highlights.

Rules:

- only proofs that pass public display policy can be featured;
- revoked proofs never display;
- stale proofs retain `status: "stale"` if displayed;
- max visible proofs defaults to 6;
- future UI may recommend 4 to 6, but the domain cap is 6.

## Visibility Settings

`passport_visibility_settings` separates owner preference from Passport state.

Suggested fields:

- `passport_id`;
- `publication_consent`;
- `show_linked_providers`;
- `show_last_updated`;
- `proof_visibility_defaults`;
- `created_at`;
- `updated_at`.

Publication consent is required for `publishable`.

## Token Storage

`provider_tokens` or `provider_credentials` is server-side only.

Rules:

- no frontend read path;
- no public projection;
- no token in `metadataSafe`;
- no raw access token, refresh token, API token, client secret, bearer string, or authorization header in profile JSON;
- secrets must be encrypted or referenced through a server secret manager in a future implementation.

## Projections

### Owner Projection

Owner projection is for authenticated dashboard reads.

It may include:

- draft Passport fields;
- linked provider account status;
- sync status;
- private recommendations;
- local preview settings;
- publication readiness reasons;
- owned cosmetics;
- provider connection management state.

It must not expose raw tokens to the browser.

### Public Projection

Public projection is the only source for `/id/:slug`.

It may include:

- slug;
- alias;
- avatar;
- public scene config;
- verified linked provider summaries;
- featured proofs that pass policy;
- equipped cosmetics;
- last update timestamp;
- share metadata.

It must exclude:

- Parent Auth provider;
- email;
- private owner id;
- provider tokens;
- raw payloads;
- private metadata;
- full profile metadata;
- local dashboard recommendations;
- empty placeholders.

### Publishability Projection

Publishability projection is a private dashboard calculation.

It returns:

- `publishable`;
- missing requirements;
- slug validation;
- verified provider count;
- publication consent state;
- suspension state.

It is not a persisted Passport state.

## Future Migration Shape

A future Supabase PR should be additive and reviewable:

- one migration for base tables and constraints;
- one migration for RLS and owner policies;
- one migration for public projection or RPC;
- one migration for provider token storage if needed;
- tests or SQL comments proving public allowlist behavior.

This PR intentionally ships no SQL.
