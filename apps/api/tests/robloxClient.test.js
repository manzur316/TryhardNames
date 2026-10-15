import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { authorizeUrl, createAuthorization, normalizeOwnProfile, readAuthorizedProfile } from '../src/integrations/roblox/client.js';

const config = { clientId: '1234', clientSecret: 'test-secret-not-a-real-credential',
  callbackUrl: 'https://www.tryhardnames.com/api/v1/integrations/roblox/callback' };
const profile = { sub: '123', preferred_username: 'Player', name: 'Player Name',
  picture: 'https://tr.rbxcdn.com/avatar.png', created_at: 1584682495 };
function provider({ failProfile = false, failRevoke = false, omitRefresh = false } = {}) {
  const calls = [];
  return { calls, fetchImpl: async (url, options) => {
    calls.push({ url, options });
    if (url.endsWith('/token')) return Response.json({ access_token: 'fake-access',
      refresh_token: omitRefresh ? undefined : 'fake-refresh', token_type: 'Bearer', id_token: 'ignored' });
    if (url.endsWith('/token/revoke')) return new Response(null, { status: failRevoke ? 500 : 200 });
    return Response.json({ ...profile, email: 'private@example.invalid' }, { status: failProfile ? 500 : 200 });
  } };
}
test('Roblox requests minimal scopes and S256 bound to the hosted callback', () => {
  const authorization = createAuthorization();
  const url = new URL(authorizeUrl(config, authorization));
  assert.equal(url.origin, 'https://apis.roblox.com');
  assert.equal(url.searchParams.get('scope'), 'openid profile');
  assert.equal(url.searchParams.get('redirect_uri'), config.callbackUrl);
  assert.equal(url.searchParams.get('code_challenge_method'), 'S256');
  assert.equal(url.searchParams.get('code_challenge'), createHash('sha256').update(authorization.verifier).digest('base64url'));
});
test('Roblox profile is allowlisted and rejects unrelated avatar origins', () => {
  const actual = normalizeOwnProfile({ ...profile, picture: 'https://rbxcdn.com.evil.example/avatar', email: 'private' });
  assert.equal(actual.avatarUrl, null);
  assert.equal(actual.email, undefined);
  assert.equal(actual.accountId, '123');
  assert.throws(() => normalizeOwnProfile({ ...profile, sub: '../123' }));
});
test('Roblox verification revokes refresh authorization and returns no credentials', async () => {
  const fake = provider();
  const actual = await readAuthorizedProfile('code', 'verifier', config, fake.fetchImpl);
  assert.equal(actual.accountId, '123');
  assert.doesNotMatch(JSON.stringify(actual), /fake-access|fake-refresh|ignored|private@example/);
  assert.equal(fake.calls.at(-1).options.body.get('token'), 'fake-refresh');
  assert.equal(fake.calls[0].options.body.get('redirect_uri'), config.callbackUrl);
  for (const call of fake.calls) assert.equal(call.options.redirect, 'manual');
});
test('Roblox revokes authorization even when userinfo fails', async () => {
  const fake = provider({ failProfile: true });
  await assert.rejects(readAuthorizedProfile('code', 'verifier', config, fake.fetchImpl), { code: 'profile_failed' });
  assert.equal(fake.calls.at(-1).options.body.get('token'), 'fake-refresh');
});
test('Roblox fails closed when revocation cannot be confirmed', async () => {
  for (const options of [{ failRevoke: true }, { omitRefresh: true }]) {
    const fake = provider(options);
    await assert.rejects(readAuthorizedProfile('code', 'verifier', config, fake.fetchImpl), { code: 'revoke_failed' });
  }
});

