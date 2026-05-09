/**
 * Offline smoke checks for SVG artifacts (Unicode + banner sequencing).
 * Run: node scripts/identity-artifact-smoke.mjs
 */

import { buildIdentityKitSvgString } from '../src/utils/identityKitSvgExport.js';

const baseKit = {
  kitLabel: 'QA',
  moodId: 'calm',
  readabilityTier: 'B',
  surfaceId: 'riot',
};

const denseUnicode = {
  ...baseKit,
  styledAlias: '❃❃ 𝓣𝓮𝓼𝓽 中文 태그 ❃❃',
  bioLine: 'Line one for wrap stress. Line two.',
  artifactLayout: 'banner',
};

const longAscii = {
  ...baseKit,
  primaryAlias: 'VERYLONGALIAS_WITHOUT_SPACES_' + 'x'.repeat(80),
  artifactLayout: 'banner',
};

const svgBanner = buildIdentityKitSvgString(denseUnicode);
const svgVertical = buildIdentityKitSvgString({ ...denseUnicode, artifactLayout: 'vertical' });
const svgLong = buildIdentityKitSvgString(longAscii);

const checks = [
  ['banner has sequential READ CONTEXT after body', svgBanner.indexOf('READ CONTEXT') > svgBanner.indexOf('KIT')],
  ['banner includes riot surface in chip line', /RIOT.*READ B/i.test(svgBanner)],
  ['vertical completes', svgVertical.includes('</svg>')],
  ['long word wraps without empty svg', svgLong.length > 500 && !svgLong.includes('undefined')],
];

let failed = false;
for (const [label, ok] of checks) {
  if (!ok) {
    console.error('FAIL:', label);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('identity-artifact-smoke: OK');
