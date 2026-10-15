// Private presentation only; image URLs and styles never come from stored user input.
const supplied = [
  { id: 'sakura-lake', name: 'Sakura Lake' },
  { id: 'sky-islands', name: 'Sky Islands' },
  { id: 'amethyst-citadel', name: 'Amethyst Citadel' },
  { id: 'lunar-falls', name: 'Lunar Falls' },
  { id: 'astral-nexus', name: 'Astral Nexus' },
  { id: 'luminous-grove', name: 'Luminous Grove' },
  { id: 'neon-gateway', name: 'Neon Gateway' },
  { id: 'cyber-city', name: 'Cyber City' },
];

export const PROFILE_BACKGROUND_OPTIONS = Object.freeze([
  { id: 'default', name: 'Original', src: '/passport/passport-citadel-v2.webp', thumbnail: '/passport/passport-citadel-v2.webp', width: 2160, height: 720 },
  ...supplied.map((background) => ({
    ...background,
    src: `/passport/backgrounds/${background.id}.webp`,
    thumbnail: `/passport/backgrounds/${background.id}.thumb.webp`,
    width: 1672,
    height: 941,
  })),
].map(Object.freeze));

export function sanitizeProfileBackgroundId(value) {
  return typeof value === 'string' && value !== 'default' && PROFILE_BACKGROUND_OPTIONS.some((item) => item.id === value) ? value : undefined;
}

export function resolveProfileBackground(value) {
  const id = sanitizeProfileBackgroundId(value);
  return PROFILE_BACKGROUND_OPTIONS.find((item) => item.id === id) || PROFILE_BACKGROUND_OPTIONS[0];
}
