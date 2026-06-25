# Theme Audit

## Audit Date

June 24, 2026

## Summary

`ThemeProvider` and global tokens exist. PR10 recorded that several new account/passport/auth surfaces used hardcoded dark classes and bypassed light mode.

PR10.1 corrected the Account/Auth functional surfaces. This PR updates the light-mode baseline and makes the Gaming Passport landing theme-aware. Legal/docs pages remain a later pass if their intentionally dark presentation is not accepted.

## System Evidence

- `apps/web/src/core/context/ThemeContext.jsx` stores `theme` in `localStorage` and toggles `html.dark`.
- `apps/web/src/App.jsx` wraps the app in `ThemeProvider` and uses `bg-background text-foreground` at the app shell.
- `apps/web/src/index.css` defines `:root` and `.dark` CSS tokens.
- `apps/web/tailwind.config.js` uses class-based dark mode and exposes token-backed colors.

## Route Findings

### `/gaming-passport`

Before this PR:

- Root uses dark-only `bg-slate-950 text-slate-100`.
- Many sections use fixed `text-white`, `bg-slate-*`, and `bg-white/*` alpha patterns.
- Only the global navigation visibly responds to the theme toggle.

After this PR:

- Root uses paired light/dark classes.
- Primary containers, cards, preview shell, CTAs, and legal notice use explicit light/dark variants.
- Dark mode preserves the premium dark-branded treatment.
- Light mode provides a readable white/soft-slate presentation.

Status: THEME_AWARE after this PR.

Severity before this PR: Medium, because it is a marketing/review landing.

### `/account`

PR10 finding:

- Dashboard uses dark-only cards, inputs, borders, and text.
- Functional UI should be theme-aware.
- Root relies on App `bg-background`, but page content hardcodes dark text/surfaces.

PR10.1 status:

- Account dashboard surfaces, inputs, alerts, and private draft preview were updated to use paired light/dark classes.

Status: WORKS after PR10.1.

Severity before PR10.1: High.

### `/sign-in`

PR10 finding:

- Auth form uses dark-only cards, inputs, borders, and text.
- Functional auth UI should be readable in both light and dark mode.

PR10.1 status:

- Sign-in card, labels, inputs, alerts, Google Parent Auth button, and links were updated to use paired light/dark classes.

Status: WORKS after PR10.1.

Severity before PR10.1: High.

### `/sign-up`

PR10 finding:

- Auth form repeats the same dark-only form patterns as `/sign-in`.
- Labels, helper text, and Google button need paired light/dark styling.

PR10.1 status:

- Sign-up card, labels, inputs, alerts, Google Parent Auth button, and links were updated to use paired light/dark classes.

Status: WORKS after PR10.1.

Severity before PR10.1: High.

### `/auth/callback`

PR10 finding:

- Status surface uses dark-only heading/body colors.
- It is smaller than the forms but still part of the auth flow.

PR10.1 status:

- Callback status, error text, and return link were updated to use paired light/dark classes.

Status: WORKS after PR10.1.

Severity before PR10.1: Medium.

### `AuthUnavailable`

PR10 finding:

- Fallback state uses dark-only heading/body colors.
- It appears in auth/account surfaces when local config is missing.

PR10.1 status:

- Fallback heading/body text and surface were updated to use paired light/dark classes.

Status: WORKS after PR10.1.

Severity before PR10.1: Medium.

### `/privacy-policy` and `/terms-of-service`

Findings:

- Both pages use `bg-gradient-dark`, `bg-dark-800`, `text-dark-*`, and `prose-invert`.
- PR9 updated legal copy, but theme behavior remains intentionally dark-looking or unresolved.

Status: PARTIAL/INTENTIONAL_DARK pending a later legal/docs theme decision.

Severity: Medium/Low depending on whether legal/docs pages are intentionally dark-only.

### `/identity-kit`

Findings:

- Identity Kit already changes the page container and functional surfaces with the light/dark toggle.
- It is a reference for expected container behavior.
- This PR does not modify Identity Kit.

Status: WORKS.

### Navigation

Findings:

- Navigation is intentionally dark-integrated via `th-nav-shell`.
- Decision needed: keep dark-integrated or make theme-aware.

Severity: Low if documented.

## Recommended Fix Order

1. PR10.1 Account/Auth. Completed before this PR.
2. PR10.2 light baseline and Gaming Passport landing. This PR.
3. PR10.3 Legal/docs theme pass.
4. Future public profile uses theme contract from day one.

## Non-Goals

- No Account/Auth changes in PR10.2.
- No Identity Kit changes in PR10.2.
- No page component rewrite.
- No auth logic changes.
- No provider runtime.
- No Riot or Discord OAuth.
- No Supabase, Vercel, Google Cloud, Riot Developer Portal, migration, or RLS changes.
