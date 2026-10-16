import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { readWorkspaceDraft, removeLegacyPresentationParams, saveWorkspaceDraft, WORKSPACE_DRAFT_KEY } from '../../src/gaming-passport/data/workspaceDraft.js';
import { buildPrivateOsuCard } from '../../src/gaming-passport/data/privateOsuCard.js';
import { getSavedOsuConnections, mapSavedOsuConnection } from '../../src/gaming-passport/data/savedOsuConnections.js';
import { buildPrivateGameHighlights } from '../../src/gaming-passport/data/privateGameHighlights.js';
import { GAME_BADGES, getGameBadge } from '../../src/gaming-passport/data/gameBadges.js';
import { PROFILE_BACKGROUND_OPTIONS, resolveProfileBackground, sanitizeProfileBackgroundId } from '../../src/gaming-passport/data/profileBackgrounds.js';
import { AVATAR_FRAME_OPTIONS, resolveAvatarFrame, sanitizeAvatarFrameId } from '../../src/gaming-passport/data/avatarFrames.js';
import { buildPresentationPayload, mapPassportRow, sanitizeSceneConfig } from '../../src/gaming-passport/data/passportRepository.js';
import { mapPublicPassportV2, publicGameHighlights } from '../../src/gaming-passport/data/publicPassportV2.js';

test('public presentation preserves consent-filtered stats and rejects private provider payloads', () => {
  const game = { provider: 'osu', username: 'Player', displayName: 'Player', verifiedAt: '2026-10-15T00:00:00Z', updatedAt: '2026-10-15T00:00:00Z', stale: false, stats: null };
  const value = { schemaVersion: 2, slug: 'player', alias: 'Player', bio: '', avatarUrl: '', scene: {}, games: [game] };
  const mapped = mapPublicPassportV2(value);
  assert.equal(mapped.games[0].stats, null);
  assert.equal(publicGameHighlights(mapped.games)[0].pp, null);
  assert.equal(publicGameHighlights(mapped.games)[0].globalRank, null);
  assert.equal(mapPublicPassportV2({ ...value, games: [{ ...game, metadata_safe: {} }] }), null);
  assert.equal(mapPublicPassportV2({ ...value, games: [{ ...game, provider: 'steam' }] }), null);
  const withStats = mapPublicPassportV2({ ...value, games: [{ ...game, stats: { mode: 'osu', pp: 0, medals: 0, accuracyPercent: 98.4, globalRank: 3050088, countryRank: 42 } }] });
  assert.equal(withStats.games[0].stats.pp, 0);
  assert.equal(publicGameHighlights(withStats.games)[0].globalRank, '#3,050,088');
});

test('published preview and public route share presentation and sanitized public repository', () => {
  const read = file => readFileSync(new URL('../../src/' + file, import.meta.url), 'utf8');
  const preview = read('gaming-passport/components/PublishedPassportPreview.jsx');
  const page = read('pages/PublicGamingPassportPage.jsx');
  const card = read('gaming-passport/components/PublicPassportProfile.jsx');
  assert.match(preview, /getPublicPassportBySlug\(client, slug\)/);
  assert.match(preview, /<PublicPassportProfile passport=\{state.passport\}/);
  assert.match(page, /<PublicPassportProfile passport=\{passport\}/);
  assert.doesNotMatch(preview, /linked_provider_accounts|metadata_safe|access_token/);
  assert.match(card, /gp-profile-game-art/);
  assert.match(card, /Number.isFinite\(game.stats\?\.\[key\]\)/);
  assert.match(read('gaming-passport/components/PassportWorkspace.jsx'), /id=\{publicPreview \? undefined : 'gp-linked-games'\}/);
});

function storage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return { getItem: (key) => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
}

const savedOsuRow = {
  id: 'saved-account', owner_id: 'owner', passport_id: 'passport', provider: 'osu',
  external_account_id: '12345', status: 'verified', visibility: 'private', revoked_at: null,
  verified_at: '2026-10-15T00:00:00Z', last_synced_at: '2026-10-15T00:00:00Z',
  metadata_safe: { normalizerVersion: 'osu.private.v1', snapshot: {
    username: 'Saved player', mode: 'osu', pp: 2.83, globalRank: 3050088,
    countryRank: null, accuracyPercent: 92.5, medals: 0, arbitrary: 'excluded',
  } },
};

test('saved osu! owner read restores card and header without a local OAuth service', async () => {
  const calls = [];
  const query = {};
  for (const method of ['select', 'eq', 'in', 'is', 'order']) query[method] = (...args) => {
    calls.push([method, ...args]); return query;
  };
  query.abortSignal = async () => ({ data: [savedOsuRow, { ...savedOsuRow, owner_id: 'other' },
    { ...savedOsuRow, passport_id: 'other' }, { ...savedOsuRow, status: 'revoked' }], error: null });
  const client = { from(table) { assert.equal(table, 'linked_provider_accounts'); return query; } };
  const saved = await getSavedOsuConnections(client, { access_token: 'test-only', user: { id: 'owner' } }, 'passport', new AbortController().signal);
  assert.equal(saved.length, 1);
  assert.equal(buildPrivateOsuCard(saved[0]).pp, '2.83');
  assert.equal(buildPrivateGameHighlights(saved)[0].game, 'osu!');
  assert.ok(calls.some((call) => JSON.stringify(call) === JSON.stringify(['eq', 'owner_id', 'owner'])));
  assert.ok(calls.some((call) => JSON.stringify(call) === JSON.stringify(['eq', 'passport_id', 'passport'])));
  assert.ok(calls.some((call) => JSON.stringify(call) === JSON.stringify(['eq', 'provider', 'osu'])));
  assert.ok(calls.some((call) => JSON.stringify(call) === JSON.stringify(['is', 'revoked_at', null])));
  for (const field of ['owner_id', 'passport_id', 'metadata_safe', 'external_account_id', 'arbitrary']) assert.equal(saved[0][field], undefined);
});

test('saved osu! reads require an owner session and propagate load failures', async () => {
  const client = { from() { throw new Error('must not query'); } };
  for (const session of [null, { user: { id: 'owner' } }, { access_token: 'test-only' }]) {
    await assert.rejects(() => getSavedOsuConnections(client, session, 'passport'), /sign_in_required/);
  }
  const query = {};
  for (const method of ['select', 'eq', 'in', 'is', 'order']) query[method] = () => query;
  query.abortSignal = async () => ({ data: null, error: new Error('read failed') });
  await assert.rejects(() => getSavedOsuConnections({ from: () => query },
    { access_token: 'test-only', user: { id: 'owner' } }, 'passport'), /read failed/);
});

test('saved osu! display fails closed for revoked, unsupported and unverified rows', () => {
  for (const patch of [{ status: 'revoked' }, { status: 'pending' }, { status: 'failed' },
    { visibility: 'public' }, { provider: 'roblox' }, { revoked_at: '2026-10-15T00:00:00Z' },
    { external_account_id: '123?bad' }, { verified_at: null }, { metadata_safe: {} }]) {
    assert.equal(mapSavedOsuConnection({ ...savedOsuRow, ...patch }), null);
  }
  assert.equal(mapSavedOsuConnection(null), null);
  const fresh = mapSavedOsuConnection(savedOsuRow, Date.parse('2026-10-15T01:00:00Z'));
  assert.equal(fresh.status, 'verified');
  assert.equal(fresh.avatarUrl, 'https://a.ppy.sh/12345');
  assert.equal(mapSavedOsuConnection(savedOsuRow, Date.parse('2026-10-16T00:00:00Z')).status, 'stale');
});

test('production renders saved osu! independently of development linking and clears stale requests', () => {
  const source = readFileSync(new URL('../../src/gaming-passport/components/PassportWorkspace.jsx', import.meta.url), 'utf8');
  assert.match(source, /import SavedOsuConnections from/);
  assert.match(source, /!showOsuPersistence && !showOsuProbe && <SavedOsuConnections/);
  assert.match(source, /\[\.\.\.gameHighlights, \.\.\.linkedRobloxHighlights, \.\.\.linkedSteamHighlights\]/);
  const component = readFileSync(new URL('../../src/gaming-passport/components/SavedOsuConnections.jsx', import.meta.url), 'utf8');
  assert.match(component, /requestVersion !== version/);
  assert.match(component, /controller\?\.abort\(\)/);
  assert.match(component, /onHighlightsChange\(\[\]\)/);
  assert.doesNotMatch(component, /localhost|\.rpc\(|localStorage|requestOsuPersistence/);
  const card = readFileSync(new URL('../../src/gaming-passport/components/PrivateOsuAccountCard.jsx', import.meta.url), 'utf8');
  assert.match(card, /onUnlink && \(confirmUnlink/);
});

test('legacy Identity Kit alias and bio become presentation, never verified data', () => {
  const old = JSON.stringify({ primaryAlias: 'Nexor', bioLine: 'My story', rank: 'diamond', ownerId: 'other' });
  const store = storage({ 'tryhardnames:identity-kit:v1': old });
  const result = readWorkspaceDraft(store);
  assert.equal(result.imported, true);
  assert.equal(result.form.alias, 'Nexor');
  assert.equal(result.form.bioShort, 'My story');
  assert.equal(result.form.rank, undefined);
  assert.equal(result.form.ownerId, undefined);
  assert.equal(store.getItem('tryhardnames:identity-kit:v1'), old);
});

test('saved workspace takes precedence over a legacy kit', () => {
  const store = storage({ 'tryhardnames:identity-kit:v1': JSON.stringify({ primaryAlias: 'Old' }) });
  saveWorkspaceDraft(store, { alias: 'New', bioShort: 'New bio' });
  assert.equal(readWorkspaceDraft(store).form.alias, 'New');
});

test('local save persists only validated presentation fields', () => {
  const store = storage();
  saveWorkspaceDraft(store, { alias: 'Player', ownerId: 'not-allowed', status: 'published', slug: 'fake', publicationConsent: true,
    verifiedProofs: [{}], sceneConfig: { accent: 'emerald', arbitrary: true } });
  const stored = JSON.parse(store.getItem(WORKSPACE_DRAFT_KEY));
  assert.deepEqual(Object.keys(stored).sort(), ['alias', 'avatarUrl', 'bioShort', 'sceneConfig']);
  assert.equal(stored.sceneConfig.accent, 'emerald');
  assert.equal(stored.sceneConfig.arbitrary, undefined);
});

test('old prefill links retain only bounded alias and bio', () => {
  const result = readWorkspaceDraft(storage(), `?primary=${'a'.repeat(70)}&bio=${'b'.repeat(210)}&ownerId=other&status=published`);
  assert.equal(result.form.alias.length, 64);
  assert.equal(result.form.bioShort.length, 200);
  assert.equal(result.form.status, undefined);
});

test('invalid and unavailable local storage do not break loading', () => {
  assert.equal(readWorkspaceDraft(storage({ [WORKSPACE_DRAFT_KEY]: '{broken' })).form.alias, '');
  assert.equal(readWorkspaceDraft({ getItem() { throw new Error('denied'); } }).form.alias, '');
});

test('removing legacy presentation parameters preserves explicit non-persistent osu! mode', () => {
  const original = new URLSearchParams('primary=Player&bio=Story&styled=1&label=Old&osuProbe=1&osuPersist=1');
  assert.equal(removeLegacyPresentationParams(original).toString(), 'osuProbe=1&osuPersist=1');
  assert.equal(original.has('primary'), true);
  assert.equal(removeLegacyPresentationParams('?osuProbe=1').toString(), 'osuProbe=1');
});

test('invalid fields and failed local writes never report a successful save', () => {
  assert.throws(() => saveWorkspaceDraft(storage(), { avatarUrl: 'javascript:alert(1)' }));
  assert.throws(() => saveWorkspaceDraft(storage(), { alias: 'a'.repeat(65) }));
  assert.throws(() => saveWorkspaceDraft(null, {}));
  assert.throws(() => saveWorkspaceDraft({ setItem() { throw new Error('quota'); } }, {}));
});

test('both entry points converge on one editor without public sample identities', () => {
  const read = (file) => readFileSync(new URL(`../../src/${file}`, import.meta.url), 'utf8');
  assert.match(read('pages/IdentityKitPage.jsx'), /<Navigate to=\{`\/gaming-passport\$\{search\}`\} replace/);
  assert.match(read('pages/GamingPassportPage.jsx'), /<PassportWorkspace/);
  const editor = read('gaming-passport/components/PassportWorkspace.jsx');
  assert.match(editor, /updatePassportPresentation/);
  assert.match(editor, /\[ownerId, auth.isConfigured, retry\]/);
  assert.match(editor, /key=\{auth.user\?\.id \|\| 'local'\}/);
  assert.doesNotMatch(editor, /externalAccountId|competitive_rank|23500|Diamond|Emerald IV/);
});

test('shared public scene has no private biography or parent identity input', () => {
  const source = readFileSync(new URL('../../src/gaming-passport/components/PublicPassportCard.jsx', import.meta.url), 'utf8');
  assert.match(source, /PassportIdentityScene/);
  assert.doesNotMatch(source, /bio|ownerId|email|session|privatePreview/);
});

test('private header combines a decorative backdrop and actual games without changing public or share guards', () => {
  const source = readFileSync(new URL('../../src/gaming-passport/components/PassportIdentityScene.jsx', import.meta.url), 'utf8');
  assert.match(source, /const richPresentation = privatePreview \|\| publicPresentation/);
  assert.match(source, /publicPresentation = false/);
  assert.match(source, /!richPresentation && <img className="gp-cover" src="\/passport\/passport-citadel\.webp"/);
  assert.match(source, /richPresentation && <img className="gp-owner-backdrop"[^>]+src=\{background\.src\} alt="" aria-hidden="true"/);
  assert.match(source, /richPresentation \? resolveProfileBackground\(scene\.backgroundId\) : null/);
  assert.match(source, /data-highlight-count=\{richPresentation \? highlightCount : undefined\}/);
  assert.match(source, /const highlightCount = richPresentation \? gameHighlights.length \+ probeHighlights.length : 0/);
  assert.match(source, /const hasHighlights = richPresentation && highlightCount > 0/);
  assert.match(source, /hasHighlights && <PrivateGameHighlights highlights=\{gameHighlights\}/);
  assert.match(source, /richPresentation \? 'gp-scene-owner' : ''/);
  assert.match(source, /if \(privatePreview \|\| !slug\) return/);
  assert.match(source, /!privatePreview && slug/);
  assert.match(source, /richPresentation && bio/);
  assert.doesNotMatch(source, /auth\.user|user_metadata|email|verifiedProofs|competitive_rank|level|ShieldCheck/);
});

test('private highlights use bounded single tiles and a two-column desktop mosaic', () => {
  const css = readFileSync(new URL('../../src/gaming-passport/components/privateIdentityScene.css', import.meta.url), 'utf8');
  assert.match(css, /\[data-highlight-count="1"\] \{ --highlight-width: 260px;/);
  assert.match(css, /\.gp-highlight-grid \{ display: grid; grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.gp-scene-owner::after \{ display: block; background: linear-gradient/);
});

test('user-supplied game insignias have stable names and bounded local assets', () => {
  assert.ok(Object.isFrozen(GAME_BADGES));
  assert.deepEqual(GAME_BADGES.map((badge) => badge.id), [
    'fortnite', 'rocket-league', 'apex-legends', 'valorant', 'osu', 'counter-strike-2', 'brawl-stars', 'league-of-legends', 'clash-of-clans', 'roblox', 'steam',
  ]);
  assert.equal(new Set(GAME_BADGES.map((badge) => badge.game)).size, 11);
  let totalBytes = 0;
  for (const badge of GAME_BADGES) {
    assert.ok(Object.isFrozen(badge));
    assert.deepEqual(Object.keys(badge).sort(), ['game', 'id', 'src']);
    assert.equal(getGameBadge(badge.game), badge);
    if (badge.id === 'steam') {
      assert.equal(badge.src, 'https://store.fastly.steamstatic.com/public/shared/images/header/logo_steam.svg');
      continue;
    }
    assert.equal(badge.src, `/passport/game-badges/${badge.id}.${badge.id === 'roblox' ? 'png' : 'webp'}`);
    const bytes = readFileSync(new URL(`../../public${badge.src}`, import.meta.url));
    if (badge.id === 'roblox') {
      assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
      assert.ok(bytes.length < 2_000_000);
      continue;
    }
    assert.equal(bytes.subarray(0, 4).toString(), 'RIFF');
    assert.equal(bytes.subarray(8, 12).toString(), 'WEBP');
    assert.ok(bytes.length < 80_000);
    totalBytes += bytes.length;
  }
  assert.ok(totalBytes < 500_000);
});

test('badge lookup never accepts arbitrary asset paths or guesses an unknown game', () => {
  for (const input of [null, undefined, {}, '__proto__', 'toString', '/private/file', 'https://other.test/badge', 'Not connected']) {
    assert.equal(getGameBadge(input), null);
  }
  assert.equal(getGameBadge('osu!').id, 'osu');
});

test('badges decorate existing private cards without creating connections or verification claims', () => {
  const read = (file) => readFileSync(new URL(`../../src/gaming-passport/components/${file}`, import.meta.url), 'utf8');
  const badge = read('GameBadge.jsx');
  assert.match(badge, /aria-hidden="true"/);
  assert.match(badge, /src=\{badge\.src\} alt=""/);
  assert.doesNotMatch(badge, /fetch\(|localStorage|\.rpc\(|verified|rank|proof|unlock/i);
  assert.match(read('PrivateGameHighlights.jsx'), /tiles\.map/);
  assert.match(read('PrivateGameHighlights.jsx'), /<GameBadge game=\{game\.game\}/);
  assert.doesNotMatch(read('PrivateGameHighlights.jsx'), /GAME_BADGES\.map/);
  assert.match(read('PrivateOsuAccountCard.jsx'), /if \(!card\) return null/);
  assert.match(read('PrivateOsuAccountCard.jsx'), /<GameBadge game="osu!"/);
  const roblox = read('PrivateRobloxProbe.jsx');
  assert.match(roblox, /<GameBadge game="Roblox"/);
  assert.match(roblox, /\{profile.accountId\}/);
  assert.match(roblox, /Not linked to your Passport/);
  assert.doesNotMatch(roblox, /localStorage|sessionStorage|rank|wins|playCount/);
});

test('background pack has eight bounded images and lightweight thumbnails with stable names', () => {
  assert.ok(Object.isFrozen(PROFILE_BACKGROUND_OPTIONS));
  assert.deepEqual(PROFILE_BACKGROUND_OPTIONS.map((item) => item.id), [
    'default', 'sakura-lake', 'sky-islands', 'amethyst-citadel', 'lunar-falls', 'astral-nexus', 'luminous-grove', 'neon-gateway', 'cyber-city',
  ]);
  for (const item of PROFILE_BACKGROUND_OPTIONS) {
    assert.ok(Object.isFrozen(item));
    assert.equal(resolveProfileBackground(item.id), item);
    for (const src of [item.src, item.thumbnail]) {
      assert.match(src, /^\/passport\/[a-z0-9/.-]+\.webp$/);
      const bytes = readFileSync(new URL(`../../public${src}`, import.meta.url));
      assert.equal(bytes.subarray(0, 4).toString(), 'RIFF');
      assert.equal(bytes.subarray(8, 12).toString(), 'WEBP');
      assert.ok(bytes.length < (src.includes('.thumb.') ? 20_000 : 350_000));
    }
  }
});

test('background defaults and invalid IDs preserve the original scene and never accept URLs', () => {
  for (const value of [undefined, null, '', 'default', {}, [], '__proto__', 'toString', 'unknown', '/private/file', 'https://other.test/bg.webp', 'javascript:alert(1)']) {
    assert.equal(sanitizeProfileBackgroundId(value), undefined);
    assert.equal(resolveProfileBackground(value).id, 'default');
    assert.equal(Object.hasOwn(sanitizeSceneConfig({ backgroundId: value }), 'backgroundId'), false);
  }
  assert.equal(resolveProfileBackground().src, '/passport/passport-citadel-v2.webp');
  assert.equal(Object.hasOwn(sanitizeSceneConfig({}), 'backgroundId'), false);
});

test('all background selections survive local save, presentation payload and row mapping', () => {
  for (const background of PROFILE_BACKGROUND_OPTIONS.slice(1)) {
    const store = storage();
    const form = { alias: 'Test player', bioShort: 'Private bio', sceneConfig: {
      backgroundId: background.id, avatarFrameId: 'christmas-frost', accent: 'emerald',
      backgroundUrl: 'https://other.test/private.webp', opacity: 0, ownerId: 'other', status: 'published',
    } };
    saveWorkspaceDraft(store, form);
    assert.equal(readWorkspaceDraft(store).form.sceneConfig.backgroundId, background.id);
    const payload = buildPresentationPayload({ ...form, slug: 'fake', status: 'published', publicationConsent: true });
    assert.deepEqual(Object.keys(payload).sort(), ['alias', 'avatar_url', 'bio_short', 'scene_config']);
    assert.equal(payload.scene_config.backgroundId, background.id);
    assert.equal(payload.scene_config.avatarFrameId, 'christmas-frost');
    assert.equal(payload.scene_config.accent, 'emerald');
    for (const key of ['backgroundUrl', 'opacity', 'ownerId', 'status']) assert.equal(Object.hasOwn(payload.scene_config, key), false);
    const row = mapPassportRow({ ...payload, status: 'draft_private', slug: null, publication_consent: false });
    assert.equal(row.sceneConfig.backgroundId, background.id);
    assert.equal(row.status, 'draft_private');
    assert.equal(row.slug, null);
    assert.equal(row.publicationConsent, false);
    assert.equal(form.sceneConfig.backgroundUrl, 'https://other.test/private.webp');
  }
});

test('restoring Original removes only the optional background selection', () => {
  const scene = sanitizeSceneConfig({ backgroundId: 'sky-islands', avatarFrameId: 'inferno', accent: 'amber' });
  const reset = sanitizeSceneConfig({ ...scene, backgroundId: 'default' });
  assert.equal(Object.hasOwn(reset, 'backgroundId'), false);
  assert.equal(reset.avatarFrameId, 'inferno');
  assert.equal(reset.accent, 'amber');
});

test('background picker is a controlled native radio group and stays outside public projection', () => {
  const picker = readFileSync(new URL('../../src/gaming-passport/components/BackgroundPicker.jsx', import.meta.url), 'utf8');
  assert.match(picker, /<details className="gp-background-picker"/);
  assert.match(picker, /<legend className="sr-only">Profile background<\/legend>/);
  assert.match(picker, /type="radio" name=\{name\}/);
  assert.match(picker, /checked=\{selected\.id === background\.id\}/);
  assert.match(picker, /src=\{background\.thumbnail\}/);
  assert.doesNotMatch(picker, /fetch\(|localStorage|\.rpc\(/);
  const workspace = readFileSync(new URL('../../src/gaming-passport/components/PassportWorkspace.jsx', import.meta.url), 'utf8');
  assert.match(workspace, /onChange=\{\(backgroundId\) => editScene\(\{ backgroundId \}\)\}/);
  const projection = readFileSync(new URL('../../src/gaming-passport/domain/publicProjection.js', import.meta.url), 'utf8');
  assert.doesNotMatch(projection, /backgroundId|backgroundUrl|profileBackgrounds/);
});

test('private header preserves the chosen avatar, with initials or icon on failure', () => {
  const source = readFileSync(new URL('../../src/gaming-passport/components/PassportIdentityScene.jsx', import.meta.url), 'utf8');
  assert.match(source, /avatarUrl \|\| \(decorated \? '\/passport\/moonlit-avatar\.webp' : ''\)/);
  assert.match(source, /avatarSource !== brokenAvatar/);
  assert.match(source, /onError=\{\(\) => setBrokenAvatar\(avatarSource\)\}/);
  assert.match(source, /Array\.from\(alias\)\[0\]\.toUpperCase/);
  assert.match(source, /<UserRound size=\{48\} aria-hidden="true"/);
  assert.doesNotMatch(source, /localStorage|fetch\(|\.rpc\(/);
});

test('header ornament is decoration only and the optimized assets are available', () => {
  const source = readFileSync(new URL('../../src/gaming-passport/components/PassportIdentityScene.jsx', import.meta.url), 'utf8');
  assert.match(source, /richPresentation \? <>/);
  assert.match(source, /className=\{`gp-owner-avatar/);
  assert.match(source, /frame\.src && <img className="gp-avatar-ornament"[^>]+alt="" aria-hidden="true"/);
  for (const name of ['passport-citadel-v2.webp', 'passport-avatar-frame.webp']) {
    const asset = readFileSync(new URL(`../../public/passport/${name}`, import.meta.url));
    assert.equal(asset.subarray(0, 4).toString(), 'RIFF');
    assert.equal(asset.subarray(8, 12).toString(), 'WEBP');
    assert.ok(asset.length < 350_000);
  }
});

test('uploaded avatar frames have stable names, local assets and bounded portrait fits', () => {
  assert.deepEqual(AVATAR_FRAME_OPTIONS.map((frame) => frame.id), ['auto', 'minimal', 'obsidian', 'astral', 'void', 'inferno', 'verdant', 'cyber', 'glacier',
    'halloween-midnight', 'halloween-candy', 'halloween-coven', 'halloween-blood-moon', 'halloween-haunted',
    'christmas-frost', 'christmas-gingerbread', 'christmas-woodland', 'christmas-noel']);
  assert.ok(Object.isFrozen(AVATAR_FRAME_OPTIONS));
  for (const frame of AVATAR_FRAME_OPTIONS) {
    assert.ok(Object.isFrozen(frame));
    if (!frame.src) continue;
    assert.match(frame.src, /^\/passport\/[a-z-]+\.webp$/);
    assert.ok(frame.size > 0 && frame.size < 100 && frame.top >= 0 && frame.size + frame.top <= 100);
    const asset = readFileSync(new URL(`../../public${frame.src}`, import.meta.url));
    assert.equal(asset.subarray(0, 4).toString(), 'RIFF');
    assert.equal(asset.subarray(8, 12).toString(), 'WEBP');
    assert.ok(asset.length < 200_000);
  }
});

test('Halloween is a distinct decorative collection with unique IDs and assets', () => {
  const halloween = AVATAR_FRAME_OPTIONS.filter((frame) => frame.collection === 'halloween');
  assert.deepEqual(halloween.map((frame) => frame.name), ['Midnight', 'Candy', 'Coven', 'Blood Moon', 'Haunted']);
  assert.equal(new Set(AVATAR_FRAME_OPTIONS.map((frame) => frame.id)).size, AVATAR_FRAME_OPTIONS.length);
  const images = AVATAR_FRAME_OPTIONS.filter((frame) => frame.src);
  assert.equal(new Set(images.map((frame) => frame.src)).size, images.length);
  for (const frame of halloween) {
    assert.equal(frame.id, `halloween-${frame.name.toLowerCase().replaceAll(' ', '-')}`);
    assert.equal(frame.src, `/passport/frame-${frame.id}.webp`);
    assert.deepEqual(Object.keys(frame).sort(), ['collection', 'id', 'name', 'size', 'src', 'top']);
  }
  const scene = sanitizeSceneConfig({ avatarFrameId: 'halloween-coven', collection: 'halloween', size: 90, top: 0 });
  assert.equal(scene.avatarFrameId, 'halloween-coven');
  for (const key of ['collection', 'size', 'top']) assert.equal(Object.hasOwn(scene, key), false);
});

test('Christmas frames remain decorative and only their allowlisted IDs can be saved', () => {
  const christmas = AVATAR_FRAME_OPTIONS.filter((frame) => frame.collection === 'christmas');
  assert.deepEqual(christmas.map((frame) => frame.name), ['Frost', 'Gingerbread', 'Woodland', 'Noel']);
  for (const frame of christmas) {
    assert.equal(frame.id, `christmas-${frame.name.toLowerCase()}`);
    assert.equal(frame.src, `/passport/frame-${frame.id}.webp`);
    assert.deepEqual(Object.keys(frame).sort(), ['collection', 'id', 'name', 'size', 'src', 'top']);
    const scene = sanitizeSceneConfig({ avatarFrameId: frame.id, collection: 'christmas', src: frame.src, size: 90, top: 0, unlocked: true });
    assert.equal(scene.avatarFrameId, frame.id);
    for (const key of ['collection', 'src', 'size', 'top', 'unlocked']) assert.equal(Object.hasOwn(scene, key), false);
  }
});

test('legacy theme frames remain automatic and explicit choices are independent of theme', () => {
  assert.equal(resolveAvatarFrame(undefined, true).id, 'obsidian');
  assert.equal(resolveAvatarFrame(undefined, false).id, 'minimal');
  assert.equal(resolveAvatarFrame('auto', true).id, 'obsidian');
  assert.equal(resolveAvatarFrame('minimal', true).src, null);
  for (const { id } of AVATAR_FRAME_OPTIONS.filter((frame) => frame.id !== 'auto')) {
    assert.equal(resolveAvatarFrame(id, true).id, id);
    assert.equal(resolveAvatarFrame(id, false).id, id);
  }
});

test('frame IDs reject paths, CSS, objects and unknown choices', () => {
  for (const value of [null, {}, [], 'constructor', '__proto__', 'Astral', ' astral ', 'url(https://example.test)', '/passport/untrusted.webp']) {
    assert.equal(sanitizeAvatarFrameId(value), undefined);
    assert.equal(resolveAvatarFrame(value, true).id, 'obsidian');
    assert.equal(Object.hasOwn(sanitizeSceneConfig({ avatarFrameId: value }), 'avatarFrameId'), false);
  }
  assert.equal(Object.hasOwn(sanitizeSceneConfig({}), 'avatarFrameId'), false);
});

test('selected frame survives local save and owner row mapping without changing identity or truth', () => {
  const store = storage();
  for (const { id } of AVATAR_FRAME_OPTIONS) {
    const form = { alias: 'Test player', avatarUrl: 'https://a.ppy.sh/123', bioShort: 'Actual draft bio', sceneConfig: { accent: 'amber', avatarFrameId: id } };
    saveWorkspaceDraft(store, form);
    assert.equal(readWorkspaceDraft(store).form.sceneConfig.avatarFrameId, id);
    const payload = buildPresentationPayload({ ...form, status: 'published', slug: 'forbidden', publicationConsent: true });
    assert.deepEqual(Object.keys(payload).sort(), ['alias', 'avatar_url', 'bio_short', 'scene_config']);
    assert.equal(payload.alias, form.alias);
    assert.equal(payload.avatar_url, form.avatarUrl);
    assert.equal(payload.bio_short, form.bioShort);
    assert.equal(payload.scene_config.accent, 'amber');
    assert.equal(payload.scene_config.avatarFrameId, id);
    const row = mapPassportRow({ ...payload, status: 'draft_private', slug: null, publication_consent: false });
    assert.equal(row.sceneConfig.avatarFrameId, id);
    assert.equal(row.status, 'draft_private');
    assert.equal(row.slug, null);
    assert.equal(row.publicationConsent, false);
  }
});

test('frame selector uses native radios and only changes owner presentation', () => {
  const picker = readFileSync(new URL('../../src/gaming-passport/components/AvatarFramePicker.jsx', import.meta.url), 'utf8');
  assert.match(picker, /<legend>Avatar frame<\/legend>/);
  assert.match(picker, /type="radio"/);
  assert.match(picker, /checked=\{selected === frame\.id\}/);
  assert.doesNotMatch(picker, /fetch\(|localStorage|\.rpc\(|getSupabase/);
  const workspace = readFileSync(new URL('../../src/gaming-passport/components/PassportWorkspace.jsx', import.meta.url), 'utf8');
  assert.match(workspace, /onChange=\{\(avatarFrameId\) => editScene\(\{ avatarFrameId \}\)\}/);
  const projection = readFileSync(new URL('../../src/gaming-passport/domain/publicProjection.js', import.meta.url), 'utf8');
  assert.doesNotMatch(projection, /avatarFrameId/);
});

test('private osu! action uses the bundled official logo and preserves authentication gates', () => {
  const source = readFileSync(new URL('../../src/gaming-passport/components/PersistentOsuConnections.jsx', import.meta.url), 'utf8');
  assert.match(source, /src="\/passport\/osu-logo\.png" alt="" width="64" height="64"/);
  assert.match(source, /disabled=\{busy \|\| loading \|\| !passportReady \|\| !configured\}/);
  assert.match(source, /aria-busy=\{busy \|\| loading\}/);
  assert.match(source, /type="button"/);
  assert.match(source, /to="\/sign-in\?returnTo=%2Fgaming-passport"/);
  assert.match(source, /Authorize osu! again/);
  assert.match(source, /Please wait/);
  const logo = readFileSync(new URL('../../public/passport/osu-logo.png', import.meta.url));
  assert.equal(logo.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(logo.readUInt32BE(16), logo.readUInt32BE(20));
});

test('osu! action motion is bounded, reduced-motion aware, and does not transform the logo', () => {
  const css = readFileSync(new URL('../../src/gaming-passport/components/privateOsuProbe.css', import.meta.url), 'utf8');
  assert.match(css, /animation: gp-osu-invite 1\.8s ease-out 2/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /\.gp-osu-connect-button::before, \.gp-osu-connect-spinner \{ animation: none; \}/);
  assert.match(css, /\.gp-osu-connect-button:focus-visible \{ outline: 3px solid/);
  assert.match(css, /width: min\(100%, 360px\)/);
  const logoRule = css.match(/\.gp-osu-connect-logo img \{([^}]+)\}/)[1];
  assert.doesNotMatch(logoRule, /transform|rotate|filter|animation/);
});

const savedOsu = {
  provider: 'osu', persisted: true, visibility: 'private', status: 'verified', username: 'Test player', mode: 'osu',
  pp: 12.34, globalRank: 12345, countryRank: 987, accuracyPercent: 96.12, medals: 1,
  avatarUrl: 'https://a.ppy.sh/12345', verifiedAt: '2026-10-14T12:00:00Z', lastSyncedAt: '2026-10-14T12:00:00Z',
};

test('header highlights reflect saved osu data, not mockup ranks or a cross-game rating', () => {
  const input = structuredClone(savedOsu);
  const highlights = buildPrivateGameHighlights([input]);
  assert.deepEqual(highlights, [{ game: 'osu!', username: 'Test player', mode: 'osu!', pp: '12.34', globalRank: '#12,345', stale: false }]);
  assert.deepEqual(input, savedOsu);
});

test('four saved accounts retain their own data rather than creating extra games or a combined score', () => {
  const accounts = ['osu', 'mania', 'taiko', 'fruits'].map((mode, index) => ({
    ...savedOsu, mode, username: `Test player ${index + 1}`, pp: index + 1, globalRank: (index + 1) * 100,
  }));
  const highlights = buildPrivateGameHighlights(accounts);
  assert.equal(highlights.length, 4);
  assert.equal(new Set(highlights.map((item) => item.game)).size, 1);
  assert.deepEqual(highlights.map((item) => item.username), accounts.map((item) => item.username));
  assert.deepEqual(highlights.map((item) => item.pp), ['1', '2', '3', '4']);
  assert.deepEqual(highlights.map((item) => item.globalRank), ['#100', '#200', '#300', '#400']);
});

test('header hides missing, revoked, public, pending and temporary connections', () => {
  for (const input of [null, undefined, {}, 'osu']) assert.deepEqual(buildPrivateGameHighlights(input), []);
  for (const patch of [{ status: 'revoked' }, { status: 'pending' }, { visibility: 'public' }, { persisted: false }, { provider: 'riot' }]) {
    assert.deepEqual(buildPrivateGameHighlights([{ ...savedOsu, ...patch }]), []);
  }
});

test('header retains zero PP and stale status without inventing missing game statistics', () => {
  const [stale] = buildPrivateGameHighlights([{ ...savedOsu, status: 'stale', pp: 0, globalRank: null }]);
  assert.equal(stale.pp, '0');
  assert.equal(stale.globalRank, null);
  assert.equal(stale.stale, true);
  for (const patch of [{ pp: null, globalRank: null }, { mode: 'unknown' }]) {
    const [missing] = buildPrivateGameHighlights([{ ...savedOsu, ...patch }]);
    assert.equal(missing.pp, null);
    assert.equal(missing.globalRank, null);
  }
});

test('header display model excludes parent identity and arbitrary provider metadata', () => {
  const [highlight] = buildPrivateGameHighlights([{ ...savedOsu, id: 'private-id', email: 'private@example.test', ownerId: 'private-owner', metadataSafe: { rank: 'invented' } }]);
  assert.deepEqual(Object.keys(highlight).sort(), ['game', 'globalRank', 'mode', 'pp', 'stale', 'username']);
});

test('header reads the existing connection state and never adds a provider request', () => {
  const component = readFileSync(new URL('../../src/gaming-passport/components/PrivateGameHighlights.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(component, /fetch\(|localStorage|\.rpc\(|getSupabase|connect\(|publish|avg|Average/);
  assert.match(component, /href=\{game.temporary \? '#gp-roblox-test' : '#gp-linked-games'\}/);
  assert.match(component, /new Set\(highlights\.map/);
  assert.match(component, /game\.stale/);
  const connections = readFileSync(new URL('../../src/gaming-passport/components/PersistentOsuConnections.jsx', import.meta.url), 'utf8');
  assert.match(connections, /onHighlightsChange\?\.\(ownerId && passportReady && auth\.isConfigured \? buildPrivateGameHighlights\(connections\) : \[\]\)/);
});

test('private osu! card formats only the stored snapshot, without manufacturing achievements', () => {
  const input = structuredClone(savedOsu);
  const card = buildPrivateOsuCard(input);
  assert.equal(card.username, input.username);
  assert.equal(card.pp, '12.34');
  assert.deepEqual(card.stats, [
    { key: 'global', label: 'Global rank', value: '#12,345' },
    { key: 'country', label: 'Country rank', value: '#987' },
    { key: 'accuracy', label: 'Accuracy', value: '96.12%' },
    { key: 'medals', label: 'Medals', value: '1' },
  ]);
  assert.deepEqual(input, savedOsu);
  assert.equal(card.achievements, undefined);
  assert.equal(card.proofs, undefined);
});

test('private card rejects revoked, unverified, public and temporary connections', () => {
  assert.equal(buildPrivateOsuCard(null), null);
  for (const patch of [{ status: 'revoked' }, { status: 'pending' }, { status: 'unknown' }, { status: 'failed' }, { visibility: 'public' }, { visibility: undefined }, { persisted: false }, { provider: 'riot' }]) {
    assert.equal(buildPrivateOsuCard({ ...savedOsu, ...patch }), null);
  }
});

test('stale remains explicit and invalid or absent dates are hidden', () => {
  assert.equal(buildPrivateOsuCard(savedOsu).stale, false);
  const card = buildPrivateOsuCard({ ...savedOsu, status: 'stale', lastSyncedAt: 'invalid', verifiedAt: null });
  assert.equal(card.stale, true);
  assert.equal(card.updatedAt, null);
  assert.equal(card.verifiedAt, null);
});

test('missing statistics produce no zeroes, empty slots or invented ranks', () => {
  const card = buildPrivateOsuCard({ ...savedOsu, pp: null, globalRank: null, countryRank: undefined, accuracyPercent: null, medals: null });
  assert.equal(card.pp, null);
  assert.deepEqual(card.stats, []);
});

test('real zero values survive while rank zero and invalid statistics are hidden', () => {
  const card = buildPrivateOsuCard({ ...savedOsu, pp: 0, accuracyPercent: 0, medals: 0, globalRank: 0, countryRank: -1 });
  assert.equal(card.pp, '0');
  assert.deepEqual(card.stats, [{ key: 'accuracy', label: 'Accuracy', value: '0%' }, { key: 'medals', label: 'Medals', value: '0' }]);
  const invalid = buildPrivateOsuCard({ ...savedOsu, pp: Infinity, accuracyPercent: 101, medals: 1.5, globalRank: '120', countryRank: NaN });
  assert.equal(invalid.pp, null);
  assert.deepEqual(invalid.stats, []);
});

test('PP and ranks retain ruleset context and are hidden for unknown modes', () => {
  for (const mode of ['osu', 'mania', 'taiko', 'fruits']) {
    assert.ok(buildPrivateOsuCard({ ...savedOsu, mode }).mode);
    assert.equal(buildPrivateOsuCard({ ...savedOsu, mode }).pp, '12.34');
  }
  const unknown = buildPrivateOsuCard({ ...savedOsu, mode: 'unknown' });
  assert.equal(unknown.mode, null);
  assert.equal(unknown.pp, null);
  assert.deepEqual(unknown.stats.map((item) => item.key), ['medals']);
});

test('avatar URL is limited to the existing osu! avatar origin and has initials fallback', () => {
  assert.equal(buildPrivateOsuCard(savedOsu).avatarUrl, savedOsu.avatarUrl);
  for (const avatarUrl of ['javascript:alert(1)', 'http://a.ppy.sh/123', 'https://other.test/123', 'https://a.ppy.sh/123?secret=value', 'https://user:password@a.ppy.sh/123', undefined]) {
    const card = buildPrivateOsuCard({ ...savedOsu, avatarUrl });
    assert.equal(card.avatarUrl, null);
    assert.equal(card.initial, 'T');
  }
});

test('card display model omits internal identifiers, credentials, metadata and Parent Auth', () => {
  const card = buildPrivateOsuCard({ ...savedOsu, id: 'internal', ownerId: 'private', externalAccountId: '12345', email: 'test@example.test', metadataSafe: { title: 'invented' } });
  assert.deepEqual(Object.keys(card).sort(), ['avatarUrl', 'initial', 'mode', 'pp', 'stale', 'stats', 'updatedAt', 'username', 'verifiedAt']);
});

test('persistent card exposes private details, safe unlink confirmation and no public action', () => {
  const source = readFileSync(new URL('../../src/gaming-passport/components/PrivateOsuAccountCard.jsx', import.meta.url), 'utf8');
  assert.match(source, /Account ownership verified/);
  assert.match(source, /Snapshot needs updating/);
  assert.match(source, /Saved privately to your Passport/);
  assert.match(source, /Connection details/);
  assert.match(source, /Confirm unlink/);
  assert.doesNotMatch(source, /localStorage|\.rpc\(|\.from\(|window\.location|\/id\/|Share profile|publishPassport|dangerouslySetInnerHTML/);
});
