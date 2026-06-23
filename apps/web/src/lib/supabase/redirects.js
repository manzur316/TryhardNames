export function getAuthCallbackUrl(origin = getWindowOrigin()) {
  return `${origin}/auth/callback`;
}

export function sanitizeReturnTo(value, fallback = '/account', origin = getWindowOrigin()) {
  if (!value || typeof value !== 'string') return fallback;

  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith('//')) return fallback;

  try {
    if (trimmed.startsWith('/')) {
      return normalizeInternalPath(trimmed, fallback);
    }

    const parsed = new URL(trimmed);
    if (parsed.origin !== origin) return fallback;
    return normalizeInternalPath(`${parsed.pathname}${parsed.search}${parsed.hash}`, fallback);
  } catch {
    return fallback;
  }
}

function normalizeInternalPath(path, fallback) {
  if (!path.startsWith('/')) return fallback;
  if (path.startsWith('/auth/callback')) return fallback;
  if (path.startsWith('/sign-in') || path.startsWith('/sign-up')) return fallback;
  return path;
}

function getWindowOrigin() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'http://localhost:3000';
}
