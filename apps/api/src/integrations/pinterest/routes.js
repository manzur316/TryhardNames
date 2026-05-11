import { Router } from 'express';
import { INTEGRATION_STATUS } from '../../core/index.js';
import { fail, ok } from '../../shared/apiResponse.js';
import { normalizeExportPayload } from '../../services/export/exportPayload.js';
import { buildTrustedExportRenderUrl, pickImageRenderFormat } from '../../services/export/exportTrustedUrl.js';
import { getPinterestConfig, getPinterestPublishConfig } from './config.js';
import { createPinterestState, validatePinterestState } from './oauthState.js';
import {
  publishPinterestPin,
  validatePublishPayload,
} from './publishPin.js';
import {
  isPinterestOAuthBootstrapTokenExposureActive,
  markPinterestBootstrapPublishSucceeded,
} from './oauthBootstrap.js';
import { exchangePinterestCode } from './tokenExchange.js';

const r = Router();

function pinterestUnavailable(res, cfg) {
  return res.status(503).json(fail('Pinterest integration not configured', {
    integration: 'pinterest',
    status: INTEGRATION_STATUS.READY_FOR_CONFIGURATION,
    missing: cfg.missing,
  }));
}

r.get('/', (req, res) => {
  const cfg = getPinterestConfig();
  res.json(ok({
    integration: 'pinterest',
    role: 'export_consumer',
    status: cfg.ok ? INTEGRATION_STATUS.CONFIGURED : INTEGRATION_STATUS.READY_FOR_CONFIGURATION,
    missing: cfg.missing,
    scopes: cfg.scopes,
    hasPublishToken: cfg.hasAccessToken,
    capabilities: ['oauth_authorize_url', 'publish_contract_validation', 'controlled_publish'],
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

  const body = {
    integration: 'pinterest',
    status: 'authorized',
    token: exchanged.token,
    persistence: 'not_configured',
    next: 'Store tokens securely before enabling any publish flow',
  };

  if (isPinterestOAuthBootstrapTokenExposureActive() && exchanged.accessToken) {
    body.oauth_bootstrap_manual = true;
    body.oauth_bootstrap_mode = 'manual_initial_env_only';
    body.oauth_bootstrap_warning =
      'TEMPORARY: full access_token included for one-time manual configuration (copy to PINTEREST_ACCESS_TOKEN). '
      + 'This response is not logged by the server. Tokens are not stored. '
      + 'Unset PINTEREST_OAUTH_BOOTSTRAP_EXPOSE_TOKEN after setup. '
      + 'After the first successful controlled publish in this process, the callback will omit the raw token again.';
    body.access_token = exchanged.accessToken;
  }

  res.json(ok(body));
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

  markPinterestBootstrapPublishSucceeded();

  res.status(201).json(ok({
    integration: 'pinterest',
    status: 'published',
    pin: published.pin,
    normalizedExport: parsed.value,
    automation: 'manual_controlled_publish',
  }));
});

export default r;
