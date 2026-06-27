import crypto from 'node:crypto';

const STATE_TTL_MS = 10 * 60 * 1000;

export function createOsuState({ now = Date.now, randomBytes = crypto.randomBytes } = {}) {
  return {
    state: randomBytes(32).toString('base64url'),
    issuedAt: new Date(now()).toISOString(),
    expiresAt: new Date(now() + STATE_TTL_MS).toISOString(),
  };
}

export function hashOsuState(state, stateSecret) {
  return crypto
    .createHmac('sha256', stateSecret)
    .update(assertStateText(state))
    .digest('base64url');
}

export function validateOsuStateRecord(record = {}, state, stateSecret, options = {}) {
  if (!state) return { ok: false, error: 'missing_state' };
  if (!record?.state_hash) return { ok: false, error: 'state_not_found' };
  if (record.status !== 'pending') return { ok: false, error: record.status === 'consumed' ? 'state_reused' : 'state_not_pending' };
  if (record.consumed_at) return { ok: false, error: 'state_reused' };

  const expectedHash = hashOsuState(state, stateSecret);
  if (!safeEqual(expectedHash, record.state_hash)) return { ok: false, error: 'state_mismatch' };

  const now = Date.parse(options.now || new Date().toISOString());
  const expiresAt = Date.parse(record.expires_at || '');
  if (!Number.isFinite(expiresAt) || expiresAt <= now) return { ok: false, error: 'state_expired' };

  return { ok: true };
}

function assertStateText(value) {
  if (typeof value !== 'string' || value.length < 32 || value.length > 256) {
    throw new Error('Invalid OAuth state.');
  }
  return value;
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}
