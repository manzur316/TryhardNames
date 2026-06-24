# UI Theme Surface Contract

This contract defines how new visual surfaces in TryhardNames should be built so the light/dark mode button behaves coherently.

"Routes" here does not mean router/navigation. It means page surfaces: landing, dashboard, auth, legal, profile, generator, and visual preview surfaces.

## Existing Theme System

- `ThemeProvider` stores the selected theme in `localStorage` as `theme`.
- `ThemeProvider` adds/removes `html.dark`.
- Tailwind uses `darkMode: ['class']`.
- The App root uses `bg-background text-foreground`.
- CSS tokens exist in `:root` and `.dark`.
- Some pages bypass tokens with fixed dark classes.

Evidence:

- `apps/web/src/core/context/ThemeContext.jsx`
- `apps/web/src/App.jsx`
- `apps/web/src/index.css`
- `apps/web/tailwind.config.js`

## Surface Types

1. Public generator surface.
2. Marketing landing surface.
3. Protected dashboard surface.
4. Auth surface.
5. Legal/docs surface.
6. Future public profile surface.
7. Visual preview/scene surface.

## Theme Rules

- Functional UI must be theme-aware by default.
- Dashboards and forms must support light and dark.
- Inputs must not be hardcoded to `bg-black`/`text-white` unless they are inside an isolated visual preview.
- Cards should use `bg-card`, `text-card-foreground`, `border-border`, or explicit light/dark pairs.
- Muted text should use `text-muted-foreground` or paired `text-slate-* dark:text-*` classes.
- Dark-branded marketing sections are allowed only if declared.
- A Passport visual scene may be dark-branded if isolated from functional controls.
- The navbar may remain dark-integrated if documented, but should not imply the whole app is dark-only.

## Allowed Patterns

- `bg-background text-foreground`
- `bg-card text-card-foreground border-border`
- `bg-white dark:bg-dark-800/95`
- `text-slate-900 dark:text-dark-50`
- `border-slate-200 dark:border-white/10`

## Risky Patterns

- Root page: `bg-slate-950 text-slate-100`
- `text-white` on a functional page without a dark variant
- `bg-black/30` on input
- `border-white/10` on light functional surfaces
- `text-slate-300` on light surface without a dark variant
- `bg-gradient-dark` on legal/docs pages unless dark-only is intentional

## Route Surface Expectations

| Route | Expectation |
| --- | --- |
| `/` | Theme-aware. |
| `/gaming-passport` | Decision required: dark-branded landing or theme-aware landing. |
| `/account` | Must be theme-aware. |
| `/sign-in` | Must be theme-aware. |
| `/sign-up` | Must be theme-aware. |
| `/auth/callback` | Must be theme-aware. |
| `/privacy-policy` | Should be theme-aware. |
| `/terms-of-service` | Should be theme-aware. |
| future `/id/:slug` | Must be theme-aware shell; Passport scene may be visual/themed. |

## PR10.1 Implementation Plan

PR10.1 fixes:

- `AccountPage`
- `SignInPage`
- `SignUpPage`
- `AuthCallbackPage`
- `AuthUnavailable`

PR10.1 does not:

- Change auth logic.
- Change Supabase.
- Implement provider runtime.
- Implement Riot.
- Change routes.
- Touch migrations/RLS.

Acceptance criteria:

- Readable in light mode.
- Readable in dark mode.
- Inputs visible.
- Alerts visible.
- Buttons visible.
- No white text on near-white backgrounds.
- No black input fields in light dashboard unless intentionally styled and accessible.
- Tests/smoke cover both modes.

## PR10.2 Implementation Plan

PR10.2 decides `GamingPassportPage`.

Option A: dark-branded landing, with documented exception and no broken toggle expectations.

Option B: theme-aware landing with light and dark variants.

Acceptance criteria:

- Button state does not look broken.
- Landing copy remains Riot-safe.
- Legal notice remains visible.
- No Riot assets/logos added.
