/**
 * Minimal SVG artifact builder — semantic groups, system fonts, no raster deps.
 * Opens cleanly in Figma/Illustrator/Inkscape for edits; Unicode preserved via UTF-8.
 */

import { normalizeIdentityKit, IDENTITY_SURFACES, READABILITY_TIERS } from './identityKitModel.js';
import { getKitInterpretation } from './identityCultureNotes.js';

const BG = '#070A12';
const MOOD_ACCENT = {
  calm: '#22d3ee',
  sharp: '#f59e0b',
  soft: '#fb7185',
  neutral: '#64748b',
};

/** @param {string} s */
function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Greedy word-wrap for SVG <text> lines (approximate; complex scripts may vary).
 * @param {string} text
 * @param {number} maxChars
 * @returns {string[]}
 */
export function wrapSvgPlainText(text, maxChars) {
  const t = String(text || '').trim();
  if (!t) return [];
  const words = t.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length <= maxChars) {
      cur = next;
    } else {
      if (cur) lines.push(cur);
      if (w.length > maxChars) {
        const chars = [...w];
        for (let i = 0; i < chars.length; i += maxChars) {
          lines.push(chars.slice(i, i + maxChars).join(''));
        }
        cur = '';
      } else {
        cur = w;
      }
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
}

const FONT_STACK = "'Rajdhani', 'DM Sans', ui-sans-serif, system-ui, sans-serif";

/**
 * @param {object} kitRaw
 * @param {{ layout?: 'vertical' | 'banner' }} [opts]
 * @returns {string}
 */
export function buildIdentityKitSvgString(kitRaw, opts = {}) {
  const k = normalizeIdentityKit(kitRaw);
  const layout =
    opts.layout !== undefined && opts.layout !== null
      ? opts.layout
      : k.artifactLayout === 'banner'
        ? 'banner'
        : 'vertical';
  const accent = MOOD_ACCENT[k.moodId] || MOOD_ACCENT.neutral;
  const surfaceLabel = IDENTITY_SURFACES.find((s) => s.id === k.surfaceId)?.label || k.surfaceId;

  const display = (k.styledAlias || k.primaryAlias || '').trim() || 'Your alias';
  const subLine = k.symbolLine.trim()
    ? k.symbolLine.trim()
    : k.styledAlias.trim() && k.primaryAlias.trim() && k.styledAlias.trim() !== k.primaryAlias.trim()
      ? `Plain read: ${k.primaryAlias.trim()}`
      : '';

  const interp = getKitInterpretation(k);

  if (layout === 'banner') {
    return buildBannerSvg({
      k,
      accent,
      surfaceLabel,
      display,
      subLine,
      interp,
    });
  }

  return buildVerticalSvg({
    k,
    accent,
    surfaceLabel,
    display,
    subLine,
    interp,
  });
}

/**
 * @param {object} p
 */
function buildBannerSvg({ k, accent, surfaceLabel, display, subLine, interp }) {
  const W = 720;
  const padX = 44;
  const readabilityLabel =
    READABILITY_TIERS.find((x) => x.id === k.readabilityTier)?.label ?? 'Balanced read';
  const parts = [];
  let y = 52;

  parts.push(
    `<text x="${padX}" y="${y}" fill="rgba(255,255,255,0.35)" font-size="10" font-family="${FONT_STACK}" letter-spacing="0.28em">${xmlEscape(
      k.kitLabel ? `KIT · ${k.kitLabel.toUpperCase()}` : 'IDENTITY KIT'
    )}</text>`
  );
  y += 36;

  const dispLines = wrapSvgPlainText(display, 44);
  for (const dl of dispLines.slice(0, 6)) {
    parts.push(
      `<text x="${padX}" y="${y}" fill="rgba(255,255,255,0.95)" font-size="22" font-weight="600" font-family="${FONT_STACK}" text-rendering="optimizeLegibility">${xmlEscape(dl)}</text>`
    );
    y += 28;
  }

  if (subLine) {
    parts.push(
      `<text x="${padX}" y="${y}" fill="rgba(255,255,255,0.45)" font-size="13" font-family="${FONT_STACK}" text-rendering="optimizeLegibility">${xmlEscape(subLine)}</text>`
    );
    y += 22;
  }

  if (k.bioLine.trim()) {
    const bioLines = wrapSvgPlainText(k.bioLine.trim(), 52).slice(0, 5);
    for (const bl of bioLines) {
      parts.push(
        `<text x="${padX}" y="${y}" fill="rgba(255,255,255,0.55)" font-size="13" font-family="${FONT_STACK}" text-rendering="optimizeLegibility">${xmlEscape(bl)}</text>`
      );
      y += 18;
    }
  }

  /* Chips after body — matches React banner; avoids collision with tall aliases */
  y += 12;
  const chipLine = `${surfaceLabel.toUpperCase()}  ·  ${readabilityLabel.toUpperCase()}`;
  parts.push(
    `<text x="${padX}" y="${y}" fill="rgba(255,255,255,0.35)" font-size="10" font-weight="600" font-family="${FONT_STACK}" letter-spacing="0.14em">${xmlEscape(chipLine)}</text>`
  );
  y += 26;

  parts.push(
    `<line x1="${padX}" y1="${y - 8}" x2="${W - 40}" y2="${y - 8}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`
  );
  parts.push(
    `<text x="${padX}" y="${y}" fill="rgba(255,255,255,0.3)" font-size="9" font-family="${FONT_STACK}" letter-spacing="0.28em">READ CONTEXT</text>`
  );
  y += 18;
  parts.push(
    `<text x="${padX}" y="${y}" fill="rgba(255,255,255,0.42)" font-size="11" font-family="${FONT_STACK}" text-rendering="optimizeLegibility">${xmlEscape(interp.surface)}</text>`
  );
  y += 16;
  parts.push(
    `<text x="${padX}" y="${y}" fill="rgba(255,255,255,0.42)" font-size="11" font-family="${FONT_STACK}" text-rendering="optimizeLegibility">${xmlEscape(interp.readability)}</text>`
  );
  y += 16;
  parts.push(
    `<text x="${padX}" y="${y}" fill="rgba(255,255,255,0.42)" font-size="11" font-family="${FONT_STACK}" text-rendering="optimizeLegibility">${xmlEscape(interp.mood)}</text>`
  );
  y += 16;
  for (const ty of interp.typography.slice(0, 2)) {
    const tl = wrapSvgPlainText(ty, 72);
    for (const piece of tl) {
      parts.push(
        `<text x="${padX}" y="${y}" fill="rgba(255,255,255,0.38)" font-size="11" font-family="${FONT_STACK}" text-rendering="optimizeLegibility">${xmlEscape(piece)}</text>`
      );
      y += 14;
    }
  }

  const H = y + 36;
  const out = [];
  out.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  out.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Identity kit banner" text-rendering="optimizeLegibility">`
  );
  out.push(`<title>${xmlEscape(k.kitLabel ? `Kit · ${k.kitLabel}` : 'Identity kit')}</title>`);
  out.push(`<rect width="${W}" height="${H}" fill="${BG}"/>`);
  out.push(`<rect x="0" y="0" width="4" height="${H}" fill="${accent}"/>`);
  out.push(...parts);
  out.push(`</svg>`);
  return out.join('\n');
}

/**
 * @param {object} p
 */
function buildVerticalSvg({ k, accent, surfaceLabel, display, subLine, interp }) {
  const W = 520;
  const padX = 44;
  const readabilityLabel =
    READABILITY_TIERS.find((x) => x.id === k.readabilityTier)?.label ?? 'Balanced read';
  const parts = [];
  let y = 48;

  parts.push(
    `<text x="${padX}" y="${y}" fill="rgba(255,255,255,0.35)" font-size="10" font-family="${FONT_STACK}" letter-spacing="0.28em">${xmlEscape(
      k.kitLabel ? `KIT · ${k.kitLabel.toUpperCase()}` : 'IDENTITY KIT'
    )}</text>`
  );
  y += 40;

  const dispLines = wrapSvgPlainText(display, 34);
  for (const dl of dispLines.slice(0, 5)) {
    parts.push(
      `<text x="${padX}" y="${y}" fill="rgba(255,255,255,0.95)" font-size="24" font-weight="600" font-family="${FONT_STACK}">${xmlEscape(dl)}</text>`
    );
    y += 32;
  }

  if (subLine) {
    parts.push(
      `<text x="${padX}" y="${y}" fill="rgba(255,255,255,0.45)" font-size="14" font-family="${FONT_STACK}">${xmlEscape(subLine)}</text>`
    );
    y += 26;
  }

  if (k.bioLine.trim()) {
    y += 12;
    parts.push(
      `<line x1="${padX}" y1="${y - 8}" x2="${W - 36}" y2="${y - 8}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`
    );
    const bioLines = wrapSvgPlainText(k.bioLine.trim(), 44).slice(0, 5);
    for (const bl of bioLines) {
      parts.push(
        `<text x="${padX}" y="${y}" fill="rgba(255,255,255,0.55)" font-size="14" font-family="${FONT_STACK}">${xmlEscape(bl)}</text>`
      );
      y += 22;
    }
  }

  y += 16;
  parts.push(
    `<text x="${padX}" y="${y}" fill="rgba(255,255,255,0.35)" font-size="10" font-weight="600" font-family="${FONT_STACK}" letter-spacing="0.18em">${xmlEscape(surfaceLabel.toUpperCase())}</text>`
  );
  parts.push(
    `<text x="${padX + 152}" y="${y}" fill="rgba(255,255,255,0.35)" font-size="10" font-weight="600" font-family="${FONT_STACK}" letter-spacing="0.12em">${xmlEscape(readabilityLabel.toUpperCase())}</text>`
  );
  y += 36;
  parts.push(
    `<line x1="${padX}" y1="${y - 16}" x2="${W - 36}" y2="${y - 16}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`
  );
  parts.push(
    `<text x="${padX}" y="${y}" fill="rgba(255,255,255,0.3)" font-size="9" font-family="${FONT_STACK}" letter-spacing="0.28em">READ CONTEXT</text>`
  );
  y += 22;
  parts.push(
    `<text x="${padX}" y="${y}" fill="rgba(255,255,255,0.42)" font-size="11" font-family="${FONT_STACK}">${xmlEscape(interp.surface)}</text>`
  );
  y += 18;
  parts.push(
    `<text x="${padX}" y="${y}" fill="rgba(255,255,255,0.42)" font-size="11" font-family="${FONT_STACK}">${xmlEscape(interp.readability)}</text>`
  );
  y += 18;
  parts.push(
    `<text x="${padX}" y="${y}" fill="rgba(255,255,255,0.42)" font-size="11" font-family="${FONT_STACK}">${xmlEscape(interp.mood)}</text>`
  );
  y += 18;
  for (const ty of interp.typography.slice(0, 2)) {
    const tl = wrapSvgPlainText(ty, 56);
    for (const piece of tl) {
      parts.push(
        `<text x="${padX}" y="${y}" fill="rgba(255,255,255,0.38)" font-size="11" font-family="${FONT_STACK}">${xmlEscape(piece)}</text>`
      );
      y += 16;
    }
  }

  const H = y + 48;
  const out = [];
  out.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  out.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Identity kit card" text-rendering="optimizeLegibility">`
  );
  out.push(`<title>${xmlEscape(k.kitLabel ? `Kit · ${k.kitLabel}` : 'Identity kit')}</title>`);
  out.push(`<rect width="${W}" height="${H}" fill="${BG}"/>`);
  out.push(`<rect x="0" y="0" width="4" height="${H}" fill="${accent}"/>`);
  out.push(...parts);
  out.push(`</svg>`);
  return out.join('\n');
}
