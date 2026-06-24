# TryhardNames

## What It Is

TryhardNames is a public gaming identity toolkit with free generators and a private-first Gaming Passport identity layer.

The site currently combines public name/text/symbol tools with a Gaming Passport product surface for players who want a visual, verifiable, shareable gaming resume without exposing accounts by default.

## Current Live Surfaces

- `/` - home page and public generator entry points.
- Public generators - free name, text, symbol, and identity utilities.
- `/gaming-passport` - public Gaming Passport landing page for users and Riot review.
- `/sign-in` - Parent Auth sign-in for the TryhardNames account.
- `/account` - protected private Gaming Passport draft dashboard.
- `/privacy-policy` - public Privacy Policy.
- `/terms-of-service` - public Terms of Service.
- `/sitemap.xml` - public sitemap.

Public generators are free and usable without an account. `/gaming-passport` is public. `/account` requires Parent Auth and manages a private draft. `/id/:slug` public Gaming Passport profiles are not implemented yet.

## Gaming Passport

Gaming Passport is a visual, verifiable, shareable gaming resume.

- It starts as a private draft by default.
- Nothing becomes public without explicit user consent.
- Google Auth is Parent Auth only.
- Riot and Discord are future linked provider accounts.
- League of Legends is a GameAdapter inside RiotProvider.
- No Riot data is live.
- No public profile route is live.

Parent Auth lets a user enter TryhardNames and own a draft. It is never a public proof, badge, or gaming provider.

## Riot Review Status

The Riot project has been registered in Riot Developer Portal and is awaiting Riot confirmation/review.

- Riot integration is pending Riot approval.
- Riot OAuth / Riot Sign On is not live.
- The repo has no production Riot key.
- No Riot API calls are active.
- No Riot data is live in production.

Current support docs:

- `docs/product/RIOT_REVIEW_SUBMISSION_PACK.md`
- `docs/product/RIOT_POLICY_COMPLIANCE_AUDIT.md`
- `docs/product/GAMING_PASSPORT_RIOT_REVIEW_LANDING.md`

## What TryhardNames Does Not Do

- No custom MMR/ELO.
- No OP.GG alternative.
- No tracker replacement.
- No alternative ranking system.
- No live-game advantage.
- No in-game recommendations.
- No match-history dumping.
- No hidden-player de-anonymization.
- No public profile without consent.
- No selling Riot data.
- No Riot data behind a paywall.

## Architecture Boundaries

- Parent Auth = TryhardNames account login only.
- Linked Provider = external account connected after sign-in.
- GameAdapter = game-specific proof normalization under a provider.
- VerifiedProof = normalized, source-backed proof.
- PublicProjection = allowlisted output only.

## Development

Install dependencies:

```bash
npm ci
```

Run the web app:

```bash
npm run dev
```

Validate the repo:

```bash
npm run lint
npm test
npm run test:auth
npm run test:passport
npm run test:seo
npm run build
```

Local Supabase workflow:

```bash
npm run db:start
npm run db:reset
npm run test:db
npm run db:stop
```

Database commands run local Supabase only. Do not connect to remote Supabase for tests.

## Worktree Workflow

Local convention:

- `TryhardNames-main-clean` = central main control folder.
- `TryhardNames-<task>` = temporary worktree per PR.
- Remove worktrees after merge.
- Do not work in old worktrees.

Example:

```bash
git fetch origin
git worktree add "../TryhardNames-new-task" -b docs/example origin/main
```

## Safety Rules

- Do not commit secrets.
- Do not add env files.
- Do not expose service role keys.
- Do not implement Riot OAuth until Riot approval.
- Do not add Riot keys/tokens.
- Do not touch Supabase remote without explicit approval.
- Do not change migrations/RLS without a dedicated PR.
- Do not activate gaming providers in docs-only PRs.

## Roadmap Snapshot

Completed:

- Security/reproducibility.
- Domain foundation.
- Local schema foundation.
- Parent Auth/private draft.
- Riot site verification.
- Gaming Passport landing.
- Riot review submission pack.
- Riot policy compliance audit.

Waiting:

- Riot confirmation/review.

Next before Riot runtime:

- README and public policy alignment.
- Optional Riot response playbook/screenshots.
- Privacy/terms maintenance.

After Riot approval:

- RSO design.
- Server-side token storage.
- Unlink/revoke.
- RiotProvider runtime.
- LeagueOfLegendsAdapter.
- Proof sync.
- Public projection review.

No dates are promised. Riot runtime work should wait until approval and next steps are clear.
