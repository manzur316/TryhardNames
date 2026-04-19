# Edge Cases Handling Documentation

This document outlines how the routing architecture handles various edge cases, malformed inputs, and unexpected user behaviors to ensure application stability.

## 1. Malformed URLs
The `sanitizePathname` utility in `routeValidator.js` handles URL normalization before validation:
- **Double Slashes (`//gamer-names`):** Automatically collapsed to a single slash (`/gamer-names`).
- **Trailing Slashes (`/roblox-names/`):** Stripped automatically (unless it's the root `/`), ensuring `/roblox-names/` matches `/roblox-names`.
- **Mixed Case (`/RoBlox-NaMes`):** Converted to lowercase before validation, ensuring case-insensitive matching.
- **Encoded Characters (`/%20gamer-names`):** Handled natively by the browser's URL parser before reaching the React Router location object.

## 2. Missing or Invalid Parameters
- **Missing Category (`/roblox-names`):** Perfectly valid. Renders the parent layout and main category page.
- **Invalid Category (`/roblox-names/fake-category`):** Fails the `VALID_PATTERNS` regex check. The `RouteGuard` intercepts this and redirects the user to `/` (Home).
- **Extra Parameters (`/gamer-names/cool/extra`):** Fails the regex check (which expects exact matches or specific sub-routes). Redirected to `/`.

## 3. Legacy Route Edge Cases
- **Legacy Route with Trailing Slash (`/cool-names/`):** Sanitized to `/cool-names`, successfully matched in the legacy map, and redirected to `/gamer-names/cool`.
- **Legacy Route with Query String (`/cool-names?ref=twitter`):** React Router's `location.pathname` ignores the query string. The redirect preserves the destination, though query strings are dropped during the `replace` navigation to ensure clean SEO URLs.

## 4. Invalid Route Edge Cases
- **Empty Path / Null / Undefined:** The `sanitizePathname` function defaults falsy values to `/`.
- **Very Long Paths (`/a/b/c/d/e/f`):** Fails regex validation instantly. Redirected to `/`.
- **Catch-all Fallback:** If an invalid route somehow bypasses the `RouteGuard` (e.g., during initial hydration edge cases), the `*` route in `App.jsx` acts as a final safety net, rendering the `NotFoundPage`.

## 5. Performance Edge Cases
- **Rapid Route Changes:** `RouteGuard` uses `useEffect` tied to `location.pathname`. It processes changes synchronously.
- **Browser Back Button (History Stack):** Both `RouteGuard` and `LegacyRouteHandler` use `navigate(path, { replace: true })`. This overwrites the current history entry, preventing the user from getting stuck in an infinite redirect loop when clicking the back button.

## 6. Browser Compatibility
- **Old Browsers:** Uses standard ES6 features and React Router v7. No experimental browser APIs are used for routing.
- **Mobile Browsers:** Touch navigation and mobile history stacks behave identically to desktop due to the `replace: true` strategy.

## 7. Testing Commands & Utilities
Developers can verify edge case handling in the browser console using the exposed utilities: