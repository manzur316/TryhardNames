import { Router } from 'express';
import { INTEGRATION_STATUS } from '../../core/index.js';
import { fail, ok } from '../../shared/apiResponse.js';
import { getOsuRuntimeConfig, toSafeOsuRuntimeConfig } from './config.js';
import { buildOsuAuthorizeUrl, exchangeOsuCode, fetchOsuOwnProfile, revokeOsuCurrentToken, sanitizeOsuRuntimeResult } from './oauthClient.js';
import { createOsuState, hashOsuState, validateOsuStateRecord } from './oauthState.js';
import { getSupabaseAdminClient, requireOwnerSession } from './supabaseServer.js';
import {
  completeOsuLink,
  createOsuLinkState,
  findOsuCallbackStateByHash,
  getOsuConnectionStatus,
  unlinkOsuProvider,
} from './runtimeStore.js';

const r = Router();

r.get('/', (req, res) => {
  const config = getOsuRuntimeConfig();
  res.json(ok({
    integration: 'osu',
    role: 'gaming_proof_provider',
    status: config.configured ? INTEGRATION_STATUS.CONFIGURED : INTEGRATION_STATUS.READY_FOR_CONFIGURATION,
    runtime: toSafeOsuRuntimeConfig(config),
    capabilities: [
      'authorization_code_owner_linking',
      'csrf_state_hash_storage',
      'server_side_token_exchange',
      'no_refresh_token_storage',
      'immediate_token_revoke_after_verification',
      'owner_only_unlink',
    ],
  }));
});

r.get('/status', async (req, res) => {
  const config = getOsuRuntimeConfig();
  if (!config.configured) return osuUnavailable(res, config);

  try {
    const supabase = getSupabaseAdminClient(config);
    const owner = await requireOwnerSession(req, supabase);
    const passportId = safeText(req.query.passportId);
    if (!passportId) return res.status(400).json(fail('missing_passport_id'));

    const connections = await getOsuConnectionStatus(supabase, {
      ownerId: owner.ownerId,
      passportId,
    });

    res.json(ok({
      integration: 'osu',
      status: 'owner_status',
      connections,
      tokenStrategy: config.tokenStrategy,
    }));
  } catch (error) {
    sendSafeError(res, error);
  }
});

r.post('/link-intent', async (req, res) => {
  const config = getOsuRuntimeConfig();
  if (!config.configured) return osuUnavailable(res, config);

  try {
    const supabase = getSupabaseAdminClient(config);
    const owner = await requireOwnerSession(req, supabase);
    const passportId = safeText(req.body?.passportId);
    if (!passportId) return res.status(400).json(fail('missing_passport_id'));

    const state = createOsuState();
    const stateHash = hashOsuState(state.state, config.stateSecret);
    await createOsuLinkState(supabase, {
      ownerId: owner.ownerId,
      passportId,
      stateHash,
      scopes: config.scopes,
      expiresAt: state.expiresAt,
    });

    res.status(201).json(ok({
      integration: 'osu',
      status: 'link_intent_created',
      authorizeUrl: buildOsuAuthorizeUrl(config, state.state),
      expiresAt: state.expiresAt,
      scopes: config.scopes,
      tokenStrategy: config.tokenStrategy,
    }));
  } catch (error) {
    sendSafeError(res, error);
  }
});

r.get('/callback', async (req, res) => {
  const config = getOsuRuntimeConfig();
  if (!config.configured) return osuUnavailable(res, config);

  const code = safeText(req.query.code);
  const state = safeText(req.query.state);
  if (!code) return res.status(400).json(fail('missing_code'));
  if (!state) return res.status(400).json(fail('missing_state'));

  try {
    const supabase = getSupabaseAdminClient(config);
    const stateHash = hashOsuState(state, config.stateSecret);
    const callbackState = await findOsuCallbackStateByHash(supabase, stateHash);
    const stateValidation = validateOsuStateRecord(callbackState, state, config.stateSecret);
    if (!stateValidation.ok) {
      return res.status(400).json(fail(stateValidation.error, { integration: 'osu' }));
    }

    const exchanged = await exchangeOsuCode(code, config);
    if (!exchanged.ok) {
      return res.status(502).json(fail('token_exchange_failed', {
        integration: 'osu',
        status: exchanged.status,
      }));
    }

    const profile = await fetchOsuOwnProfile(exchanged.token.accessToken, config);
    if (!profile.ok) {
      return res.status(502).json(fail('profile_fetch_failed', {
        integration: 'osu',
        status: profile.status,
      }));
    }

    const revoked = await revokeOsuCurrentToken(exchanged.token.accessToken, config);
    if (!revoked.ok) {
      return res.status(502).json(fail('token_revoke_failed', {
        integration: 'osu',
        status: revoked.status,
      }));
    }

    const observedAt = new Date().toISOString();
    const completed = await completeOsuLink(supabase, {
      callbackState,
      identity: profile.identity,
      observedAt,
    });

    res.json(ok(sanitizeOsuRuntimeResult({
      integration: 'osu',
      status: 'linked',
      tokenStrategy: config.tokenStrategy,
      tokenRevokedImmediately: true,
      linkedProviderAccount: {
        id: completed.linkedProviderAccount.id,
        provider: 'osu',
        displayName: completed.linkedProviderAccount.display_name,
        status: completed.linkedProviderAccount.status,
        visibility: completed.linkedProviderAccount.visibility,
        verifiedAt: completed.linkedProviderAccount.verified_at,
      },
      proof: {
        type: 'profile_linked',
        source: 'osu',
        label: 'Linked osu! account',
        visibility: completed.proof.visibility,
        verifiedAt: completed.proof.verified_at,
      },
    })));
  } catch (error) {
    sendSafeError(res, error);
  }
});

r.post('/unlink', async (req, res) => {
  const config = getOsuRuntimeConfig();
  if (!config.configured) return osuUnavailable(res, config);

  try {
    const supabase = getSupabaseAdminClient(config);
    const owner = await requireOwnerSession(req, supabase);
    const passportId = safeText(req.body?.passportId);
    const linkedProviderAccountId = safeText(req.body?.linkedProviderAccountId);
    if (!passportId) return res.status(400).json(fail('missing_passport_id'));
    if (!linkedProviderAccountId) return res.status(400).json(fail('missing_linked_provider_account_id'));

    const result = await unlinkOsuProvider(supabase, {
      ownerId: owner.ownerId,
      passportId,
      linkedProviderAccountId,
    });

    res.json(ok({
      integration: 'osu',
      status: 'unlinked',
      tokenStrategy: config.tokenStrategy,
      revokeStrategy: 'local_revoke_no_token_stored',
      result,
    }));
  } catch (error) {
    sendSafeError(res, error);
  }
});

function osuUnavailable(res, config) {
  return res.status(503).json(fail('osu_runtime_not_configured', {
    integration: 'osu',
    runtime: toSafeOsuRuntimeConfig(config),
  }));
}

function sendSafeError(res, error) {
  const status = Number.isInteger(error?.status) ? error.status : 500;
  res.status(status).json(fail(error?.message || 'osu_runtime_error', {
    integration: 'osu',
  }));
}

function safeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export default r;
