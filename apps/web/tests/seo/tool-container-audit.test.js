import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');

const auditScript = readRepo('scripts/audit-tool-containers.mjs');
const auditDoc = readRepo('docs/product/TOOL_CONTAINER_VISUAL_AUDIT.md');
const packageJson = JSON.parse(readWeb('package.json'));

describe('tool container visual audit tooling', () => {
  it('registers the source files and npm entrypoint', () => {
    assert.match(auditScript, /Tool Container Visual Audit|audit-tool-containers|ROUTES|VIEWPORTS/);
    assert.match(auditDoc, /# Tool Container Visual Audit/);
    assert.equal(packageJson.scripts['audit:tool-containers'], 'node ../../scripts/audit-tool-containers.mjs');
  });

  it('covers representative dynamic and feature generator routes', () => {
    [
      '/valorant/sweaty',
      '/general/best',
      '/fortnite/tryhard',
      '/cod/sweaty',
      '/roblox-names/cool',
      '/gamer-names/cool',
    ].forEach((route) => {
      assert.match(auditScript, new RegExp(route.replaceAll('/', '\\/')));
    });
  });

  it('measures required visual audit metrics', () => {
    [
      'firstCopyNameY',
      'cardsWithAwkwardWrap',
      'cardsWithButtonOverlap',
      'floatingShelfCoversViewportPercent',
      'lineupDrawerHeight',
    ].forEach((metric) => {
      assert.match(auditScript, new RegExp(metric));
    });
  });

  it('generates JSON, Markdown, and screenshot artifacts', () => {
    assert.match(auditScript, /audit\.json/);
    assert.match(auditScript, /audit\.md/);
    assert.match(auditScript, /screenshots/);
  });

  it('documents status vocabulary and component-level findings', () => {
    assert.match(auditDoc, /PASS\/WARN\/FAIL/);
    ['NameCard', 'CopyButton', 'Similar Reads', 'Lineup shelf', 'Lineup drawer'].forEach((term) => {
      assert.match(auditDoc, new RegExp(term));
    });
  });
});
