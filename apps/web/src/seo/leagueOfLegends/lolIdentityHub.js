/**
 * League of Legends — identity hub (editorial root).
 * Lane URLs are programmatic: /league-of-legends/{keyword}
 */

export const LOL_HUB_PATH = '/league-of-legends';

/** Identity lanes live today (programmatic keywords). Keep tight to avoid thin pages. */
export const LOL_IDENTITY_LANES = [
  {
    slug: 'pro',
    title: 'Pro & esports-adjacent',
    blurb: 'Short, pronounceable tags that read clean in client, op.gg, and clips—without cosplaying a team you’re not on.',
  },
  {
    slug: 'sweaty',
    title: 'Sweaty ranked',
    blurb: 'High-intensity solo queue energy: sharp, readable, intimidating in loading screen and death recap.',
  },
  {
    slug: 'tryhard',
    title: 'Tryhard',
    blurb: 'Same competitive intent with a louder “grind” signal—still disciplined, not noisy.',
  },
  {
    slug: 'one-word',
    title: 'One-word & challenger minimal',
    blurb: 'Single strong tokens and tight spellings—the side of LoL culture that prizes restraint over decoration.',
  },
  {
    slug: '3-letter',
    title: '3-letter & ultra-short',
    blurb: 'Initials and micro-tags that feel premium when they land—hard to get, easy to recognize.',
  },
  {
    slug: 'clean',
    title: 'Clean minimal',
    blurb: 'No clutter, no symbol stacks—works across regions and survives Riot ID + tag readability.',
  },
  {
    slug: 'korean',
    title: 'KR ladder minimal',
    blurb: 'Roman-letter restraint and lobby readability—the aspirational side of high-elo solo queue, not “Korean names.”',
  },
  {
    slug: 'aesthetic',
    title: 'Aesthetic profile',
    blurb: 'Softer, profile-forward names that still fit the client—distinct from ARAM meme chaos.',
  },
  {
    slug: 'anime',
    title: 'Anime-inspired (tasteful)',
    blurb: 'Skin-line and vibe-adjacent without turning the name into a paragraph of references.',
  },
  {
    slug: 'funny',
    title: 'Funny & lobby humor',
    blurb: 'One clear joke, readable in chat—know the line between clever and report-bait.',
  },
  {
    slug: 'edgy',
    title: 'Edgy assassin energy',
    blurb: 'Dark nouns and sharp syllables—strong in client, weak if it becomes try-hard cliché.',
  },
  {
    slug: 'brandable',
    title: 'Brandable core',
    blurb: 'A name you could keep for seasons: recall, pronunciation, and consistency across Discord.',
  },
  {
    slug: 'cool',
    title: 'Cool modern',
    blurb: 'Flexible “main character” handles that aren’t locked to one lane fantasy.',
  },
];

export const LOL_HUB_SECTIONS = [
  {
    title: 'What makes a LoL summoner name land',
    bullets: [
      'Readability beats decoration: the client shows your name constantly—loading screen, lobby, death recap.',
      'Minimal beats meme stacks: one clear idea beats three references crammed together.',
      'Region and queue context matters: what feels funny in ARAM can feel off in ranked.',
    ],
  },
  {
    title: 'Lanes, not a keyword zoo',
    bullets: [
      'Each lane below is a real cultural axis players recognize—pro minimal, sweaty ranked, Korean-adjacent romanization, etc.',
      'We expand slowly: depth and editorial voice first, URL count second.',
    ],
  },
];

export const LOL_HUB_FAQS = [
  {
    question: 'Is this connected to Riot Games?',
    answer:
      'No. TryhardNames is an independent identity utility. League of Legends is a trademark of Riot Games, Inc.',
  },
  {
    question: 'Why a hub instead of one generator page?',
    answer:
      'LoL naming culture isn’t one vibe. A hub lets you pick the lane that matches how you play and how you want to be read—then explore examples and patterns with context.',
  },
];
