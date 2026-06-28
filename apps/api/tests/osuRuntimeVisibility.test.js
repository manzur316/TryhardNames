import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import {
  getOsuConnectionStatus,
  setOsuProfileProofVisibility,
} from '../src/integrations/osu/runtimeStore.js';

const now = '2026-06-28T16:00:00.000Z';

describe('RM-32 osu! owner proof visibility controls', () => {
  it('exposes proof visibility in owner status without raw internals', async () => {
    const supabase = fakeSupabase(baseState());

    const connections = await getOsuConnectionStatus(supabase, {
      ownerId: 'owner_1',
      passportId: 'passport_1',
    });

    assert.equal(connections.length, 1);
    assert.equal(connections[0].provider, 'osu');
    assert.equal(connections[0].visibility, 'private');
    assert.deepEqual(connections[0].proof, {
      type: 'profile_linked',
      source: 'osu',
      label: 'Linked osu! account',
      status: 'current',
      visibility: 'private',
      verifiedAt: now,
      lastSyncedAt: now,
      staleAt: null,
      revokedAt: null,
      publicServingAllowed: false,
    });

    const json = JSON.stringify(connections);
    for (const forbidden of [
      'external_account_id',
      'owner_id',
      'passport_id',
      'linked_provider_account_id',
      'metadata_safe',
      'token',
    ]) {
      assert.equal(json.includes(forbidden), false, forbidden);
    }
  });

  it('lets the owner set a current verified osu! proof from private to public preference', async () => {
    const supabase = fakeSupabase(baseState());

    const result = await setOsuProfileProofVisibility(supabase, {
      ownerId: 'owner_1',
      passportId: 'passport_1',
      linkedProviderAccountId: 'lpa_osu',
      nextVisibility: 'public',
    });

    assert.equal(result.status, 'proof_visibility_updated');
    assert.equal(result.visibility, 'public');
    assert.equal(result.connection.visibility, 'public');
    assert.equal(result.connection.proof.visibility, 'public');
    assert.equal(result.publicServingAllowed, false);
    assert.equal(result.projectionEligibility.reason, 'public_projection_allowlist_disabled');
    assert.equal(supabase.state.linked_provider_accounts[0].visibility, 'public');
    assert.equal(supabase.state.verified_proofs[0].visibility, 'public');
    assert.equal(supabase.state.provider_audit_events[0].event_status, 'owner_requested_public_projection_gated');
  });

  it('lets the owner revert a public preference back to private', async () => {
    const supabase = fakeSupabase(baseState({
      account: { visibility: 'public' },
      proof: { visibility: 'public' },
    }));

    const result = await setOsuProfileProofVisibility(supabase, {
      ownerId: 'owner_1',
      passportId: 'passport_1',
      linkedProviderAccountId: 'lpa_osu',
      nextVisibility: 'private',
    });

    assert.equal(result.visibility, 'private');
    assert.equal(result.projectionEligibility.reason, 'linked_provider_not_public');
    assert.equal(supabase.state.linked_provider_accounts[0].visibility, 'private');
    assert.equal(supabase.state.verified_proofs[0].visibility, 'private');
  });

  it('blocks wrong owner, unpublished passport, revoked provider, stale proof, and non-osu account writes', async () => {
    await assertRejectsVisibility(baseState(), { ownerId: 'owner_2' }, 'passport_not_found');
    await assertRejectsVisibility(baseState({
      passport: { status: 'draft_private', publication_consent: false },
    }), {}, 'passport_not_publication_ready');
    await assertRejectsVisibility(baseState({
      account: { status: 'revoked', revoked_at: now },
    }), {}, 'linked_provider_not_current');
    await assertRejectsVisibility(baseState({
      proof: { status: 'stale', stale_at: now },
    }), {}, 'profile_linked_proof_not_current');
    await assertRejectsVisibility(baseState({
      account: { provider: 'riot' },
      proof: { provider: 'riot', source_key: 'riot:rank' },
    }), {}, 'non_osu_provider_rejected');
  });

  it('keeps auth and safe response enforcement on the API route', () => {
    const routeSource = readFileSync(new URL('../src/integrations/osu/routes.js', import.meta.url), 'utf8');
    const proofVisibilityRoute = routeSource.slice(routeSource.indexOf("r.post('/proof-visibility'"));

    assert.match(proofVisibilityRoute, /r\.post\('\/proof-visibility'/);
    assert.match(proofVisibilityRoute, /requireOwnerSession\(req, supabase\)/);
    assert.match(proofVisibilityRoute, /setOsuProfileProofVisibility/);
    assert.doesNotMatch(proofVisibilityRoute, /access_token|refresh_token|client_secret|OSU_CLIENT_SECRET|SUPABASE_SERVICE_ROLE_KEY/);
  });
});

async function assertRejectsVisibility(state, overrides = {}, expectedMessage) {
  const supabase = fakeSupabase(state);
  await assert.rejects(
    () => setOsuProfileProofVisibility(supabase, {
      ownerId: overrides.ownerId || 'owner_1',
      passportId: overrides.passportId || 'passport_1',
      linkedProviderAccountId: overrides.linkedProviderAccountId || 'lpa_osu',
      nextVisibility: overrides.nextVisibility || 'public',
    }),
    (error) => error?.message === expectedMessage
  );
}

function baseState(overrides = {}) {
  return {
    gaming_passports: [{
      id: 'passport_1',
      owner_id: 'owner_1',
      status: 'published',
      publication_consent: true,
      suspended_at: null,
      ...(overrides.passport || {}),
    }],
    linked_provider_accounts: [{
      id: 'lpa_osu',
      owner_id: 'owner_1',
      passport_id: 'passport_1',
      provider: 'osu',
      display_name: 'OsuOwner',
      status: 'verified',
      visibility: 'private',
      verified_at: now,
      last_synced_at: now,
      stale_at: null,
      revoked_at: null,
      metadata_safe: { profileUrl: 'https://osu.ppy.sh/users/123' },
      ...(overrides.account || {}),
    }],
    verified_proofs: [{
      id: 'proof_osu',
      linked_provider_account_id: 'lpa_osu',
      owner_id: 'owner_1',
      passport_id: 'passport_1',
      provider: 'osu',
      proof_type: 'provider_ownership',
      source_key: 'osu:profile_linked',
      source: 'linked_provider',
      verification_method: 'oauth',
      status: 'current',
      visibility: 'private',
      verified_at: now,
      last_synced_at: now,
      stale_at: null,
      revoked_at: null,
      ...(overrides.proof || {}),
    }],
    provider_audit_events: [],
  };
}

function fakeSupabase(seed) {
  const state = JSON.parse(JSON.stringify(seed));
  return {
    state,
    from(table) {
      return new FakeQuery(state, table);
    },
  };
}

class FakeQuery {
  constructor(state, table) {
    this.state = state;
    this.table = table;
    this.filters = [];
    this.inFilters = [];
    this.patch = null;
    this.insertPayload = null;
  }

  select() {
    return this;
  }

  eq(key, value) {
    this.filters.push({ key, value });
    return this;
  }

  in(key, values) {
    this.inFilters.push({ key, values });
    return this;
  }

  order() {
    return this;
  }

  update(patch) {
    this.patch = patch;
    return this;
  }

  insert(payload) {
    this.insertPayload = payload;
    return this;
  }

  maybeSingle() {
    const rows = this.execute();
    return Promise.resolve({ data: rows[0] || null, error: null });
  }

  then(resolve, reject) {
    try {
      return Promise.resolve(resolve({ data: this.execute(), error: null }));
    } catch (error) {
      if (reject) return Promise.resolve(reject(error));
      return Promise.reject(error);
    }
  }

  execute() {
    const rows = this.state[this.table] || [];
    if (this.insertPayload) {
      const inserted = {
        ...this.insertPayload,
        id: this.insertPayload.id || `${this.table}_${rows.length + 1}`,
      };
      rows.push(inserted);
      return [clone(inserted)];
    }

    const matchedRows = rows.filter((row) => {
      return this.filters.every(({ key, value }) => row[key] === value) &&
        this.inFilters.every(({ key, values }) => Array.isArray(values) && values.includes(row[key]));
    });

    if (this.patch) {
      for (const row of matchedRows) Object.assign(row, this.patch);
    }

    return matchedRows.map(clone);
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
