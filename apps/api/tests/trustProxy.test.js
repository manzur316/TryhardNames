import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getTrustProxyConfig, isVercelRuntime, parseTrustProxyValue } from '../src/config/trustProxy.js';

describe('RM-37 Vercel trust proxy hardening', () => {
  it('keeps local development conservative by default', () => {
    assert.equal(isVercelRuntime({}), false);
    assert.equal(getTrustProxyConfig({}), false);
  });

  it('trusts one proxy hop on Vercel by default', () => {
    assert.equal(isVercelRuntime({ VERCEL: '1' }), true);
    assert.equal(isVercelRuntime({ VERCEL_ENV: 'preview' }), true);
    assert.equal(getTrustProxyConfig({ VERCEL: '1' }), 1);
    assert.equal(getTrustProxyConfig({ VERCEL_ENV: 'production' }), 1);
  });

  it('allows explicit operator override', () => {
    assert.equal(getTrustProxyConfig({ VERCEL: '1', TRUST_PROXY: 'false' }), false);
    assert.equal(getTrustProxyConfig({ TRUST_PROXY: '0' }), false);
    assert.equal(getTrustProxyConfig({ TRUST_PROXY: '1' }), 1);
    assert.equal(getTrustProxyConfig({ TRUST_PROXY: '2' }), 2);
    assert.equal(getTrustProxyConfig({ TRUST_PROXY: 'loopback' }), 'loopback');
  });

  it('normalizes common trust proxy aliases', () => {
    assert.equal(parseTrustProxyValue(''), false);
    assert.equal(parseTrustProxyValue(' off '), false);
    assert.equal(parseTrustProxyValue('true'), 1);
    assert.equal(parseTrustProxyValue('on'), 1);
    assert.equal(parseTrustProxyValue('3'), 3);
    assert.equal(parseTrustProxyValue('uniquelocal'), 'uniquelocal');
  });
});
