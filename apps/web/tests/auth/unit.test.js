import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildCreateDraftPayload,
  buildPresentationPayload,
  createPrivateDraft,
  getOrCreatePrivateDraft,
  getOwnedPassport,
  mapPassportRow,
  mapPassportToPresentationForm,
  sanitizeSceneConfig,
  shouldLoadDraftForOwner,
  updatePassportPresentation,
  validatePresentationInput,
} from '../../src/gaming-passport/data/passportRepository.js';
import {
  applySignedOutSessionState,
  completeAuthCallback,
  createSupabaseClientFromFactory,
  getSupabaseRuntime,
  parseAuthCallbackParams,
  readSupabaseConfig,
  resetSupabaseRuntimeForTests,
  sanitizeReturnTo,
  signInWithEmail,
  signInWithGoogle,
  signOutWithSupabase,
  signUpWithEmail,
} from '../../src/lib/supabase/index.js';
import { buildPublicPassportProjection } from '../../src/gaming-passport/domain/index.js';
import { getAccountNavigationState } from '../../src/core/routing/accountNavigation.js';

describe('Parent Auth configuration', () => {
  it('keeps missing Supabase config from breaking imports or creating a client', () => {
    const config = readSupabaseConfig({});
    let called = false;
    const client = createSupabaseClientFromFactory(() => {
      called = true;
    }, config);

    assert.equal(config.isConfigured, false);
    assert.equal(client, null);
    assert.equal(called, false);
  });

  it('creates a Supabase client only when URL and publishable key are present', () => {
    const config = readSupabaseConfig({
      VITE_SUPABASE_URL: 'http://127.0.0.1:54321',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_local',
    });
    const client = createSupabaseClientFromFactory((url, key, options) => ({ url, key, options }), config);

    assert.equal(config.isConfigured, true);
    assert.equal(client.url, 'http://127.0.0.1:54321');
    assert.equal(client.key, 'sb_publishable_local');
    assert.equal(client.options.auth.flowType, 'pkce');
    assert.equal(client.options.auth.persistSession, true);
    assert.equal(client.options.auth.detectSessionInUrl, false);
  });

  it('rejects prohibited admin-shaped browser config', () => {
    const config = readSupabaseConfig({
      VITE_SUPABASE_URL: 'http://127.0.0.1:54321',
      VITE_SUPABASE_PUBLISHABLE_KEY: ['sb', 'secret_not_allowed'].join('_'),
    });

    assert.equal(config.isConfigured, false);
  });

  it('accepts modern publishable keys and legacy anon JWT keys', () => {
    assert.equal(readSupabaseConfig({
      VITE_SUPABASE_URL: 'https://project.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_abc123',
    }).isConfigured, true);

    assert.equal(readSupabaseConfig({
      VITE_SUPABASE_URL: 'http://127.0.0.1:54321',
      VITE_SUPABASE_PUBLISHABLE_KEY: makeJwt({ role: 'anon' }),
    }).isConfigured, true);
  });

  it('rejects secret keys, service role JWTs, malformed JWTs, and unsafe URLs', () => {
    assert.equal(readSupabaseConfig({
      VITE_SUPABASE_URL: 'https://project.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: ['sb', 'secret_abc123'].join('_'),
    }).isConfigured, false);

    assert.equal(readSupabaseConfig({
      VITE_SUPABASE_URL: 'https://project.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: makeJwt({ role: 'service_role' }),
    }).isConfigured, false);

    assert.equal(readSupabaseConfig({
      VITE_SUPABASE_URL: 'https://project.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'header.not-json.signature',
    }).isConfigured, false);

    assert.equal(readSupabaseConfig({
      VITE_SUPABASE_URL: 'javascript:alert(1)',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_abc123',
    }).isConfigured, false);

    assert.equal(readSupabaseConfig({
      VITE_SUPABASE_URL: 'file:///tmp/project',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_abc123',
    }).isConfigured, false);

    assert.equal(readSupabaseConfig({
      VITE_SUPABASE_URL: 'http://127.0.0.1:54321',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_abc123',
    }).isConfigured, true);
  });

  it('keeps runtime safe when createClient throws', async () => {
    resetSupabaseRuntimeForTests();
    const runtime = await getSupabaseRuntime({
      config: readSupabaseConfig({
        VITE_SUPABASE_URL: 'https://project.supabase.co',
        VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_abc123',
      }),
      factory: () => {
        throw new Error('bad client');
      },
    });

    assert.equal(runtime.client, null);
    assert.equal(runtime.config.isConfigured, false);
    resetSupabaseRuntimeForTests();
  });
});

describe('Parent Auth service calls', () => {
  it('sign-up calls Supabase signUp with email redirect', async () => {
    const calls = [];
    const client = {
      auth: {
        signUp: async (payload) => {
          calls.push(payload);
          return { data: { user: { id: 'user-1' } }, error: null };
        },
      },
    };

    const result = await signUpWithEmail(client, {
      email: 'player@example.test',
      password: 'secret123',
    }, 'http://localhost:3000');

    assert.equal(result.ok, true);
    assert.equal(calls[0].email, 'player@example.test');
    assert.equal(calls[0].options.emailRedirectTo, 'http://localhost:3000/auth/callback');
  });

  it('sign-in calls Supabase signInWithPassword', async () => {
    const calls = [];
    const client = {
      auth: {
        signInWithPassword: async (payload) => {
          calls.push(payload);
          return { data: { session: { id: 'session-created' } }, error: null };
        },
      },
    };

    const result = await signInWithEmail(client, {
      email: 'player@example.test',
      password: 'secret123',
    });

    assert.equal(result.ok, true);
    assert.deepEqual(calls[0], { email: 'player@example.test', password: 'secret123' });
  });

  it('Google OAuth uses provider google and the internal callback URL', async () => {
    const calls = [];
    const client = {
      auth: {
        signInWithOAuth: async (payload) => {
          calls.push(payload);
          return { data: { url: 'https://accounts.google.test' }, error: null };
        },
      },
    };

    const result = await signInWithGoogle(client, {
      enabled: true,
      origin: 'http://localhost:3000',
    });

    assert.equal(result.ok, true);
    assert.equal(calls[0].provider, 'google');
    assert.equal(calls[0].options.redirectTo, 'http://localhost:3000/auth/callback');
  });

  it('sign-out delegates session cleanup to Supabase', async () => {
    let called = false;
    const client = {
      auth: {
        signOut: async () => {
          called = true;
          return { error: null };
        },
      },
    };

    const result = await signOutWithSupabase(client);
    assert.equal(result.ok, true);
    assert.equal(called, true);
  });

  it('keeps current session state when sign-out fails', async () => {
    const currentState = {
      user: { id: 'owner-1' },
      session: { user: { id: 'owner-1' } },
    };

    assert.deepEqual(applySignedOutSessionState({ ok: false }, currentState), currentState);
    assert.deepEqual(applySignedOutSessionState({ ok: true }, currentState), {
      user: null,
      session: null,
    });
  });
});

describe('Manual PKCE callback policy', () => {
  it('exchanges a code exactly once and uses the returned session', async () => {
    let exchangeCalls = 0;
    let getSessionCalls = 0;
    const callbackParams = parseAuthCallbackParams('?code=abc123', '');

    const result = await completeAuthCallback({
      client: {},
      callbackParams,
      getCurrentSession: async () => {
        getSessionCalls += 1;
        return null;
      },
      exchangeCodeForSession: async (_client, code) => {
        exchangeCalls += 1;
        assert.equal(code, 'abc123');
        return { ok: true, data: { session: { user: { id: 'owner-1' } } } };
      },
    });

    assert.equal(callbackParams.shouldCleanUrl, true);
    assert.equal(result.ok, true);
    assert.equal(result.session.user.id, 'owner-1');
    assert.equal(exchangeCalls, 1);
    assert.equal(getSessionCalls, 0);
  });

  it('continues without code when an existing session is present', async () => {
    const result = await completeAuthCallback({
      client: {},
      callbackParams: parseAuthCallbackParams('', ''),
      getCurrentSession: async () => ({ user: { id: 'owner-1' } }),
      exchangeCodeForSession: async () => {
        throw new Error('must not exchange');
      },
    });

    assert.equal(result.ok, true);
    assert.equal(result.session.user.id, 'owner-1');
  });

  it('fails without code and without an existing session', async () => {
    const result = await completeAuthCallback({
      client: {},
      callbackParams: parseAuthCallbackParams('', ''),
      getCurrentSession: async () => null,
    });

    assert.equal(result.ok, false);
    assert.match(result.error, /No active session/);
  });

  it('sanitizes OAuth errors and marks callback params for cleanup', async () => {
    const callbackParams = parseAuthCallbackParams(
      '?error=server_error&error_code=bad&error_description=raw-secret',
      '#code=ignored',
    );
    const result = await completeAuthCallback({
      client: {},
      callbackParams,
      getCurrentSession: async () => ({ user: { id: 'owner-1' } }),
    });

    assert.equal(callbackParams.hasOAuthError, true);
    assert.equal(callbackParams.shouldCleanUrl, true);
    assert.equal(result.ok, false);
    assert.equal(result.error.includes('raw-secret'), false);
    assert.equal(result.error, 'Sign-in could not be completed. Please try again.');
  });
});

describe('Safe redirects and public projection', () => {
  it('rejects external redirect targets', () => {
    assert.equal(sanitizeReturnTo('https://evil.example/account', '/account', 'http://localhost:3000'), '/account');
    assert.equal(sanitizeReturnTo('//evil.example/account'), '/account');
    assert.equal(sanitizeReturnTo('/account?tab=draft'), '/account?tab=draft');
  });

  it('keeps Parent Auth data out of public projection', () => {
    const projection = buildPublicPassportProjection({
      passport: {
        slug: 'player-one',
        alias: 'Player One',
        status: 'published',
        publicationConsent: true,
        publishedAt: '2026-06-23T00:00:00Z',
        updatedAt: '2026-06-23T00:00:00Z',
        parentAuthProvider: 'google',
        email: 'private@example.test',
        ownerId: 'owner-1',
      },
      linkedProviderAccounts: [{
        id: 'provider-1',
        provider: 'discord',
        externalAccountId: 'discord-1',
        status: 'verified',
        visibility: 'public',
        displayName: 'Player One',
        verifiedAt: '2026-06-23T00:00:00Z',
      }],
      verifiedProofs: [],
      featuredProofIds: [],
    });

    assert.equal(projection.email, undefined);
    assert.equal(projection.ownerId, undefined);
    assert.equal(projection.parentAuthProvider, undefined);
  });
});

describe('Auth navigation policy', () => {
  it('hides account navigation when Supabase is not configured', () => {
    assert.equal(getAccountNavigationState({ isConfigured: false, session: null }), null);
  });

  it('shows Sign in when configured without a session and Account with a session', () => {
    assert.deepEqual(getAccountNavigationState({ isConfigured: true, session: null }), {
      href: '/sign-in',
      label: 'Sign in',
    });
    assert.deepEqual(getAccountNavigationState({ isConfigured: true, session: { user: { id: 'owner-1' } } }), {
      href: '/account',
      label: 'Account',
    });
  });
});

describe('Gaming Passport draft repository', () => {
  it('transforms owned Passport rows into the frontend model', async () => {
    const row = samplePassportRow();
    const client = createFakeSupabaseClient({ selectResults: [{ data: row, error: null }] });

    const passport = await getOwnedPassport(client, sampleSession());

    assert.equal(passport.ownerId, row.owner_id);
    assert.equal(passport.avatarUrl, row.avatar_url);
    assert.equal(passport.bioShort, row.bio_short);
    assert.deepEqual(passport.sceneConfig, row.scene_config);
    assert.deepEqual(mapPassportToPresentationForm(passport), {
      alias: row.alias,
      avatarUrl: row.avatar_url,
      bioShort: row.bio_short,
      sceneConfig: row.scene_config,
    });
  });

  it('createPrivateDraft sends only allowed create fields', async () => {
    const row = samplePassportRow();
    const client = createFakeSupabaseClient({ insertResults: [{ data: row, error: null }] });

    await createPrivateDraft(client, sampleSession(), {
      ownerId: 'attacker',
      alias: 'Player',
      avatarUrl: 'https://example.test/a.png',
      bioShort: 'Ready',
      sceneConfig: { layout: 'compact', accent: 'emerald', density: 'dense', unsafe: true },
      status: 'published',
      slug: 'public-slug',
      publicationConsent: true,
    });

    assert.deepEqual(Object.keys(client.calls[0].payload).sort(), [
      'alias',
      'avatar_url',
      'bio_short',
      'owner_id',
      'scene_config',
    ]);
    assert.equal(client.calls[0].payload.owner_id, 'owner-1');
    assert.equal(client.calls[0].payload.status, undefined);
    assert.equal(client.calls[0].payload.slug, undefined);
    assert.equal(client.calls[0].payload.publication_consent, undefined);
    assert.deepEqual(client.calls[0].payload.scene_config, {
      layout: 'compact',
      accent: 'emerald',
      density: 'dense',
    });
  });

  it('updatePassportPresentation never sends status, slug, consent, or owner_id', async () => {
    const row = samplePassportRow();
    const client = createFakeSupabaseClient({ updateResults: [{ data: row, error: null }] });

    await updatePassportPresentation(client, sampleSession(), 'passport-1', {
      alias: 'Updated',
      status: 'published',
      slug: 'updated',
      ownerId: 'attacker',
      publicationConsent: true,
    });

    assert.deepEqual(Object.keys(client.calls[0].payload).sort(), [
      'alias',
      'avatar_url',
      'bio_short',
      'scene_config',
    ]);
    assert.equal(client.calls[0].payload.status, undefined);
    assert.equal(client.calls[0].payload.slug, undefined);
    assert.equal(client.calls[0].payload.owner_id, undefined);
    assert.equal(client.calls[0].payload.publication_consent, undefined);
  });

  it('getOrCreate handles a missing row by inserting a private draft', async () => {
    const row = samplePassportRow();
    const client = createFakeSupabaseClient({
      selectResults: [{ data: null, error: null }],
      insertResults: [{ data: row, error: null }],
    });

    const passport = await getOrCreatePrivateDraft(client, sampleSession(), { alias: 'New' });

    assert.equal(passport.id, 'passport-1');
    assert.equal(client.calls.some((call) => call.type === 'insert'), true);
  });

  it('getOrCreate recovers after a unique owner conflict', async () => {
    const row = samplePassportRow();
    const client = createFakeSupabaseClient({
      selectResults: [
        { data: null, error: null },
        { data: row, error: null },
      ],
      insertResults: [{ data: null, error: { code: '23505', message: 'duplicate key' } }],
    });

    const passport = await getOrCreatePrivateDraft(client, sampleSession(), { alias: 'Raced' });

    assert.equal(passport.id, 'passport-1');
    assert.equal(client.calls.filter((call) => call.type === 'select').length, 2);
  });

  it('does not let callers supply a different owner id', () => {
    const payload = buildCreateDraftPayload('owner-1', {
      ownerId: 'owner-2',
      owner_id: 'owner-3',
      alias: 'Player',
    });

    assert.equal(payload.owner_id, 'owner-1');
  });

  it('rejects excessive alias and bio values', () => {
    const validation = validatePresentationInput({
      alias: 'a'.repeat(65),
      bioShort: 'b'.repeat(201),
    });

    assert.equal(validation.ok, false);
    assert.equal(Boolean(validation.errors.alias), true);
    assert.equal(Boolean(validation.errors.bioShort), true);
  });

  it('scene_config only allows known keys and values', () => {
    assert.deepEqual(sanitizeSceneConfig({
      layout: 'compact',
      accent: 'emerald',
      density: 'dense',
      rawPayload: 'nope',
    }), {
      layout: 'compact',
      accent: 'emerald',
      density: 'dense',
    });

    assert.deepEqual(buildPresentationPayload({
      sceneConfig: { layout: 'script', accent: 'red', density: 'huge' },
    }).scene_config, {
      layout: 'classic',
      accent: 'cyan',
      density: 'comfortable',
    });
  });

  it('does not reload a dirty draft for the same owner during session refresh', () => {
    assert.equal(shouldLoadDraftForOwner({
      isConfigured: true,
      ownerId: 'owner-1',
      loadedOwnerId: null,
    }), true);

    assert.equal(shouldLoadDraftForOwner({
      isConfigured: true,
      ownerId: 'owner-1',
      loadedOwnerId: 'owner-1',
      isDirty: true,
    }), false);

    assert.equal(shouldLoadDraftForOwner({
      isConfigured: true,
      ownerId: 'owner-2',
      loadedOwnerId: 'owner-1',
    }), true);
  });
});

function sampleSession() {
  return { user: { id: 'owner-1', email: 'player@example.test' } };
}

function makeJwt(payload) {
  return [
    encodeBase64Url({ alg: 'HS256', typ: 'JWT' }),
    encodeBase64Url(payload),
    'signature',
  ].join('.');
}

function encodeBase64Url(value) {
  return Buffer.from(JSON.stringify(value))
    .toString('base64url');
}

function samplePassportRow() {
  return {
    id: 'passport-1',
    owner_id: 'owner-1',
    slug: null,
    status: 'draft_private',
    alias: 'Player',
    avatar_url: 'https://example.test/avatar.png',
    bio_short: 'Short bio',
    publication_consent: false,
    scene_config: { layout: 'compact', accent: 'emerald', density: 'dense' },
    created_at: '2026-06-23T00:00:00Z',
    updated_at: '2026-06-23T00:00:00Z',
    published_at: null,
    unpublished_at: null,
    suspended_at: null,
  };
}

function createFakeSupabaseClient({ selectResults = [], insertResults = [], updateResults = [] }) {
  const calls = [];
  return {
    calls,
    from(table) {
      return new FakeQuery(table, calls, { selectResults, insertResults, updateResults });
    },
  };
}

class FakeQuery {
  constructor(table, calls, queues) {
    this.table = table;
    this.calls = calls;
    this.queues = queues;
    this.mode = 'select';
    this.payload = null;
    this.filters = [];
  }

  select(columns) {
    this.columns = columns;
    return this;
  }

  eq(column, value) {
    this.filters.push({ column, value });
    return this;
  }

  insert(payload) {
    this.mode = 'insert';
    this.payload = payload;
    this.calls.push({ type: 'insert', table: this.table, payload });
    return this;
  }

  update(payload) {
    this.mode = 'update';
    this.payload = payload;
    this.calls.push({ type: 'update', table: this.table, payload });
    return this;
  }

  async maybeSingle() {
    if (this.mode === 'insert') return this.queues.insertResults.shift();
    if (this.mode === 'update') return this.queues.updateResults.shift();
    this.calls.push({ type: 'select', table: this.table, filters: this.filters });
    return this.queues.selectResults.shift();
  }
}
