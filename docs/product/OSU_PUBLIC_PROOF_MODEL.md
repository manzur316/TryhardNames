# RM-26 osu! Public Proof Model

RM-26 proposes a conceptual public proof shape for osu!. It does not create runtime, OAuth implementation, callback route, API calls, token storage implementation, env vars/secrets, public provider linking UI or DB migrations.

The proof model is conceptual.

## Goal

Represent "this TryhardNames owner linked this osu! account" without turning TryhardNames into:

- ranking alternative;
- tracker/ranking clone;
- match-history dump;
- live-game advice tool;
- hidden-player inference product;
- excessive polling surface;
- fake proof/rank system.

## Conceptual Public Shape

Example conceptual payload, not code:

```json
{
  "providerId": "osu",
  "displayName": "osu!",
  "externalUsername": "...",
  "profileUrl": "https://osu.ppy.sh/users/...",
  "verifiedAt": "...",
  "proofs": [
    {
      "type": "profile_linked",
      "label": "Linked osu! account",
      "source": "osu",
      "observedAt": "...",
      "visibility": "public"
    }
  ]
}
```

## Allowlisted Fields

Allowed for future public projection only if RM-27 implements consent and publish policy:

- `providerId`;
- `displayName`;
- `externalUsername`;
- `profileUrl`;
- `verifiedAt`;
- `proofs[].type`;
- `proofs[].label`;
- `proofs[].source`;
- `proofs[].observedAt`;
- `proofs[].visibility`.

public projection remains allowlisted.

## Excluded Fields

Never public by default:

- external account id;
- owner id;
- internal linked provider account id;
- OAuth code;
- access token;
- refresh token;
- token expiration;
- token status internals;
- raw API response;
- raw OAuth response;
- email or private account fields;
- friend list;
- chat data;
- forum write/read state;
- beatmap history dump;
- score history dump;
- live activity feed;
- anti-cheat or restriction internals;
- unreviewed rank/PP/stat badges.

## Proof Semantics

`profile_linked` means:

- the TryhardNames owner completed an official OAuth ownership flow;
- TryhardNames observed the authenticated osu! profile;
- the public proof only states account linkage.

`profile_linked` does not mean:

- official osu! endorsement;
- staff status;
- verified skill tier;
- live rank;
- current availability;
- no account restrictions;
- no future username change;
- permission to sell osu! data or assets.

## Freshness

`verifiedAt` and `observedAt` must be shown as timestamps, not live status.

If proof becomes stale:

- display only if RM-27 accepts stale label;
- otherwise hide until refreshed.

If proof becomes revoked:

- remove from public projection;
- do not satisfy publish policy;
- do not keep a visible badge.

## Anti-Tracker Guardrails

RM-27 must not add:

- ranking alternative;
- custom rank/PP scoring;
- tracker/ranking clone;
- match-history dump;
- live-game advice;
- hidden-player inference;
- polling every minute for each user;
- rank badges that imply official osu! status without source-backed and allowed evidence;
- fake proof/rank.

## Store/Payment Guardrail

No store/payment behavior may depend on osu! proof.

Do not:

- sell osu! proof;
- paywall provider data;
- create premium boosts from osu! data;
- add `/cosmetics` route;
- add checkout, billing or subscriptions tied to provider proof.

## Public Proof Decision

Decision: conditional-go for a minimal `profile_linked` proof only.

Any future performance proof, rank proof, score proof, best-play proof, achievement proof or leaderboard proof requires a separate readiness review.
