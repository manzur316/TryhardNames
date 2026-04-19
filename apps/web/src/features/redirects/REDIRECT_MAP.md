# Route Redirects Documentation

This document outlines the URL redirects implemented to preserve SEO rankings and ensure a smooth user experience after restructuring the application's routing.

## How Redirects Work
We use a custom `<Redirect>` component that leverages React Router's `useNavigate` hook. When a user visits an old URL, the component immediately redirects them to the new URL using the `replace: true` option. This prevents the old URL from being added to the browser history, ensuring the "Back" button works as expected.

## Benefits
- **No 404 Errors**: Users with bookmarked links or clicking on old search engine results will seamlessly reach the correct content.
- **SEO Friendly**: Search engines will eventually update their indexes to the new URLs without penalizing the site for broken links.
- **Smooth UX**: The redirect happens instantly on mount, displaying a brief loading state if necessary.

## Redirect Map

### Roblox Names Redirects

| Old Route | New Route | Status |
| :--- | :--- | :--- |
| `/roblox-names-generator` | `/roblox-names` | Active |
| `/roblox-cool-names` | `/roblox-names/cool` | Active |
| `/roblox-funny-names` | `/roblox-names/funny` | Active |
| `/roblox-aesthetic-names` | `/roblox-names/aesthetic` | Active |
| `/roblox-tryhard-names` | `/roblox-names/tryhard` | Active |

### Gamer Names Redirects

| Old Route | New Route | Status |
| :--- | :--- | :--- |
| `/gamer-names-generator` | `/gamer-names` | Active |
| `/cool-gamer-names` | `/gamer-names/cool` | Active |
| `/funny-gamer-names` | `/gamer-names/funny` | Active |
| `/pro-gamer-names` | `/gamer-names/pro` | Active |
| `/edgy-gamer-names` | `/gamer-names/edgy` | Active |

*Note: Old routes are preserved in `App.jsx` strictly for backward compatibility and routing to the redirect components.*