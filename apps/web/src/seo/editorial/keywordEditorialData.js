/**
 * Keyword-level micro-subculture datasets.
 * These blocks must feel exclusive to the keyword (not generic game-level advice).
 *
 * Keep it lightweight:
 * - short bullets
 * - a few templates per keyword
 * - deterministic selection handled by editorialSections.js
 */
export const KEYWORD_EDITORIAL_DATA = {
  valorant: {
    clean: {
      hooks: [
        'Why minimal aliases dominate competitive scoreboards',
        'Clean esports branding: the “one-word” advantage',
        'Scoreboard clarity is a skill signal (clean tags win)',
      ],
      microGuides: [
        {
          title: 'Alias length that looks “pro” in Riot UI',
          bullets: ['4–8 chars: highest readability in scoreboard.', '9–12 chars: still OK, but avoid long suffixes.', 'If it wraps or truncates, it stops feeling premium.'],
        },
        {
          title: 'Anti-symbol philosophy (why pros avoid clutter)',
          bullets: [
            'Unicode can render inconsistently across fonts/clients.',
            'Symbols reduce comms recall (people mis-say or mis-type).',
            'One clean core word is more brandable across socials.',
          ],
        },
      ],
      pitfalls: [
        'Avoid double-modifier stacks (CleanRadiantImmortal): reads like cosplay, not pro.',
        'Avoid “xX_” framing—instantly breaks esports minimalism.',
        'Avoid numbers unless they are part of your identity (2–3 max).',
      ],
      links: [
        { label: 'VCT-style tags', to: '/valorant/vct' },
        { label: 'CS2 one-word aliases', to: '/cs2/one-word' },
        { label: 'Brandable usernames hub', to: '/brandable-usernames' },
      ],
      visual: { accent: 'cyan' },
    },
    tactical: {
      hooks: [
        'IGL-coded names: discipline > aggression',
        'Utility-minded identities (why “calm” reads tactical)',
        'Strategy-first naming: tags that sound composed',
      ],
      microGuides: [
        {
          title: 'Tactical words that feel “IGL”',
          bullets: ['Anchor, Default, Rotate, Retake, Hold, Setup.', 'Verb-first tags read like decision-making, not ego.', 'Keep them pronounceable for comms speed.'],
        },
        {
          title: 'Comms readability beats style',
          bullets: [
            'If your tag is hard to say, you lose instant recognition.',
            'Avoid ambiguous letters (l/I/1) if you want clarity.',
            'Clean casing is part of the “disciplined” vibe.',
          ],
        },
      ],
      pitfalls: ['Avoid edgy threat words (Slayer/Death): clashes with calm tactical identity.', 'Avoid loud rank flex cues (RadiantImmortal): feels tryhard.'],
      links: [
        { label: 'Valorant clean', to: '/valorant/clean' },
        { label: 'Aim-demon patterns', to: '/valorant/aim' },
        { label: 'Competitive hub', to: '/competitive-gamer-names' },
      ],
      visual: { accent: 'purple' },
    },
    radiant: {
      hooks: [
        'Radiant-coded tags: premium confidence, not cringe flex',
        'Rank identity works when it’s subtle',
        'Top-rank vibes: minimal cues, maximum polish',
      ],
      microGuides: [
        {
          title: 'How to signal rank without sounding cringe',
          bullets: ['One cue max (RR, Radiant) — then stop.', 'Let the core word carry the identity.', 'Short + pronounceable looks “signed”.'],
        },
        {
          title: '“Premium” rhythm (why it matters)',
          bullets: ['Two syllables read clean in comms.', 'Avoid chaotic consonant piles.', 'Consistent casing > random caps.'],
        },
      ],
      pitfalls: ['Avoid stacking rank words (RadiantImmortal): it backfires.', 'Avoid “Top1” type suffixes: meme-coded.'],
      links: [
        { label: 'VCT style', to: '/valorant/vct' },
        { label: 'Clean esports tags', to: '/valorant/clean' },
        { label: 'Brandable usernames', to: '/brandable-usernames' },
      ],
      visual: { accent: 'gold' },
    },
    jett: {
      hooks: ['Aggressive naming styles in duelist culture', 'Movement identity: tags built for montage energy', 'Entry-fragger vibes: sharp, fast, memorable'],
      microGuides: [
        {
          title: 'Montage culture patterns',
          bullets: ['Dash / Slice / Drift / Flick-coded words read “clip-ready”.', 'Short names look better in titles + thumbnails.', 'One sharp modifier max (avoid stacks).'],
        },
      ],
      pitfalls: ['Avoid long multi-word jokes: they die in killfeed.', 'Avoid heavy symbols that blur in motion clips.'],
      links: [
        { label: 'Valorant aim names', to: '/valorant/aim' },
        { label: 'Sweaty competitive tags', to: '/valorant/sweaty' },
        { label: 'Competitive hub', to: '/competitive-gamer-names' },
      ],
      visual: { accent: 'cyan' },
    },
  },

  roblox: {
    soft: {
      hooks: ['Soft usernames trend because they match avatar aesthetics', 'Pastel identity: clean rhythm, cozy vocabulary', 'Creator-friendly handles (soft ≠ generic)'],
      microGuides: [
        {
          title: 'Soft repetition that looks intentional',
          bullets: ['Double vowels sparingly (oo/ee) for “softness”.', 'Endings like ii/ie/xo can feel creator-coded.', 'Keep the base word readable—soft ≠ messy.'],
        },
        {
          title: 'Profile aesthetics > cleverness',
          bullets: ['Your name sits next to your avatar; consistency boosts recall.', 'One vibe cue + one noun is enough.', 'Avoid 3 separators; it looks bot-like.'],
        },
      ],
      pitfalls: ['Avoid mixing soft + edgy words (vibe conflict).', 'Avoid unicode fonts that break mobile copying.'],
      links: [
        { label: 'Aesthetic gaming tags hub', to: '/aesthetic-gaming-tags' },
        { label: 'TikTok handles', to: '/roblox/tiktok' },
        { label: 'Avatar branding', to: '/roblox/avatar' },
      ],
      visual: { accent: 'pink' },
    },
    tiktok: {
      hooks: ['TikTok handles win on mobile because typing friction is real', 'Trendable identities: short, rhythm-first handles', 'Creator discoverability starts with a clean handle'],
      microGuides: [
        {
          title: 'Mobile readability checklist',
          bullets: ['Avoid confusing characters (l/I/1) in the same name.', 'One separator max (dot or underscore).', 'If it takes two keyboard layouts, CTR drops.'],
        },
      ],
      pitfalls: ['Avoid emoji stacks; they look trendy for a week then age badly.', 'Avoid long numbers; they kill handle recall.'],
      links: [
        { label: 'Soft creator names', to: '/roblox/soft' },
        { label: 'Avatar branding usernames', to: '/roblox/avatar' },
        { label: 'Brandable usernames', to: '/brandable-usernames' },
      ],
      visual: { accent: 'cyan' },
    },
  },

  'gta-rp': {
    luxury: {
      hooks: ['Luxury RP identities work best when they sound believable', 'Old money vibes: minimalism + credibility', 'Prestige RP naming: subtle cues, real structure'],
      microGuides: [
        {
          title: 'Believable wealthy aliases (not “fake mafia” clichés)',
          bullets: ['Surname-first elegance beats loud crime keywords.', 'One luxury cue max (Gold/Crown/District).', 'If it reads like a gamertag, immersion breaks.'],
        },
      ],
      pitfalls: ['Avoid “DonBossLux” stacks: it reads cosplay.', 'Avoid streamer suffixes (TTV/YT): out-of-world.'],
      links: [
        { label: 'Realistic identities', to: '/gta-rp/realistic' },
        { label: 'Brandable usernames', to: '/brandable-usernames' },
        { label: 'Edgy tags hub', to: '/edgy-gamer-tags' },
      ],
      visual: { accent: 'gold' },
    },
  },

  cs2: {
    'one-word': {
      hooks: ['One-word aliases feel iconic in OG esports culture', 'Minimalist prestige: one word, one identity', 'Clean pro identity: readable, chantable, repeatable'],
      microGuides: [
        {
          title: 'Why one-word tags read “OG”',
          bullets: ['They don’t truncate in HUD.', 'They’re easy to chant in comms.', 'They scale across Steam + socials without changes.'],
        },
      ],
      pitfalls: ['Avoid underscores/dots unless they are part of the brand.', 'Avoid numbers by default—minimalism is the point.'],
      links: [
        { label: 'CS2 OG tags', to: '/cs2/og' },
        { label: 'Valorant clean', to: '/valorant/clean' },
        { label: 'Brandable usernames', to: '/brandable-usernames' },
      ],
      visual: { accent: 'emerald' },
    },
  },

  minecraft: {
    smp: {
      hooks: ['SMP identity is long-term: names should age well', 'Guild/community feeling: roles beat random words', 'Multiplayer presence: recognition over gimmicks'],
      microGuides: [
        {
          title: 'Long-term naming (why SMP is different)',
          bullets: ['People read your name for weeks, not one match.', 'Story-friendly roles feel natural (Ranger/Smith/Warden).', 'Cozy nouns improve recall without becoming generic.'],
        },
      ],
      pitfalls: ['Avoid PvP sweat suffixes if your server is cozy SMP.', 'Avoid symbol reliance—servers may strip them.'],
      links: [
        { label: 'Minecraft survival', to: '/minecraft/survival' },
        { label: 'Medieval vibes', to: '/minecraft/medieval' },
        { label: 'Aesthetic hub', to: '/aesthetic-gaming-tags' },
      ],
      visual: { accent: 'emerald' },
    },
  },

  'league-of-legends': {
    korean: {
      hooks: [
        'Roman-letter restraint: why calm tags survive ranked seasons',
        'Lobby readability as identity—not ornament',
        'Minimal cores travel cleanly across client, op.gg, and vod',
      ],
      microGuides: [
        {
          title: 'Why “quiet” reads stronger than loud here',
          bullets: [
            'High-attention surfaces punish gimmicks: death recap font is small and fast.',
            'Consistency beats novelty—mixed casing looks accidental, not crafted.',
            'If you need a joke, another lane fits better than this one.',
          ],
        },
        {
          title: 'What belongs in this lane',
          bullets: [
            'Tight syllables, pronounceable latin, no decoration arms race.',
            'Temperature discipline: minimal prestige, not irony.',
            'Borrow ladder habits—avoid borrowing real gamertags.',
          ],
        },
      ],
      pitfalls: [
        'Avoid imitation of real pros or org brands.',
        'Avoid suffix stacks (TTV/YT/region spam)—they fight minimal identity.',
        'Avoid mixing meme tone with KR restraint—they contradict each other.',
      ],
      links: [
        { label: 'One-word lane', to: '/league-of-legends/one-word' },
        { label: 'Clean lane', to: '/league-of-legends/clean' },
        { label: 'Identity hub', to: '/league-of-legends' },
      ],
      visual: { accent: 'emerald' },
    },
  },
};

