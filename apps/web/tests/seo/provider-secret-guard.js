import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Allow only reviewed redirect-validation expressions, never an API call or token exchange.
export function withoutReviewedOsuRedirectGuard(source) {
  return source.replace("url.origin !== 'https://osu.ppy.sh' || url.pathname !== '/oauth/authorize'", 'REVIEWED_REDIRECT_GUARD')
    .replace("url.origin !== 'https://www.bungie.net' || url.pathname !== '/en/OAuth/Authorize'", 'REVIEWED_BUNGIE_REDIRECT_GUARD');
}

export function assertNoProviderSecrets(source) {
  // Only reviewed transports can forward Parent Auth. No provider credentials or token storage.
  let checked = source;
  for (const file of ['privateOsuPersistence.js', 'robloxLinking.js', 'osuLinking.js', 'savedOsuConnections.js', 'steamLinking.js', 'bungieLinking.js']) {
    const transport = readFileSync(new URL('../../src/gaming-passport/data/' + file, import.meta.url), 'utf8');
    assert.doesNotMatch(transport, /localStorage|sessionStorage|console\.|refresh_token|client_secret/i);
    const withoutParentAccess = transport.replace(/\bsession(?:\?\.|\.)access_token\b/g, 'PARENT_AUTH_SESSION_FIELD');
    checked = checked.replace(transport, withoutParentAccess);
  }
  assert.doesNotMatch(checked,
    /OSU_CLIENT_SECRET|ROBLOX_CLIENT_SECRET|ROBLOX_COOKIE_KEY|STEAM_WEB_API_KEY|STEAM_COOKIE_KEY|STEAM_PASSPORT_DATABASE_URL|BUNGIE_API_KEY|BUNGIE_CLIENT_SECRET|BUNGIE_COOKIE_KEY|BUNGIE_PASSPORT_DATABASE_URL|SUPABASE_SERVICE_ROLE_KEY|access_token|refresh_token|client_secret|token_ciphertext/i);
}
