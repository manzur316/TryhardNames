import { getNamesByCategory } from '../../../../web/src/features/nameGenerators/services/nameGeneratorService.js';
import { getPinterestContentSiteOrigin } from './pinterestSiteOrigin.js';
import {
  defaultPinterestContentTopicDef,
  getPinterestContentTopicDef,
  listPinterestContentTopicDefs,
  listPinterestContentTopicIds,
} from './pinterestContentTopics.js';

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

function sanitizeTitle(value, max = 100) {
  const s = String(value || '').replace(/\s+/g, ' ').trim();
  return s.slice(0, max);
}

function sanitizeDescription(value, max = 500) {
  const s = String(value || '').replace(/\s+/g, ' ').trim();
  return s.slice(0, max);
}

function buildHashtags(def) {
  const base = ['#TryhardNames', '#GamerNames', '#Gaming'];
  const cat = def.category.replace(/-/g, '');
  const extra = [`#${cat.charAt(0).toUpperCase() + cat.slice(1)}`];
  const words = def.keyword
    .split(/[^a-zA-Z0-9]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2)
    .slice(0, 3)
    .map((w) => `#${w.charAt(0).toUpperCase()}${w.slice(1)}`);
  const merged = [...new Set([...words, ...extra, ...base])];
  return merged.slice(0, 10);
}

function pickUsernames(engine, count, seedString) {
  const pool = getNamesByCategory(engine.type, engine.category);
  const sorted = [...new Set(pool)].sort((a, b) => a.localeCompare(b));
  if (sorted.length === 0) {
    return [];
  }
  const want = Math.min(count, sorted.length);
  const seed = hashString(seedString);
  const rnd = mulberry32(seed);
  const picks = [];
  const used = new Set();
  let guard = 0;
  while (picks.length < want && guard < sorted.length * 8) {
    guard += 1;
    const idx = Math.floor(rnd() * sorted.length);
    const name = sorted[idx];
    if (!used.has(name)) {
      used.add(name);
      picks.push(name);
    }
  }
  if (picks.length < want) {
    for (const name of sorted) {
      if (!used.has(name)) {
        used.add(name);
        picks.push(name);
        if (picks.length >= want) break;
      }
    }
  }
  return picks;
}

function buildDescription(def, usernames) {
  const samples = usernames.slice(0, 3).join(', ');
  return sanitizeDescription(
    `Discover ${def.keyword.toLowerCase()} on TryhardNames — curated ideas for ${def.audience}. `
      + `Example styles: ${samples}. `
      + `Open ${def.path} for more angles, filters, and copy-ready gamertag inspiration.`,
    500,
  );
}

function buildTitle(def) {
  return sanitizeTitle(`${def.keyword} | TryhardNames`, 100);
}

/**
 * @param {import('./pinterestContentTopics.js').PinterestContentTopicDef} def
 * @param {{ usernameCount: number, random: boolean, bundleIndex: number }} opts
 */
export function buildSinglePinterestContentPayload(def, opts) {
  const origin = getPinterestContentSiteOrigin();
  const day = utcDayStamp();
  const seedCore = opts.random
    ? `${def.topic}-${Date.now()}-${opts.bundleIndex}-${Math.random()}`
    : `${def.topic}-${day}-${opts.bundleIndex}`;

  const usernames = pickUsernames(def.engine, opts.usernameCount, seedCore);

  return {
    ok: true,
    topic: def.topic,
    keyword: def.keyword,
    category: def.category,
    canonicalUrl: `${origin}${def.path}`,
    slug: def.slug,
    title: buildTitle(def),
    description: buildDescription(def, usernames),
    usernames,
    hashtags: buildHashtags(def),
    visualStyle: def.visualStyle,
    audience: def.audience,
    meta: {
      source: 'tryhardnames-internal-generators',
      engine: def.engine,
      dayStamp: day,
      deterministic: !opts.random,
    },
  };
}

/**
 * @param {{ topic?: string, limit: number, random: boolean, usernameCount: number }} query
 */
export function buildPinterestContentResponse(query) {
  const limit = Math.min(20, Math.max(1, Number(query.limit) || 1));
  const usernameCount = Math.min(24, Math.max(3, Number(query.usernameCount) || 6));
  const random = query.random === true || query.random === 'true' || query.random === '1';

  const topicParam = typeof query.topic === 'string' ? query.topic.trim() : '';
  const all = listPinterestContentTopicDefs();

  if (topicParam) {
    const resolved = getPinterestContentTopicDef(topicParam);
    if (!resolved) {
      return {
        ok: false,
        error: 'unknown_topic',
        hint: 'Use a known topic id, slug, or path segment (see topics list).',
        topics: listPinterestContentTopicIds(),
      };
    }
  }

  if (limit === 1) {
    const def = topicParam
      ? getPinterestContentTopicDef(topicParam)
      : defaultPinterestContentTopicDef();
    return buildSinglePinterestContentPayload(def, {
      usernameCount,
      random,
      bundleIndex: 0,
    });
  }

  const items = [];
  for (let i = 0; i < limit; i += 1) {
    let def;
    if (topicParam) {
      def = getPinterestContentTopicDef(topicParam);
    } else {
      const idx = random
        ? Math.floor(Math.random() * all.length)
        : (hashString(`${utcDayStamp()}-${i}`) % all.length);
      def = all[idx];
    }
    items.push(
      buildSinglePinterestContentPayload(def, {
        usernameCount,
        random,
        bundleIndex: i,
      }),
    );
  }

  return {
    ok: true,
    count: items.length,
    items,
    meta: {
      siteOrigin: getPinterestContentSiteOrigin(),
      deterministic: !random,
      dayStamp: utcDayStamp(),
    },
  };
}
