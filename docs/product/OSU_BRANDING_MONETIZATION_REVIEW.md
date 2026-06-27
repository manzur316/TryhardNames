# RM-26 osu! Branding And Monetization Review

This review covers branding/assets/monetization constraints for a future osu! linked provider. It is readiness-before-runtime and design-only.

RM-26 adds no osu! runtime, no OAuth implementation, no callback route, no token storage implementation, no env vars/secrets, no store/payment, no checkout, no billing and no `/cosmetics`.

## Branding Decision

Default posture:

- use text label `osu!`;
- do not use osu! logos/assets unless official permission is confirmed;
- do not use osu! screenshots, profile art, beatmap art or marks as decorative assets by default;
- do not imply endorsement, partnership, certification, rank verification or official review;
- keep TryhardNames visual identity separate from osu! proof.

Acceptable conceptual text:

```txt
Linked osu! account
```

Suggested disclaimer:

```txt
Not official osu! endorsement.
```

## Assets

No osu! assets unless allowed.

Before RM-27 uses any asset:

- identify official asset source;
- verify license/brand rules;
- document allowed sizes/context;
- add tests preventing asset misuse if asset use is approved.

If no permission is explicit, use text-only display.

## Monetization

Do not:

- paywall provider data;
- sell osu! proof;
- sell osu! badges;
- sell rank/status claims;
- create premium boosts from osu! data;
- make provider proof more visible because a user paid;
- make osu! linking required for a store;
- tie checkout, billing, subscription or inventory purchase to osu! proof.

No store/payment work is approved by RM-26.

## Badges And Status Claims

Do not create badges that imply official osu! rank/status unless:

- official source field is reviewed;
- public display is allowed;
- stale/revoked behavior is defined;
- rank/status copy is source-backed;
- no fake proof/rank can be created by cosmetics or payments.

For RM-27, only `profile_linked` is conditionally acceptable.

## Cosmetics Boundary

TryhardNames cosmetics can style the Passport shell but cannot:

- manufacture osu! proof;
- change proof state;
- make stale proof look current;
- imply official osu! rank;
- use osu! assets;
- create provider-data monetization.

RM-26 adds no `/cosmetics`.

## Branding/Monetization Decision

Decision: conditional-go for text-only linked-provider display in RM-27.

Any osu! asset usage, official-looking badge, rank/status claim, store/payment tie-in or provider-data monetization is no-go until separate official review approves it.
