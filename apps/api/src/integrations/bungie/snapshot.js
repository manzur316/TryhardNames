const ID = /^[1-9]\d{0,19}$/;
const text = (v, max) => typeof v === 'string' && v.trim().length > 0 && v.length <= max && !/[\u0000-\u001f\u007f]/.test(v);
export function persistentBungieSnapshot(profile) {
  if (!profile || !ID.test(profile.accountId) || typeof profile.accountId !== 'string'
    || !text(profile.displayName, 128) || !text(profile.bungieName, 134)
    || !Number.isFinite(Date.parse(profile.verifiedAt)) || !Array.isArray(profile.destinyMemberships)) {
    throw new Error('invalid_snapshot');
  }
  let avatarUrl = null;
  if (profile.avatarUrl != null) {
    const url = new URL(profile.avatarUrl);
    if (url.origin !== 'https://www.bungie.net' || url.username || url.password
      || url.search || url.hash || !/^\/img\/[A-Za-z0-9_./-]+$/.test(url.pathname) || url.href.length > 512) throw new Error('invalid_avatar');
    avatarUrl = url.href;
  }
  const destinyMemberships = profile.destinyMemberships.slice(0, 6).map((m) => {
    if (!m || typeof m.accountId !== 'string' || !ID.test(m.accountId)
      || !Number.isInteger(m.platform) || m.platform < 1 || m.platform > 255
      || !Number.isInteger(m.crossSaveOverride) || m.crossSaveOverride < 0 || m.crossSaveOverride > 255
      || (m.displayName !== null && !text(m.displayName, 128))) throw new Error('invalid_membership');
    return { accountId: m.accountId, platform: m.platform, displayName: m.displayName, crossSaveOverride: m.crossSaveOverride };
  });
  if (new Set(destinyMemberships.map((m) => m.platform + ':' + m.accountId)).size !== destinyMemberships.length) throw new Error('duplicate_membership');
  return { accountId: profile.accountId, displayName: profile.displayName, bungieName: profile.bungieName,
    avatarUrl, destinyMemberships, verifiedAt: new Date(profile.verifiedAt).toISOString() };
}
