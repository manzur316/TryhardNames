const TRUST_PROXY_ENV = 'TRUST_PROXY';

export function getTrustProxyConfig(env = process.env) {
  const explicit = clean(env[TRUST_PROXY_ENV]);

  if (explicit) {
    return parseTrustProxyValue(explicit);
  }

  if (isVercelRuntime(env)) {
    return 1;
  }

  return false;
}

export function isVercelRuntime(env = process.env) {
  return clean(env.VERCEL) === '1' || clean(env.VERCEL_ENV) !== '';
}

export function parseTrustProxyValue(value) {
  const normalized = clean(value).toLowerCase();

  if (normalized === '' || normalized === 'false' || normalized === '0' || normalized === 'off') {
    return false;
  }

  if (normalized === 'true' || normalized === '1' || normalized === 'on') {
    return 1;
  }

  if (/^\d+$/.test(normalized)) {
    return Number.parseInt(normalized, 10);
  }

  return normalized;
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}
