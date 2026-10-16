import { isCanonicalPublicSlug } from '../domain/contracts.js';
import { sanitizeAvatarFrameId } from './avatarFrames.js';
import { sanitizeProfileBackgroundId } from './profileBackgrounds.js';

const keys = (value, allowed) => value && typeof value === 'object' && !Array.isArray(value)
  && Object.keys(value).every((key) => allowed.includes(key));
const text = (value, max = 200) => typeof value === 'string' ? value.slice(0, max) : '';
const timestamp = (value) => typeof value === 'string' && Number.isFinite(Date.parse(value)) ? value : '';
const metric = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
export const PUBLIC_PROVIDER_NAMES = Object.freeze({ osu: 'osu!', roblox: 'Roblox', bungie: 'Bungie' });

export function mapPublicPassportV2(value) {
  if (!keys(value, ['schemaVersion','slug','alias','avatarUrl','bio','updatedAt','publishedAt','scene','games'])
    || value.schemaVersion !== 2 || !isCanonicalPublicSlug(value.slug)
    || !keys(value.scene, ['themeId','accent','backgroundId','avatarFrameId'])
    || !Array.isArray(value.games) || value.games.length > 32) return null;
  const games = [];
  for (const game of value.games) {
    if (!keys(game, ['provider','username','displayName','verifiedAt','updatedAt','stale','stats'])
      || !Object.hasOwn(PUBLIC_PROVIDER_NAMES, game.provider) || !timestamp(game.verifiedAt)) return null;
    let stats = null;
    if (game.stats !== null) {
      if (game.provider !== 'osu' || !keys(game.stats, ['mode','pp','globalRank','countryRank','accuracyPercent','medals'])) return null;
      stats = Object.fromEntries(['pp','globalRank','countryRank','accuracyPercent','medals'].map((name) => [name, metric(game.stats[name])]));
      stats.mode = ['osu','taiko','fruits','mania'].includes(game.stats.mode) ? game.stats.mode : '';
    }
    games.push({ provider: game.provider, username: text(game.username, game.provider === 'bungie' ? 134 : 64), displayName: text(game.displayName, game.provider === 'bungie' ? 128 : 120),
      verifiedAt: timestamp(game.verifiedAt), updatedAt: timestamp(game.updatedAt), stale: game.stale === true, stats });
  }
  return {
    schemaVersion: 2, slug: value.slug, alias: text(value.alias, 64), bio: text(value.bio),
    avatarUrl: /^https?:\/\//i.test(value.avatarUrl || '') ? text(value.avatarUrl, 500) : '',
    updatedAt: timestamp(value.updatedAt), publishedAt: timestamp(value.publishedAt),
    scene: { themeId: value.scene.themeId === 'theme.obsidian-pulse' ? value.scene.themeId : 'theme.clean-dark',
      accent: ['cyan','violet','emerald','amber'].includes(value.scene.accent) ? value.scene.accent : 'cyan',
      backgroundId: sanitizeProfileBackgroundId(value.scene.backgroundId), avatarFrameId: sanitizeAvatarFrameId(value.scene.avatarFrameId) },
    games,
  };
}

export function publicGameHighlights(games) {
  const number = new Intl.NumberFormat('en', { maximumFractionDigits: 2 });
  return games.map((game) => ({ game: PUBLIC_PROVIDER_NAMES[game.provider], username: game.username,
    mode: game.stats?.mode || '', stale: game.stale,
    pp: game.stats?.pp == null ? null : number.format(game.stats.pp),
    globalRank: game.stats?.globalRank == null ? null : '#' + number.format(game.stats.globalRank),
  }));
}
