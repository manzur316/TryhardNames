/**
 * Editorial templates (micro blocks).
 *
 * Output format is consumed by editorialSections.js and then rendered by SeoTemplate.
 * Keep blocks short, scannable, and non-repetitive.
 */

function asList(arr, max = 4) {
  return (arr || []).filter(Boolean).slice(0, max);
}

export function buildMicroGuideIntro({ gameLabel, keywordLabel, angle }) {
  const a = String(angle || '').trim();
  const k = String(keywordLabel || '').trim();
  const g = String(gameLabel || '').trim();
  if (a) return a;
  if (k && g) return `Mini guide: ${k} naming for ${g} (culture-first, not templates).`;
  if (g) return `Mini guide: naming culture for ${g} (fast, practical, scan-friendly).`;
  return `Mini guide: gaming identity naming (fast, practical, scan-friendly).`;
}

export function tWhyItWorks({ title, bullets, links, eyebrow = 'Why it works' }) {
  return {
    kind: 'editorial',
    eyebrow,
    title,
    bullets: asList(bullets, 4),
    links: asList(links, 3),
  };
}

export function tPitfalls({ title, bullets, links, eyebrow = 'Avoid these' }) {
  return {
    kind: 'editorial',
    eyebrow,
    title,
    bullets: asList(bullets, 4),
    links: asList(links, 3),
  };
}

export function tQuickChecks({ title, bullets, links, eyebrow = 'Fast checks' }) {
  return {
    kind: 'editorial',
    eyebrow,
    title,
    bullets: asList(bullets, 4),
    links: asList(links, 3),
  };
}

export function tRoleCulture({ title, bullets, links, eyebrow = 'Culture note' }) {
  return {
    kind: 'editorial',
    eyebrow,
    title,
    bullets: asList(bullets, 4),
    links: asList(links, 3),
  };
}

export function tMicroGuide({ title, bullets, links, eyebrow = 'Micro guide', tone }) {
  return {
    kind: 'editorial',
    eyebrow,
    title,
    bullets: asList(bullets, 4),
    links: asList(links, 3),
    tone: tone || undefined,
  };
}

