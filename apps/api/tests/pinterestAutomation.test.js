import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getPinterestAutomationConfig } from '../src/integrations/pinterest/config.js';
import {
  getPinterestAutomationRequestKey,
  validatePinterestAutomationRequest,
} from '../src/integrations/pinterest/routes.js';
import {
  publishPinterestPin,
  sanitizePinterestPublishErrorDetails,
  validatePublishDirectPayload,
} from '../src/integrations/pinterest/publishPin.js';
import { getPinterestContentTopicDef } from '../src/services/pinterest/pinterestContentTopics.js';

function reqWithHeaders(headers = {}) {
  const normalized = Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]),
  );
  return {
    get(name) {
      return normalized[String(name).toLowerCase()] || '';
    },
  };
}

describe('MKT-01 Pinterest automation recovery and hardening', () => {
  it('maps legacy n8n topic aliases to supported content topics', () => {
    const discord = getPinterestContentTopicDef('discord-usernames');
    const social = getPinterestContentTopicDef('social-usernames');

    assert.equal(discord.slug, 'brandable-usernames');
    assert.equal(social.slug, 'brandable-usernames');
  });

  it('requires an inbound automation key before publish-direct can run', () => {
    const missingCfg = getPinterestAutomationConfig({});
    assert.equal(missingCfg.ok, false);
    assert.deepEqual(missingCfg.missing, ['PINTEREST_AUTOMATION_SECRET']);

    const cfg = getPinterestAutomationConfig({ PINTEREST_AUTOMATION_SECRET: 'expected-key' });
    assert.equal(cfg.ok, true);
    assert.equal(cfg.hasAutomationSecret, true);

    const missingRequest = validatePinterestAutomationRequest(reqWithHeaders(), cfg);
    assert.deepEqual(missingRequest, { ok: false, status: 401, error: 'automation_unauthorized' });

    const wrongRequest = validatePinterestAutomationRequest(
      reqWithHeaders({ 'X-TryhardNames-Automation-Secret': 'wrong-key' }),
      cfg,
    );
    assert.deepEqual(wrongRequest, { ok: false, status: 401, error: 'automation_unauthorized' });

    const validRequest = validatePinterestAutomationRequest(
      reqWithHeaders({ 'X-TryhardNames-Automation-Secret': 'expected-key' }),
      cfg,
    );
    assert.deepEqual(validRequest, { ok: true });
  });

  it('supports the short n8n automation header alias', () => {
    const req = reqWithHeaders({ 'X-THN-Automation-Secret': 'expected-key' });
    assert.equal(getPinterestAutomationRequestKey(req), 'expected-key');
  });

  it('validates publish-direct payloads as public HTTPS-only', () => {
    const valid = validatePublishDirectPayload({
      boardId: 'board-123',
      title: 'Gaming Names',
      description: 'Pinterest description',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.png',
      link: 'https://tryhardnames.com/gamer-names',
    });
    assert.equal(valid.ok, true);

    const privateImage = validatePublishDirectPayload({
      boardId: 'board-123',
      title: 'Gaming Names',
      imageUrl: 'http://localhost:3000/image.png',
    });
    assert.equal(privateImage.ok, false);
    assert.match(privateImage.error, /public HTTPS URL/);
  });

  it('sanitizes Pinterest API failure details before returning them', async () => {
    assert.deepEqual(sanitizePinterestPublishErrorDetails({
      code: 'invalid_request',
      message: 'Board is unavailable',
      debug_blob: 'do-not-return-this',
    }), {
      code: 'invalid_request',
      message: 'Board is unavailable',
    });

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response(JSON.stringify({
      code: 'invalid_request',
      message: 'Board is unavailable',
      debug_blob: 'do-not-return-this',
    }), { status: 400 });

    try {
      const result = await publishPinterestPin({
        boardId: 'board-123',
        title: 'Gaming Names',
        description: 'Pinterest description',
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.png',
        link: 'https://tryhardnames.com/gamer-names',
      }, {
        apiBaseUrl: 'https://api.pinterest.test/v5',
        accessToken: 'runtime-token-placeholder',
      });

      assert.equal(result.ok, false);
      assert.equal(result.status, 400);
      assert.deepEqual(result.details, {
        code: 'invalid_request',
        message: 'Board is unavailable',
      });
      assert.equal(JSON.stringify(result).includes('runtime-token-placeholder'), false);
      assert.equal(JSON.stringify(result).includes('do-not-return-this'), false);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
