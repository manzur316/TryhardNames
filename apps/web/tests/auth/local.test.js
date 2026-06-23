import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createClient } from '@supabase/supabase-js';
import {
  getOrCreatePrivateDraft,
  updatePassportPresentation,
} from '../../src/gaming-passport/data/passportRepository.js';

test('local Supabase Parent Auth creates and edits a private Passport draft', async () => {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  assert.ok(url, 'VITE_SUPABASE_URL is required');
  assert.ok(key, 'VITE_SUPABASE_PUBLISHABLE_KEY is required');

  const supabase = createClient(url, key, {
    auth: {
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });

  const unique = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const email = `passport-${unique}@example.test`;
  const password = `Test-${unique}-pass`;

  const signUp = await supabase.auth.signUp({ email, password });
  assert.equal(signUp.error, null);

  const signIn = signUp.data.session
    ? { data: signUp.data, error: null }
    : await supabase.auth.signInWithPassword({ email, password });

  assert.equal(signIn.error, null);
  assert.ok(signIn.data.session);

  const draft = await getOrCreatePrivateDraft(supabase, signIn.data.session, {
    alias: 'Local Draft',
    bioShort: 'Created by local auth integration.',
    sceneConfig: {
      layout: 'classic',
      accent: 'cyan',
      density: 'comfortable',
    },
  });

  assert.equal(draft.ownerId, signIn.data.session.user.id);
  assert.equal(draft.status, 'draft_private');
  assert.equal(draft.slug, null);
  assert.equal(draft.publicationConsent, false);

  const updated = await updatePassportPresentation(supabase, signIn.data.session, draft.id, {
    alias: 'Updated Local Draft',
    avatarUrl: '',
    bioShort: 'Updated through anon RLS.',
    sceneConfig: {
      layout: 'compact',
      accent: 'emerald',
      density: 'dense',
      ignored: true,
    },
  });

  assert.equal(updated.alias, 'Updated Local Draft');
  assert.equal(updated.status, 'draft_private');
  assert.equal(updated.slug, null);
  assert.equal(updated.publicationConsent, false);
  assert.deepEqual(updated.sceneConfig, {
    layout: 'compact',
    accent: 'emerald',
    density: 'dense',
  });

  const signedOut = await supabase.auth.signOut();
  assert.equal(signedOut.error, null);
});
