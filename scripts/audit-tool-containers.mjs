import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..');
const BASE_URL = (process.env.AUDIT_BASE_URL || 'http://127.0.0.1:3002').replace(/\/$/, '');
const AUDIT_ROOT = path.join(repoRoot, 'artifacts', 'tool-container-audit', 'latest');
const SCREENSHOT_DIR = path.join(AUDIT_ROOT, 'screenshots');

const ROUTES = [
  { path: '/valorant/sweaty', group: 'dynamic', expectsTool: true },
  { path: '/valorant/aesthetic', group: 'dynamic', expectsTool: true },
  { path: '/general/best', group: 'dynamic', expectsTool: true },
  { path: '/general/cool', group: 'dynamic', expectsTool: true },
  { path: '/fortnite/tryhard', group: 'dynamic', expectsTool: true },
  { path: '/fortnite/og', group: 'dynamic', expectsTool: true },
  { path: '/cod/sweaty', group: 'dynamic', expectsTool: true },
  { path: '/cod/funny', group: 'dynamic', expectsTool: true },
  { path: '/minecraft/pvp', group: 'dynamic', expectsTool: true },
  { path: '/league-of-legends/korean', group: 'dynamic', expectsTool: true },
  { path: '/roblox-names/cool', group: 'feature-generator', expectsTool: true },
  { path: '/roblox-names/tryhard', group: 'feature-generator', expectsTool: true },
  { path: '/gamer-names/cool', group: 'feature-generator', expectsTool: true },
  { path: '/gamer-names/pro', group: 'feature-generator', expectsTool: true },
  { path: '/', group: 'no-regression', expectsTool: false },
  { path: '/identity-kit', group: 'no-regression', expectsTool: false },
  { path: '/gaming-passport', group: 'no-regression', expectsTool: false },
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

const THEMES = ['light', 'dark'];

function safeRouteName(routePath) {
  if (routePath === '/') return 'home';
  return routePath.replace(/^\//, '').replace(/[^a-z0-9._-]+/gi, '_');
}

function relativeArtifact(filePath) {
  return path.relative(AUDIT_ROOT, filePath).replaceAll(path.sep, '/');
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function assertServer() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(BASE_URL, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    console.error(`Start local server first. Tried ${BASE_URL}.`);
    console.error('Example: npm run dev -- --host 127.0.0.1 --port 3002');
    if (process.env.DEBUG_AUDIT) console.error(error);
    process.exit(1);
  } finally {
    clearTimeout(timeout);
  }
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function firstExisting(paths) {
  for (const candidate of paths.filter(Boolean)) {
    if (await pathExists(candidate)) return candidate;
  }
  return null;
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : null;
      server.close(() => {
        if (port) resolve(port);
        else reject(new Error('Could not reserve a Chrome debugging port.'));
      });
    });
  });
}

async function createBrowserDriver() {
  try {
    const { chromium } = await import('playwright');
    const browser = await chromium.launch({ headless: true });
    return new PlaywrightDriver(browser, 'playwright');
  } catch (playwrightError) {
    try {
      const puppeteer = await import('puppeteer');
      const browser = await puppeteer.launch({ headless: 'new' });
      return new PuppeteerDriver(browser, 'puppeteer');
    } catch {
      const chromePath = await findChromeExecutable();
      if (!chromePath) {
        console.error('Chrome automation unavailable. Install Playwright/Puppeteer or set CHROME_PATH to Chrome/Edge.');
        if (process.env.DEBUG_AUDIT) console.error(playwrightError);
        process.exit(1);
      }
      return CdpDriver.launch(chromePath);
    }
  }
}

async function findChromeExecutable() {
  return firstExisting([
    process.env.CHROME_PATH,
    process.platform === 'win32' && path.join(process.env.PROGRAMFILES || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    process.platform === 'win32' && path.join(process.env['PROGRAMFILES(X86)'] || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    process.platform === 'win32' && path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    process.platform === 'win32' && path.join(process.env.PROGRAMFILES || '', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    process.platform === 'win32' && path.join(process.env['PROGRAMFILES(X86)'] || '', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    process.platform === 'darwin' && '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    process.platform === 'darwin' && '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    process.platform === 'linux' && '/usr/bin/google-chrome',
    process.platform === 'linux' && '/usr/bin/google-chrome-stable',
    process.platform === 'linux' && '/usr/bin/chromium',
    process.platform === 'linux' && '/usr/bin/chromium-browser',
  ]);
}

class PlaywrightDriver {
  constructor(browser, engine) {
    this.browser = browser;
    this.engine = engine;
  }

  async newPage() {
    const page = await this.browser.newPage();
    return {
      setViewport: (viewport) => page.setViewportSize({ width: viewport.width, height: viewport.height }),
      goto: (url) => page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }),
      reload: () => page.reload({ waitUntil: 'networkidle', timeout: 30000 }),
      evaluate: (fn, ...args) => page.evaluate(fn, ...args),
      wait: (ms) => page.waitForTimeout(ms),
      screenshot: (filePath, options = {}) => page.screenshot({ path: filePath, fullPage: true, ...options }),
      screenshotClip: (filePath, clip) => page.screenshot({ path: filePath, clip }),
      close: () => page.close(),
    };
  }

  async close() {
    await this.browser.close();
  }
}

class PuppeteerDriver {
  constructor(browser, engine) {
    this.browser = browser;
    this.engine = engine;
  }

  async newPage() {
    const page = await this.browser.newPage();
    return {
      setViewport: (viewport) => page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1 }),
      goto: (url) => page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 }),
      reload: () => page.reload({ waitUntil: 'networkidle0', timeout: 30000 }),
      evaluate: (fn, ...args) => page.evaluate(fn, ...args),
      wait,
      screenshot: (filePath, options = {}) => page.screenshot({ path: filePath, fullPage: true, ...options }),
      screenshotClip: (filePath, clip) => page.screenshot({ path: filePath, clip }),
      close: () => page.close(),
    };
  }

  async close() {
    await this.browser.close();
  }
}

class CdpDriver {
  static async launch(chromePath) {
    const port = await getFreePort();
    const userDataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tool-container-audit-chrome-'));
    const child = spawn(chromePath, [
      '--headless=new',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userDataDir}`,
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--no-default-browser-check',
      '--hide-scrollbars',
      'about:blank',
    ], { stdio: ['ignore', 'ignore', 'pipe'] });

    child.stderr.on('data', (chunk) => {
      if (process.env.DEBUG_AUDIT) process.stderr.write(chunk);
    });

    for (let i = 0; i < 80; i += 1) {
      try {
        const response = await fetch(`http://127.0.0.1:${port}/json/version`);
        if (response.ok) return new CdpDriver(child, port, userDataDir);
      } catch {
        await wait(125);
      }
    }

    child.kill();
    throw new Error('Chrome DevTools endpoint did not become available.');
  }

  constructor(child, port, userDataDir) {
    this.child = child;
    this.port = port;
    this.userDataDir = userDataDir;
    this.engine = 'chrome-cdp';
  }

  async newPage() {
    const response = await fetch(`http://127.0.0.1:${this.port}/json/new?about:blank`, { method: 'PUT' });
    if (!response.ok) throw new Error(`Could not create Chrome target: HTTP ${response.status}`);
    const target = await response.json();
    const session = await CdpSession.connect(target.webSocketDebuggerUrl);
    await session.send('Page.enable');
    await session.send('Runtime.enable');
    return new CdpPage(session, target.id, this.port);
  }

  async close() {
    try {
      this.child.kill();
      await Promise.race([
        new Promise((resolve) => this.child.once('exit', resolve)),
        wait(1200),
      ]);
    } catch {
      // Chrome cleanup is best effort; do not mask audit results.
    }
    for (let attempt = 0; attempt < 4; attempt += 1) {
      try {
        await fs.rm(this.userDataDir, { recursive: true, force: true });
        return;
      } catch (error) {
        if (!['EBUSY', 'EPERM', 'ENOTEMPTY'].includes(error?.code) || attempt === 3) {
          console.warn(`Warning: could not remove Chrome temp profile ${this.userDataDir}: ${error.message}`);
          return;
        }
        await wait(250 * (attempt + 1));
      }
    }
  }
}

class CdpSession {
  static connect(url) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      const session = new CdpSession(ws);
      ws.addEventListener('open', () => resolve(session), { once: true });
      ws.addEventListener('error', reject, { once: true });
      ws.addEventListener('message', (event) => session.handleMessage(event));
    });
  }

  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
  }

  handleMessage(event) {
    const payload = JSON.parse(event.data);
    if (payload.id && this.pending.has(payload.id)) {
      const { resolve, reject } = this.pending.get(payload.id);
      this.pending.delete(payload.id);
      if (payload.error) reject(new Error(payload.error.message || 'CDP command failed'));
      else resolve(payload.result || {});
      return;
    }
    if (payload.method && this.listeners.has(payload.method)) {
      for (const listener of this.listeners.get(payload.method)) listener(payload.params || {});
    }
  }

  send(method, params = {}, timeoutMs = 30000) {
    const id = this.nextId;
    this.nextId += 1;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (!this.pending.has(id)) return;
        this.pending.delete(id);
        reject(new Error(`CDP timeout for ${method}`));
      }, timeoutMs);
    });
  }

  once(method) {
    return new Promise((resolve) => {
      const listener = (params) => {
        this.off(method, listener);
        resolve(params);
      };
      this.on(method, listener);
    });
  }

  on(method, listener) {
    if (!this.listeners.has(method)) this.listeners.set(method, new Set());
    this.listeners.get(method).add(listener);
  }

  off(method, listener) {
    this.listeners.get(method)?.delete(listener);
  }

  close() {
    this.ws.close();
  }
}

class CdpPage {
  constructor(session, targetId, port) {
    this.session = session;
    this.targetId = targetId;
    this.port = port;
    this.viewport = { width: 1280, height: 720 };
  }

  async setViewport(viewport) {
    this.viewport = viewport;
    await this.setDeviceMetrics(viewport.width, viewport.height);
    await this.session.send('Emulation.setTouchEmulationEnabled', { enabled: viewport.width <= 480 });
  }

  async setDeviceMetrics(width, height) {
    await this.session.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: this.viewport.width <= 480,
    });
  }

  async goto(url) {
    const load = this.session.once('Page.loadEventFired');
    await this.session.send('Page.navigate', { url });
    await Promise.race([load, wait(12000)]);
    await wait(500);
  }

  async reload() {
    const load = this.session.once('Page.loadEventFired');
    await this.session.send('Page.reload', { ignoreCache: true });
    await Promise.race([load, wait(12000)]);
    await wait(500);
  }

  async evaluate(fn, ...args) {
    const expression = `(${fn.toString()})(...${JSON.stringify(args)})`;
    const result = await this.session.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Runtime.evaluate failed');
    return result.result?.value;
  }

  async wait(ms) {
    await wait(ms);
  }

  async screenshot(filePath) {
    const metrics = await this.session.send('Page.getLayoutMetrics');
    const contentSize = metrics.cssContentSize || metrics.contentSize || {};
    const documentHeight = Math.max(this.viewport.height, Math.ceil(contentSize.height || this.viewport.height));
    const captureHeight = Math.min(documentHeight, 24000);
    try {
      await this.setDeviceMetrics(this.viewport.width, captureHeight);
      await wait(100);
      const screenshot = await this.session.send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        captureBeyondViewport: false,
      }, 60000);
      await fs.writeFile(filePath, Buffer.from(screenshot.data, 'base64'));
      if (documentHeight > captureHeight) {
        console.warn(`Warning: full-page screenshot capped at ${captureHeight}px for ${filePath}.`);
      }
    } catch (error) {
      console.warn(`Warning: full-page CDP screenshot failed, using viewport capture for ${filePath}: ${error.message}`);
      await this.setDeviceMetrics(this.viewport.width, this.viewport.height);
      await wait(100);
      const screenshot = await this.session.send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        captureBeyondViewport: false,
      }, 30000);
      await fs.writeFile(filePath, Buffer.from(screenshot.data, 'base64'));
    } finally {
      await this.setDeviceMetrics(this.viewport.width, this.viewport.height);
    }
  }

  async screenshotClip(filePath, clip) {
    const screenshot = await this.session.send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      captureBeyondViewport: true,
      clip: {
        x: Math.max(0, Math.floor(clip.x)),
        y: Math.max(0, Math.floor(clip.y)),
        width: Math.max(1, Math.ceil(clip.width)),
        height: Math.max(1, Math.ceil(clip.height)),
        scale: 1,
      },
    }, 30000);
    await fs.writeFile(filePath, Buffer.from(screenshot.data, 'base64'));
  }

  async close() {
    try {
      await fetch(`http://127.0.0.1:${this.port}/json/close/${this.targetId}`);
    } catch {
      // best effort cleanup
    }
    this.session.close();
  }
}

function measureToolContainers(routeConfig, viewport, theme, state) {
  const rectOf = (el) => {
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      x: Math.round(rect.x),
      y: Math.round(rect.y + window.scrollY),
      viewportY: Math.round(rect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      right: Math.round(rect.right),
      bottom: Math.round(rect.bottom),
    };
  };

  const isVisible = (el) => {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && Number(style.opacity || 1) > 0.01;
  };

  const labelFor = (el) => (el?.innerText || el?.getAttribute('aria-label') || el?.getAttribute('title') || '').replace(/\s+/g, ' ').trim();
  const norm = (text) => String(text || '').replace(/\s+/g, ' ').trim();
  const buttonLike = [...document.querySelectorAll('button, a, input, select, textarea, [role="button"]')].filter(isVisible);
  const viewportArea = Math.max(1, window.innerWidth * window.innerHeight);

  const overlaps = (a, b) => {
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    const x = Math.max(0, Math.min(ar.right, br.right) - Math.max(ar.left, br.left));
    const y = Math.max(0, Math.min(ar.bottom, br.bottom) - Math.max(ar.top, br.top));
    return x * y > 4;
  };

  const interactiveOverlapIds = new Set();
  for (let i = 0; i < buttonLike.length; i += 1) {
    for (let j = i + 1; j < buttonLike.length; j += 1) {
      if (overlaps(buttonLike[i], buttonLike[j])) {
        interactiveOverlapIds.add(i);
        interactiveOverlapIds.add(j);
      }
    }
  }

  const findCard = (el) => {
    let node = el?.parentElement;
    let best = null;
    let depth = 0;
    while (node && depth < 8) {
      const rect = node.getBoundingClientRect();
      const cls = node.getAttribute('class') || '';
      if (/rounded|border|shadow|group|bg-|grid|p-/.test(cls) && rect.width >= el.getBoundingClientRect().width && rect.height >= el.getBoundingClientRect().height) {
        best = node;
      }
      node = node.parentElement;
      depth += 1;
    }
    return best || el.parentElement;
  };

  const copyButtons = buttonLike.filter((el) => /\bCopy Name\b/i.test(labelFor(el)) || /^Copy to clipboard$/i.test(labelFor(el)) || /\bCopy\b/i.test(labelFor(el)));
  const copyNameButtons = buttonLike.filter((el) => /\bCopy Name\b/i.test(labelFor(el)) || /^Copy to clipboard$/i.test(labelFor(el)));
  const saveButtons = buttonLike.filter((el) => /^(Save|Saved|Unsave)$/i.test(labelFor(el)));
  const similarReadsButtons = buttonLike.filter((el) => /Similar reads/i.test(labelFor(el)));
  const copyPackButtons = buttonLike.filter((el) => /Copy pack/i.test(labelFor(el)));
  const exportPackButtons = buttonLike.filter((el) => /Export Discord Pack/i.test(labelFor(el)));
  const shareButtons = buttonLike.filter((el) => /Share page/i.test(labelFor(el)));
  const disabledPackButtons = [...copyPackButtons, ...exportPackButtons].filter((el) => el.disabled || el.getAttribute('aria-disabled') === 'true');
  const activePackButtons = [...copyPackButtons, ...exportPackButtons].filter((el) => !el.disabled && el.getAttribute('aria-disabled') !== 'true');

  const nameGrid = document.querySelector('#names') || document.querySelector('#generator-section .grid') || document.querySelector('#generator-section');
  const editorialCandidates = [...document.querySelectorAll('article h2, main h2, main section, [aria-label]')].filter((el) => {
    const text = norm(el.textContent);
    if (!text) return false;
    if (/Lineup|Trending here|Similar reads|Saved|Recent picks|Copy Name|Copy pack|Export Discord/i.test(text)) return false;
    return el.getBoundingClientRect().top + window.scrollY > ((nameGrid?.getBoundingClientRect().top || 0) + window.scrollY + 120);
  });
  const firstEditorialY = editorialCandidates.length ? Math.round(Math.min(...editorialCandidates.map((el) => el.getBoundingClientRect().top + window.scrollY))) : null;

  const fixedLineupCandidates = [...document.querySelectorAll('div, section, aside, button')].filter((el) => {
    if (!isVisible(el) || !/Lineup/i.test(norm(el.textContent))) return false;
    let node = el;
    while (node && node !== document.body) {
      if (getComputedStyle(node).position === 'fixed') return true;
      node = node.parentElement;
    }
    return false;
  });
  const fixedShelf = fixedLineupCandidates.sort((a, b) => b.getBoundingClientRect().width * b.getBoundingClientRect().height - a.getBoundingClientRect().width * a.getBoundingClientRect().height)[0] || null;
  const fixedShelfRect = fixedShelf ? fixedShelf.getBoundingClientRect() : null;
  const floatingShelfCoversViewportPercent = fixedShelfRect ? Math.round((fixedShelfRect.width * fixedShelfRect.height / viewportArea) * 1000) / 10 : 0;

  const drawerCandidates = [...document.querySelectorAll('section, div')].filter((el) => {
    if (!isVisible(el)) return false;
    const text = norm(el.textContent);
    return /Saved/i.test(text) && /Recent picks/i.test(text) && el.getBoundingClientRect().height > 40;
  });
  const drawer = drawerCandidates.sort((a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0] || null;
  const lineupDrawerHeight = drawer ? Math.round(drawer.getBoundingClientRect().height) : 0;

  const cardSet = new Set();
  for (const button of [...copyNameButtons, ...saveButtons, ...similarReadsButtons]) {
    const card = findCard(button);
    if (card && isVisible(card)) cardSet.add(card);
  }
  if (nameGrid) {
    for (const card of [...nameGrid.querySelectorAll(':scope > *, .group, [class*="rounded"]')]) {
      const rect = card.getBoundingClientRect();
      if (isVisible(card) && rect.width > 80 && rect.height > 40) cardSet.add(card);
    }
  }
  const nameCards = [...cardSet].filter((card) => {
    const text = norm(card.textContent);
    return text.length > 1 && !/Frequently Asked Questions/i.test(text);
  });

  const rangeRectsForText = (textNode) => {
    const range = document.createRange();
    range.selectNodeContents(textNode);
    const rects = [...range.getClientRects()].filter((rect) => rect.width > 1 && rect.height > 1);
    range.detach();
    return rects;
  };

  const textNodes = (root) => {
    const nodes = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const text = norm(node.nodeValue);
        if (text.length < 2 || text.length > 80) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent || parent.closest('button, a, svg')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let node = walker.nextNode();
    while (node) {
      nodes.push(node);
      node = walker.nextNode();
    }
    return nodes;
  };

  const cardReports = nameCards.map((card) => {
    const candidates = textNodes(card).map((node) => {
      const parent = node.parentElement;
      const style = getComputedStyle(parent);
      const rects = rangeRectsForText(node);
      const fontSize = parseFloat(style.fontSize || '0') || 0;
      return { node, text: norm(node.nodeValue), fontSize, lineRects: rects, score: fontSize * 10 + Math.min(30, norm(node.nodeValue).length) };
    }).sort((a, b) => b.score - a.score);
    const name = candidates[0] || null;
    const lineCount = name ? Math.max(1, name.lineRects.length) : 0;
    const smallSegment = Boolean(name && lineCount > 1 && name.lineRects.some((rect) => rect.width <= Math.max(18, name.fontSize * 3.2)));
    const actions = [...card.querySelectorAll('button, a, [role="button"]')].filter(isVisible);
    const dominantActions = actions.filter((el) => el.getBoundingClientRect().height >= 38 || /Copy Name|Save|Saved|Similar reads/i.test(labelFor(el)));
    return {
      text: name?.text || norm(card.textContent).slice(0, 80),
      boundingBox: rectOf(card),
      nameLines: lineCount,
      awkwardWrap: lineCount > 3 || smallSegment,
      smallSegment,
      actionCount: actions.length,
      dominantActionCount: dominantActions.length,
      tooManyActions: dominantActions.length > 3,
      buttonOverlap: actions.some((a, index) => actions.some((b, otherIndex) => index !== otherIndex && overlaps(a, b))),
    };
  });

  const elements = [
    ...copyNameButtons.map((el) => ({ kind: 'CopyButton', el })),
    ...saveButtons.map((el) => ({ kind: 'Save button', el })),
    ...similarReadsButtons.map((el) => ({ kind: 'Similar Reads', el })),
    ...copyPackButtons.map((el) => ({ kind: 'Copy Pack', el })),
    ...exportPackButtons.map((el) => ({ kind: 'Export Discord Pack', el })),
    ...shareButtons.map((el) => ({ kind: 'Share', el })),
  ].map(({ kind, el }) => {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const parentCard = findCard(el);
    const overlapX = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
    const overlapY = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
    return {
      kind,
      text: labelFor(el),
      role: el.getAttribute('role') || '',
      tag: el.tagName.toLowerCase(),
      boundingBox: rectOf(el),
      visible: isVisible(el),
      backgroundColor: style.backgroundColor,
      color: style.color,
      fontSize: style.fontSize,
      zIndex: style.zIndex,
      parentCardBoundingBox: rectOf(parentCard),
      viewportOverlap: Math.round((overlapX * overlapY / Math.max(1, rect.width * rect.height)) * 1000) / 1000,
      aboveFold: rect.top < window.innerHeight,
      disabled: Boolean(el.disabled),
      ariaDisabled: el.getAttribute('aria-disabled') === 'true',
      overlapsAnotherInteractive: interactiveOverlapIds.has(buttonLike.indexOf(el)),
    };
  });

  const rgb = (value) => {
    const match = String(value || '').match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    return match ? match.slice(1, 4).map(Number) : null;
  };
  const luminance = (value) => {
    const parts = rgb(value);
    return parts ? Math.round((0.2126 * parts[0]) + (0.7152 * parts[1]) + (0.0722 * parts[2])) : null;
  };
  const backgroundSamples = [
    getComputedStyle(document.documentElement).backgroundColor,
    getComputedStyle(document.body).backgroundColor,
    ...[...document.querySelectorAll('main, body > div, #root > div')].slice(0, 4).map((el) => getComputedStyle(el).backgroundColor),
  ];
  const solidBackground = backgroundSamples.find((value) => value && !/rgba\(0,\s*0,\s*0,\s*0\)|transparent/i.test(value));
  const shellLuminance = luminance(solidBackground);
  const firstCardY = nameCards[0]?.getBoundingClientRect().top;
  const fixedShelfOverlapsCards = Boolean(fixedShelf && nameCards.some((card) => overlaps(fixedShelf, card)));

  const metrics = {
    firstCopyNameY: copyNameButtons.length ? Math.round(Math.min(...copyNameButtons.map((el) => el.getBoundingClientRect().top + window.scrollY))) : null,
    firstNameGridY: nameGrid ? Math.round(nameGrid.getBoundingClientRect().top + window.scrollY) : (firstCardY ? Math.round(firstCardY + window.scrollY) : null),
    namesGridY: nameGrid ? Math.round(nameGrid.getBoundingClientRect().top + window.scrollY) : null,
    firstEditorialY,
    lineupShelfY: fixedShelfRect ? Math.round(fixedShelfRect.top + window.scrollY) : null,
    lineupDrawerHeight,
    copyButtonsCount: copyNameButtons.length,
    saveButtonsCount: saveButtons.length,
    similarReadsButtonsCount: similarReadsButtons.length,
    disabledPackButtonsCount: disabledPackButtons.length,
    activePackButtonsCount: activePackButtons.length,
    nameCardsCount: nameCards.length,
    maxNameLines: cardReports.length ? Math.max(...cardReports.map((card) => card.nameLines || 0)) : 0,
    cardsWithAwkwardWrap: cardReports.filter((card) => card.awkwardWrap).length,
    cardsWithButtonOverlap: cardReports.filter((card) => card.buttonOverlap).length,
    cardsWithTooManyActions: cardReports.filter((card) => card.tooManyActions).length,
    cardsBelowFoldBeforeFirstTool: cardReports.filter((card) => {
      const y = card.boundingBox?.viewportY ?? 0;
      const pageY = card.boundingBox?.y ?? 0;
      return y > window.innerHeight && (firstEditorialY == null || pageY < firstEditorialY);
    }).length,
    floatingShelfCoversViewportPercent,
    mobileSmallButtonsCount: window.innerWidth <= 480 ? buttonLike.filter((el) => /Copy Name|Copy to clipboard|Save|Saved|Similar reads|Copy pack|Export Discord Pack|Share page/i.test(labelFor(el)) && el.getBoundingClientRect().height < 40).length : 0,
    floatingShelfOverlapsNameCards: fixedShelfOverlapsCards,
    emptyLineupCopyPackActive: /Save a name to build a pack/i.test(document.body.innerText) && activePackButtons.some((el) => /Copy pack/i.test(labelFor(el))),
    lightModeDarkShell: theme === 'light' && shellLuminance != null && shellLuminance < 80,
    darkModeLightShell: theme === 'dark' && shellLuminance != null && shellLuminance > 210,
    htmlDarkClass: document.documentElement.classList.contains('dark'),
    bodyBackground: solidBackground || null,
    shellLuminance,
    trendingCardsCount: [...document.querySelectorAll('section, div')].filter((el) => /Trending here|Trending .* Names/i.test(norm(el.textContent)) && isVisible(el)).length,
    internalLinksCount: [...document.querySelectorAll('a[href]')].filter((el) => {
      const href = el.getAttribute('href') || '';
      return /^\/[a-z0-9-]+\/[a-z0-9-]+/.test(href) || /Explore More|Topic hub/i.test(norm(el.closest('section, div')?.textContent));
    }).length,
    allCopyControlsCount: copyButtons.length,
  };

  return {
    route: routeConfig.path,
    group: routeConfig.group,
    viewport,
    theme,
    state,
    url: location.href,
    pageTitle: document.title,
    scrollHeight: document.documentElement.scrollHeight,
    viewportSize: { width: window.innerWidth, height: window.innerHeight },
    themeClassMatches: theme === 'dark' ? metrics.htmlDarkClass : !metrics.htmlDarkClass,
    metrics,
    elements,
    cards: cardReports,
  };
}

function openToolState() {
  const norm = (text) => String(text || '').replace(/\s+/g, ' ').trim();
  const isVisible = (el) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
  };
  const buttons = [...document.querySelectorAll('button, [role="button"]')].filter(isVisible);
  const clicked = { save: false, drawer: false, similarReads: false };
  const saveButton = buttons.find((button) => /^Save$/i.test(norm(button.innerText || button.getAttribute('aria-label'))));
  if (saveButton) {
    saveButton.click();
    clicked.save = true;
  }
  const similarButton = buttons.find((button) => /Similar reads/i.test(norm(button.innerText || button.getAttribute('aria-label'))));
  if (similarButton) {
    similarButton.click();
    clicked.similarReads = true;
  }
  const lineupButton = buttons.find((button) => {
    if (!/Lineup/i.test(norm(button.innerText || button.getAttribute('aria-label')))) return false;
    let node = button;
    while (node && node !== document.body) {
      if (getComputedStyle(node).position === 'fixed') return true;
      node = node.parentElement;
    }
    return false;
  });
  if (lineupButton) {
    lineupButton.click();
    clicked.drawer = true;
  }
  return clicked;
}

function clipFor(selector) {
  const el = document.querySelector(selector);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return null;
  return {
    x: Math.max(0, rect.x + window.scrollX),
    y: Math.max(0, rect.y + window.scrollY),
    width: Math.min(rect.width, window.innerWidth),
    height: Math.min(rect.height, window.innerHeight * 1.5),
  };
}

function detectIssues(record, routeConfig) {
  const { metrics } = record;
  const issues = [];
  const isMobile = record.viewport.width <= 480;
  const copyThreshold = isMobile ? 1800 : 1600;
  if (routeConfig.expectsTool && metrics.copyButtonsCount === 0) issues.push({ severity: 'WARN', code: 'NO_COPY_BUTTONS', message: 'No Copy Name or copy-to-clipboard buttons were detected.' });
  if (metrics.firstCopyNameY != null && metrics.firstCopyNameY > copyThreshold) issues.push({ severity: 'FAIL', code: 'COPY_NAME_TOO_LOW', message: `First copy control appears at y=${metrics.firstCopyNameY}, threshold=${copyThreshold}.` });
  if (metrics.maxNameLines > 3) issues.push({ severity: 'FAIL', code: 'NAME_WRAP_GT_3_LINES', message: `A name appears across ${metrics.maxNameLines} lines.` });
  if (metrics.cardsWithAwkwardWrap > 0) issues.push({ severity: 'WARN', code: 'AWKWARD_NAME_WRAP', message: `${metrics.cardsWithAwkwardWrap} cards have awkward wrapping or short line fragments.` });
  if (metrics.cardsWithButtonOverlap > 0) issues.push({ severity: 'FAIL', code: 'BUTTON_OVERLAP', message: `${metrics.cardsWithButtonOverlap} name cards contain overlapping interactive controls.` });
  if (metrics.cardsWithTooManyActions > 0) issues.push({ severity: 'WARN', code: 'TOO_MANY_CARD_ACTIONS', message: `${metrics.cardsWithTooManyActions} cards have more than three dominant actions.` });
  if (metrics.mobileSmallButtonsCount > 0) issues.push({ severity: 'WARN', code: 'MOBILE_SMALL_BUTTONS', message: `${metrics.mobileSmallButtonsCount} mobile controls are under 40px tall.` });
  if (metrics.emptyLineupCopyPackActive) issues.push({ severity: 'FAIL', code: 'EMPTY_LINEUP_ACTIVE_COPY_PACK', message: 'Empty lineup exposes an active Copy Pack action.' });
  if (metrics.lineupDrawerHeight > record.viewport.height * 0.65) issues.push({ severity: 'FAIL', code: 'LINEUP_DRAWER_TOO_TALL', message: `Lineup drawer height ${metrics.lineupDrawerHeight}px exceeds 65% of viewport.` });
  if (metrics.floatingShelfOverlapsNameCards) issues.push({ severity: 'WARN', code: 'FLOATING_SHELF_OVER_NAME_CARD', message: 'Floating shelf overlaps at least one name card.' });
  if (metrics.lightModeDarkShell) issues.push({ severity: 'FAIL', code: 'LIGHT_MODE_DARK_SHELL', message: 'Light mode rendered with a dark shell background.' });
  if (metrics.darkModeLightShell) issues.push({ severity: 'FAIL', code: 'DARK_MODE_LIGHT_SHELL', message: 'Dark mode rendered with a light shell background.' });
  if (!record.themeClassMatches) issues.push({ severity: 'WARN', code: 'THEME_CLASS_MISMATCH', message: `html.dark did not match requested ${record.theme} theme.` });
  return issues;
}

function statusFromIssues(issues) {
  if (issues.some((issue) => issue.severity === 'FAIL')) return 'FAIL';
  if (issues.some((issue) => issue.severity === 'WARN')) return 'WARN';
  return 'PASS';
}

function maxMetric(records, key) {
  const values = records.map((record) => record.metrics[key]).filter((value) => typeof value === 'number');
  return values.length ? Math.max(...values) : null;
}

function worstRoute(records, filter) {
  const candidates = records.filter(filter);
  return candidates.sort((a, b) => {
    const aFail = a.issues.filter((issue) => issue.severity === 'FAIL').length;
    const bFail = b.issues.filter((issue) => issue.severity === 'FAIL').length;
    const aWarn = a.issues.filter((issue) => issue.severity === 'WARN').length;
    const bWarn = b.issues.filter((issue) => issue.severity === 'WARN').length;
    return (bFail - aFail) || (bWarn - aWarn) || ((b.metrics.firstCopyNameY || 0) - (a.metrics.firstCopyNameY || 0));
  })[0] || null;
}

function aggregate(records) {
  const failures = records.reduce((sum, record) => sum + record.issues.filter((issue) => issue.severity === 'FAIL').length, 0);
  const warnings = records.reduce((sum, record) => sum + record.issues.filter((issue) => issue.severity === 'WARN').length, 0);
  const screenshots = records.reduce((sum, record) => sum + record.screenshots.length, 0);
  const mobileWorst = worstRoute(records, (record) => record.viewport.name === 'mobile');
  const desktopWorst = worstRoute(records, (record) => record.viewport.name === 'desktop');
  return {
    totalRoutes: ROUTES.length,
    totalRuns: records.length,
    totalScreenshots: screenshots,
    failures,
    warnings,
    firstCopyNameYMax: maxMetric(records, 'firstCopyNameY'),
    mobileWorstRoute: mobileWorst ? `${mobileWorst.route} ${mobileWorst.theme}` : 'n/a',
    desktopWorstRoute: desktopWorst ? `${desktopWorst.route} ${desktopWorst.theme}` : 'n/a',
  };
}

function routeRows(records) {
  return ROUTES.map((routeConfig) => {
    const runs = records.filter((record) => record.route === routeConfig.path);
    const issues = runs.flatMap((record) => record.issues);
    return {
      route: routeConfig.path,
      status: statusFromIssues(issues),
      firstCopyNameY: maxMetric(runs, 'firstCopyNameY'),
      nameCardsCount: maxMetric(runs, 'nameCardsCount') || 0,
      awkwardWraps: runs.reduce((sum, record) => sum + record.metrics.cardsWithAwkwardWrap, 0),
      overlaps: runs.reduce((sum, record) => sum + record.metrics.cardsWithButtonOverlap, 0),
      emptyLineupBehavior: runs.some((record) => record.metrics.emptyLineupCopyPackActive) ? 'FAIL active empty pack action' : 'PASS guarded or not present',
      floatingShelfCoverage: maxMetric(runs, 'floatingShelfCoversViewportPercent') || 0,
      screenshots: runs.flatMap((record) => record.screenshots),
    };
  });
}

function componentFindings(records) {
  return [
    ['NameCard', `Max card count ${maxMetric(records, 'nameCardsCount') || 0}; awkward wraps ${records.reduce((sum, record) => sum + record.metrics.cardsWithAwkwardWrap, 0)}; overlaps ${records.reduce((sum, record) => sum + record.metrics.cardsWithButtonOverlap, 0)}.`],
    ['CopyButton', `Max firstCopyNameY ${maxMetric(records, 'firstCopyNameY') ?? 'n/a'}; max copy controls ${maxMetric(records, 'copyButtonsCount') || 0}.`],
    ['Save button', `Max Save/Saved controls ${maxMetric(records, 'saveButtonsCount') || 0}.`],
    ['Similar Reads', `Max Similar Reads controls ${maxMetric(records, 'similarReadsButtonsCount') || 0}.`],
    ['Lineup shelf', `Max viewport coverage ${maxMetric(records, 'floatingShelfCoversViewportPercent') || 0}%.`],
    ['Lineup drawer', `Max drawer height ${maxMetric(records, 'lineupDrawerHeight') || 0}px.`],
    ['Trending cards', `Max detected trending surfaces ${maxMetric(records, 'trendingCardsCount') || 0}.`],
    ['Internal links', `Max internal links detected ${maxMetric(records, 'internalLinksCount') || 0}.`],
  ];
}

function markdownTable(headers, rows) {
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map((cell) => String(cell ?? 'n/a').replace(/\n/g, ' ')).join(' | ')} |`),
  ].join('\n');
}

function buildMarkdown(records) {
  const summary = aggregate(records);
  const rows = routeRows(records);
  const runRows = records.map((record) => [
    record.route,
    record.viewport.name,
    record.theme,
    statusFromIssues(record.issues),
    record.metrics.firstCopyNameY ?? 'n/a',
    record.metrics.nameCardsCount,
    record.metrics.cardsWithAwkwardWrap,
    record.metrics.cardsWithButtonOverlap,
    `${record.metrics.floatingShelfCoversViewportPercent}%`,
    record.screenshots.map((file) => `[${path.basename(file)}](${file})`).join('<br>'),
  ]);

  return `# Tool Container Visual Audit

Generated: ${new Date().toISOString()}

## Summary

${markdownTable(
    ['total routes', 'total screenshots', 'failures', 'warnings', 'firstCopyNameY max', 'mobile worst route', 'desktop worst route'],
    [[summary.totalRoutes, summary.totalScreenshots, summary.failures, summary.warnings, summary.firstCopyNameYMax ?? 'n/a', summary.mobileWorstRoute, summary.desktopWorstRoute]],
  )}

## Findings by route

${markdownTable(
    ['route', 'status', 'first Copy Name y', 'name card count', 'awkward wraps', 'overlaps', 'empty lineup behavior', 'floating shelf coverage', 'screenshot links'],
    rows.map((row) => [
      row.route,
      row.status,
      row.firstCopyNameY ?? 'n/a',
      row.nameCardsCount,
      row.awkwardWraps,
      row.overlaps,
      row.emptyLineupBehavior,
      `${row.floatingShelfCoverage}%`,
      row.screenshots.slice(0, 4).map((file) => `[${path.basename(file)}](${file})`).join('<br>'),
    ]),
  )}

## Run details

${markdownTable(
    ['route', 'viewport', 'theme', 'status', 'firstCopyNameY', 'name cards', 'awkward wraps', 'overlaps', 'shelf coverage', 'screenshots'],
    runRows,
  )}

## Component-level findings

${markdownTable(['component', 'finding'], componentFindings(records))}

## Recommendations

- NameCard: set a stable min width and min height for generated-name cards before changing layout.
- NameCard: define name typography and wrap rules so one-to-three-character line fragments are avoided.
- CopyButton: reduce visual dominance relative to Save and Similar Reads only after comparing the recorded y-position and card action counts.
- Save button: keep the action available but visually secondary to Copy Name.
- Similar Reads: preserve discoverability while avoiding competition with Copy Name inside cramped cards.
- Lineup shelf: cap shelf coverage by viewport and verify it never covers name cards.
- Lineup drawer: cap max height under 65% of viewport and reduce repeated large actions in dense states.
- Trending cards: compare copy button hierarchy with the main NameCard treatment before redesign.
- Internal links: keep editorial/internal links below the tool surface and out of the primary action hierarchy.
`;
}

async function auditOne(page, routeConfig, viewport, theme) {
  const routeSlug = safeRouteName(routeConfig.path);
  const baseName = `${routeSlug}__${viewport.name}__${theme}`;
  const url = `${BASE_URL}${routeConfig.path}`;
  await page.setViewport(viewport);
  await page.goto(url);
  await page.evaluate((nextTheme) => {
    localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  }, theme);
  await page.reload();
  await page.wait(750);

  const screenshots = [];
  const fullScreenshot = path.join(SCREENSHOT_DIR, `${baseName}.png`);
  try {
    await page.screenshot(fullScreenshot);
    screenshots.push(relativeArtifact(fullScreenshot));
  } catch (error) {
    console.warn(`Warning: screenshot failed for ${baseName}: ${error.message}`);
  }

  const initial = await page.evaluate(measureToolContainers, routeConfig, viewport, theme, 'initial');
  const clicked = await page.evaluate(openToolState);
  await page.wait(700);

  if (clicked.drawer || clicked.save || clicked.similarReads) {
    const drawerScreenshot = path.join(SCREENSHOT_DIR, `${baseName}__drawer.png`);
    try {
      await page.screenshot(drawerScreenshot);
      screenshots.push(relativeArtifact(drawerScreenshot));
    } catch (error) {
      console.warn(`Warning: drawer screenshot failed for ${baseName}: ${error.message}`);
    }
  }

  const namesClip = await page.evaluate(clipFor, '#names');
  if (namesClip) {
    const namesScreenshot = path.join(SCREENSHOT_DIR, `${baseName}__names.png`);
    try {
      await page.screenshotClip(namesScreenshot, namesClip);
      screenshots.push(relativeArtifact(namesScreenshot));
    } catch (error) {
      console.warn(`Warning: names screenshot failed for ${baseName}: ${error.message}`);
    }
  }

  const drawer = await page.evaluate(measureToolContainers, routeConfig, viewport, theme, 'drawer-open');
  const metrics = {
    ...initial.metrics,
    lineupDrawerHeight: Math.max(initial.metrics.lineupDrawerHeight || 0, drawer.metrics.lineupDrawerHeight || 0),
    floatingShelfCoversViewportPercent: Math.max(initial.metrics.floatingShelfCoversViewportPercent || 0, drawer.metrics.floatingShelfCoversViewportPercent || 0),
    activePackButtonsCount: Math.max(initial.metrics.activePackButtonsCount || 0, drawer.metrics.activePackButtonsCount || 0),
    disabledPackButtonsCount: Math.max(initial.metrics.disabledPackButtonsCount || 0, drawer.metrics.disabledPackButtonsCount || 0),
  };
  const record = {
    ...initial,
    metrics,
    stateActions: clicked,
    drawerState: { metrics: drawer.metrics, elements: drawer.elements },
    screenshots,
  };
  record.issues = detectIssues(record, routeConfig);
  record.status = statusFromIssues(record.issues);
  return record;
}

async function main() {
  await assertServer();
  await fs.rm(AUDIT_ROOT, { recursive: true, force: true });
  await fs.mkdir(SCREENSHOT_DIR, { recursive: true });

  const driver = await createBrowserDriver();
  const records = [];
  try {
    for (const routeConfig of ROUTES) {
      for (const viewport of VIEWPORTS) {
        for (const theme of THEMES) {
          const page = await driver.newPage();
          try {
            const record = await auditOne(page, routeConfig, viewport, theme);
            records.push(record);
            console.log(`${record.status} ${routeConfig.path} ${viewport.name} ${theme}`);
          } finally {
            await page.close();
          }
        }
      }
    }
  } finally {
    await driver.close();
  }

  const audit = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    engine: driver.engine,
    routes: ROUTES,
    viewports: VIEWPORTS,
    themes: THEMES,
    summary: aggregate(records),
    records,
  };

  await fs.writeFile(path.join(AUDIT_ROOT, 'audit.json'), `${JSON.stringify(audit, null, 2)}\n`);
  await fs.writeFile(path.join(AUDIT_ROOT, 'audit.md'), buildMarkdown(records));
  console.log(`Wrote ${path.relative(repoRoot, path.join(AUDIT_ROOT, 'audit.json'))}`);
  console.log(`Wrote ${path.relative(repoRoot, path.join(AUDIT_ROOT, 'audit.md'))}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
