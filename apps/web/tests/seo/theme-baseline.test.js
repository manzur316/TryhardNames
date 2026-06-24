import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const indexCss = read('src/index.css');

describe('theme baseline', () => {
  it('uses a soft white light-mode token baseline', () => {
    assert.match(indexCss, /--background:\s*210 40% 98%;/);
    assert.match(indexCss, /--card:\s*0 0% 100%;/);
    assert.match(indexCss, /--popover:\s*0 0% 100%;/);
    assert.match(indexCss, /--muted:\s*210 40% 96%;/);
    assert.match(indexCss, /--muted-foreground:\s*215 16% 42%;/);
    assert.match(indexCss, /--border:\s*214 32% 91%;/);
    assert.match(indexCss, /--input:\s*214 32% 91%;/);
  });

  it('keeps light and dark body backgrounds explicitly separated', () => {
    assert.match(indexCss, /html:not\(\.dark\) body/);
    assert.match(indexCss, /linear-gradient\(165deg,\s*hsl\(210 40% 98%\)/);
    assert.doesNotMatch(indexCss, /hsl\(215 24% 91%\)/);
    assert.match(indexCss, /\.dark\s*{/);
    assert.match(indexCss, /html\.dark body/);
  });
});
