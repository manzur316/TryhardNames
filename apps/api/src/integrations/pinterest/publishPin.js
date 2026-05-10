function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/** Pinterest fetch + SSRF-hardening: HTTPS only, no loopback / obvious private hosts */
function isTrustedPinImageUrl(value) {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    if (host === 'localhost' || host.endsWith('.localhost')) return false;
    if (host === '[::1]' || host === '::1') return false;
    if (/^127\./.test(host)) return false;
    if (/^10\./.test(host)) return false;
    if (/^192\.168\./.test(host)) return false;
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) return false;
    return true;
  } catch {
    return false;
  }
}

function normalizeText(value, maxLength) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().slice(0, maxLength);
}

function sanitizePinResponse(data) {
  return {
    id: data.id || null,
    boardId: data.board_id || null,
    title: data.title || null,
    link: data.link || null,
    createdAt: data.created_at || null,
    hasMedia: Boolean(data.media),
  };
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
      details: data,
    };
  }

  return {
    ok: true,
    status: response.status,
    pin: sanitizePinResponse(data),
  };
}
