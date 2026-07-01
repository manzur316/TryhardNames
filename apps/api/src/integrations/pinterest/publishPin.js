function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function isValidHttpsUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * HTTPS-only public image URL checks (SSRF-hardening for Pinterest media_source.url).
 * Used by export-backed publish and publish-direct (Cloudinary/CDN).
 * Does not fetch the URL — host/protocol analysis only.
 */
export function isAllowedPublicHttpsImageUrl(value) {
  if (typeof value !== 'string' || !value.trim()) {
    return false;
  }
  let parsed;
  try {
    parsed = new URL(value.trim());
  } catch {
    return false;
  }

  const protocol = parsed.protocol.toLowerCase();
  if (protocol !== 'https:') {
    return false;
  }

  const hostRaw = parsed.hostname;
  if (!hostRaw) {
    return false;
  }

  const host = hostRaw.toLowerCase();

  if (host === 'localhost' || host.endsWith('.localhost')) return false;
  if (host === '[::1]' || host === '::1') return false;
  if (/^127\./.test(host)) return false;
  if (/^10\./.test(host)) return false;
  if (/^192\.168\./.test(host)) return false;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) return false;
  if (/^169\.254\./.test(host)) return false;
  if (host === '0.0.0.0') return false;

  if (host.startsWith('[')) {
    const inner = host.slice(1, -1).toLowerCase();
    if (inner === '::1') return false;
    if (inner.startsWith('fe80:')) return false;
    if (inner.startsWith('fc') || inner.startsWith('fd')) return false;
  }

  return true;
}

/** @deprecated use isAllowedPublicHttpsImageUrl — kept as alias for readability in export flow */
function isTrustedPinImageUrl(value) {
  return isAllowedPublicHttpsImageUrl(value);
}

function normalizeText(value, maxLength) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().slice(0, maxLength);
}

function buildPinterestPinCanonicalUrl(pinId) {
  if (pinId == null || pinId === '') {
    return null;
  }
  return `https://www.pinterest.com/pin/${encodeURIComponent(String(pinId))}/`;
}

function sanitizePinResponse(data) {
  const id = data.id || null;
  return {
    id,
    url: buildPinterestPinCanonicalUrl(id),
    boardId: data.board_id || null,
    title: data.title || null,
    link: data.link || null,
    createdAt: data.created_at || null,
    hasMedia: Boolean(data.media),
  };
}

export function sanitizePinterestPublishErrorDetails(data) {
  if (!data || typeof data !== 'object') {
    return {};
  }

  const rawMessage = data.message
    || data.error_description
    || data.error?.message
    || data.details
    || data.raw;
  const rawCode = data.code || data.error?.code || data.error;
  const rawType = data.type || data.error?.type || data.reason;

  const details = {};
  const code = normalizeText(String(rawCode || ''), 80);
  const type = normalizeText(String(rawType || ''), 80);
  const message = normalizeText(String(rawMessage || ''), 300);

  if (code) details.code = code;
  if (type) details.type = type;
  if (message) details.message = message;

  return details;
}

export function validatePublishPayload(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Body must be a JSON object' };
  }

  const boardId = normalizeText(body.boardId, 128);
  const title = normalizeText(body.title, 100);
  const description = normalizeText(body.description, 800);
  const link = normalizeText(body.link, 2048);
  const imageUrl = normalizeText(body.imageUrl || body.mediaSource?.url, 2048);

  if (!boardId) {
    return { ok: false, error: 'boardId is required' };
  }
  if (!title) {
    return { ok: false, error: 'title is required' };
  }
  if (!imageUrl || !isTrustedPinImageUrl(imageUrl)) {
    return {
      ok: false,
      error: 'imageUrl must be a valid HTTPS URL reachable publicly (no localhost/private hosts)',
    };
  }
  if (link && !isValidUrl(link)) {
    return { ok: false, error: 'link must be a valid URL when present' };
  }

  return {
    ok: true,
    value: {
      boardId,
      title,
      description,
      link,
      imageUrl,
    },
  };
}

/**
 * n8n / automation: publish pin using an external public image URL (e.g. Cloudinary secure_url).
 * No export contract, no server-side fetch of imageUrl.
 */
export function validatePublishDirectPayload(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Body must be a JSON object' };
  }

  const boardId = normalizeText(body.boardId, 128);
  const title = normalizeText(body.title, 100);
  const description = normalizeText(body.description, 800);
  const link = body.link != null && body.link !== '' ? normalizeText(body.link, 2048) : '';
  const imageUrl = normalizeText(body.imageUrl, 2048);

  if (!boardId) {
    return { ok: false, error: 'boardId is required' };
  }
  if (!title) {
    return { ok: false, error: 'title is required' };
  }
  if (!imageUrl || !isAllowedPublicHttpsImageUrl(imageUrl)) {
    return {
      ok: false,
      error:
        'imageUrl must be a valid public HTTPS URL (no localhost, private IPs, link-local, or non-https schemes)',
    };
  }
  if (link && !isValidHttpsUrl(link)) {
    return { ok: false, error: 'link must be a valid HTTPS URL when present' };
  }

  return {
    ok: true,
    value: {
      boardId,
      title,
      description,
      link,
      imageUrl,
    },
  };
}

export function buildPinterestPinPayload(value) {
  return {
    board_id: value.boardId,
    title: value.title,
    description: value.description,
    link: value.link || undefined,
    media_source: {
      source_type: 'image_url',
      url: value.imageUrl,
    },
  };
}

export async function publishPinterestPin(value, cfg) {
  const response = await fetch(`${cfg.apiBaseUrl}/pins`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buildPinterestPinPayload(value)),
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: 'publish_failed',
      details: sanitizePinterestPublishErrorDetails(data),
    };
  }

  return {
    ok: true,
    status: response.status,
    pin: sanitizePinResponse(data),
  };
}
