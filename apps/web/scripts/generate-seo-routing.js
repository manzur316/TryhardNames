import { readFile, writeFile } from 'node:fs/promises';
import { getSeoRouting } from '../src/seo/routing.js';

const target = new URL('../../../vercel.json', import.meta.url);
const current = JSON.parse(await readFile(target, 'utf8'));
const expected = { ...current, ...getSeoRouting() };
const output = JSON.stringify(expected, null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (JSON.stringify(current) !== JSON.stringify(expected)) {
    console.error('SEO routes are stale. Run node apps/web/scripts/generate-seo-routing.js before deploying.');
    process.exitCode = 1;
  }
} else {
  await writeFile(target, output);
  console.log('Updated Vercel SEO redirects, noindex headers and registered route rewrites.');
}
