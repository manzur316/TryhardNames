import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePersistenceProfile, readAuthorizedProfile } from '../src/integrations/osu-linking/client.js';
const config = { clientId: '123', clientSecret: 'fixture-not-a-secret',
  callbackUrl: 'https://www.tryhardnames.com/api/v1/integrations/osu/callback' };
const profile = { id: 123, username: 'Player', playmode: 'osu', statistics: { pp: 2.83, global_rank: 3000, accuracy: 0.98 } };
function provider({ failProfile = false, failRevoke = false, restricted = false } = {}) {
  const calls = [];
  return { calls, fetchImpl: async (url, options) => {
    calls.push({ url, options });
    if (url.endsWith('/oauth/token')) return Response.json({ access_token: 'fake-access', refresh_token: 'fake-refresh' });
    if (url.endsWith('/oauth/tokens/current')) return new Response(null, { status: failRevoke ? 500 : 204 });
    return Response.json({ ...profile, is_restricted: restricted, email: 'private@example.invalid' }, { status: failProfile ? 500 : 200 });
  } };
}
test('osu! returns only identity and normalized metrics, never credentials or unrelated profile fields', async () => {
  const fake = provider();
  const actual = await readAuthorizedProfile('code', config, fake.fetchImpl);
  assert.equal(actual.externalAccountId, '123');
  assert.equal(actual.accuracyPercent, 98);
  assert.equal(actual.pp, 2.83);
  assert.doesNotMatch(JSON.stringify(actual), /fake-access|fake-refresh|private@example/);
  assert.equal(fake.calls[0].options.body.get('redirect_uri'), config.callbackUrl);
  assert.equal(fake.calls.at(-1).options.method, 'DELETE');
  assert.equal(fake.calls.at(-1).options.headers.Authorization, 'Bearer fake-access');
  for (const call of fake.calls) assert.equal(call.options.redirect, 'manual');
});
test('osu! missing stats remain null and account restriction is rejected', () => {
  const actual = normalizePersistenceProfile({ id: 123, username: 'Player', playmode: 'mania' });
  assert.equal(actual.pp, null);
  assert.equal(actual.globalRank, null);
  assert.equal(actual.medals, null);
  assert.throws(() => normalizePersistenceProfile({ ...profile, is_restricted: true }), { code: 'restricted_profile' });
  assert.throws(() => normalizePersistenceProfile({ ...profile, id: -1 }));
});
test('osu! revokes authorization when profile fails or is restricted', async () => {
  for (const options of [{ failProfile: true }, { restricted: true }]) {
    const fake = provider(options);
    await assert.rejects(readAuthorizedProfile('code', config, fake.fetchImpl));
    assert.ok(fake.calls.at(-1).url.endsWith('/oauth/tokens/current'));
  }
});
test('osu! does not persist a snapshot if token revocation fails', async () => {
  const fake = provider({ failRevoke: true });
  await assert.rejects(readAuthorizedProfile('code', config, fake.fetchImpl), { code: 'revoke_failed' });
});
