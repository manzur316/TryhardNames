import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

export function assertNoProviderSecrets(source) {
  // Only reviewed transports can forward Parent Auth. No provider credentials or token storage.
  let checked = source;
  for (const file of ['privateOsuPersistence.js', 'robloxLinking.js']) {
    const transport = readFileSync(new URL('../../src/gaming-passport/data/' + file, import.meta.url), 'utf8');
    assert.doesNotMatch(transport, /localStorage|sessionStorage|console\.|refresh_token|client_secret/i);
    const withoutParentAccess = transport.replace(/\bsession(?:\?\.|\.)access_token\b/g, 'PARENT_AUTH_SESSION_FIELD');
    checked = checked.replace(transport, withoutParentAccess);
  }
  assert.doesNotMatch(checked,
    /OSU_CLIENT_SECRET|ROBLOX_CLIENT_SECRET|ROBLOX_COOKIE_KEY|SUPABASE_SERVICE_ROLE_KEY|access_token|refresh_token|client_secret|token_ciphertext/i);
}
