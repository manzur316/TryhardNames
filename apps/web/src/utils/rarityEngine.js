function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function hasNonAscii(s) {
  return /[^\x20-\x7E]/.test(String(s || ''));
}

function hasSymbols(s) {
  const str = String(s || '');
  return /[^\w\s]/.test(str) || hasNonAscii(str);
}

function isCleanAlnum(s) {
  const str = String(s || '');
  return /^[A-Za-z0-9]+$/.test(str);
}

function scoreLength(len) {
  // short is premium (scoreboard/killfeed)
  if (len <= 4) return 30;
  if (len <= 6) return 22;
  if (len <= 9) return 14;
  if (len <= 12) return 8;
  if (len <= 16) return 2;
  return -6;
}

function scoreCleanFactor(name) {
  const str = String(name || '');
  let s = 0;
  if (isCleanAlnum(str)) s += 18;
  if (!hasSymbols(str)) s += 10;
  if (/[A-Z][a-z]+/.test(str)) s += 6; // readable camel-case vibe
  if (/[0-9]/.test(str)) s -= 4; // digits slightly less premium
  if (/[_\.]/.test(str)) s -= 2;
  if (hasNonAscii(str)) s -= 2; // can still be cool, but less “clean”
  return s;
}

function scoreContextFit(name, contextKey) {
  const str = String(name || '');
  const up = str.toUpperCase();
  let s = 0;
  if (!contextKey) return 0;

  if (contextKey === 'valorant') {
    if (/(VCT|RR|IGL|ACE|TAP|PEEK|RETAKE|HOLD|SWING)/i.test(str)) s += 18;
    if (/(KILL|DARK|DEATH|SLAYER)/i.test(str)) s -= 10;
    if (up.includes('VCT')) s += 6;
  } else if (contextKey === 'cs2') {
    if (str.length <= 6) s += 16;
    if (/^[A-Za-z]+\.?$/.test(str)) s += 10;
    if (/(TTV|YT|LIVE|VCT)/i.test(str)) s -= 6;
  } else if (contextKey === 'gta-rp') {
    if (/(DON|CAPO|EL|LA)/i.test(str)) s += 12;
    if (/(LUX|VICE|GOLD|DIAMOND)/i.test(str)) s += 10;
    if (/(Xx|TTV|YT|VCT)/i.test(str)) s -= 8;
  } else if (contextKey === 'roblox') {
    if (/(AURA|MOON|SOFT|PLUSH|CHERRY|BUNNI|PIXEL)/i.test(str)) s += 12;
    if (/(II|IE|XO|LUV)$/i.test(str)) s += 10;
    if (/(DON|VCT|RR|IGL)/i.test(str)) s -= 6;
  } else if (contextKey === 'minecraft') {
    if (/(NETHER|EMBER|OAK|RUNE|ASH|MOSS|STONE|FROST)/i.test(str)) s += 12;
    if (/(KNIGHT|KEEP|SMITH|MAGE|CRAFT|VALE)/i.test(str)) s += 10;
  }
  return s;
}

function tierFromScore(score, contextKey, name) {
  const str = String(name || '');
  if (contextKey === 'cs2' && str.length <= 4 && isCleanAlnum(str)) return 'OG';
  if (contextKey === 'valorant' && /VCT/i.test(str) && str.length <= 10) return 'Legendary';
  if (score >= 70) return 'Legendary';
  if (score >= 54) return 'Epic';
  if (score >= 40) return 'Rare';
  return 'Common';
}

function buildBadges({ contextKey, name, scoreParts }) {
  const badges = [];
  const str = String(name || '');

  if (contextKey === 'valorant') {
    if (/VCT/i.test(str)) badges.push({ id: 'vct', label: 'VCT-Coded', weight: 12 });
    if (/(TAP|PEEK|RETAKE|HOLD|CLUTCH)/i.test(str)) badges.push({ id: 'ranked', label: 'Ranked Ready', weight: 10 });
    if (scoreParts.clean >= 18) badges.push({ id: 'clean', label: 'Clean OG', weight: 9 });
    badges.push({ id: 'tactical', label: 'Tactical Identity', weight: 8 });
  } else if (contextKey === 'roblox') {
    if (/(II|IE|XO|LUV)$/i.test(str)) badges.push({ id: 'creator', label: 'Creator Pick', weight: 12 });
    badges.push({ id: 'aesthetic', label: 'Aesthetic Favorite', weight: 10 });
  } else if (contextKey === 'gta-rp') {
    if (/(DON|CAPO|EL|LA)/i.test(str)) badges.push({ id: 'rp', label: 'RP Approved', weight: 12 });
    if (/(LUX|VICE|GOLD)/i.test(str)) badges.push({ id: 'lux', label: 'Luxury Persona', weight: 10 });
  } else if (contextKey === 'cs2') {
    badges.push({ id: 'og', label: 'Clean OG', weight: 12 });
    if (str.length <= 6) badges.push({ id: 'minimal', label: 'Minimal OG', weight: 10 });
  } else if (contextKey === 'minecraft') {
    badges.push({ id: 'smp', label: 'SMP Elite', weight: 12 });
    if (/(KNIGHT|KEEP|RUNE|SMITH|MAGE)/i.test(str)) badges.push({ id: 'fantasy', label: 'Guild Vibe', weight: 10 });
  }

  // pick top 2 deterministic by weight then label
  badges.sort((a, b) => b.weight - a.weight || a.label.localeCompare(b.label));
  return badges.slice(0, 2);
}

export function computeRarity({ name, contextKey } = {}) {
  const str = String(name || '').trim();
  const len = str.length;

  const length = scoreLength(len);
  const clean = scoreCleanFactor(str);
  const context = scoreContextFit(str, contextKey);
  const symbolPenalty = hasSymbols(str) ? -4 : 0;
  const score = clamp(length + clean + context + symbolPenalty + 28, 0, 100);

  const tier = tierFromScore(score, contextKey, str);
  const badges = buildBadges({ contextKey, name: str, scoreParts: { length, clean, context } });

  // collectible microcopy: deterministic by tier + context
  const microByTier = {
    OG: 'Hard to get vibe',
    Legendary: 'Rare tactical identity',
    Epic: 'Feels premium in-game',
    Rare: 'Noticeably clean pick',
    Common: 'Solid daily driver',
  };

  return {
    tier,
    score,
    badges,
    micro: microByTier[tier] || microByTier.Common,
  };
}

export function rarityVisual(tier) {
  const t = String(tier || 'Common');
  const map = {
    Common: {
      badge: 'bg-slate-500/10 text-slate-200 border-slate-500/30',
      border: 'border-slate-200/80 dark:border-dark-700',
      glow: 'shadow-sm',
      accent: 'from-slate-500/10 to-slate-500/0',
    },
    Rare: {
      badge: 'bg-cyan-500/10 text-cyan-200 border-cyan-500/30',
      border: 'border-cyan-400/30 dark:border-cyan-500/25',
      glow: 'shadow-[0_0_22px_rgba(6,182,212,0.08)]',
      accent: 'from-accent-cyan/12 to-accent-purple/0',
    },
    Epic: {
      badge: 'bg-purple-500/10 text-purple-200 border-purple-500/30',
      border: 'border-purple-400/30 dark:border-purple-500/25',
      glow: 'shadow-[0_0_22px_rgba(168,85,247,0.10)]',
      accent: 'from-accent-purple/12 to-accent-cyan/0',
    },
    Legendary: {
      badge: 'bg-yellow-500/10 text-yellow-200 border-yellow-500/30',
      border: 'border-yellow-400/30 dark:border-yellow-500/25',
      glow: 'shadow-[0_0_26px_rgba(234,179,8,0.10)]',
      accent: 'from-yellow-500/12 to-accent-purple/0',
    },
    OG: {
      badge: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/30',
      border: 'border-emerald-400/30 dark:border-emerald-500/25',
      glow: 'shadow-[0_0_26px_rgba(16,185,129,0.10)]',
      accent: 'from-emerald-500/12 to-accent-cyan/0',
    },
  };
  return map[t] || map.Common;
}

