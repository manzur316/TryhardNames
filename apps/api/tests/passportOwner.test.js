import test from 'node:test';
import assert from 'node:assert/strict';
import { authenticateOwner } from '../src/integrations/passport-owner.js';

const ownerId = '11111111-1111-4111-8111-111111111111';
const sessionId = '22222222-2222-4222-8222-222222222222';
const passportId = '33333333-3333-4333-8333-333333333333';
const token = 'header.' + Buffer.from(JSON.stringify({ sub: ownerId, session_id: sessionId, exp: Date.now() / 1000 + 600 })).toString('base64url') + '.signature';
function clientFor(row, rejected = false) {
  return {
    auth: { getUser: async () => ({ data: { user: { id: ownerId } }, error: rejected ? {} : null }) },
    from(table) {
      assert.equal(table, 'gaming_passports');
      return { select(columns) {
        assert.ok(columns.includes('suspended_at'));
        return { eq(key, value) {
          assert.equal(key, 'owner_id'); assert.equal(value, ownerId);
          return { maybeSingle: async () => ({ data: row, error: null }) };
        } };
      } };
    },
  };
}
test('provider owner authentication accepts active private, published and unpublished Passports', async () => {
  for (const status of ['draft_private', 'published', 'unpublished']) {
    const result = await authenticateOwner('Bearer ' + token, () => clientFor({ id: passportId, status, suspended_at: null }));
    assert.equal(result.ownerId, ownerId); assert.equal(result.sessionId, sessionId); assert.equal(result.passportId, passportId);
  }
});
test('suspension and invalid Parent Auth fail closed before provider linking', async () => {
  for (const row of [{ status: 'suspended' }, { status: 'published', suspended_at: new Date().toISOString() }, { status: 'unknown' }]) {
    await assert.rejects(authenticateOwner('Bearer ' + token, () => clientFor({ id: passportId, ...row })), /private_passport_required/);
  }
  await assert.rejects(authenticateOwner('Bearer ' + token, () => clientFor(null)), /passport_required/);
  await assert.rejects(authenticateOwner('Bearer ' + token, () => clientFor(null, true)), /sign_in_required/);
  await assert.rejects(authenticateOwner('', () => { throw new Error('must not run'); }), /sign_in_required/);
});
