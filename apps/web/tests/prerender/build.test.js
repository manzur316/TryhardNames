import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { parse } from 'parse5';
import { getPrerenderPaths, prerenderDestination } from '../../src/seo/prerender.js';
import { absoluteUrl } from '../../src/seo/paths.js';
import { getSeoRouting } from '../../src/seo/routing.js';

const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
function nodes(node) { return [node, ...(node.childNodes || []).flatMap(nodes)]; }
const read = file => readFileSync(new URL('../../dist/' + file, import.meta.url), 'utf8');

test('every public snapshot has content and unique metadata in the initial HTML', () => {
  for (const route of getPrerenderPaths()) {
    const html = read(prerenderDestination(route).slice(1));
    const all = nodes(parse(html));
    const matching = (name, value) => all.filter(node => attr(node, name) === value);
    assert.equal(all.filter(node => node.tagName === 'h1').length, 1, route);
    assert.equal(all.filter(node => node.tagName === 'title').length, 1, route);
    assert.equal(matching('name', 'description').length, 1, route);
    assert.equal(matching('name', 'robots').length, 1, route);
    assert.equal(attr(matching('name', 'robots')[0], 'content'), 'index, follow', route);
    assert.equal(matching('rel', 'canonical').length, 1, route);
    assert.equal(attr(matching('rel', 'canonical')[0], 'href'), absoluteUrl(route), route);
    assert.equal(matching('id', 'root').length, 1, route);
    assert.equal(attr(matching('id', 'root')[0], 'data-prerendered'), 'true', route);
    assert.ok(nodes(matching('id', 'root')[0]).filter(node => node.nodeName === '#text').map(node => node.value).join('').length > 500, route);
    for (const script of matching('type', 'application/ld+json')) {
      assert.doesNotThrow(() => JSON.parse(script.childNodes.map(node => node.value).join('')), route);
    }
    assert.doesNotMatch(html, /steam_passport_writer|postgres(?:ql)?:\/\/|sb_secret_|RGAPI-/i, route);
  }
});

test('private and live profile routes never receive a public content snapshot', () => {
  const all = nodes(parse(read('_app.html')));
  const root = all.find(node => attr(node, 'id') === 'root');
  assert.equal(root.childNodes.length, 0);
  assert.equal(all.filter(node => attr(node, 'rel') === 'canonical').length, 0);
  assert.equal(all.filter(node => attr(node, 'data-prerendered') !== undefined).length, 0);
  const routing = getSeoRouting();
  for (const source of ['/gaming-passport', '/account', '/sign-in', '/sign-up', '/auth/callback', '/favorites']) {
    assert.equal(routing.rewrites.find(rule => rule.source === source)?.destination, '/_app.html');
    assert.ok(!existsSync(new URL('../../dist' + source + '.html', import.meta.url)), source);
  }
  assert.equal(routing.rewrites.find(rule => rule.source.startsWith('/id/:slug')).destination, '/_app.html');
});

test('HTML aliases permanently redirect to their clean canonical URL', () => {
  const routing = getSeoRouting();
  for (const route of getPrerenderPaths()) {
    const destination = prerenderDestination(route);
    assert.deepEqual(routing.redirects.find(rule => rule.source === destination),
      { source: destination, destination: route, permanent: true });
    if (route !== '/') assert.equal(routing.rewrites.find(rule => rule.source === route)?.destination, destination);
  }
});
