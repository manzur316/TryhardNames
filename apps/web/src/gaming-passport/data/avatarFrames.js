// Owner presentation choices, not unlocks, ranks or verification badges.
export const AVATAR_FRAME_OPTIONS = Object.freeze([
  { id: 'auto', name: 'Theme', src: null },
  { id: 'minimal', name: 'Minimal', src: null },
  { id: 'obsidian', name: 'Obsidian', src: '/passport/passport-avatar-frame.webp', size: 70, top: 12.25 },
  { id: 'astral', name: 'Astral', src: '/passport/frame-astral.webp', size: 62, top: 21.2 },
  { id: 'void', name: 'Void', src: '/passport/frame-void.webp', size: 64, top: 17.7 },
  { id: 'inferno', name: 'Inferno', src: '/passport/frame-inferno.webp', size: 60, top: 23.2 },
  { id: 'verdant', name: 'Verdant', src: '/passport/frame-verdant.webp', size: 64, top: 20 },
  { id: 'cyber', name: 'Cyber', src: '/passport/frame-cyber.webp', size: 61, top: 16.8 },
  { id: 'glacier', name: 'Glacier', src: '/passport/frame-glacier.webp', size: 60, top: 20.2 },
  { id: 'halloween-midnight', name: 'Midnight', collection: 'halloween', src: '/passport/frame-halloween-midnight.webp', size: 61, top: 17.8 },
  { id: 'halloween-candy', name: 'Candy', collection: 'halloween', src: '/passport/frame-halloween-candy.webp', size: 65, top: 16.6 },
  { id: 'halloween-coven', name: 'Coven', collection: 'halloween', src: '/passport/frame-halloween-coven.webp', size: 65, top: 17 },
  { id: 'halloween-blood-moon', name: 'Blood Moon', collection: 'halloween', src: '/passport/frame-halloween-blood-moon.webp', size: 64, top: 19.1 },
  { id: 'halloween-haunted', name: 'Haunted', collection: 'halloween', src: '/passport/frame-halloween-haunted.webp', size: 62, top: 18.8 },
  { id: 'christmas-frost', name: 'Frost', collection: 'christmas', src: '/passport/frame-christmas-frost.webp', size: 64, top: 19.4 },
  { id: 'christmas-gingerbread', name: 'Gingerbread', collection: 'christmas', src: '/passport/frame-christmas-gingerbread.webp', size: 60, top: 19.1 },
  { id: 'christmas-woodland', name: 'Woodland', collection: 'christmas', src: '/passport/frame-christmas-woodland.webp', size: 63, top: 14.3 },
  { id: 'christmas-noel', name: 'Noel', collection: 'christmas', src: '/passport/frame-christmas-noel.webp', size: 67, top: 16.7 },
].map(Object.freeze));

export function sanitizeAvatarFrameId(value) {
  return typeof value === 'string' && AVATAR_FRAME_OPTIONS.some((frame) => frame.id === value) ? value : undefined;
}

export function resolveAvatarFrame(value, decorated = false) {
  const id = sanitizeAvatarFrameId(value);
  const resolved = !id || id === 'auto' ? (decorated ? 'obsidian' : 'minimal') : id;
  return AVATAR_FRAME_OPTIONS.find((frame) => frame.id === resolved);
}
