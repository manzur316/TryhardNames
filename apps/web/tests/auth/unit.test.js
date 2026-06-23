import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildCreateDraftPayload,
  buildPresentationPayload,
  createPrivateDraft,
  getOrCreatePrivateDraft,
  getOwnedPassport,
  mapPassportRow,
  sanitizeSceneConfig,
  updatePassportPresentation,
  validatePresentationInput,
} from '../../src/gaming-passport/data/passportRepository.js';
import {
  createSupabaseClientFromFactory,
  readSupabaseConfig,
  sanitizeReturnTo,
  signInWithEmail,
  signInWithGoogle,
  signOutWithSupabase,
  signUpWithEmail,
} from '../../src/lib/supabase/index.js';
import { buildPublicPassportProjection } from '../../src/gaming-passport/domain/index.js';

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
      VITE_SUPABASE_PUBLISHABLE_KEY: 'anon-key',
    });
    const client = createSupabaseClientFromFactory((url, key, options) => ({ url, key, options }), config);

    assert.equal(config.isConfigured, true);
    assert.equal(client.url, 'http://127.0.0.1:54321');
    assert.equal(client.key, 'anon-key');
    assert.equal(client.options.auth.flowType, 'pkce');
    assert.equal(client.options.auth.persistSession, true);
  });

  it('rejects prohibited admin-shaped browser config', () => {
    const config = readSupabaseConfig({
      VITE_SUPABASE_URL: 'http://127.0.0.1:54321',
      VITE_SUPABASE_PUBLISHABLE_KEY: ['sb', 'secret_not_allowed'].join('_'),
    });

    assert.equal(config.isConfigured, false);
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

describe('Gaming Passport draft repository', () => {
  it('transforms owned Passport rows into the frontend model', async () => {
    const row = samplePassportRow();
    const client = createFakeSupabaseClient({ selectResults: [{ data: row, error: null }] });

    const passport = await getOwnedPassport(client, sampleSession());

    assert.equal(passport.ownerId, row.owner_id);
    assert.equal(passport.avatarUrl, row.avatar_url);
    assert.equal(passport.bioShort, row.bio_short);
    assert.deepEqual(passport.sceneConfig, row.scene_config);
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
});

function sampleSession() {
  return { user: { id: 'owner-1', email: 'player@example.test' } };
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
