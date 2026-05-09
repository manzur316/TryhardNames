import { GAME_EDITORIAL_DATA } from './gameEditorialData.js';
import { KEYWORD_EDITORIAL_DATA } from './keywordEditorialData.js';
import { buildMicroGuideIntro, tMicroGuide, tPitfalls, tQuickChecks, tRoleCulture, tWhyItWorks } from './editorialTemplates.js';

function hashToInt(input) {
  const s = String(input || '');
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickVariant(key, options) {
  const arr = (options || []).filter(Boolean);
  if (!arr.length) return null;
  const idx = hashToInt(key) % arr.length;
  return arr[idx];
}

function uniqLinks(links) {
  const out = [];
  const seen = new Set();
  for (const l of links || []) {
    const to = l?.to ? String(l.to) : '';
    if (!to || seen.has(to)) continue;
    seen.add(to);
    out.push({ label: String(l.label || to), to });
  }
  return out;
}

function keywordLabel(keyword) {
  const map = {
    sweaty: 'Sweaty',
    tryhard: 'Tryhard',
    pro: 'Pro',
    cool: 'Cool',
    edgy: 'Edgy',
    aesthetic: 'Aesthetic',
    cute: 'Cute',
    soft: 'Soft',
    tiktok: 'TikTok',
    avatar: 'Avatar branding',
    'one-word': 'One-word',
    og: 'OG',
    '3-letter': '3-letter',
    smp: 'SMP',
    survival: 'Survival',
    pvp: 'PvP',
    bedwars: 'Bedwars',
    medieval: 'Medieval',
    realistic: 'Realistic',
    mafia: 'Mafia',
    cartel: 'Cartel',
    luxury: 'Luxury',
    street: 'Street',
    gang: 'Crew',
    clean: 'Clean',
    tactical: 'Tactical',
    vct: 'VCT',
    radiant: 'Radiant',
    jett: 'Jett',
    reyna: 'Reyna',
    chamber: 'Chamber',
    aim: 'Aim',
    movement: 'Movement',
    predator: 'Predator',
    rp: 'Roleplay',
    brandable: 'Brandable',
    best: 'Best',
    anime: 'Anime',
    korean: 'KR ladder minimal',
  };
  return map[String(keyword || '')] || String(keyword || '');
}

function inferredEditorialLinks({ category, keyword }) {
  // Hand-picked “natural” editorial bridges. Must map to existing programmatic slugs.
  const out = [];
  const c = String(category || '');
  const k = String(keyword || '');

  if (c === 'valorant') {
    out.push({ label: 'Clean esports branding', to: '/valorant/clean' });
    out.push({ label: 'VCT-style aliases', to: '/valorant/vct' });
    out.push({ label: 'Tactical identity culture', to: '/valorant/tactical' });
  }

  if (c === 'cs2') {
    out.push({ label: 'One-word minimal aliases', to: '/cs2/one-word' });
    out.push({ label: 'OG esports tags', to: '/cs2/og' });
    out.push({ label: '3-letter minimal names', to: '/cs2/3-letter' });
  }

  if (c === 'roblox') {
    out.push({ label: 'TikTok aesthetic handles', to: '/roblox/tiktok' });
    out.push({ label: 'Avatar branding usernames', to: '/roblox/avatar' });
    out.push({ label: 'Soft creator-style names', to: '/roblox/soft' });
  }

  if (c === 'gta-rp') {
    out.push({ label: 'Realistic whitelist identities', to: '/gta-rp/realistic' });
    out.push({ label: 'Luxury RP aesthetics', to: '/gta-rp/luxury' });
    out.push({ label: 'Mafia-style aliases', to: '/gta-rp/mafia' });
  }

  if (c === 'minecraft') {
    out.push({ label: 'SMP naming culture', to: '/minecraft/smp' });
    out.push({ label: 'Medieval fantasy vibes', to: '/minecraft/medieval' });
    out.push({ label: 'PvP identity styles', to: '/minecraft/pvp' });
  }

  // Cross-game bridges for semantic coverage (no new URLs).
  if (c === 'valorant' && (k === 'clean' || k === 'pro' || k === 'vct')) {
    out.push({ label: 'CS2 one-word aliases', to: '/cs2/one-word' });
    out.push({ label: 'Brandable usernames hub', to: '/brandable-usernames' });
  }
  if (c === 'gta-rp' && (k === 'luxury' || k === 'realistic' || k === 'mafia')) {
    out.push({ label: 'Edgy gamer tags hub', to: '/edgy-gamer-tags' });
    out.push({ label: 'Brandable usernames hub', to: '/brandable-usernames' });
  }
  if (c === 'roblox' && (k === 'tiktok' || k === 'avatar' || k === 'soft')) {
    out.push({ label: 'Aesthetic gaming tags hub', to: '/aesthetic-gaming-tags' });
  }
  if (c === 'minecraft' && (k === 'smp' || k === 'medieval')) {
    out.push({ label: 'Roleplay usernames (general)', to: '/general/rp' });
  }

  return uniqLinks(out);
}

function getKeywordPack({ category, keyword }) {
  const c = String(category || '').trim();
  const k = String(keyword || '').trim();
  if (!c || !k) return null;
  const pack = KEYWORD_EDITORIAL_DATA?.[c]?.[k] || null;
  return pack && typeof pack === 'object' ? pack : null;
}

function toneToEyebrow(tone) {
  const t = String(tone || '');
  if (t === 'cyan') return 'Scoreboard clarity';
  if (t === 'purple') return 'Tactical culture';
  if (t === 'gold') return 'Prestige signal';
  if (t === 'pink') return 'Creator aesthetic';
  if (t === 'emerald') return 'Minimal prestige';
  return 'Micro guide';
}

function buildBlocksForCategory({ category, keyword, slug }) {
  const data = GAME_EDITORIAL_DATA[category];
  if (!data) return [];

  const kLabel = keywordLabel(keyword);
  const seed = `${category}:${keyword}:${slug || ''}`;
  const keywordPack = getKeywordPack({ category, keyword });
  const links = uniqLinks([
    ...(keywordPack?.links || []),
    ...(data.internalLinks || []),
    ...inferredEditorialLinks({ category, keyword }),
  ]);

  const angles = [
    buildMicroGuideIntro({
      gameLabel: data.gameLabel,
      keywordLabel: kLabel,
      angle: `How ${kLabel.toLowerCase()} tags read in ${data.gameLabel} culture`,
    }),
    buildMicroGuideIntro({
      gameLabel: data.gameLabel,
      keywordLabel: kLabel,
      angle: `${data.gameLabel} naming culture: readability, identity, and “fit”`,
    }),
    buildMicroGuideIntro({
      gameLabel: data.gameLabel,
      keywordLabel: kLabel,
      angle: `Mini guide: choosing a ${kLabel.toLowerCase()} identity that stays readable`,
    }),
  ];

  const introTitle = pickVariant(`${seed}:introTitle`, angles) || angles[0];

  // “Why” bullets pick (varies by category and keyword).
  const whyPools = [
    ...(data.culture.shortNameThesis || []),
    ...(data.culture.creatorNaming || []),
    ...(data.culture.realisticIdentity || []),
    ...(data.culture.oneWord || []),
    ...(data.culture.smp || []),
  ];
  const why = whyPools.length
    ? [pickVariant(`${seed}:why0`, whyPools), pickVariant(`${seed}:why1`, whyPools), pickVariant(`${seed}:why2`, whyPools)]
        .filter(Boolean)
    : [];

  const blocks = [];

  // Keyword-exclusive blocks (1–3): force subculture uniqueness per keyword.
  if (keywordPack) {
    const hookTitle = pickVariant(`${seed}:kwHook`, keywordPack.hooks || []) || null;
    const tone = keywordPack.visual?.accent || null;

    if (hookTitle) {
      blocks.push(
        tMicroGuide({
          eyebrow: toneToEyebrow(tone),
          title: hookTitle,
          bullets: [
            pickVariant(`${seed}:kwWhy0`, keywordPack.microGuides?.[0]?.bullets || []),
            pickVariant(`${seed}:kwWhy1`, keywordPack.microGuides?.[1]?.bullets || []),
          ].filter(Boolean),
          links: links.slice(0, 3),
          tone,
        })
      );
    }

    const microCandidates = (keywordPack.microGuides || []).filter(Boolean);
    const microPick = pickVariant(`${seed}:kwMicroPick`, microCandidates);
    if (microPick?.title && Array.isArray(microPick.bullets) && microPick.bullets.length) {
      blocks.push(
        tMicroGuide({
          eyebrow: 'Micro guide',
          title: microPick.title,
          bullets: microPick.bullets,
          links: links.slice(1, 4),
          tone,
        })
      );
    }

    if (Array.isArray(keywordPack.pitfalls) && keywordPack.pitfalls.length) {
      blocks.push(
        tPitfalls({
          title: `Keyword traps: ${kLabel.toLowerCase()} in ${data.gameLabel}`,
          bullets: [
            pickVariant(`${seed}:kwPit0`, keywordPack.pitfalls),
            pickVariant(`${seed}:kwPit1`, keywordPack.pitfalls),
            pickVariant(`${seed}:kwPit2`, keywordPack.pitfalls),
          ].filter(Boolean),
          links: links.slice(0, 2),
        })
      );
    }
  }

  // Block A: Why it works (always short)
  if (why.length) {
    blocks.push(
      tWhyItWorks({
        title: introTitle,
        bullets: why,
        links: links.slice(0, 3),
      })
    );
  }

  // Block B: Culture note — per-game special sections (rotated)
  const cultureCandidates = [];
  if (Array.isArray(data.culture.roleCulture) && data.culture.roleCulture.length) cultureCandidates.push(...data.culture.roleCulture);
  if (Array.isArray(data.culture.mafiaCartel) && data.culture.mafiaCartel.length) cultureCandidates.push(...data.culture.mafiaCartel);
  if (Array.isArray(data.culture.proScene) && data.culture.proScene.length) cultureCandidates.push(...data.culture.proScene);
  if (Array.isArray(data.culture.fantasyMedieval) && data.culture.fantasyMedieval.length) cultureCandidates.push(...data.culture.fantasyMedieval);

  const culturePick = pickVariant(`${seed}:culturePick`, cultureCandidates);
  if (culturePick?.title && culturePick?.bullets?.length) {
    blocks.push(
      tRoleCulture({
        title: culturePick.title,
        bullets: culturePick.bullets,
        links: links.slice(1, 4),
      })
    );
  }

  // Block C: Pitfalls (always)
  if (data.culture.pitfalls?.length) {
    const pitfalls = [
      pickVariant(`${seed}:pit0`, data.culture.pitfalls),
      pickVariant(`${seed}:pit1`, data.culture.pitfalls),
      pickVariant(`${seed}:pit2`, data.culture.pitfalls),
    ].filter(Boolean);
    blocks.push(
      tPitfalls({
        title: `Common mistakes in ${data.gameLabel} naming`,
        bullets: pitfalls,
        links: links.slice(0, 2),
      })
    );
  }

  // Block D: Quick checks (always)
  if (data.culture.quickChecks?.length) {
    const checks = [
      pickVariant(`${seed}:chk0`, data.culture.quickChecks),
      pickVariant(`${seed}:chk1`, data.culture.quickChecks),
      pickVariant(`${seed}:chk2`, data.culture.quickChecks),
    ].filter(Boolean);
    blocks.push(
      tQuickChecks({
        title: `Fast “does it fit?” checks`,
        bullets: checks,
        links: links.slice(2, 5),
      })
    );
  }

  // Cap blocks for UX: 2–4 max, deterministic rotation.
  const max = 4;
  const start = hashToInt(`${seed}:rotate`) % Math.max(1, blocks.length);
  const rotated = blocks.length > 1 ? blocks.slice(start).concat(blocks.slice(0, start)) : blocks;
  return rotated.slice(0, Math.min(max, rotated.length));
}

export function getEditorialBlocks({ category, keyword, slug } = {}) {
  const c = String(category || '').trim();
  const k = String(keyword || '').trim();
  if (!c || !k) return [];
  if (!GAME_EDITORIAL_DATA[c]) return [];
  return buildBlocksForCategory({ category: c, keyword: k, slug: String(slug || '') });
}

