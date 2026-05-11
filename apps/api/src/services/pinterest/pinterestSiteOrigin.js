/**
 * Canonical site origin for Pinterest / SEO URLs (align with apps/web `SITE_ORIGIN`).
 */
export function getPinterestContentSiteOrigin() {
  const fromEnv = process.env.PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (fromEnv) {
    return String(fromEnv).replace(/\/$/, '');
  }
  return 'https://tryhardnames.com';
}
