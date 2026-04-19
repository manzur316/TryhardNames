# SEO Setup & Maintenance Guide

This document outlines the SEO configuration for TryhardNames and provides instructions for maintaining and monitoring search engine visibility.

## 1. Robots.txt
The `robots.txt` file is located at `apps/web/public/robots.txt` and is accessible at `https://tryhardnames.com/robots.txt`.
- **Purpose**: Instructs search engine crawlers which pages or files they can or cannot request from your site.
- **Configuration**: 
  - Allows all standard bots (`User-agent: *`).
  - Blocks private/admin routes (`/admin/`, `/api/`, `/private/`).
  - Blocks known aggressive scrapers (AhrefsBot, SemrushBot, DotBot).
  - Points to the XML sitemaps.

## 2. XML Sitemaps
Sitemaps help search engines discover and index your pages efficiently.
- **Index Sitemap**: `https://tryhardnames.com/sitemap.xml`
- **Pages Sitemap**: `https://tryhardnames.com/sitemap-pages.xml`
- **Blog Sitemap**: `https://tryhardnames.com/sitemap-blog.xml`

*(Note: Sitemap generation is handled by the backend API server).*

## 3. Dynamic SEO Hook (`useSEO`)
We use a custom React hook (`useSEO.js`) to dynamically update meta tags on route changes.
- **Usage**: