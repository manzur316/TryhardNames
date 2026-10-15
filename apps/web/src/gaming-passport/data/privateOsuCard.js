const MODES = Object.freeze({ osu: 'osu!', mania: 'osu!mania', taiko: 'osu!taiko', fruits: 'osu!catch' });
const format = (value, digits = 0) => new Intl.NumberFormat('en', { maximumFractionDigits: digits }).format(value);
const nonNegative = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const rank = (value) => Number.isSafeInteger(value) && value > 0;

function date(value) {
  if (typeof value !== 'string' || !Number.isFinite(Date.parse(value))) return null;
  return new Date(value).toISOString();
}

function avatar(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'a.ppy.sh' && !url.port
      && !url.username && !url.password && !url.search && !url.hash && /^\/\d+$/.test(url.pathname) ? url.href : null;
  } catch { return null; }
}

// This is an owner-only display model, never a public projection or a proof generator.
export function buildPrivateOsuCard(profile) {
  if (!profile || profile.provider !== 'osu' || profile.persisted !== true || profile.visibility !== 'private'
    || !['verified', 'stale'].includes(profile.status)) return null;
  const mode = Object.hasOwn(MODES, profile.mode) ? MODES[profile.mode] : null;
  const username = typeof profile.username === 'string' && profile.username.trim() ? profile.username.trim() : 'osu! account';
  const stats = [
    mode && rank(profile.globalRank) && { key: 'global', label: 'Global rank', value: `#${format(profile.globalRank)}` },
    mode && rank(profile.countryRank) && { key: 'country', label: 'Country rank', value: `#${format(profile.countryRank)}` },
    mode && nonNegative(profile.accuracyPercent) && profile.accuracyPercent <= 100
      && { key: 'accuracy', label: 'Accuracy', value: `${format(profile.accuracyPercent, 2)}%` },
    Number.isSafeInteger(profile.medals) && profile.medals >= 0 && { key: 'medals', label: 'Medals', value: format(profile.medals) },
  ].filter(Boolean);
  return {
    username, initial: Array.from(username)[0].toUpperCase(), avatarUrl: avatar(profile.avatarUrl), mode,
    pp: mode && nonNegative(profile.pp) ? format(profile.pp, 2) : null,
    stats, stale: profile.status === 'stale', verifiedAt: date(profile.verifiedAt), updatedAt: date(profile.lastSyncedAt),
  };
}
