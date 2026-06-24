# Gaming Passport Riot Review Landing

PR6 adds a public `/gaming-passport` landing page for review context. It explains Gaming Passport as a visual, verifiable, shareable gaming resume while keeping all existing public generators usable without an account.

## Review Alignment

- Riot integration is described as pending approval.
- Riot Sign On is described as a future explicit linked-provider flow.
- League of Legends remains a GameAdapter under RiotProvider.
- Google remains Parent Auth only and is not represented as a public proof.
- Discord and Riot remain future linked provider accounts, not Parent Auth login methods.

## Safety And Non-Goals

This landing does not implement Riot OAuth, Discord OAuth, Riot API calls, public profile publishing, slugs, providers, proofs, Supabase changes, secrets, migrations, Vercel changes, or Google Cloud changes.

The page explicitly states that TryhardNames is not an OP.GG alternative and does not provide custom MMR, ELO calculations, alternative rankings, live-game recommendations, hidden-player data, match-history dumping, Riot data resale, or public profiles without consent.

## Monetization Boundary

The landing states that Riot-owned data and assets are not monetized directly. Future monetization, if any, is limited to TryhardNames-owned cosmetics, themes, borders, and animations.

## Legal Notice

The visible page includes the Riot Games notice required by Riot developer policy, using the product name `TryhardNames Gaming Passport`.
