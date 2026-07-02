import { timingSafeEqual } from 'node:crypto';
import { Router } from 'express';
import { INTEGRATION_STATUS } from '../../core/index.js';
import { fail, ok } from '../../shared/apiResponse.js';
import { normalizeExportPayload } from '../../services/export/exportPayload.js';
import { buildTrustedExportRenderUrl, pickImageRenderFormat } from '../../services/export/exportTrustedUrl.js';
import {
  getPinterestAutomationConfig,
  getPinterestConfig,
  getPinterestPublishConfig,
  PINTEREST_AUTOMATION_SECRET_HEADER,
  PINTEREST_AUTOMATION_SECRET_HEADER_FALLBACK,
} from './config.js';
import { createPinterestState, validatePinterestState } from './oauthState.js';
import {
  publishPinterestPin,
  validatePublishDirectPayload,
  validatePublishPayload,
} from './publishPin.js';
import { exchangePinterestCode } from './tokenExchange.js';

const r = Router();

function pinterestUnavailable(res, cfg) {
  return res.status(503).json(fail('Pinterest integration not configured', {
    integration: 'pinterest',
    status: INTEGRATION_STATUS.READY_FOR_CONFIGURATION,
    missing: cfg.missing,
  }));
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function safeCompareAutomationKey(a, b) {
  const left = Buffer.from(a, 'utf8');
  const right = Buffer.from(b, 'utf8');
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

export function getPinterestAutomationRequestKey(req) {
  return clean(
    req.get(PINTEREST_AUTOMATION_SECRET_HEADER)
      || req.get(PINTEREST_AUTOMATION_SECRET_HEADER_FALLBACK),
  );
}

export function validatePinterestAutomationRequest(req, automationCfg) {
  if (!automationCfg.ok) {
    return { ok: false, status: 401, error: 'automation_not_configured', missing: automationCfg.missing };
  }

  const providedKey = getPinterestAutomationRequestKey(req);
  if (!providedKey) {
    return { ok: false, status: 401, error: 'automation_unauthorized' };
  }

  if (!safeCompareAutomationKey(providedKey, automationCfg.automationSecret)) {
    return { ok: false, status: 401, error: 'automation_unauthorized' };
  }

  return { ok: true };
}

function automationUnavailable(res, auth) {
  return res.status(auth.status).json(fail(auth.error, {
    integration: 'pinterest',
    missing: auth.missing || undefined,
    hint: 'Configure Pinterest automation gateway and pass the required automation header from n8n.',
  }));
}

r.get('/', (req, res) => {
  const cfg = getPinterestConfig();
  const automationCfg = getPinterestAutomationConfig();
  res.json(ok({
    integration: 'pinterest',
    role: 'export_consumer',
    status: cfg.ok ? INTEGRATION_STATUS.CONFIGURED : INTEGRATION_STATUS.READY_FOR_CONFIGURATION,
    missing: cfg.missing,
    scopes: cfg.scopes,
    hasPublishToken: cfg.hasAccessToken,
    automationGateway: {
      required: true,
      configured: automationCfg.ok,
      missing: automationCfg.missing,
      headerName: automationCfg.headerName,
      fallbackHeaderName: automationCfg.fallbackHeaderName,
    },
    capabilities: [
      'oauth_authorize_url',
      'publish_contract_validation',
      'controlled_publish',
      'pinterest_publish_direct',
    ],
  }));
});

/** OAuth authorize URL, available when env is complete. */
r.get('/auth', (req, res) => {
  const cfg = getPinterestConfig();
  if (!cfg.ok) {
    return pinterestUnavailable(res, cfg);
  }
  const state = createPinterestState(cfg.stateSecret);
  const scope = encodeURIComponent(cfg.scopes.join(','));
  const redirect = encodeURIComponent(cfg.redirectUri);
  const authorizeUrl =
    `https://www.pinterest.com/oauth/?client_id=${cfg.appId}` +
    `&redirect_uri=${redirect}&response_type=code&scope=${scope}` +
    `&state=${encodeURIComponent(state)}`;
  res.json(ok({
    integration: 'pinterest',
    status: 'configuration_ok',
    authorizeUrl,
    state: 'generated',
    next: 'Use authorizeUrl to start OAuth; keep token exchange server-side',
  }));
});

/** OAuth callback with minimal server-side token exchange. */
r.get('/callback', async (req, res) => {
  const cfg = getPinterestConfig();
  if (!cfg.ok) {
    return pinterestUnavailable(res, cfg);
  }
  const { code, error, state } = req.query;
  if (error) {
    return res.status(400).json(fail('auth_failed', {
      integration: 'pinterest',
      details: String(error),
    }));
  }
  if (!code || typeof code !== 'string') {
    return res.status(400).json(fail('Missing code', {
      hint: 'Pinterest redirects here with ?code= after user consent',
    }));
  }

  const stateValidation = validatePinterestState(state, cfg.stateSecret);
  if (!stateValidation.ok) {
    return res.status(400).json(fail('invalid_state', {
      integration: 'pinterest',
      reason: stateValidation.error,
    }));
  }

  const exchanged = await exchangePinterestCode(code, cfg);
  if (!exchanged.ok) {
    return res.status(502).json(fail('token_exchange_failed', {
      integration: 'pinterest',
      status: exchanged.status,
      details: exchanged.details,
    }));
  }

  res.json(ok({
    integration: 'pinterest',
    status: 'authorized',
    token: exchanged.token,
    persistence: 'not_configured',
    next: 'Store tokens securely before enabling any publish flow',
  }));
});

/** Controlled export-to-Pinterest publish. No scheduling or automation lives here. */
r.post('/publish', async (req, res) => {
  const cfg = getPinterestPublishConfig();
  if (!cfg.ok) {
    return res.status(401).json(fail('unauthorized', {
      integration: 'pinterest',
      missing: cfg.missing,
      hint: 'Configure a short-lived Pinterest access token before controlled publish testing',
    }));
  }

  const { export: exportPayload } = req.body || {};
  const parsed = normalizeExportPayload(exportPayload);
  if (!parsed.ok) {
    return res.status(400).json(fail(parsed.error));
  }

  const imageRenderFormat = pickImageRenderFormat(parsed.value);
  const trustedImageUrl = buildTrustedExportRenderUrl(req, parsed.value, imageRenderFormat);

  const publishPayload = validatePublishPayload({
    boardId: req.body?.boardId,
    title: req.body?.title,
    description: req.body?.description,
    link: req.body?.link,
    imageUrl: trustedImageUrl,
  });
  if (!publishPayload.ok) {
    return res.status(400).json(fail(publishPayload.error));
  }

  const published = await publishPinterestPin(publishPayload.value, cfg);
  if (!published.ok) {
    return res.status(502).json(fail('publish_failed', {
      integration: 'pinterest',
      status: published.status,
      details: published.details,
      normalizedExport: parsed.value,
    }));
  }

  res.status(201).json(ok({
    integration: 'pinterest',
    status: 'published',
    pin: published.pin,
    normalizedExport: parsed.value,
    automation: 'manual_controlled_publish',
  }));
});

/**
 * Automation gateway: publish a pin from a caller-provided public HTTPS image URL
 * (e.g. Cloudinary secure_url). No export contract, no /exports/render, no artifacts.
 */
r.post('/publish-direct', async (req, res) => {
  const automationCfg = getPinterestAutomationConfig();
  const automationAuth = validatePinterestAutomationRequest(req, automationCfg);
  if (!automationAuth.ok) {
    return automationUnavailable(res, automationAuth);
  }

  const cfg = getPinterestPublishConfig();
  if (!cfg.ok) {
    return res.status(401).json(fail('unauthorized', {
      integration: 'pinterest',
      missing: cfg.missing,
      hint: 'Configure PINTEREST_ACCESS_TOKEN for Pinterest publish',
    }));
  }

  const direct = validatePublishDirectPayload(req.body || {});
  if (!direct.ok) {
    return res.status(400).json(fail(direct.error));
  }

  const published = await publishPinterestPin(direct.value, cfg);
  if (!published.ok) {
    return res.status(502).json(fail('publish_failed', {
      integration: 'pinterest',
      status: published.status,
      details: published.details,
    }));
  }

  res.status(201).json(ok({
    integration: 'pinterest',
    status: 'published',
    pin: published.pin,
    automation: 'pinterest_publish_direct',
  }));
});

export default r;
