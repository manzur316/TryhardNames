# Riot Review Submission Pack — TryhardNames Gaming Passport

## Current public URLs

- Production site: https://tryhardnames.com
- Gaming Passport landing: https://tryhardnames.com/gaming-passport
- Sign in: https://tryhardnames.com/sign-in
- Account draft: https://tryhardnames.com/account

Production smoke was validated from this environment on June 24, 2026. Requests to `https://tryhardnames.com` canonicalized to `https://www.tryhardnames.com`, and the public routes listed above loaded without Vercel Deployment Protection or a 404.

## Product summary

TryhardNames Gaming Passport is a visual, verifiable, shareable gaming résumé for players who want to show verified gaming identity proofs without exposing accounts by default.

## Current live behavior

- Public generators are free and usable without an account.
- `/gaming-passport` is public.
- Google Auth is Parent Auth only.
- `/account` creates and manages a private Gaming Passport draft after Parent Auth sign-in.
- No public profile publishing is active in this PR scope.
- Riot integration is not live.
- Discord integration is not live.

## Planned Riot integration

- Riot integration is pending Riot approval.
- After approval, users will explicitly link Riot through Riot Sign On.
- Riot will be a linked provider account, not Parent Auth.
- League of Legends lives inside `RiotProvider` as `LeagueOfLegendsAdapter` / GameAdapter.
- Planned League of Legends proofs:
  - Riot account ownership
  - Riot ID display
  - Ranked Solo/Duo standing
  - Ranked Flex standing
  - sync timestamp and source

## Data usage

- Riot data will only be accessed after Riot approval and explicit user authorization.
- Only approved fields and proofs will be shown publicly.
- Tokens will stay server-side when providers are implemented.
- The public page will use an allowlist.
- No hidden player data.
- No de-anonymization.
- No selling Riot data.
- No Riot data behind a paywall.

## What TryhardNames does not do

- No custom MMR or ELO.
- No OP.GG alternative.
- No tracker replacement.
- No alternative ranking system.
- No live-game advantage.
- No in-game recommendations.
- No match-history dumping.
- No hidden player de-anonymization.
- No public profile without consent.
- No Riot assets/logos unless later approved by policy.

## Monetization boundary

- Riot-owned data and assets are not monetized directly.
- Public generators remain free.
- Any future monetization is limited to TryhardNames-owned cosmetics, themes, borders, and animations.

## Privacy and user control

- Private draft by default.
- Publish is explicit.
- Provider and proof visibility are controlled by the user.
- Unlink and revoke flows are planned before provider launch.
- The public page only shows approved fields and proofs.

## Auth/provider model

- Google = Parent Auth Account.
- Riot = future linked provider account.
- Discord = future linked provider account.
- League of Legends = GameAdapter inside `RiotProvider`.
- League of Legends is not a standalone provider.

## Legal notice

The visible Gaming Passport landing includes this Riot Games notice:

> TryhardNames Gaming Passport is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.

## Smoke checklist

- [x] `/gaming-passport` public
- [x] `/sign-in` Google visible
- [x] `/account` protected
- [x] public generators still public
- [x] no Riot OAuth button
- [x] no Discord OAuth button
- [x] no fake Riot data
- [x] no Riot assets/logos
- [x] SEO/canonical checked
- [x] sitemap checked
- [x] build/lint/tests passed

## Smoke results

### Local

- Local dev server was validated at `http://127.0.0.1:3002` because port `3000` was already occupied by another worktree.
- `/gaming-passport` loaded without login.
- `Create your private draft` navigated to `/sign-in`.
- `See how it works` scrolled to the internal `#how-it-works` section.
- `/sign-in` showed `Continue with Google` and did not show Riot or Discord login buttons.
- `/account` redirected to `/sign-in?returnTo=%2Faccount` without a session.
- `/auth/callback` loaded a callback state and did not 404.
- `/` and `/stylish-text-generator` remained public.
- Desktop and mobile navigation included `Gaming Passport`.
- Mobile viewport at 375px had no horizontal overflow.
- `/sitemap.xml` contained `/gaming-passport`.

### Production

- `https://tryhardnames.com/gaming-passport` redirected to `https://www.tryhardnames.com/gaming-passport` and loaded the Gaming Passport landing.
- The visible Riot legal notice was present.
- `https://tryhardnames.com/sign-in` redirected to `https://www.tryhardnames.com/sign-in`, showed `Continue with Google`, and did not show Riot or Discord login buttons.
- `https://tryhardnames.com/account` redirected to `https://www.tryhardnames.com/sign-in?returnTo=%2Faccount` without a session.
- `https://tryhardnames.com/auth/callback` loaded and did not 404.
- `https://tryhardnames.com/stylish-text-generator` remained public.
- `https://tryhardnames.com/sitemap.xml` contained `/gaming-passport`.

## Open risks

- Riot provider runtime is not implemented yet.
- Riot OAuth cannot be tested until approval and client credentials exist.
- Production deployment should be checked after each future merge if Vercel deploy timing delays occur.
