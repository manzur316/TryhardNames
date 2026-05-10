import crypto from 'node:crypto';

const STATE_TTL_MS = 10 * 60 * 1000;

function encodeBase64Url(value) {
  return Buffer.from(value).toString('base64url');
}

function decodeBase64Url(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signState(payload, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64url');
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function createPinterestState(secret) {
  const payload = JSON.stringify({
    issuedAt: Date.now(),
    nonce: crypto.randomBytes(16).toString('base64url'),
  });
  const encodedPayload = encodeBase64Url(payload);
  const signature = signState(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export function validatePinterestState(state, secret) {
  if (!state || typeof state !== 'string') {
    return { ok: false, error: 'missing_state' };
  }

  const [encodedPayload, signature] = state.split('.');
  if (!encodedPayload || !signature) {
    return { ok: false, error: 'malformed_state' };
  }

  const expectedSignature = signState(encodedPayload, secret);
  if (!safeEqual(signature, expectedSignature)) {
    return { ok: false, error: 'invalid_state' };
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload));
    const issuedAt = Number(payload.issuedAt);
    if (!Number.isFinite(issuedAt)) {
      return { ok: false, error: 'malformed_state' };
    }
    if (Date.now() - issuedAt > STATE_TTL_MS) {
      return { ok: false, error: 'expired_state' };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'malformed_state' };
  }
}
