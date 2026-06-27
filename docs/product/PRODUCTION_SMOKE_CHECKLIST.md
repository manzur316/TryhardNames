# Production Smoke Checklist

This checklist is read-only. It must not require secrets, provider tokens, production credentials, remote configuration changes, deploy execution, or write access to external services.

## Evidence Format

For each item record:

- route or flow;
- environment;
- timestamp;
- expected result;
- actual result;
- screenshot or terminal output when useful;
- severity if failed;
- go/no-go decision;
- owner initials.

## Public Route Smoke

| Route | Expected result | Failure severity | Rollback/block decision | Evidence |
| --- | --- | --- | --- | --- |
| `/` | Home loads, navigation works, no console-blocking runtime error. | Critical | Block launch if unavailable. | Screenshot plus HTTP status. |
| `/gaming-passport` | Landing loads and keeps private-first/provider-not-live copy. | High | Block if missing or misleading. | Screenshot plus copy spot-check. |
| `/sign-in` | Sign-in page loads without Riot/Discord/osu!/Steam/Supercell login buttons. | High | Block if auth surface is broken or provider login appears. | Screenshot. |
| `/sign-up` | Sign-up page loads and remains Parent Auth oriented. | High | Block if broken. | Screenshot. |
| `/account` signed out | Redirects/protects account surface. | High | Block if private dashboard is public. | Redirect/status evidence. |
| `/id/nonexistent-slug` | Shows generic unavailable behavior without leaking profile state. | High | Block if private state is disclosed. | Screenshot. |
| `/gamer-names/pro` | Public generator route loads and Copy Name remains usable. | Medium | Block only if route is unavailable or core generator action is broken. | Screenshot. |
| `/roblox-names/cool` | Public generator route loads and Copy Name remains usable. | Medium | Block only if route is unavailable or core generator action is broken. | Screenshot. |
| `/valorant/sweaty` | Public dynamic generator route loads and does not imply Riot runtime. | Medium | Block if unavailable or provider/runtime copy appears. | Screenshot. |
| `/sitemap.xml` | Sitemap returns XML and public pages remain represented. | Medium | Block if malformed or missing critical public routes. | HTTP output. |
| `/robots.txt` | Robots file returns expected crawl policy. | Medium | Block if missing or malformed. | HTTP output. |

## Authorized Session Smoke

Run only in staging/local or an approved production smoke account. Do not place credentials in chat, docs, logs, screenshots, or commits.

| Flow | Expected result | Failure severity | Rollback/block decision | Evidence |
| --- | --- | --- | --- | --- |
| Parent Auth sign-in | User can sign in through the configured Parent Auth path. | High | Block if account access fails. | Screenshot with private info redacted. |
| Account Dashboard | `/account` loads Account Dashboard V2. | High | Block if dashboard is unavailable. | Screenshot. |
| Saved Names | Saved Names section loads; local/account fallback state is clear. | Medium | Block if saved-name state is destructive or misleading. | Screenshot. |
| Private Passport draft | Private draft loads and remains private. | High | Block if draft is public or missing. | Screenshot. |
| Cosmetics panel | Passport Cosmetics panel loads; Obsidian Pulse remains free foundation preview. | Medium | Block if prices/store/payment appear. | Screenshot. |
| Publish controls | Publish remains blocked when verified provider requirements are missing. | High | Block if policy is bypassed. | Screenshot/status. |
| Public profile fixture | A policy-valid fixture renders allowlisted public projection only. | High | Block if private fields leak. | Screenshot plus source/JSON spot-check. |
| Report dialog | Report dialog opens on a valid public profile and submission returns safe success. | Medium | Block if report exposes private data or public report list appears. | Screenshot/status. |

## Console And Network Checks

For browser smoke, check:

- no blocking JavaScript exceptions;
- no failed critical CSS/JS/image assets;
- no OAuth redirect attempts for Riot, Discord, osu!, Steam, or Supercell;
- no provider API calls;
- no payment or checkout requests;
- no public report admin/list requests.

## Go/No-Go Notes

Launch can proceed only when critical and high-severity failures are cleared or explicitly accepted by the owner. Medium issues may proceed only when they do not affect privacy, account access, public projection safety, report submission safety, or provider/payment boundaries.
