/**
 * Single source of truth for export allowlists and normalized payload shape.
 * Normalized export: only payload.name survives (no client imageUrl / opaque fields).
 */

export const ALLOWED_FORMATS = new Set(['png', 'svg', 'json']);
export const ALLOWED_VARIANTS = new Set(['banner', 'card', 'kit', 'kr', 'default']);
export const ALLOWED_SOURCES = new Set(['identity-kit', 'kr-card', 'readability', 'profile-banner', 'manual']);

const MAX_NAME_LEN = 80;

export function sanitizeExportName(raw) {
  if (raw == null) return '';
  const s = String(raw).normalize('NFKC').trim().slice(0, MAX_NAME_LEN);
  let out = '';
  for (let i = 0; i < s.length; i += 1) {
    const ch = s[i];
    const code = ch.charCodeAt(0);
    if (code < 32 || code === 127) continue;
    if (ch === '<' || ch === '>') continue;
    out += ch;
  }
  return out;
}

/**
 * Strict normalization: only { format, variant, source, payload: { name } }.
 */
export function normalizeExportPayload(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Body must be a JSON object' };
  }

  const { format, variant, payload, source } = body;

  if (!ALLOWED_FORMATS.has(format)) {
    return { ok: false, error: `format must be one of: ${[...ALLOWED_FORMATS].join(', ')}` };
  }
  if (variant != null && !ALLOWED_VARIANTS.has(variant)) {
    return { ok: false, error: `variant must be one of: ${[...ALLOWED_VARIANTS].join(', ')}` };
  }
  if (payload != null && typeof payload !== 'object') {
    return { ok: false, error: 'payload must be an object when present' };
  }
  if (source != null && !ALLOWED_SOURCES.has(source)) {
    return { ok: false, error: `source must be one of: ${[...ALLOWED_SOURCES].join(', ')}` };
  }

  const rawPayload = payload && typeof payload === 'object' ? payload : {};
  const ignoredClientImageUrl = Boolean(
    Object.prototype.hasOwnProperty.call(rawPayload, 'imageUrl')
      && rawPayload.imageUrl != null
      && String(rawPayload.imageUrl).trim() !== '',
  );

  const name = sanitizeExportName(rawPayload.name);
  if (!name) {
    return { ok: false, error: 'payload.name is required and must be non-empty' };
  }

  return {
    ok: true,
    value: {
      format,
      variant: variant || 'default',
      source: source || 'manual',
      payload: { name },
    },
    ignoredClientImageUrl,
  };
}

/**
 * Shared validation for GET /exports/render (png/svg only).
 */
export function parseExportRenderQuery(query) {
  if (!query || typeof query !== 'object') {
    return { ok: false, error: 'Invalid query' };
  }
  const format = typeof query.format === 'string' ? query.format : '';
  if (format !== 'png' && format !== 'svg') {
    return { ok: false, error: 'format must be png or svg' };
  }

  const variant = query.variant != null && query.variant !== '' ? String(query.variant) : undefined;
  const source = query.source != null && query.source !== '' ? String(query.source) : undefined;
  const name = query.name != null ? String(query.name) : '';

  return normalizeExportPayload({
    format,
    variant,
    source,
    payload: { name },
  });
}

export function getExportContractMetadata() {
  return {
    formats: [...ALLOWED_FORMATS],
    variants: [...ALLOWED_VARIANTS],
    sources: [...ALLOWED_SOURCES],
  };
}

/** @deprecated Use normalizeExportPayload — kept for accidental imports */
export function validateExportPreviewBody(body) {
  return normalizeExportPayload(body);
}
