# Passport Cosmetics Foundation

PR21 adds the Passport Cosmetics Foundation for TryhardNames-owned visual identity.

This is not a store, not a payment system, not a purchased inventory system, and not a provider data feature.

## Product Philosophy

Passport Cosmetics are freemium and earned-first.

Cosmetics can style identity.

Cosmetics cannot manufacture proof.

Cosmetics may make a Gaming Passport feel more personal, but they must never change proof truth, provider truth, publication policy, or public projection safety.

## Categories

PR21 defines these categories:

- `core`
- `free`
- `earned`
- `founder`
- `legacy`
- `seasonal`
- `premium_preview`
- `locked`

PR21 actively supports:

- core/free cosmetics;
- earned-ready cosmetics based on internal TryhardNames milestones;
- premium-preview cosmetics through a free foundation preview.

Founder and Legacy are reserved categories. They are not promoted as active public entitlements and are not equipable without a real future unlock policy.

Seasonal is reserved for future release planning.

## Obsidian Pulse

Obsidian Pulse is the foundation preview cosmetic set.

It is:

- free;
- equipable in the private Passport draft;
- TryhardNames-owned;
- visual-only;
- not a purchase;
- not priced;
- not checkout-backed;
- not tied to Riot, Discord, provider data, or proof status.

User-facing copy must keep it clear:

- Foundation preview.
- Visual-only.
- No fake proofs.
- No rank boosts.

## Earned-Ready Cosmetics

PR21 uses internal milestones only:

- `profile_complete`
- `saved_names_collector`
- `slug_claimed`
- `passport_published`
- `identity_builder`

These milestones do not depend on Riot, Discord, external providers, payments, or hidden account data.

Earned cosmetics must stay visual. They cannot imply official verification, skill, rank, MMR, ELO, or provider status.

## Scene Storage

PR21 stores the equipped visual loadout in existing `scene_config`:

```json
{
  "themeId": "theme.obsidian-pulse",
  "equippedCosmeticIds": [
    "border.pulse-frame",
    "background.obsidian-aura",
    "nameplate.pulse-nameplate",
    "effect.soft-glow"
  ]
}
```

No inventory table is added in PR21.

No purchased ownership model is added in PR21.

No payment or billing fields are stored.

## Public Projection

The public `/id/:slug` projection may expose only:

```json
{
  "scene": {
    "themeId": "safe-known-id",
    "equippedCosmeticIds": ["safe-known-id"]
  }
}
```

The public projection must not expose:

- private Saved Names highlights;
- owner id;
- email;
- inventory;
- prices;
- purchase history;
- locked cosmetics;
- raw metadata;
- tokens;
- provider external account ids.

Unknown, reserved, or unsafe cosmetic ids are stripped before public serving.

## Future `/cosmetics`

The future showcase route is:

`/cosmetics`

PR21 documents that route but does not implement it.

The future route should explain cosmetic categories, availability, earned milestones, policy boundaries, and visual previews. It should not be named `/store` for the initial cosmetics line.

## Future Companions

Mascots, pets, companions, and 3D figures are future visual classes.

PR21 does not implement:

- companion runtime;
- pet runtime;
- mascot runtime;
- 3D models;
- Three.js;
- WebGL;
- Rive;
- Lottie;
- animation pipelines;
- companion slots in the equip UI.

Future companion work must remain visual-only and must not imply proof, rank, provider ownership, or Riot/Discord affiliation.

## Prohibited

Passport Cosmetics must not introduce:

- fake proofs;
- fake verified badges;
- fake rank frames;
- proof boosts;
- skill claims;
- official Riot, League of Legends, Valorant, or Discord assets;
- official rank names as cosmetic rarity;
- MMR/ELO visuals;
- ranking alternatives;
- match history;
- tracker behavior;
- live-game advice;
- hidden-player de-anonymization;
- Riot data behind a paywall.

## PR22 Trust/Safety Follow-up

PR22 adds the trust/safety layer that broader cosmetic distribution needs before future `/cosmetics`, inventory, payments, or pets/companions work.

PR22 defines:

- public profile report intent;
- cosmetic abuse policy;
- blocked/reserved visual identity terms;
- impersonation rules;
- takedown/suspension/privacy runbook;
- report storage that is private and not publicly readable.

Cosmetic reports include `offensive_cosmetic` and `fake_proof_or_rank`. These report categories do not activate a store, `/cosmetics`, payments, inventory, pets/companions runtime, or provider runtime.

## PR21 Non-Goals

PR21 does not implement:

- cosmetics store;
- checkout;
- payments;
- Stripe;
- MercadoPago;
- webhooks;
- purchased inventory;
- subscriptions;
- coupons;
- marketplace;
- loot boxes;
- gacha;
- user-uploaded cosmetics;
- creator marketplace;
- `/cosmetics`;
- pets/companions runtime;
- 3D animation runtime;
- Riot OAuth;
- Riot API calls;
- Discord OAuth;
- provider runtime activation.

## Next

Future cosmetics work should follow this order:

1. Trust/safety and privacy review.
2. `/cosmetics` showcase route.
3. Earned unlock policy hardening.
4. Optional inventory model only after product and payment boundaries are approved.
5. Companion/3D exploration only after visual safety and performance review.
