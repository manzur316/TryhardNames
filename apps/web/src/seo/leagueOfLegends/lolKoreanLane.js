/**
 * Lane differentiation: /league-of-legends/korean
 * KR high-elo fantasy = roman-letter restraint + lobby readability, not "Korean names" SEO.
 */

import { faqPageSchema } from '../schema.js';
import { finalizeLolKrComposition, LOL_KR_MINIMAL_COMPOSITION } from '../composition/compositionProfiles.js';
import { humanPaceKrOrderKeyed, KR_DEFAULT_ECOLOGY_SALT } from './krBehavioralCuration.js';
import { buildKrIntentLayeredPick, presentKrIntentSurface } from './krIntentSignatures.js';
import { resolveKrDiscoveryTier } from './krDiscoverySurface.js';

export { BehavioralCurationRules, KR_PLAIN_BEHAVIORAL_LEXICON } from './krBehavioralCuration.js';
export { DiscoverySurfaceRules } from './krDiscoverySurface.js';

/** SSR / sitemap / programmatic — stable until salt passed explicitly (same as {@link KR_DEFAULT_ECOLOGY_SALT}). */
export const KR_ECLOGY_STATIC_SALT = KR_DEFAULT_ECOLOGY_SALT;

export const LOL_KOREAN_LANE_SLUG = 'league-of-legends/korean';

const STYLE_TITLE = 'KR ladder minimal';

/**
 * KR ladder lane — lexicon kept disjoint from global STYLE_DEFS “dark minimal” sludge
 * (Void / Nova / Cipher / Echo / Shadow recycled across dozens of keywords).
 * Preference: calm surfaces, compact syllables, low mythic drama, op.gg-plausible cores.
 */
export const LOL_KOREAN_POOLS = {
  cold: [
    'Mist',
    'Frost',
    'Tide',
    'Veil',
    'Mute',
    'Lane',
    'Solo',
    'Clip',
    'Peak',
    'Drift',
    'Haze',
    'Slate',
    'Gale',
    'Vale',
    'Knox',
    'Reed',
    'Elm',
    'Cove',
    'Spar',
    'Rime',
    'Mire',
    'Kite',
    'Dusk',
    'Gray',
    'Calm',
    'Silt',
    'Loch',
    'Numb',
    'Pale',
    'Flint',
    'Birch',
  ],
  tight: ['Min', 'Jun', 'Seo', 'Rae', 'Woo', 'Jin', 'Yun', 'Kyul', 'Nae', 'Eon'],
};

/** Extra minimal cores — short, ambiguous; kept tiny to avoid “random syllable soup” */
const KR_SINGLE_EXTRAS = ['ren', 'vey', 'sol', 'ion'];

function uniq(arr) {
  return [...new Set((arr || []).filter(Boolean).map(String))];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Quick transforms aligned with KR ladder restraint (no TTV, symbols, meme suffixes).
 * No dual-token fusion modes — those recreate “compound generator” silhouette.
 */
export const LOL_KOREAN_QUICK_MODES = [
  { id: 'kr-client-clean', label: 'Client clean' },
  { id: 'kr-tight', label: 'Tighter tag' },
  { id: 'kr-one', label: 'One surface' },
  { id: 'kr-quiet', label: 'Lowercase alt' },
  { id: 'kr-case', label: 'Casing shift' },
];

export function applyLolKoreanQuickMode(mode, baseNames) {
  const base = uniq(baseNames.map(String));
  const out = [];
  const strip = (s) => String(s).replace(/[^a-zA-Z]/g, '');

  for (const raw of base) {
    const w = strip(raw);
    if (!w || w.length < 2) continue;

    if (mode === 'kr-client-clean') {
      const c = w.slice(0, 14);
      out.push(c);
      if (w.length > 7) out.push(w.slice(0, 7));
    } else if (mode === 'kr-tight') {
      const n = Math.min(7, Math.max(4, w.length <= 7 ? w.length : 6));
      out.push(w.slice(0, n));
    } else if (mode === 'kr-one') {
      const split = w.replace(/([a-z])([A-Z])/g, '$1 $2').trim().split(/\s+/);
      const head = split[0] || w;
      if (head.length <= 10) out.push(head);
      if (split[1] && split[1].length <= 6) out.push(split[1]);
    } else if (mode === 'kr-quiet') {
      out.push(w.toLowerCase());
    } else if (mode === 'kr-case') {
      const low = w.toLowerCase();
      out.push(low);
      out.push(low.charAt(0).toUpperCase() + low.slice(1));
    }
  }

  return finalizeLolKrComposition(shuffle(uniq([...out, ...base])).slice(0, 40));
}

/** Subtle variants for “nearby” exploration — no leetspeak circus */
function finalizeKrLaneRows(rows) {
  const { maxLen, minLen, forbiddenPatterns } = LOL_KR_MINIMAL_COMPOSITION;
  const out = [];
  const seen = new Set();
  for (const row of rows || []) {
    let s = String(row.presented).replace(/[^a-zA-Z]/g, '');
    if (!s) continue;
    if (s.length > maxLen) s = s.slice(0, maxLen);
    if (s.length < minLen) continue;
    let reject = false;
    for (const re of forbiddenPatterns) {
      if (re.test(s)) {
        reject = true;
        break;
      }
    }
    if (reject) continue;
    const k = s.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ ...row, presented: s });
  }
  return out;
}

export function evolveLolKoreanVariants(baseName) {
  const w = String(baseName || '').replace(/[^a-zA-Z]/g, '');
  if (!w) return [];
  const lower = w.toLowerCase();
  const dropLast = w.length > 4 ? w.slice(0, -1) : w;
  const head = w.slice(0, Math.min(6, w.length));
  const raw = uniq([w, lower, dropLast, head, w.length > 5 ? w.slice(0, 5) : w].filter(Boolean));
  return finalizeLolKrComposition(
    raw.map((x) =>
      presentKrIntentSurface(x.replace(/[^a-zA-Z]/g, '').toLowerCase(), 'clean_grinder'),
    ),
  );
}

/**
 * Single-token-only surface: reads like alt / smurf picks, not assembled compounds.
 * Dual CamelCase fusion intentionally removed — it shared the global generator silhouette.
 */
export function buildLolKoreanSummonerNamesDetailed(ecologySalt = KR_ECLOGY_STATIC_SALT) {
  const { cold, tight } = LOL_KOREAN_POOLS;

  const pairs = buildKrIntentLayeredPick(
    {
      cold: cold.map((w) => w.toLowerCase()),
      tight: tight.map((w) => w.toLowerCase()),
      extras: KR_SINGLE_EXTRAS,
    },
    ecologySalt,
  );

  const rows = pairs.map(({ token, intent }) => ({
    presented: presentKrIntentSurface(token, intent),
    intent,
    token,
  }));

  const ordered = humanPaceKrOrderKeyed(rows, (r) => r.presented, ecologySalt);
  const finalized = finalizeKrLaneRows(ordered);

  const names = [];
  const discoverySurfaces = [];
  finalized.forEach((r, i) => {
    names.push(r.presented);
    discoverySurfaces.push(
      resolveKrDiscoveryTier({
        intent: r.intent,
        presented: r.presented,
        index: i,
        ecologySalt,
      }),
    );
  });

  return { names, discoverySurfaces };
}

export function buildLolKoreanSummonerNames() {
  return buildLolKoreanSummonerNamesDetailed(KR_ECLOGY_STATIC_SALT).names;
}

const SECTIONS = [
  {
    title: 'What “KR ladder minimal” means here',
    content: [
      'High-level League culture often prizes roman-letter tags that read cold and fast: short syllables, no decoration, strong lobby presence. That habit shows up well beyond Korea—but this lane is for the aspirational fantasy of that restraint.',
      'This is not a list of “Korean names.” It is identity framing: compact handles that could sit next to a Challenger badge without shouting.',
      'If it needs explanation in all-chat, it is probably too clever for this lane.',
    ],
  },
  {
    title: 'Where the name actually lives',
    content: [
      'Client, loading screen, death recap, op.gg—same string everywhere. Misread tags feel cheaper than loud ones.',
      'Riot ID + tag still rewards pronounceable cores: teammates ping you by habit, not by decoding symbols.',
      'Restraint reads as confidence; stacked modifiers read as nervous energy.',
    ],
  },
  {
    title: 'Lines not to cross',
    content: [
      'Avoid cosplaying real pros or teams—signal style, not impersonation.',
      'Skip faux-localization or random syllable piles; they age fast and feel disrespectful.',
      'Edgy spam undoes minimal prestige—pick one temperature and stay there.',
    ],
  },
];

const FAQS = [
  {
    question: 'Is this lane “Korean names”?',
    answer:
      'No. It targets the roman-letter minimalism common in high-level solo queue culture—the fantasy of a quiet, precise tag. Our suggestions stay in latin letters and readable shapes; we are not generating Korean names or imitating real players.',
  },
  {
    question: 'Why do minimal tags feel stronger in League?',
    answer:
      'Your summoner name is always visible. A short, legible tag survives seasons; noisy constructions feel dated faster. Minimalism reads intentional in client and on op.gg—the same surfaces where reputation is earned.',
  },
  {
    question: 'How short should the tag be?',
    answer:
      'Often four to nine letters for the core—enough to be unique, not enough to clutter the lobby. If you go shorter, every character has to carry weight.',
  },
  {
    question: 'Should I match “LCK” styling?',
    answer:
      'Borrow the discipline—clean casing, no clutter—not cosplay. Pros compete under branding constraints you do not share; steal the restraint, not the jersey.',
  },
  {
    question: 'Are lowercase tags okay?',
    answer:
      'Some ladders favor understated casing. If you choose lowercase, commit consistently—mixed random casing reads messy in death recap.',
  },
  {
    question: 'What about edgy or meme names?',
    answer:
      'Wrong lane. Irony and aggression fight minimal prestige. Use funny or edgy lanes if you want punch; come here when you want quiet confidence.',
  },
  {
    question: 'Why avoid symbol stacks?',
    answer:
      'Symbols rarely add skill signals—and they break faster across club tags, Discord, and vod overlays. One clean word usually beats decoration.',
  },
];

export function getLolKoreanLinkBlocks() {
  return [
    {
      title: 'Same universe · calm lanes',
      links: [
        { slug: 'league-of-legends/one-word', title: 'One-word minimal' },
        { slug: 'league-of-legends/clean', title: 'Clean minimal' },
        { slug: 'league-of-legends/pro', title: 'Pro · esports-adjacent' },
        { slug: 'league-of-legends/brandable', title: 'Brandable core' },
      ],
    },
    {
      title: 'League universe',
      links: [{ slug: 'league-of-legends', title: 'Identity hub' }],
    },
  ];
}

export function mergeLolKoreanLanePageData(base) {
  const title =
    'KR ladder minimal summoner tags · League of Legends identity | TryhardNames';
  const description =
    'Roman-letter handles framed for high-elo restraint: compact, legible in client and op.gg, quiet confidence—not “Korean username” gimmicks or symbol stacks.';

  const namePayload = buildLolKoreanSummonerNamesDetailed();

  return {
    ...base,
    laneExperience: 'lol-korean',
    title,
    description,
    h1: STYLE_TITLE,
    laneHero: {
      eyebrow: 'League of Legends · identity lane',
      title: 'Quiet prestige under a roman-letter tag.',
      subtitle:
        'The aspirational side of solo queue culture: short syllables, calm casing, strong lobby readability. Not ethnic caricature—pattern discipline borrowed from how elite ladders treat identity.',
      note: 'Believable on op.gg. Restraint beats decoration when your name is always on screen.',
    },
    sections: SECTIONS,
    faqs: FAQS,
    names: namePayload.names,
    krDiscoverySurfaces: namePayload.discoverySurfaces,
    related: [],
    linkBlocks: getLolKoreanLinkBlocks(),
    topicHub: null,
    namesSectionTitle: 'Starter handles',
    namesSectionLead:
      'Single-surface tags only—no stitched CamelCase compounds. Skim like a lobby: most tags just exist; a few read a little louder without turning into a scoreboard.',
    internalExploreTitle: 'Explore · calm lanes',
    laneUi: {
      shuffleLabel: 'New draw',
      evolveLabel: 'Nearby variants',
      resetLabel: 'Reset pool',
      filterAll: 'All lengths',
      filterShort: 'Short',
      filterMedium: 'Mid',
      filterAsciiLabel: 'Latin only',
      filterRiotLabel: 'Compact core',
      favoritesHeading: 'Pinned tags',
      favoritesClear: 'Clear',
      savedLabel: 'Pinned',
      saveLabel: 'Pin',
    },
    jsonLd: [faqPageSchema(FAQS)],
  };
}
