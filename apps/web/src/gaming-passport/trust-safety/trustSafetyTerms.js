export const BLOCKED_VISUAL_IDENTITY_TERMS = Object.freeze([
  'riot',
  'valorant',
  'league of legends',
  'discord',
  'verified',
  'proof',
  'rank boost',
  'admin',
  'staff',
  'official',
  'moderator',
  'support',
  'challenger',
  'grandmaster',
  'master',
  'diamond',
  'platinum',
  'gold',
  'silver',
  'bronze',
  'iron',
  'radiant',
  'immortal',
]);

export const TRUST_SAFETY_RUNTIME_NON_GOALS = Object.freeze([
  'riot_oauth',
  'riot_api',
  'discord_oauth',
  'discord_api',
  'cosmetics_route',
  'store',
  'checkout',
  'payments',
  'admin_report_dashboard',
  'public_report_list',
  'email_notification_service',
]);

export function includesBlockedVisualIdentityTerm(value) {
  const text = normalizeTermText(value);
  if (!text) return false;
  return BLOCKED_VISUAL_IDENTITY_TERMS.some((term) => text.includes(normalizeTermText(term)));
}

function normalizeTermText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}
