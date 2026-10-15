import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, parseFragment, serialize } from 'parse5';
import { getPrerenderPaths, prerenderDestination } from '../src/seo/prerender.js';
import { absoluteUrl } from '../src/seo/paths.js';

process.env.NODE_ENV = 'production';
// Rendering is offline and anonymous; provider APIs must never run at build time.
globalThis.fetch = () => { throw new Error('Network access is forbidden during prerender'); };
const { renderPage } = await import('../.prerender/entry-prerender.js');

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const template = await readFile(path.join(dist, 'index.html'), 'utf8');
await writeFile(path.join(dist, '_app.html'), template);
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
function find(node, predicate) {
  if (predicate(node)) return node;
  for (const child of node.childNodes || []) {
    const match = find(child, predicate);
    if (match) return match;
  }
}
function append(parent, nodes) {
  for (const node of nodes) { node.parentNode = parent; parent.childNodes.push(node); }
}

const paths = getPrerenderPaths();
for (const route of paths) {
  const rendered = await renderPage(route);
  const document = parse(template);
  const head = find(document, node => node.tagName === 'head');
  const root = find(document, node => attr(node, 'id') === 'root');
  head.childNodes = head.childNodes.filter(node => node.tagName !== 'title' && attr(node, 'data-react-helmet') === undefined);
  append(head, parseFragment(rendered.head).childNodes);
  root.childNodes = [];
  append(root, parseFragment(rendered.body).childNodes);
  root.attrs.push({name:'data-prerendered', value:'true'});
  const canonical = find(head, node => attr(node, 'rel') === 'canonical');
  const robots = find(head, node => attr(node, 'name') === 'robots');
  if (attr(canonical, 'href') !== absoluteUrl(route) || attr(robots, 'content') !== 'index, follow'
    || !find(root, node => node.tagName === 'h1')) throw new Error('Invalid prerender output: ' + route);
  // Initial entrance animations must not hide static content when JS is disabled.
  append(head, parseFragment('<style id="prerender-visibility">#root[data-prerendered] [style*="opacity:0"]{opacity:1!important}</style>').childNodes);
  const destination = path.join(dist, prerenderDestination(route).slice(1));
  await mkdir(path.dirname(destination), {recursive:true});
  await writeFile(destination, serialize(document));
}
console.log('Prerendered ' + paths.length + ' public pages. Private routes use _app.html.');
