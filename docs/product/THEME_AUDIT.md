# Theme Audit

## Audit Date

June 24, 2026

## Summary

`ThemeProvider` and global tokens exist, but several new account/passport/auth surfaces use hardcoded dark classes and bypass light mode.

This PR does not fix runtime UI. It records the current findings and defines the follow-up slices.

## System Evidence

- `apps/web/src/core/context/ThemeContext.jsx` stores `theme` in `localStorage` and toggles `html.dark`.
- `apps/web/src/App.jsx` wraps the app in `ThemeProvider` and uses `bg-background text-foreground` at the app shell.
- `apps/web/src/index.css` defines `:root` and `.dark` CSS tokens.
- `apps/web/tailwind.config.js` uses class-based dark mode and exposes token-backed colors.

## Route Findings

### `/gaming-passport`

Findings:

- Root uses dark-only `bg-slate-950 text-slate-100`.
- Many sections use fixed `text-white`, `bg-slate-*`, and `bg-white/*` alpha patterns.
- Needs a dark-branded vs theme-aware decision before visual fixes.

Severity: Medium, because it is a marketing/review landing.

### `/account`

Findings:

- Dashboard uses dark-only cards, inputs, borders, and text.
- Functional UI should be theme-aware.
- Root relies on App `bg-background`, but page content hardcodes dark text/surfaces.

Severity: High.

### `/sign-in`

Findings:

- Auth form uses dark-only cards, inputs, borders, and text.
- Functional auth UI should be readable in both light and dark mode.

Severity: High.

### `/sign-up`

Findings:

- Auth form repeats the same dark-only form patterns as `/sign-in`.
- Labels, helper text, and Google button need paired light/dark styling.

Severity: High.

### `/auth/callback`

Findings:

- Status surface uses dark-only heading/body colors.
- It is smaller than the forms but still part of the auth flow.

Severity: Medium.

### `AuthUnavailable`

Findings:

- Fallback state uses dark-only heading/body colors.
- It appears in auth/account surfaces when local config is missing.

Severity: Medium.

### `/privacy-policy` and `/terms-of-service`

Findings:

- Both pages use `bg-gradient-dark`, `bg-dark-800`, `text-dark-*`, and `prose-invert`.
- PR9 updated legal copy, but theme behavior remains intentionally dark-looking or unresolved.

Severity: Medium/Low depending on whether legal/docs pages are intentionally dark-only.

### Navigation

Findings:

- Navigation is intentionally dark-integrated via `th-nav-shell`.
- Decision needed: keep dark-integrated or make theme-aware.

Severity: Low if documented.

## Recommended Fix Order

1. PR10.1 Account/Auth.
2. PR10.2 Gaming Passport landing.
3. PR10.3 Legal/docs theme pass.
4. Future public profile uses theme contract from day one.

## Non-Goals

- No runtime fix in PR10.
- No page component rewrite.
- No auth logic changes.
- No provider runtime.
- No Riot or Discord OAuth.
- No Supabase, Vercel, Google Cloud, Riot Developer Portal, migration, or RLS changes.
