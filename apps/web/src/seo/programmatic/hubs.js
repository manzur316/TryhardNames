import { faqPageSchema } from '../schema.js';
import { isProgrammaticSlug, getAllProgrammaticSlugs } from './pages.js';
import { TOPIC_HUB_ROUTES } from './topicHubRoutes.js';

/**
 * Topic hubs (semantic intent hubs).
 * These are stable, indexable routes that consolidate authority and link into programmatic clusters.
 *
 * IMPORTANT:
 * - No changes to existing programmatic slugs.
 * - Node-build compatible imports (no @/ alias).
 */

const HUBS = [
  {
    slug: 'competitive-gamer-names',
    titleVariants: [
      'Competitive Gamer Names – Pro, Sweaty & Ranked Tags | TryhardNames',
      'Competitive Gamer Names – Clean Ranked Usernames | TryhardNames',
      'Competitive Gamer Names – Pro Tags Across Games | TryhardNames',
    ],
    descriptionVariants: [
      'A competitive hub of clean, ranked-ready gamer names across Valorant, Fortnite, COD, Roblox and more. Explore pro tags, tryhard names, and sweaty styles with practical naming rules.',
      'Browse competitive gamer names designed for readability in leaderboards and killfeeds. Compare pro tags, sweaty styles, and ranked-ready patterns across games.',
      'Explore competitive usernames with recipes, do/don’t rules, and cross-game picks to help you choose a clean tag that feels pro.',
    ],
    h1: 'Competitive Gamer Names',
    intents: ['competitive', 'brandable'],
    includeStyles: ['sweaty', 'tryhard', 'pro'],
    includeCategories: ['valorant', 'fortnite', 'cod', 'general'],
    faq: [
      {
        question: 'What makes a name feel competitive?',
        answer:
          'Competitive names are short, readable, and intentional. They look clean in leaderboards and killfeeds and sound like a tag you could keep long-term.',
      },
      {
        question: 'Should competitive names use symbols?',
        answer:
          'Usually no. Symbols can reduce readability and compatibility. If you use one, keep it subtle and test a plain version too.',
      },
    ],
    sections: [
      {
        title: 'What “competitive” actually means',
        content: [
          'Readable at speed (HUD, killfeed, scoreboard).',
          'Short and brandable (easy to say out loud).',
          'Low-noise styling (no symbol stacks, no random years).',
        ],
      },
      {
        title: 'Fast recipes',
        content: [
          '[Skill word] + [Noun] (Clutch + Ghost)',
          '[Short word] + X (NovaX)',
          '[Noun] + 2–3 char suffix (PulseVLR)',
        ],
      },
    ],
  },
  {
    slug: 'aesthetic-gaming-tags',
    titleVariants: [
      'Aesthetic Gaming Tags – Clean, Cute & Minimal | TryhardNames',
      'Aesthetic Gaming Tags – Profile-Ready Usernames | TryhardNames',
      'Aesthetic Gaming Tags – Minimal Names That Look Good | TryhardNames',
    ],
    descriptionVariants: [
      'Aesthetic gaming tags that look great on profiles and socials. Explore clean minimalist names, cute vibes, and aesthetic styles across games with compatibility-first tips.',
      'Find aesthetic gaming tags with clean, minimal patterns that stay readable on mobile. Explore cute vibes, aesthetic styles, and compatibility tips across games.',
      'Browse aesthetic usernames designed for profiles: minimal words, consistent rhythm, and soft styling that works across platforms.',
    ],
    h1: 'Aesthetic Gaming Tags',
    intents: ['aesthetic', 'minimal', 'brandable'],
    includeStyles: ['aesthetic', 'cute', 'cool'],
    includeCategories: ['roblox', 'valorant', 'general', 'fortnite'],
    faq: [
      {
        question: 'Do aesthetic tags need fancy fonts?',
        answer:
          'No. Simple words with consistent styling often look better and work on more platforms than heavy Unicode fonts.',
      },
      {
        question: 'How do I keep an aesthetic tag readable?',
        answer:
          'Use short words, avoid stacked separators, and keep symbols minimal. Test how it looks in small UI and on mobile.',
      },
    ],
    sections: [
      {
        title: 'Aesthetic ≠ hard to read',
        content: [
          'Minimal words, consistent rhythm.',
          'Soft symbols only if compatible.',
          'Vibe-first vocabulary (nature, space, cozy nouns).',
        ],
      },
      {
        title: 'Compatibility checklist',
        content: [
          'Try an ASCII-only version (no special symbols).',
          'Avoid multiple separators (.__._).',
          'Pick one theme per username.',
        ],
      },
    ],
  },
  {
    slug: 'brandable-usernames',
    titleVariants: [
      'Brandable Usernames – Clean Tags for Gaming & Socials | TryhardNames',
      'Brandable Usernames – Memorable, Easy-to-Type Names | TryhardNames',
      'Brandable Usernames – Clean Handles That Scale | TryhardNames',
    ],
    descriptionVariants: [
      'Brandable usernames that are easy to remember, say out loud, and reuse across platforms. Explore clean, minimal, and pro-style tags with naming recipes that scale.',
      'Explore brandable usernames built for recall: pronounceable, clean, and reusable across platforms. Includes recipes and patterns that scale.',
      'Find clean brandable handles for gaming and socials—minimal noise, high readability, and naming rules that help availability.',
    ],
    h1: 'Brandable Usernames',
    intents: ['brandable', 'minimal', 'curated'],
    includeStyles: ['cool', 'pro', '3-letter', 'best'],
    includeCategories: ['general', 'valorant', 'fortnite', 'cod'],
    faq: [
      {
        question: 'What makes a username brandable?',
        answer:
          'A brandable username is pronounceable, short, consistent across platforms, and doesn’t rely on random numbers or complicated symbols.',
      },
      {
        question: 'Are 3-letter names good for branding?',
        answer:
          'Yes. They look premium and are easy to remember, but many are taken—so initials and short codes help.',
      },
    ],
    sections: [
      {
        title: 'Brand rules that improve recall',
        content: [
          'Pronounceable (people remember what they can say).',
          'Short enough for handles and overlays.',
          'Unique spelling twist (one change, not ten).',
        ],
      },
      {
        title: 'Naming recipes',
        content: [
          '[One strong noun] (Onyx, Rogue, Nova).',
          '[Modifier] + [Noun] (NeonRogue).',
          '[Short word] + X (VexX).',
        ],
      },
    ],
  },
  {
    slug: 'edgy-gamer-tags',
    titleVariants: [
      'Edgy Gamer Tags – Dark, Clean & Premium | TryhardNames',
      'Edgy Gamer Tags – Shadow Vibes, Readable Names | TryhardNames',
      'Edgy Gamer Tags – Dark Usernames Without Spam | TryhardNames',
    ],
    descriptionVariants: [
      'Edgy gamer tags with dark themes that still look premium and readable. Explore edgy styles across games with safe, non-spammy naming patterns.',
      'Browse edgy gamer tags with dark themes that stay readable in small UI. Includes safe patterns, clean styling, and cross-game picks.',
      'Explore dark, premium-looking usernames built on fantasy vibes (void, nyx, ruin) without keyword stuffing or symbol spam.',
    ],
    h1: 'Edgy Gamer Tags',
    intents: ['dark', 'competitive', 'brandable'],
    includeStyles: ['edgy', 'tryhard', 'cool'],
    includeCategories: ['cod', 'valorant', 'general'],
    faq: [
      {
        question: 'What makes an edgy tag look premium?',
        answer:
          'Premium edgy tags keep the darkness in the vocabulary, not in clutter. Minimal styling, clean spelling, and readability beat symbol spam.',
      },
      {
        question: 'Will edgy names get flagged?',
        answer:
          'Avoid offensive terms and threats. Stick to fantasy-dark words (void, nyx, ruin) rather than real-world hate or violence.',
      },
    ],
    sections: [
      {
        title: 'Dark vibes, clean execution',
        content: [
          'Use fantasy-dark nouns (void, abyss, nyx).',
          'Keep it short and readable in small UI.',
          'Avoid “edgy spam” patterns and symbol stacks.',
        ],
      },
      {
        title: 'Safe edgy patterns',
        content: [
          '[Dark noun] (Void, Hex, Nyx).',
          '[Dark noun] + [Short suffix] (VoidX).',
          '[Word] + Hex / Nyx (PulseNyx).',
        ],
      },
    ],
  },
];

function hashToInt(input) {
  const s = String(input);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickVariant(key, options) {
  if (!options || options.length === 0) return null;
  const idx = hashToInt(key) % options.length;
  return options[idx];
}

function uniqueBySlug(items) {
  const seen = new Set();
  const out = [];
  for (const i of items) {
    if (seen.has(i.slug)) continue;
    seen.add(i.slug);
    out.push(i);
  }
  return out;
}

function buildProgrammaticLink(slug) {
  return {
    slug,
    title: slug.split('/').map((s) => s.replace(/-/g, ' ')).join(' '),
  };
}

function scoreHubCandidate(hub, slug) {
  // prefer slugs whose keyword is in the hub styles and whose category is in includeCategories
  const [category, keyword] = slug.split('/');
  let score = 0;
  if (hub.includeStyles.includes(keyword)) score += 50;
  if (hub.includeCategories.includes(category)) score += 30;
  if (category === 'general') score += 5;
  return score;
}

function pickTopHubLinks(hub, maxLinks = 14) {
  const all = getAllProgrammaticSlugs().filter((s) => isProgrammaticSlug(s));
  const scored = all
    .map((slug) => ({ slug, score: scoreHubCandidate(hub, slug) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, maxLinks).map((x) => buildProgrammaticLink(x.slug));
  return uniqueBySlug(top);
}

function buildHubBlocks(hub) {
  const primary = pickTopHubLinks(hub, 10);

  // small cross-links to other hubs
  const otherHubs = HUBS.filter((h) => h.slug !== hub.slug).slice(0, 3).map((h) => ({
    slug: h.slug,
    title: h.h1,
    isHub: true,
  }));

  return [
    { title: 'Top picks across games', links: primary.slice(0, 6) },
    { title: 'Explore related pages', links: primary.slice(6, 10) },
    { title: 'More topic hubs', links: otherHubs },
  ].filter((b) => b.links.length > 0);
}

export function getAllTopicHubPaths() {
  return TOPIC_HUB_ROUTES.map((r) => r.path);
}

export function getTopicHubBySlug(slug) {
  const normalized = slug.startsWith('/') ? slug.slice(1) : slug;
  const hub = HUBS.find((h) => h.slug === normalized);
  if (!hub) return null;

  const title = pickVariant(`${hub.slug}:title`, hub.titleVariants) || hub.titleVariants?.[0] || hub.title;
  const description =
    pickVariant(`${hub.slug}:desc`, hub.descriptionVariants) || hub.descriptionVariants?.[0] || hub.description;

  const linkBlocks = buildHubBlocks(hub);
  const jsonLd = [faqPageSchema(hub.faq)];

  return {
    slug: hub.slug,
    title,
    description,
    h1: hub.h1,
    sections: hub.sections,
    faqs: hub.faq,
    linkBlocks,
    jsonLd,
  };
}

