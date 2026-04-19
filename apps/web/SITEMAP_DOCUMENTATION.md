# Sitemap & SEO Documentation

This document outlines the sitemap architecture, robots.txt configuration, and SEO routing strategy for the application.

## 🗺️ Sitemap Overview
The application utilizes a dual-sitemap strategy to ensure maximum reliability for search engine crawlers:
1. **Static Fallback:** Located at `public/sitemap.xml` (served at `/sitemap.xml`).
2. **Dynamic API Generation:** (Backend implementation pending) Will be served via `/api/sitemap/routes`.

### Format Details
The sitemap strictly adheres to the XML Sitemap protocol (`http://www.sitemaps.org/schemas/sitemap/0.9`).
- **Base URL:** `https://tryhardnames.com`
- **Update Frequency:** `daily` for core pages, `weekly` for sub-categories.

## ✅ Included Routes (14 Valid Routes)
Only the following canonical routes are included in the sitemap to consolidate SEO authority:

| Route | Priority | Change Frequency |
| :--- | :--- | :--- |
| `/` | 1.0 | daily |
| `/stylish-text-generator` | 0.8 | weekly |
| `/nickname-symbols` | 0.8 | weekly |
| `/roblox-names` | 0.9 | daily |
| `/roblox-names/cool` | 0.7 | weekly |
| `/roblox-names/funny` | 0.7 | weekly |
| `/roblox-names/aesthetic` | 0.7 | weekly |
| `/roblox-names/tryhard` | 0.7 | weekly |
| `/gamer-names` | 0.9 | daily |
| `/gamer-names/cool` | 0.7 | weekly |
| `/gamer-names/funny` | 0.7 | weekly |
| `/gamer-names/pro` | 0.7 | weekly |
| `/gamer-names/edgy` | 0.7 | weekly |

## 🚫 Excluded Legacy Routes (18 Routes)
To prevent duplicate content penalties and crawler waste, the following legacy routes are **strictly excluded** from the sitemap and explicitly disallowed in `robots.txt`:
- `/cool-names`, `/funny-names`, `/valorant-names`, `/fortnite-names`, `/fortnite-tryhard-names`
- `/gamer-bio-generator`, `/cool-gamer-bio`, `/funny-gamer-bio`
- `/roblox-names-generator`, `/roblox-cool-names`, `/roblox-funny-names`, `/roblox-aesthetic-names`, `/roblox-tryhard-names`
- `/gamer-names-generator`, `/cool-gamer-names`, `/funny-gamer-names`, `/pro-gamer-names`, `/edgy-gamer-names`

## 🤖 Robots.txt Configuration
Located at `public/robots.txt`:
- Allows all bots (`User-agent: *`)
- Sets a `Crawl-delay: 1` to prevent server overload.
- Explicitly `Disallow`s all 18 legacy routes.
- Points directly to the absolute URL of the sitemap.

## 🔌 API Endpoints (Backend)
*Note: Backend implementation is handled by the API service.*
- `GET /sitemap.xml`: Returns the raw XML string.
- `GET /api/sitemap/routes`: Returns a JSON array of the 14 valid routes.
- `GET /api/sitemap/validate`: Validates the current sitemap against legacy rules.

## 🛠️ Frontend Utilities Reference
Located in `src/core/utils/`:
- `sitemapGenerator.js`: Contains `generateSitemapXML()`, `fetchSitemap()`, and `SITEMAP_ROUTES`.
- `validateSitemap.js`: Contains `runFullSitemapValidation()` to verify structure and ensure no legacy routes leak into the sitemap.

## 🚀 Google Search Console Submission
1. Log in to Google Search Console.
2. Select the property `https://tryhardnames.com`.
3. Navigate to **Sitemaps** in the left sidebar.
4. Enter `sitemap.xml` and click **Submit**.
5. Monitor the "Discovered URLs" count (should be exactly 14).

## 📈 SEO Benefits
- **Crawl Budget Optimization:** By disallowing legacy routes, Googlebot spends its crawl budget exclusively on canonical pages.
- **Authority Consolidation:** 301 redirects (via `LegacyRouteHandler`) combined with a clean sitemap pass link equity to the new URL structure.
- **Faster Indexing:** Clear priorities and change frequencies guide crawlers to the most important content first.