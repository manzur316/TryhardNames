/**
 * Builds absolute URLs for the export render endpoint (trusted, server-derived).
 * Prefer PUBLIC_APP_URL / VERCEL_URL so previews do not leak localhost to n8n.
 */

/** Raster/vector formats Pinterest can fetch */
export function pickImageRenderFormat(normalized) {
  if (normalized.format === 'png' || normalized.format === 'svg') {
    return normalized.format;
  }
  return 'png';
}

export function getPublicBaseUrl(req) {
  const explicit = process.env.PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) {
    return String(explicit).replace(/\/$/, '');
  }
  const vercel = process.env.VERCEL_URL;
  if (vercel) {
    const host = String(vercel).replace(/^https?:\/\//, '');
    return `https://${host}`;
  }
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  if (!host) {
    return '';
  }
  return `${proto}://${host}`;
}

/**
 * Deterministic public URL for GET /api/v1/exports/render (same inputs → same path/query).
 */
export function buildTrustedExportRenderUrl(req, normalized, imageRenderFormat) {
  const base = getPublicBaseUrl(req);
  const fmt = imageRenderFormat || pickImageRenderFormat(normalized);
  const params = new URLSearchParams({
    format: fmt,
    variant: normalized.variant,
    source: normalized.source,
    name: normalized.payload.name,
  });
  const path = '/api/v1/exports/render';
  return `${base}${path}?${params.toString()}`;
}
