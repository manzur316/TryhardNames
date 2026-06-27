# RM-26 osu! Trust, Safety And Privacy Review

This review covers osu! as a future linked provider candidate. It is readiness-before-runtime and design-only.

RM-26 adds no osu! runtime, no OAuth implementation, no callback route, no token storage implementation, no env vars/secrets, no DB migrations, no provider linking UI, no store/payment and no `/cosmetics`.

## Impersonation Risk

Risk:

- a user could type or claim an osu! username they do not own;
- similar usernames may confuse viewers;
- profile URLs can be misread as endorsement or official status.

Required controls:

- ownership must use Authorization Code + `/me`;
- never accept manually typed profile URL as proof;
- public copy must say "Linked osu! account";
- no official endorsement language;
- report category must support fake proof/rank and impersonation.

## Harassment And Doxxing Risk

Risk:

- exposing an osu! username/profile URL can connect identities across communities;
- osu! profiles may include user-supplied public profile data;
- public Passport viewers may use provider links for harassment.

Required controls:

- explicit consent before showing osu! publicly;
- owner can unlink and unpublish;
- report abuse integration;
- takedown/privacy request path;
- avoid location/country/social fields unless separately approved.

## Public Profile Exposure

Public proof should be minimal:

- `osu!` display label;
- username/display name;
- profile URL;
- verification timestamp;
- `profile_linked` proof label.

Do not expose:

- external account id by default;
- friends;
- chat/forum data;
- score/match-history dump;
- raw provider payload;
- hidden/private fields;
- token status internals.

public projection remains allowlisted.

## Account Unlink And Deletion

Future RM-27 unlink must:

- revoke token when possible;
- disconnect local provider account;
- remove public proof;
- stop sync;
- preserve safe audit metadata without secrets;
- support user deletion/privacy request handling in TryhardNames docs.

If the user deletes or changes data in osu!, TryhardNames must not imply the old proof is current.

## Stale Proof

Risk:

- a previously linked account may be renamed, restricted, disconnected or no longer controlled;
- stale proof may mislead public viewers.

Required controls:

- stale state must be explicit or hidden;
- stale proof must not be silently presented as current;
- revoked proof must never be public;
- failed refresh cannot create fake proof/rank.

## Rate-Limit Abuse

Risk:

- excessive refresh jobs could violate osu! API usage expectations;
- aggressive polling can create tracker behavior.

Required controls:

- cache observations;
- low-frequency refresh only;
- exponential backoff;
- stop sync on repeated failures;
- no live-game advice;
- no hidden-player inference;
- no match-history dump.

## Report Abuse Integration

RM-27 must integrate with existing public profile reports for:

- impersonation;
- fake proof/rank;
- harassment;
- privacy/doxxing;
- misleading official-status claims;
- stale/revoked proof visible publicly.

Moderation tooling must not expose raw provider payloads or tokens to public users.

## Privacy Copy Requirements

Future UI copy must disclose:

- osu! is a linked provider, not Parent Auth;
- linking lets TryhardNames verify the owner controls an osu! account;
- public display is optional and controlled by publish settings;
- unlink removes public osu! proof from TryhardNames;
- osu! profile pages may contain public data managed on osu!;
- TryhardNames does not sell osu! data or proof.

## Provider-Specific Public Disclaimer

Suggested public disclaimer:

```txt
Linked osu! account. Not official osu! endorsement.
```

Use only if the product view needs a visible disclaimer. It must not replace full privacy copy in linking/publish flows.

## Privacy Decision

Decision: conditional-go for RM-27 only if explicit consent, unlink, stale/revoked handling, report abuse integration and public projection allowlist ship with runtime.
