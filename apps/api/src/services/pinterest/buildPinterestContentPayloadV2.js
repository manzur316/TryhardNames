import { getPinterestContentSiteOrigin } from './pinterestSiteOrigin.js';
import {
  defaultPinterestContentTopicDef,
  getPinterestContentTopicDef,
  listPinterestContentTopicDefs,
  listPinterestContentTopicIds,
} from './pinterestContentTopics.js';
import { generateNamesV2, resolveNameContext } from './nameEngineV2.js';

const INTENTS = Object.freeze([
  'name_pick',
  'rebrand',
  'identity_pack',
  'streamer_brand',
  'fresh_start',
  'social_handle',
]);

export const VISUAL_FAMILIES = Object.freeze({
  minimal_typography: {
    label: 'Minimal typography',
    stylePreset: 'clean_editorial_type',
    defaultIntent: 'name_pick',
    preferredStyle: 'clean',
    textLimit: 'one headline and up to three generated names',
    characterPolicy: 'No character is needed; make the type and layout carry the pin.',
    composition: 'large clean type, generous margins, one accent stripe, vertical 2:3 canvas',
    palettes: [
      'warm white, graphite, sky blue accent',
      'porcelain, ink black, lime accent',
      'paper white, clay red, deep green accent',
    ],
  },
  pick_your_name_grid: {
    label: 'Pick your name grid',
    stylePreset: 'editorial_name_grid',
    defaultIntent: 'name_pick',
    preferredStyle: 'brandable',
    textLimit: 'six short name tiles with one compact headline',
    characterPolicy: 'No character; focus on readable name tiles.',
    composition: 'balanced grid of rounded name tiles, clear scan path, strong whitespace',
    palettes: [
      'off white, charcoal, cobalt, soft yellow',
      'cool gray, deep teal, coral, cream',
      'black ink, mint, lavender, white',
    ],
  },
  esports_character_poster: {
    label: 'Esports character poster',
    stylePreset: 'cinematic_esports_identity',
    defaultIntent: 'identity_pack',
    preferredStyle: 'sweaty',
    textLimit: 'one short title plus one featured generated name',
    characterPolicy: 'A fictional generic gamer silhouette is allowed; avoid real people and official uniforms.',
    composition: 'single focal silhouette, readable title zone, shallow depth, vertical poster framing',
    palettes: [
      'charcoal, tournament red, soft white',
      'midnight, amber, steel blue',
      'deep green, black, pale gold',
    ],
  },
  dark_ui_dashboard: {
    label: 'Dark UI dashboard',
    stylePreset: 'dark_interface_name_board',
    defaultIntent: 'identity_pack',
    preferredStyle: 'dark',
    textLimit: 'three dashboard cards, each with a short generated name',
    characterPolicy: 'No character; use interface panels and cards.',
    composition: 'premium dark dashboard, card stack, soft shadows, clear hierarchy',
    palettes: [
      'near black, slate, emerald, white',
      'dark plum, graphite, cyan accent',
      'black, muted blue, pale orange accent',
    ],
  },
  gaming_passport_preview: {
    label: 'Gaming passport preview',
    stylePreset: 'identity_passport_preview',
    defaultIntent: 'identity_pack',
    preferredStyle: 'brandable',
    textLimit: 'one display name, one short profile label, minimal microcopy',
    characterPolicy: 'No official game marks; use a fictional identity card preview.',
    composition: 'clean profile card preview, avatar placeholder, name badge, vertical 2:3 layout',
    palettes: [
      'deep navy, white, signal green',
      'stone, black, electric blue accent',
      'soft gray, royal purple, white',
    ],
  },
  before_after_rebrand: {
    label: 'Before after rebrand',
    stylePreset: 'rebrand_comparison',
    defaultIntent: 'rebrand',
    preferredStyle: 'clean',
    textLimit: 'before/after labels and one upgraded generated name',
    characterPolicy: 'No character; make the rebrand comparison the hero.',
    composition: 'left-right comparison, dull old placeholder, polished new handle card, vertical crop',
    palettes: [
      'warm gray, black, bright blue',
      'cream, forest green, graphite',
      'white, terracotta, deep navy',
    ],
  },
  choose_your_vibe: {
    label: 'Choose your vibe',
    stylePreset: 'multi_style_vibe_board',
    defaultIntent: 'name_pick',
    preferredStyle: 'aesthetic',
    textLimit: 'three vibe columns with one name each',
    characterPolicy: 'No character required; use mood-board panels.',
    composition: 'three vertical lanes, each with a different mood, cohesive spacing',
    palettes: [
      'pastel lilac, butter yellow, ink',
      'sage, blush, ivory, charcoal',
      'sky blue, tomato red, pearl',
    ],
  },
  streamer_identity_card: {
    label: 'Streamer identity card',
    stylePreset: 'creator_channel_card',
    defaultIntent: 'streamer_brand',
    preferredStyle: 'streamer',
    textLimit: 'creator handle, tiny channel tag, one visual badge',
    characterPolicy: 'A simple avatar placeholder is allowed; avoid real faces.',
    composition: 'creator card with camera-safe spacing, overlay-style panels, large handle',
    palettes: [
      'charcoal, white, magenta accent',
      'navy, silver, lime accent',
      'soft black, peach, cyan accent',
    ],
  },
  ranked_reset_drop: {
    label: 'Ranked reset drop',
    stylePreset: 'seasonal_competitive_drop',
    defaultIntent: 'fresh_start',
    preferredStyle: 'sweaty',
    textLimit: 'one short seasonal headline and two generated names',
    characterPolicy: 'Fictional gear or abstract game objects only; no official game assets.',
    composition: 'seasonal drop poster, clean badge system, crisp name cards, high motion diagonals',
    palettes: [
      'storm gray, safety orange, white',
      'black, icy blue, steel',
      'deep violet, pale gold, graphite',
    ],
  },
  clean_logo_tag: {
    label: 'Clean logo tag',
    stylePreset: 'minimal_logo_handle',
    defaultIntent: 'social_handle',
    preferredStyle: 'brandable',
    textLimit: 'one generated name and one simple abstract mark',
    characterPolicy: 'No character; create a generic abstract logo mark.',
    composition: 'logo lockup, clean handle, strong empty space, premium social profile feel',
    palettes: [
      'white, black, emerald',
      'cream, navy, copper',
      'light gray, cobalt, white',
    ],
  },
});

function hashString(s) {
  let h = 2166136261 >>> 0;
  const str = String(s);
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function utcDayStamp() {
  return new Date().toISOString().slice(0, 10);
}

function clampNumber(value, fallback, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(parsed)));
}

function normalizeIntent(value, fallback) {
  const normalized = String(value || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  if (INTENTS.includes(normalized)) return normalized;
  return fallback;
}

function pick(rnd, values) {
  return values[Math.floor(rnd() * values.length)];
}

function selectFamily({ requestedFamily, index, random, seedCore }) {
  const familyIds = Object.keys(VISUAL_FAMILIES);
  const requested = String(requestedFamily || '').trim();
  if (requested) {
    if (!VISUAL_FAMILIES[requested]) {
      return {
        ok: false,
        error: 'unknown_visual_family',
        hint: 'Use a known visualFamily id.',
        visualFamilies: familyIds,
      };
    }
    return { ok: true, id: requested, def: VISUAL_FAMILIES[requested] };
  }

  const seed = random
    ? hashString(`${seedCore}-${Date.now()}-${Math.random()}`)
    : hashString(`${seedCore}-${index}`);
  const familyId = familyIds[seed % familyIds.length];
  return { ok: true, id: familyId, def: VISUAL_FAMILIES[familyId] };
}

function topicContext(def, requestedTopic) {
  return resolveNameContext(`${requestedTopic || ''} ${def.topic} ${def.category} ${def.slug} ${def.path}`);
}

function buildCampaignId({ day, topic, visualFamily, intent, index }) {
  const suffix = hashString(`${day}-${topic}-${visualFamily}-${intent}-${index}`).toString(36).slice(0, 6);
  return `mkt02-${day.replace(/-/g, '')}-${topic}-${visualFamily}-${suffix}`;
}

function buildHashtags(def, context, visualFamily) {
  const base = ['#TryhardNames', '#GamerNames', '#Usernames'];
  const topic = `#${def.category.replace(/[^a-zA-Z0-9]/g, '')}`;
  const contextTag = `#${context.replace(/[^a-zA-Z0-9]/g, '')}`;
  const familyTag = `#${visualFamily.replace(/_/g, '')}`;
  const keywordTags = def.keyword
    .split(/[^a-zA-Z0-9]+/)
    .filter((word) => word.length > 2)
    .slice(0, 2)
    .map((word) => `#${word.charAt(0).toUpperCase()}${word.slice(1)}`);

  return [...new Set([...keywordTags, topic, contextTag, familyTag, ...base])].slice(0, 10);
}

function buildUtmUrl(canonicalUrl, campaignId, visualFamily) {
  const url = new URL(canonicalUrl);
  url.searchParams.set('utm_source', 'pinterest');
  url.searchParams.set('utm_medium', 'organic_social');
  url.searchParams.set('utm_campaign', campaignId);
  url.searchParams.set('utm_content', visualFamily);
  return url.toString();
}

function buildPinTitle(def, intent, names) {
  const primary = names[0]?.name || def.keyword;
  const intentCopy = {
    name_pick: 'Pick a Better Gaming Name',
    rebrand: 'Fresh Username Rebrand Ideas',
    identity_pack: 'Gaming Identity Ideas',
    streamer_brand: 'Streamer Handle Ideas',
    fresh_start: 'Fresh Competitive Name Ideas',
    social_handle: 'Clean Social Username Ideas',
  };
  return `${intentCopy[intent]}: ${primary}`;
}

function buildPinDescription(def, names, visualFamily) {
  const examples = names.slice(0, 5).map((item) => item.name).join(', ');
  const familyLabel = VISUAL_FAMILIES[visualFamily].label.toLowerCase();
  return [
    `Generated ${def.keyword.toLowerCase()} for ${def.audience}.`,
    `Includes fresh handle ideas like ${examples}.`,
    `Designed for a ${familyLabel} Pinterest creative from TryhardNames.`,
  ].join(' ');
}

function buildAltText(def, family, names) {
  const examples = names.slice(0, 3).map((item) => item.name).join(', ');
  return `${family.label} for ${def.keyword}, featuring generated names ${examples}.`;
}

function buildImagePrompt({ def, family, visualFamily, intent, names, context, palette }) {
  const featuredNames = names.slice(0, 6).map((item) => item.name).join(', ');
  return [
    `Create a vertical 2:3 Pinterest creative for TryhardNames.`,
    `Topic: ${def.keyword}. Audience: ${def.audience}.`,
    `Campaign intent: ${intent}. Visual family: ${visualFamily}.`,
    `Composition: ${family.composition}.`,
    `Palette: ${palette}.`,
    `Text policy: ${family.textLimit}; keep every word large, crisp, and readable on mobile.`,
    family.characterPolicy,
    `Use generated name ideas only from this list when text appears: ${featuredNames}.`,
    `Context cues may reference ${context} style through abstract shapes, UI cards, badges, or generic gear.`,
    `Avoid clutter; leave clear safe margins; do not imitate official game screens, real players, or brand logos.`,
  ].join(' ');
}

function buildNegativePrompt() {
  return [
    'tiny unreadable text',
    'misspelled names',
    'extra random words',
    'watermark',
    'brand logos',
    'official game UI',
    'real person likeness',
    'blurry letters',
    'crowded layout',
    'low resolution',
    'duplicate name tiles',
  ].join(', ');
}

function buildSinglePinterestContentPayloadV2(def, opts) {
  const origin = getPinterestContentSiteOrigin();
  const day = utcDayStamp();
  const context = topicContext(def, opts.topicParam);
  const familyResult = selectFamily({
    requestedFamily: opts.visualFamily,
    index: opts.bundleIndex,
    random: opts.random,
    seedCore: `${def.topic}-${day}`,
  });
  if (familyResult.ok === false) return familyResult;

  const family = familyResult.def;
  const visualFamily = familyResult.id;
  const intent = normalizeIntent(opts.intent, family.defaultIntent);
  const style = family.preferredStyle;
  const seedCore = opts.random
    ? `${def.topic}-${visualFamily}-${intent}-${Date.now()}-${opts.bundleIndex}-${Math.random()}`
    : `${def.topic}-${visualFamily}-${intent}-${day}-${opts.bundleIndex}`;
  const rnd = mulberry32(hashString(seedCore));
  const generatedNames = generateNamesV2({
    count: opts.usernameCount,
    style,
    topic: opts.topicParam || def.topic,
    context,
    seed: seedCore,
    random: false,
  });
  const canonicalUrl = `${origin}${def.path}`;
  const campaignId = buildCampaignId({
    day,
    topic: def.slug,
    visualFamily,
    intent,
    index: opts.bundleIndex,
  });
  const palette = pick(rnd, family.palettes);
  const hashtags = buildHashtags(def, context, visualFamily);
  const pinTitle = buildPinTitle(def, intent, generatedNames);
  const pinDescription = buildPinDescription(def, generatedNames, visualFamily);

  return {
    ok: true,
    topic: def.topic,
    keyword: def.keyword,
    intent,
    visualFamily,
    pinTitle,
    pinDescription,
    altText: buildAltText(def, family, generatedNames),
    imagePrompt: buildImagePrompt({
      def,
      family,
      visualFamily,
      intent,
      names: generatedNames,
      context,
      palette,
    }),
    negativePrompt: buildNegativePrompt(),
    generatedNames,
    usernames: generatedNames.map((item) => item.name),
    canonicalUrl,
    utmUrl: buildUtmUrl(canonicalUrl, campaignId, visualFamily),
    hashtags,
    stylePreset: family.stylePreset,
    campaignId,
    meta: {
      source: 'pinterest-content-v2',
      nameEngine: 'name-engine-v2',
      nameSource: 'generated-v2',
      style,
      context,
      palette,
      dayStamp: day,
      deterministic: !opts.random,
      requestedTopic: opts.topicParam || null,
      resolvedTopic: def.topic,
      resolvedSlug: def.slug,
    },
  };
}

/**
 * @param {{ topic?: string, random?: boolean|string, count?: number|string, usernameCount?: number|string, visualFamily?: string, intent?: string }} query
 */
export function buildPinterestContentV2Response(query = {}) {
  const count = clampNumber(query.count ?? query.limit, 1, 1, 12);
  const usernameCount = clampNumber(query.usernameCount, 10, 3, 50);
  const random = query.random === true || query.random === 'true' || query.random === '1';
  const topicParam = typeof query.topic === 'string' ? query.topic.trim() : '';
  const all = listPinterestContentTopicDefs();

  if (topicParam && !getPinterestContentTopicDef(topicParam)) {
    return {
      ok: false,
      error: 'unknown_topic',
      hint: 'Use a known topic id, slug, path segment, or supported legacy alias.',
      topics: listPinterestContentTopicIds(),
    };
  }

  if (query.visualFamily && !VISUAL_FAMILIES[String(query.visualFamily).trim()]) {
    return {
      ok: false,
      error: 'unknown_visual_family',
      hint: 'Use a known visualFamily id.',
      visualFamilies: Object.keys(VISUAL_FAMILIES),
    };
  }

  if (count === 1) {
    const def = topicParam
      ? getPinterestContentTopicDef(topicParam)
      : defaultPinterestContentTopicDef();
    return buildSinglePinterestContentPayloadV2(def, {
      topicParam,
      random,
      usernameCount,
      visualFamily: query.visualFamily,
      intent: query.intent,
      bundleIndex: 0,
    });
  }

  const day = utcDayStamp();
  const items = [];
  for (let i = 0; i < count; i += 1) {
    let def;
    if (topicParam) {
      def = getPinterestContentTopicDef(topicParam);
    } else {
      const idx = random
        ? Math.floor(Math.random() * all.length)
        : (hashString(`${day}-content-v2-${i}`) % all.length);
      def = all[idx];
    }
    items.push(buildSinglePinterestContentPayloadV2(def, {
      topicParam,
      random,
      usernameCount,
      visualFamily: query.visualFamily,
      intent: query.intent,
      bundleIndex: i,
    }));
  }

  return {
    ok: true,
    count: items.length,
    items,
    meta: {
      source: 'pinterest-content-v2',
      siteOrigin: getPinterestContentSiteOrigin(),
      deterministic: !random,
      dayStamp: day,
      visualFamilies: Object.keys(VISUAL_FAMILIES),
    },
  };
}

export function listPinterestContentV2VisualFamilies() {
  return Object.keys(VISUAL_FAMILIES);
}
