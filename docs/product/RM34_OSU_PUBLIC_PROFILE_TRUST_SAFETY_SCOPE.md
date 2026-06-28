# RM-34 osu! Public Profile Trust-Safety QA Scope

## Goal

Audit the RM-33 safe local public projection output from a trust-safety, privacy, public UX, branding, rollback, and release-readiness perspective.

## Result

Status: done.

Decision: trust-safety pass after a minimum public rendering fix.

RM-34 found that public web rendering did not yet understand the osu!-specific allowlisted DTO shape. This PR fixes that narrow issue and adds source/docs tests so the public profile renders the allowlisted osu! provider and proof without overclaiming, leaking internals, or linking unsafe URLs.

Production remains blocked after RM-35. Staging is now `conditional-go`; production is `no-go` until staging smoke evidence and owner production acceptance exist.

## In Scope

- Public copy review for neutral osu! ownership wording.
- Public allowlist review for provider and proof DTOs.
- Public profile rendering review for osu!-specific DTOs.
- Safe `profileUrl` handling review.
- Source guards for endorsement, secrets, tokens, direct browser API calls, commerce, `/cosmetics`, and tracker/ranking surfaces.
- Rollback documentation.
- Roadmap update to RM-35 production readiness / staging go-no-go.

## Out Of Scope

- Production launch.
- Remote Supabase changes.
- Vercel changes.
- Public provider linking UI outside `/account`.
- Parent Auth via osu!.
- Refresh-token storage.
- Direct osu! browser API calls.
- Secrets in web.
- `/cosmetics`.
- Store, checkout, billing, or payments.
- Rank, PP, score, match-history, beatmap, best-play, or live tracker.
- Hidden-player inference.
- Official osu! endorsement claims.

## Acceptance

RM-34 is acceptable when:

- public copy uses `Linked osu! account` or equivalent neutral wording;
- public copy does not imply official endorsement;
- public output contains only RM-31/RM-33 allowlisted fields;
- unsafe `profileUrl` values do not render as links;
- external usernames render as text;
- raw JSON is not displayed;
- owner controls remain the only path to public preference;
- revoked or stale states remain non-public;
- rollback is documented;
- RM-35 readiness is complete and declares RM-36 as the next staging smoke milestone.

## Next

```txt
RM-36 osu! Staging Configuration / Manual Smoke
```
