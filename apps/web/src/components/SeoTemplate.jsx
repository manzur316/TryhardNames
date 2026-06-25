
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '@/seo/SeoHead.jsx';
import CopyButton from '@/components/CopyButton.jsx';
import AnalyticsDebugPanel from '@/components/AnalyticsDebugPanel.jsx';
import { trackEvent } from '@/utils/analytics.js';
import LiveActivityStrip from '@/components/LiveActivityStrip.jsx';
import TrendingNamesModule from '@/components/TrendingNamesModule.jsx';
import { getEditorialBlocks } from '@/seo/editorial/editorialSections.js';
import EditorialSection from '@/components/editorial/EditorialSection.jsx';
import InternalLinkGrid from '@/components/editorial/InternalLinkGrid.jsx';
import {
  evolveContextualName,
  generateContextualNames,
  getContextKeyFromPage,
  getContextLabel,
  pickWhyThisWorks,
} from '@/utils/contextualNameEngine.js';
import { copyTextToClipboard } from '@/utils/clipboard.js';
import { notifyFavoritesChanged, subscribeFavorites } from '@/utils/localFavoritesBridge.js';
import {
  applyLolKoreanQuickMode,
  buildLolKoreanSummonerNamesDetailed,
  evolveLolKoreanVariants,
  LOL_KOREAN_QUICK_MODES,
} from '@/seo/leagueOfLegends/lolKoreanLane.js';
import {
  krDiscoveryCardClassNames,
  resolveKrDiscoveryTierFallback,
} from '@/seo/leagueOfLegends/krDiscoverySurface.js';
import { bumpKrEcologyDraw, readKrEcologySession } from '@/seo/leagueOfLegends/krSessionSalt.js';
import { cn } from '@/lib/utils.js';
import AdSlot from '@/components/ads/AdSlot.jsx';

const SeoTemplate = ({ pageData }) => {
  const path = `/${pageData.slug}`;
  const [category, keyword] = useMemo(() => {
    const parts = String(pageData.slug || '').split('/').filter(Boolean);
    return [parts[0] || 'general', parts[1] || 'cool'];
  }, [pageData.slug]);

  const initialNames = useMemo(() => pageData.names || [], [pageData.names]);
  const [names, setNames] = useState(initialNames);
  const [krDiscoverySurfacesLocal, setKrDiscoverySurfacesLocal] = useState(() => pageData.krDiscoverySurfaces || []);
  const [lengthFilter, setLengthFilter] = useState('all'); // all | short | medium
  const [asciiOnly, setAsciiOnly] = useState(false);
  const [riotSafe, setRiotSafe] = useState(false);
  const [streamSafe, setStreamSafe] = useState(false);

  const storageKey = useMemo(() => `tryhardnames:favorites:v1`, []);
  const recentKey = useMemo(() => `tryhardnames:recent:v1:${pageData.slug || 'unknown'}`, [pageData.slug]);
  const [favorites, setFavorites] = useState(() => new Set());
  const [activeEvolution, setActiveEvolution] = useState(null); // { base: string, variants: string[] }
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [recentState, setRecentState] = useState(() => ({
    recentNames: [],
    lastMode: null,
    lengthFilter: 'all',
    asciiOnly: false,
    riotSafe: false,
    streamSafe: false,
    updatedAt: null,
  }));
  const [shareCopied, setShareCopied] = useState(false);

  const filteredNames = useMemo(() => {
    const base = names.length ? names : initialNames;
    let out = base;

    if (asciiOnly || riotSafe || streamSafe) {
      out = out.map((n) => String(n).replace(/[^\x20-\x7E]/g, '')).filter(Boolean);
    }

    if (lengthFilter === 'short') {
      out = out.filter((n) => String(n).length <= 6);
    } else if (lengthFilter === 'medium') {
      out = out.filter((n) => {
        const l = String(n).length;
        return l >= 7 && l <= 12;
      });
    }

    if (riotSafe) {
      // Riot-safe: compact, readable, no weird punctuation/spam
      out = out
        .map((n) => String(n).replace(/[^\w]/g, ''))
        .filter((n) => n.length >= 3 && n.length <= 16);
    }

    if (streamSafe) {
      // Stream-safe: avoid risky punctuation, keep it pronounceable-ish
      out = out
        .map((n) => String(n).replace(/[^\w]/g, ''))
        .filter((n) => n.length >= 3 && n.length <= 18);
    }

    return out.slice(0, 40);
  }, [asciiOnly, initialNames, lengthFilter, names, riotSafe, streamSafe]);

  const vibeBadges = useMemo(() => {
    const map = {
      sweaty: { label: 'Ranked read', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30' },
      tryhard: { label: 'Competitive lane', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30' },
      pro: { label: 'Pro read', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30' },
      edgy: { label: 'Dark', className: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-purple-500/10 dark:text-purple-200 dark:border-purple-500/30' },
      aesthetic: { label: 'Aesthetic', className: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-500/10 dark:text-pink-200 dark:border-pink-500/30' },
      cute: { label: 'Cute', className: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-500/10 dark:text-pink-200 dark:border-pink-500/30' },
      soft: { label: 'Soft', className: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-500/10 dark:text-pink-200 dark:border-pink-500/30' },
      tiktok: { label: 'TikTok', className: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-200 dark:border-cyan-500/30' },
      avatar: { label: 'Avatar', className: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-200 dark:border-cyan-500/30' },
      og: { label: 'OG', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-yellow-500/10 dark:text-yellow-200 dark:border-yellow-500/30' },
      'one-word': { label: 'One‑Word', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-yellow-500/10 dark:text-yellow-200 dark:border-yellow-500/30' },
      '3-letter': { label: '3‑Letter', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-yellow-500/10 dark:text-yellow-200 dark:border-yellow-500/30' },
      korean: { label: 'KR minimal', className: 'bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-500/10 dark:text-zinc-200 dark:border-zinc-500/35' },
      movement: { label: 'Movement', className: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-200 dark:border-cyan-500/30' },
      predator: { label: 'Pred', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30' },
      realistic: { label: 'Realistic', className: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-200 dark:border-slate-500/30' },
      mafia: { label: 'Mafia', className: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-200 dark:border-slate-500/30' },
      cartel: { label: 'Cartel', className: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-200 dark:border-slate-500/30' },
      luxury: { label: 'Luxury', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-yellow-500/10 dark:text-yellow-200 dark:border-yellow-500/30' },
      gang: { label: 'Crew', className: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-200 dark:border-slate-500/30' },
      street: { label: 'Street', className: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-200 dark:border-slate-500/30' },
      smp: { label: 'SMP', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30' },
      pvp: { label: 'PvP', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30' },
      bedwars: { label: 'Bedwars', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30' },
      medieval: { label: 'Medieval', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-yellow-500/10 dark:text-yellow-200 dark:border-yellow-500/30' },
    };
    return map[keyword] || null;
  }, [keyword]);

  const contextKey = useMemo(() => getContextKeyFromPage({ category, keyword }), [category, keyword]);
  const contextLabel = useMemo(() => (contextKey ? getContextLabel({ contextKey }) : null), [contextKey]);

  const editorialBlocks = useMemo(() => {
    return getEditorialBlocks({ category, keyword, slug: pageData.slug });
  }, [category, keyword, pageData.slug]);

  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const uniq = (arr) => [...new Set(arr.filter(Boolean))];

  const pickPrefix = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const pickSuffix = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const toAscii = (s) => String(s).replace(/[^\x20-\x7E]/g, '');
  const stripNonWord = (s) => String(s).replace(/[^\w]/g, '');
  const collapse = (s) => String(s).replace(/\s+/g, '');

  const pushRecentName = (name) => {
    const n = String(name);
    setRecentState((prev) => {
      const next = [n, ...(prev.recentNames || []).filter((x) => x !== n)].slice(0, 12);
      const out = { ...prev, recentNames: next, updatedAt: new Date().toISOString() };
      try {
        localStorage.setItem(recentKey, JSON.stringify({ ...out, lengthFilter, asciiOnly, riotSafe, streamSafe }));
      } catch {
        // ignore
      }
      return out;
    });
  };

  const setLastMode = (mode) => {
    trackEvent('QUICK_MODE_USED', { pageSlug: pageData.slug, category, keyword, mode });
    setRecentState((prev) => {
      const out = { ...prev, lastMode: mode, updatedAt: new Date().toISOString() };
      try {
        localStorage.setItem(recentKey, JSON.stringify({ ...out, lengthFilter, asciiOnly, riotSafe, streamSafe }));
      } catch {
        // ignore
      }
      return out;
    });
  };

  const buildShareText = () => {
    const origin =
      typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'https://tryhardnames.com';
    const pageUrl = `${origin}/${String(pageData.slug || '').replace(/^\/+/, '')}`;
    const fav = [...favorites];
    const recent = (recentState.recentNames || []).slice(0, 8);
    const lines = [
      `TryhardNames lineup (${category}/${keyword})`,
      pageUrl,
      '',
      fav.length ? `Favorites (${fav.length}):` : null,
      ...fav.slice(0, 24).map((x) => `- ${x}`),
      fav.length ? '' : null,
      recent.length ? 'Recent picks:' : null,
      ...recent.map((x) => `- ${x}`),
    ].filter(Boolean);
    return lines.join('\n');
  };

  const buildDiscordPack = () => {
    const title = pageData.h1 || 'Tryhard Name Pack';
    const safeTitle = String(title).trim();
    const origin =
      typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'https://tryhardnames.com';
    const pageUrl = `${origin}/${String(pageData.slug || '').replace(/^\/+/, '')}`;
    const fav = [...favorites];
    const recent = (recentState.recentNames || []).slice(0, 12);
    const list = fav.length ? fav.slice(0, 24) : recent.slice(0, 12);
    const body = list.join('\n');

    return [
      `## ${safeTitle}`,
      '',
      '```yaml',
      body || 'GhostVCT',
      '```',
      '',
      `Saved from TryhardNames`,
      pageUrl,
    ].join('\n');
  };

  const exportDiscordPack = async () => {
    const text = buildDiscordPack();
    const res = await copyTextToClipboard(text, { preventRepeatMs: 650, vibrateMs: 14 });
    if (res.ok) {
      trackEvent('EXPORT_DISCORD_PACK', {
        pageSlug: pageData.slug,
        category,
        keyword,
        source: favorites.size ? 'favorites' : 'recent',
      });
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1200);
    } else {
      setShareCopied(false);
    }
  };

  const copySharePack = async () => {
    const text = buildShareText();
    const res = await copyTextToClipboard(text, { preventRepeatMs: 650, vibrateMs: 14 });
    if (res.ok) {
      trackEvent('SHARE_PACK', { pageSlug: pageData.slug, category, keyword, method: 'clipboard_pack' });
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1200);
    } else {
      setShareCopied(false);
    }
  };

  const shareLineup = async () => {
    const text = buildShareText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TryhardNames lineup',
          text,
          url: typeof window !== 'undefined' ? window.location.href : undefined,
        });
        trackEvent('SHARE_PACK', { pageSlug: pageData.slug, category, keyword, method: 'navigator_share' });
      } catch {
        // ignore
      }
    } else {
      await copySharePack();
    }
  };

  const applyMode = (mode) => {
    const contextualBase = contextKey ? generateContextualNames({ contextKey, count: 24 }) : [];
    const base = uniq([...(contextualBase || []), ...((initialNames.length ? initialNames : names).slice(0, 24).map(String) || [])]);
    const ctx = { category, keyword };
    const suffixSkill =
      ctx.category === 'valorant' ? ['VCT', 'RR', 'IGL', 'ACE'] : ctx.category === 'gta-rp' ? ['Lux', 'Vice', 'Noir'] : ['FPS', 'TV', 'YT', 'GG'];
    const suffixStream = ['TTV', 'YT', 'LIVE'];
    const darkBits = ctx.category === 'gta-rp' ? ['Don', 'Capo', 'Vice', 'Noir', 'Santos'] : ['Void', 'Nyx', 'Hex', 'Noir', 'Abyss'];
    const aestheticBits = ctx.category === 'roblox' ? ['Aura', 'Plush', 'Moon', 'Cherry', 'Cloud'] : ['Luna', 'Aura', 'Mist', 'Cloud', 'Bloom'];
    const symbolsSoft = ['✨', '♡', '•'];
    const symbolsHard = ['★', '⚡', '◆'];

    const variants = [];
    for (const raw of base) {
      const clean = collapse(raw);
      const word = stripNonWord(toAscii(clean));
      const short = word.slice(0, Math.max(3, Math.min(6, word.length)));

      if (mode === 'cleaner') {
        // cluster-aware cleaner
        variants.push(word);
        variants.push(short);
        if (contextKey === 'valorant') variants.push(short + pickSuffix(['VCT', 'RR']));
        if (contextKey === 'cs2') variants.push(short);
      } else if (mode === 'shorter') {
        variants.push(short);
        variants.push(word.length > short.length ? word : short);
      } else if (mode === 'sweaty') {
        if (contextKey === 'valorant') {
          variants.push(short + pickSuffix(['RR', 'ACE', '1Tap']));
          variants.push(pickPrefix(['Tap', 'Clutch', 'Retake']) + short);
        } else if (contextKey === 'gta-rp') {
          variants.push(pickPrefix(['Don', 'Capo', 'El']) + word);
          variants.push(word + pickSuffix(['Lux', 'Vice']));
        } else {
          variants.push(word);
          variants.push(short);
          if (contextKey) variants.push(short + symbolsHard[variants.length % symbolsHard.length]);
        }
      } else if (mode === 'og') {
        variants.push(short);
        variants.push(word);
        variants.push(short.toUpperCase());
      } else if (mode === 'streamer') {
        const suf = suffixStream[variants.length % suffixStream.length];
        variants.push(word + suf);
        variants.push(short + suf);
      } else if (mode === 'esports') {
        const suf = suffixSkill[variants.length % suffixSkill.length];
        variants.push(word + suf);
        variants.push(short + suf);
      } else if (mode === 'darker') {
        const bit = darkBits[variants.length % darkBits.length];
        variants.push(bit + short);
        variants.push(short + bit);
      } else if (mode === 'aesthetic') {
        const bit = aestheticBits[variants.length % aestheticBits.length];
        const sym = symbolsSoft[variants.length % symbolsSoft.length];
        variants.push(bit + sym + short);
        variants.push(short + sym);
      }
    }

    setLastMode(mode);
    setNames(shuffle(uniq([...variants, ...base])));
  };

  const remixNames = () => {
    const base = (initialNames.length ? initialNames : names).slice(0, 16);
    const suffixes =
      keyword === 'pro' || keyword === '3-letter' || keyword === 'one-word' ? ['', 'X', '', ''] : ['', '', 'ii', ''];
    const separators = ['','_','.' ];
    const remixed = [];
    for (let i = 0; i < base.length && remixed.length < 28; i++) {
      const n = String(base[i]);
      const suf = suffixes[i % suffixes.length];
      const sep = separators[(i + 1) % separators.length];
      const clean = n.replace(/\s+/g, '');
      remixed.push(`${clean}${suf}`);
      if (clean.length >= 4) remixed.push(`${clean.slice(0, 4)}${sep}${clean.slice(4)}`.replace(/\.$/, ''));
    }
    setNames(shuffle([...remixed, ...base]));
    trackEvent('QUICK_MODE_USED', { pageSlug: pageData.slug, category, keyword, mode: 'remix' });
  };

  const evolveName = (baseName) => {
    if (isLolKoreanLane) {
      const variants = evolveLolKoreanVariants(baseName).slice(0, 8);
      pushRecentName(baseName);
      setActiveEvolution({ base: baseName, variants });
      setDrawerOpen(true);
      return;
    }

    if (contextKey) {
      const variants = evolveContextualName({ contextKey, baseName }).slice(0, 10);
      pushRecentName(baseName);
      setActiveEvolution({ base: baseName, variants });
      setDrawerOpen(true);
      return;
    }

    const base = collapse(baseName);
    const ascii = toAscii(base);
    const word = stripNonWord(ascii) || ascii;
    const a = word;
    const b = a.replace(/o/gi, 'ø').replace(/a/gi, 'å');
    const c = a.replace(/o/gi, '0').replace(/a/gi, '4').replace(/e/gi, '3');
    const d = a.replace(/[aeiou]/gi, (m) => (m.toLowerCase() === 'o' ? 'x' : m)).replace(/oo/gi, 'o');
    const suffix = category === 'valorant' ? ['FPS', 'VCT', 'RR'] : ['FPS', 'TV', 'GG'];
    const e = a + suffix[0];
    const f = a + suffix[1];
    const g = a + suffix[2];
    const variants = uniq([a, b, c, d, e, f, g]).slice(0, 10);
    pushRecentName(baseName);
    setActiveEvolution({ base: baseName, variants });
    setDrawerOpen(true);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setFavorites(new Set(parsed.map(String)));
    } catch {
      // ignore
    }
  }, [storageKey]);

  useEffect(() => {
    return subscribeFavorites(() => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) {
          setFavorites((prev) => (prev.size === 0 ? prev : new Set()));
          return;
        }
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return;
        const next = new Set(parsed.map(String));
        setFavorites((prev) => {
          if (prev.size === next.size && [...prev].every((x) => next.has(x))) return prev;
          return next;
        });
      } catch {
        // ignore
      }
    });
  }, [storageKey]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(recentKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        setRecentState((prev) => ({ ...prev, ...parsed }));
        if (parsed.lengthFilter) setLengthFilter(parsed.lengthFilter);
        if (typeof parsed.asciiOnly === 'boolean') setAsciiOnly(parsed.asciiOnly);
        if (typeof parsed.riotSafe === 'boolean') setRiotSafe(parsed.riotSafe);
        if (typeof parsed.streamSafe === 'boolean') setStreamSafe(parsed.streamSafe);
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify([...favorites]));
      notifyFavoritesChanged();
    } catch {
      // ignore
    }
  }, [favorites, storageKey]);

  useEffect(() => {
    setRecentState((prev) => ({ ...prev, lengthFilter, asciiOnly, riotSafe, streamSafe }));
    try {
      const next = {
        ...recentState,
        lengthFilter,
        asciiOnly,
        riotSafe,
        streamSafe,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(recentKey, JSON.stringify(next));
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lengthFilter, asciiOnly, riotSafe, streamSafe, recentKey]);

  useEffect(() => {
    // non-destructive: enrich the interactive tool output with contextual DNA on mount
    if (!contextKey) return;
    const next = generateContextualNames({ contextKey, count: 24 });
    if (next && next.length) setNames((prev) => (prev && prev.length ? prev : next));
    // only on slug change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextKey, pageData.slug]);

  const toggleFavorite = (name) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      const key = String(name);
      if (next.has(key)) {
        next.delete(key);
        trackEvent('REMOVE_FAVORITE', { pageSlug: pageData.slug, category, keyword, name: key });
      } else {
        next.add(key);
        trackEvent('SAVE_FAVORITE', { pageSlug: pageData.slug, category, keyword, name: key });
      }
      return next;
    });
  };

  const isLolKoreanLane = pageData.laneExperience === 'lol-korean';
  const laneUi = pageData.laneUi || {};

  const applyKrEcologyNewDraw = () => {
    const salt = bumpKrEcologyDraw();
    const pack = buildLolKoreanSummonerNamesDetailed(salt);
    setNames(pack.names);
    setKrDiscoverySurfacesLocal(pack.discoverySurfaces);
    trackEvent('QUICK_MODE_USED', {
      pageSlug: pageData.slug,
      category,
      keyword,
      mode: 'kr_ecology_new_draw',
    });
  };

  useLayoutEffect(() => {
    if (!isLolKoreanLane) return;
    const { effectiveSalt } = readKrEcologySession();
    const pack = buildLolKoreanSummonerNamesDetailed(effectiveSalt);
    setNames(pack.names);
    setKrDiscoverySurfacesLocal(pack.discoverySurfaces);
  }, [isLolKoreanLane, pageData.slug]);

  const krSurfaceByName = useMemo(() => {
    if (!isLolKoreanLane) return new Map();
    const m = new Map();
    const list = names.length ? names : initialNames;
    const surfaces =
      krDiscoverySurfacesLocal.length === list.length ? krDiscoverySurfacesLocal : pageData.krDiscoverySurfaces || [];
    list.forEach((n, idx) => {
      const tier = surfaces[idx];
      if (tier) m.set(String(n).toLowerCase(), tier);
    });
    return m;
  }, [isLolKoreanLane, names, initialNames, krDiscoverySurfacesLocal, pageData.krDiscoverySurfaces]);

  const applyKrQuickMode = (mode) => {
    const pool = uniq((initialNames.length ? initialNames : names).slice(0, 40).map(String));
    const next = applyLolKoreanQuickMode(mode, pool);
    setNames(next.length ? next : pool);
    trackEvent('QUICK_MODE_USED', { pageSlug: pageData.slug, category, keyword, mode });
  };

  // Split H1 to make the last word a gradient (skipped for differentiated lanes)
  const h1Words = pageData.h1 ? pageData.h1.split(' ') : [];
  const lastWord = h1Words.length ? h1Words.pop() : '';
  const restH1 = h1Words.join(' ');

  const namesGridTitle = pageData.namesSectionTitle || pageData.h1 || 'Names';
  const namesGridLead =
    pageData.namesSectionLead ||
    'Tap to copy. Try adjacent styles or filters to tune how your tag reads—length and ASCII toggles refine the list.';

  const dividerClass = 'border-slate-200/90 dark:border-dark-700';
  const headingClass = 'text-slate-950 dark:text-dark-50';
  const bodyClass = 'text-slate-700 dark:text-dark-300';
  const subtleClass = 'text-slate-500 dark:text-dark-400';
  const chipClass =
    'bg-white/85 border border-slate-200/90 text-slate-700 shadow-sm dark:bg-dark-900 dark:border-dark-700 dark:text-dark-200';
  const chipLinkClass =
    'bg-white/85 border border-slate-200/90 text-slate-700 shadow-sm hover:border-cyan-300 hover:text-cyan-700 dark:bg-dark-900 dark:border-dark-700 dark:text-dark-200 dark:hover:text-accent-cyan dark:hover:border-accent-cyan/50';
  const cardClass =
    'bg-white/85 border border-slate-200/90 rounded-2xl p-8 md:p-10 text-slate-700 shadow-sm ring-1 ring-inset ring-slate-900/[0.03] hover:border-slate-300 hover:shadow-[0_22px_56px_-30px_rgba(15,23,42,0.18)] transition-all duration-300 dark:bg-dark-800 dark:border-dark-700/90 dark:text-dark-300 dark:ring-white/[0.04] dark:hover:border-dark-600 dark:hover:shadow-[0_22px_56px_-28px_rgba(0,0,0,0.55)]';
  const actionButtonClass =
    'px-4 py-2 rounded-full text-sm font-bold bg-white/90 border border-slate-200 text-slate-700 shadow-sm hover:border-cyan-300 hover:text-cyan-700 hover:bg-cyan-50/50 transition-colors dark:bg-dark-900 dark:border-dark-700 dark:text-dark-50 dark:hover:text-accent-cyan dark:hover:border-accent-cyan/50';
  const secondaryActionButtonClass =
    'px-4 py-2 rounded-full text-sm font-bold bg-white/90 border border-slate-200 text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-colors dark:bg-dark-900 dark:border-dark-700 dark:text-dark-50 dark:hover:border-dark-500';
  const inactiveFilterClass =
    'bg-white/90 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:bg-dark-900 dark:text-dark-50 dark:border-dark-700 dark:hover:border-dark-500';
  const activeCyanFilterClass =
    'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-accent-cyan/15 dark:text-accent-cyan dark:border-accent-cyan/40';
  const activePurpleFilterClass =
    'bg-violet-50 text-violet-700 border-violet-200 dark:bg-accent-purple/15 dark:text-accent-purple dark:border-accent-purple/40';
  const activeEmeraldFilterClass =
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-500/40';
  const activeCyanSoftFilterClass =
    'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-200 dark:border-cyan-500/40';
  const nameCardClass =
    'group relative bg-white/90 border border-slate-200/90 rounded-2xl p-4 overflow-hidden transition-[border-color,box-shadow] duration-200 ease-out hover:border-cyan-300/70 hover:shadow-[0_10px_32px_-16px_rgba(15,23,42,0.22)] dark:bg-dark-900 dark:border-dark-700/90 dark:hover:border-accent-cyan/22 dark:hover:shadow-[0_10px_32px_-12px_rgba(34,211,238,0.07)]';
  const smallGhostButtonClass =
    'px-3 py-2 rounded-full text-xs font-black tracking-widest uppercase bg-white/90 border border-slate-200 text-slate-700 hover:border-violet-300 hover:text-violet-700 transition-colors dark:bg-dark-900 dark:border-dark-700 dark:text-dark-200 dark:hover:text-accent-purple dark:hover:border-accent-purple/50';

  return (
    <>
      <SeoHead
        title={pageData.title}
        description={pageData.description}
        path={path}
        ogType="article"
        jsonLd={pageData.jsonLd || []}
      />

      <div className="th-atmosphere-shell text-slate-700 dark:text-dark-300 min-h-screen py-20 px-4 flex-grow flex flex-col">
        <div className="container relative z-10 mx-auto max-w-5xl">
          
          {/* Hero Section */}
          {isLolKoreanLane && pageData.laneHero ? (
            <div className={cn('mb-16 sm:mb-20 max-w-3xl mx-auto space-y-6 text-left border-b pb-14', dividerClass)}>
              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-dark-500">
                {pageData.laneHero.eyebrow}
              </p>
              <h1 className={cn('text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] leading-[1.12] text-balance', headingClass)}>
                {pageData.laneHero.title}
              </h1>
              <p className={cn('text-base md:text-lg leading-relaxed', bodyClass)}>{pageData.laneHero.subtitle}</p>
              {pageData.laneHero.note ? (
                <p className="text-sm text-slate-500 dark:text-dark-500 leading-relaxed border-l border-slate-300 dark:border-dark-600 pl-4">{pageData.laneHero.note}</p>
              ) : null}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {vibeBadges && (
                  <span
                    className={`px-3 py-2 rounded-full text-xs font-bold tracking-widest uppercase border ${vibeBadges.className}`}
                  >
                    {vibeBadges.label}
                  </span>
                )}
                <Link
                  to="/league-of-legends"
                  onClick={() =>
                    trackEvent('INTERNAL_LINK_CLICK', {
                      pageSlug: pageData.slug,
                      category,
                      keyword,
                      targetSlug: 'league-of-legends',
                      targetTitle: 'Identity hub',
                      placement: 'lol_korean_hero',
                    })
                  }
                  className="px-3 py-2 rounded-full text-xs font-bold tracking-widest uppercase bg-white/85 border border-slate-200/90 text-slate-700 shadow-sm hover:border-slate-300 transition-colors dark:bg-dark-900 dark:border-dark-600 dark:text-dark-200 dark:hover:border-dark-500"
                >
                  All League lanes
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center mb-16 sm:mb-20 space-y-7 sm:space-y-8">
              <h1 className={cn('text-4xl md:text-6xl font-bold tracking-tight md:tracking-tighter leading-[1.06] md:leading-[1.02] max-w-4xl mx-auto text-balance', headingClass)}>
                {restH1 ? `${restH1} ` : ''}
                <span className="text-cyan-600 dark:text-cyan-300">{lastWord}</span>
              </h1>
              <p className={cn('text-lg md:text-xl max-w-3xl mx-auto leading-relaxed md:leading-[1.65]', bodyClass)}>
                {pageData.description}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className={cn('px-3 py-2 rounded-full text-xs font-bold tracking-widest uppercase', chipClass)}>
                  {category}/{keyword}
                </span>
                {vibeBadges && (
                  <span
                    className={`px-3 py-2 rounded-full text-xs font-bold tracking-widest uppercase border ${vibeBadges.className}`}
                  >
                    {vibeBadges.label}
                  </span>
                )}
                {contextLabel && (
                  <span className={cn('px-3 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-colors', chipLinkClass)}>
                    {contextLabel}
                  </span>
                )}
                {pageData.topicHub && (
                  <Link
                    to={pageData.topicHub.path || `/${pageData.topicHub.slug}`}
                    onClick={() =>
                      trackEvent('TOPIC_HUB_CLICK', {
                        pageSlug: pageData.slug,
                        category,
                        keyword,
                        hubPath: pageData.topicHub.path || `/${pageData.topicHub.slug}`,
                        hubSlug: pageData.topicHub.slug,
                      })
                    }
                    className={cn('px-3 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-colors', chipLinkClass)}
                  >
                    Topic hub
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Content Sections */}
          <div className="space-y-12 mb-16">
            {pageData.sections.map((sec, i) => (
              <section 
                key={i} 
                className={cardClass}
              >
                <h2 className={cn('text-2xl md:text-3xl font-bold mb-6', headingClass)}>{sec.title}</h2>
                {Array.isArray(sec.content) ? (
                  <ul className="space-y-4 list-disc pl-6">
                    {sec.content.map((p, j) => (
                      <li key={j} className="text-lg leading-relaxed">{p}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-lg leading-relaxed">{sec.content}</p>
                )}
              </section>
            ))}
          </div>

          <EditorialSection
            blocks={editorialBlocks}
            category={category}
            keyword={keyword}
            pageSlug={pageData.slug}
            onLinkClick={(l) =>
              trackEvent('INTERNAL_LINK_CLICK', {
                pageSlug: pageData.slug,
                category,
                keyword,
                targetSlug: String(l.to).replace(/^\//, ''),
                targetTitle: l.label,
                placement: 'editorial_micro_guides',
              })
            }
          />

          {/* Names Grid */}
          {pageData.names && pageData.names.length > 0 && (
            <div className="mb-20">
              <div className="text-center mb-8 sm:mb-10 space-y-4">
                <h2 className={cn('text-3xl sm:text-4xl font-bold tracking-tight leading-[1.08] text-balance', headingClass)}>
                  {namesGridTitle}
                </h2>
                <p className={cn('text-sm max-w-2xl mx-auto leading-relaxed', bodyClass)}>{namesGridLead}</p>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                <div className="flex flex-wrap gap-2">
                  {isLolKoreanLane ? (
                    <>
                      <button
                        type="button"
                        onClick={() => applyKrEcologyNewDraw()}
                        className={actionButtonClass}
                      >
                        {laneUi.shuffleLabel || 'New draw'}
                      </button>
                      {LOL_KOREAN_QUICK_MODES.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => applyKrQuickMode(m.id)}
                          className={secondaryActionButtonClass}
                        >
                          {m.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setNames(initialNames);
                          setKrDiscoverySurfacesLocal(pageData.krDiscoverySurfaces || []);
                          setLengthFilter('all');
                          setAsciiOnly(false);
                          setRiotSafe(false);
                          setStreamSafe(false);
                        }}
                        className={secondaryActionButtonClass}
                      >
                        {laneUi.resetLabel || 'Reset'}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setNames(shuffle(initialNames))}
                        className={actionButtonClass}
                      >
                        Another mix
                      </button>
                      <button
                        type="button"
                        onClick={remixNames}
                        className="px-4 py-2 rounded-full text-sm font-bold bg-white/90 border border-slate-200 text-slate-700 shadow-sm hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50/50 transition-colors dark:bg-dark-900 dark:border-dark-700 dark:text-dark-50 dark:hover:text-accent-purple dark:hover:border-accent-purple/50"
                      >
                        Adjacent styles
                      </button>
                      <button
                        type="button"
                        onClick={() => applyMode('cleaner')}
                        className="px-4 py-2 rounded-full text-sm font-bold bg-white/90 border border-slate-200 text-slate-700 shadow-sm hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50 transition-colors dark:bg-dark-900 dark:border-dark-700 dark:text-dark-50 dark:hover:border-emerald-400/40 dark:hover:text-emerald-200"
                      >
                        Cleaner read
                      </button>
                      <button
                        type="button"
                        onClick={() => applyMode('sweaty')}
                        className="px-4 py-2 rounded-full text-sm font-bold bg-white/90 border border-slate-200 text-slate-700 shadow-sm hover:border-red-300 hover:text-red-700 hover:bg-red-50/50 transition-colors dark:bg-dark-900 dark:border-dark-700 dark:text-dark-50 dark:hover:border-red-400/40 dark:hover:text-red-200"
                      >
                        Ranked tone
                      </button>
                      <button
                        type="button"
                        onClick={() => applyMode('shorter')}
                        className="px-4 py-2 rounded-full text-sm font-bold bg-white/90 border border-slate-200 text-slate-700 shadow-sm hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50/50 transition-colors dark:bg-dark-900 dark:border-dark-700 dark:text-dark-50 dark:hover:border-yellow-400/40 dark:hover:text-yellow-200"
                      >
                        Shorter tag
                      </button>
                      <button
                        type="button"
                        onClick={() => applyMode('og')}
                        className="px-4 py-2 rounded-full text-sm font-bold bg-white/90 border border-slate-200 text-slate-700 shadow-sm hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50/50 transition-colors dark:bg-dark-900 dark:border-dark-700 dark:text-dark-50 dark:hover:border-yellow-400/40 dark:hover:text-yellow-200"
                      >
                        OG tilt
                      </button>
                      <button
                        type="button"
                        onClick={() => applyMode('streamer')}
                        className="px-4 py-2 rounded-full text-sm font-bold bg-white/90 border border-slate-200 text-slate-700 shadow-sm hover:border-cyan-300 hover:text-cyan-700 hover:bg-cyan-50/50 transition-colors dark:bg-dark-900 dark:border-dark-700 dark:text-dark-50 dark:hover:border-cyan-400/40 dark:hover:text-cyan-200"
                      >
                        Stream-friendly
                      </button>
                      <button
                        type="button"
                        onClick={() => applyMode('esports')}
                        className="px-4 py-2 rounded-full text-sm font-bold bg-white/90 border border-slate-200 text-slate-700 shadow-sm hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50 transition-colors dark:bg-dark-900 dark:border-dark-700 dark:text-dark-50 dark:hover:border-emerald-400/40 dark:hover:text-emerald-200"
                      >
                        Esports-clean
                      </button>
                      <button
                        type="button"
                        onClick={() => applyMode('darker')}
                        className="px-4 py-2 rounded-full text-sm font-bold bg-white/90 border border-slate-200 text-slate-700 shadow-sm hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50/50 transition-colors dark:bg-dark-900 dark:border-dark-700 dark:text-dark-50 dark:hover:border-purple-400/40 dark:hover:text-purple-200"
                      >
                        Darker tone
                      </button>
                      <button
                        type="button"
                        onClick={() => applyMode('aesthetic')}
                        className="px-4 py-2 rounded-full text-sm font-bold bg-white/90 border border-slate-200 text-slate-700 shadow-sm hover:border-pink-300 hover:text-pink-700 hover:bg-pink-50/50 transition-colors dark:bg-dark-900 dark:border-dark-700 dark:text-dark-50 dark:hover:border-pink-400/40 dark:hover:text-pink-200"
                      >
                        Aesthetic lane
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNames(initialNames);
                          setLengthFilter('all');
                          setAsciiOnly(false);
                          setRiotSafe(false);
                          setStreamSafe(false);
                        }}
                        className={secondaryActionButtonClass}
                      >
                        Reset
                      </button>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLengthFilter('all');
                      trackEvent('FILTER_USED', { pageSlug: pageData.slug, category, keyword, filter: 'length', value: 'all' });
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                      lengthFilter === 'all'
                        ? activeCyanFilterClass
                        : inactiveFilterClass
                    }`}
                  >
                    {laneUi.filterAll || 'All'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLengthFilter('short');
                      trackEvent('FILTER_USED', { pageSlug: pageData.slug, category, keyword, filter: 'length', value: 'short' });
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                      lengthFilter === 'short'
                        ? activeCyanFilterClass
                        : inactiveFilterClass
                    }`}
                  >
                    {laneUi.filterShort || 'Short'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLengthFilter('medium');
                      trackEvent('FILTER_USED', { pageSlug: pageData.slug, category, keyword, filter: 'length', value: 'medium' });
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                      lengthFilter === 'medium'
                        ? activeCyanFilterClass
                        : inactiveFilterClass
                    }`}
                  >
                    {laneUi.filterMedium || 'Medium'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAsciiOnly((v) => {
                        const next = !v;
                        trackEvent('FILTER_USED', { pageSlug: pageData.slug, category, keyword, filter: 'asciiOnly', value: String(next) });
                        return next;
                      });
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                      asciiOnly
                        ? activePurpleFilterClass
                        : inactiveFilterClass
                    }`}
                  >
                    {laneUi.filterAsciiLabel || 'ASCII only'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRiotSafe((v) => {
                        const next = !v;
                        trackEvent('FILTER_USED', { pageSlug: pageData.slug, category, keyword, filter: 'riotSafe', value: String(next) });
                        return next;
                      });
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                      riotSafe
                        ? activeEmeraldFilterClass
                        : inactiveFilterClass
                    }`}
                  >
                    {laneUi.filterRiotLabel || 'Riot-safe'}
                  </button>
                  {!isLolKoreanLane && (
                    <button
                      type="button"
                      onClick={() => {
                        setStreamSafe((v) => {
                          const next = !v;
                          trackEvent('FILTER_USED', { pageSlug: pageData.slug, category, keyword, filter: 'streamSafe', value: String(next) });
                          return next;
                        });
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                        streamSafe
                          ? activeCyanSoftFilterClass
                          : inactiveFilterClass
                      }`}
                    >
                      Stream-safe
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-6 flex justify-center">
                <LiveActivityStrip presetId={category === 'gta-rp' ? 'gta-rp' : category} category={category} pageSlug={pageData.slug} />
              </div>

              <div
                id="names"
                className={
                  isLolKoreanLane
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6'
                    : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                }
              >
                {filteredNames.map((name, i) => {
                  const s = String(name);
                  const len = s.length;
                  const hasSymbols = /[^\w\s]/.test(s) || /[^\x20-\x7E]/.test(s);
                  const formatHint =
                    isLolKoreanLane ? null : len <= 4 ? 'Compact' : len <= 6 ? 'Short' : hasSymbols ? 'Styled' : null;
                  const formatHintClass =
                    formatHint === 'Compact'
                      ? 'bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-500/10 dark:text-zinc-300 dark:border-zinc-500/25'
                      : formatHint === 'Short'
                        ? 'bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-500/10 dark:text-zinc-300 dark:border-zinc-500/25'
                        : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-600/15 dark:text-slate-300 dark:border-slate-500/25';

                  const krTier =
                    isLolKoreanLane &&
                    (krSurfaceByName.get(s.toLowerCase()) ?? resolveKrDiscoveryTierFallback(s, i));
                  const krStyles = isLolKoreanLane && krTier ? krDiscoveryCardClassNames(krTier) : null;

                  return (
                    <div
                      key={`${s}-${i}`}
                      className={
                        isLolKoreanLane && krStyles
                          ? `group relative border rounded-2xl overflow-hidden transition-[border-color,box-shadow] duration-200 ease-out hover:border-accent-cyan/35 hover:shadow-[0_6px_22px_rgba(0,0,0,0.22)] ${krStyles.pad} ${krStyles.wrap}`
                          : `${nameCardClass} ${i === 0 ? 'ring-1 ring-inset ring-cyan-200/60 dark:ring-white/[0.08]' : ''}`
                      }
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-accent-cyan/[0.06] blur-2xl" />
                        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-accent-purple/[0.06] blur-2xl" />
                      </div>

                      <div className="flex items-start justify-between gap-3 relative">
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            copyTextToClipboard(s, { preventRepeatMs: 450, vibrateMs: 12 }).then((res) => {
                              if (!res.ok) return;
                              pushRecentName(s);
                              trackEvent('COPY_NAME', { pageSlug: pageData.slug, category, keyword, name: s, source: 'card' });
                            });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              copyTextToClipboard(s, { preventRepeatMs: 450, vibrateMs: 12 }).then((res) => {
                                if (!res.ok) return;
                                pushRecentName(s);
                                trackEvent('COPY_NAME', { pageSlug: pageData.slug, category, keyword, name: s, source: 'card_kb' });
                              });
                            }
                          }}
                          className="min-w-0 flex-1 cursor-pointer select-none outline-none"
                          aria-label={`Copy ${s}`}
                        >
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {formatHint && (
                              <span className={`px-2 py-1 rounded-md text-[10px] font-semibold tracking-wide border ${formatHintClass}`}>
                                {formatHint}
                              </span>
                            )}
                            {vibeBadges && (
                              <span className={`px-2 py-1 rounded-md text-[10px] font-semibold tracking-wide border ${vibeBadges.className}`}>
                                {vibeBadges.label}
                              </span>
                            )}
                          </div>
                          <span
                            className={`block group-hover:text-cyan-700 dark:group-hover:text-accent-cyan/95 transition-colors duration-200 break-words leading-snug ${krStyles?.name ?? 'text-xl font-black text-slate-950 dark:text-dark-50 tracking-tight'}`}
                          >
                            {s}
                          </span>
                          <span
                            className={`block text-[11px] mt-2.5 font-medium tracking-wide ${krStyles?.meta ?? 'text-slate-500 dark:text-dark-400/90'}`}
                          >
                            {isLolKoreanLane
                              ? `${len} letters`
                              : `${len} chars${hasSymbols ? ' • symbols' : ''}`}
                          </span>
                          {contextKey && i < 3 && !isLolKoreanLane && (
                            <span className="block text-[11px] text-slate-600 dark:text-dark-300 mt-2">
                              {pickWhyThisWorks({ contextKey })}
                            </span>
                          )}
                        </div>

                        <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                          <div className="flex flex-col items-end gap-2">
                            <CopyButton
                              textToCopy={s}
                              analytics={{ pageSlug: pageData.slug, category, keyword, source: 'card_copy_button' }}
                              className="w-auto opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                trackEvent('NAME_EVOLUTION_USED', { pageSlug: pageData.slug, category, keyword, name: s });
                                evolveName(s);
                              }}
                              className={smallGhostButtonClass}
                            >
                              {laneUi.evolveLabel || 'Similar reads'}
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleFavorite(s)}
                              className={`px-3 py-2 rounded-full text-xs font-black tracking-widest uppercase border transition-colors ${
                                favorites.has(s)
                                  ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-yellow-500/15 dark:text-yellow-200 dark:border-yellow-500/40'
                                  : 'bg-white/90 text-slate-700 border-slate-200 hover:border-amber-300 hover:text-amber-700 dark:bg-dark-900 dark:text-dark-200 dark:border-dark-700 dark:hover:border-yellow-500/40 dark:hover:text-yellow-200'
                              }`}
                            >
                              {favorites.has(s)
                                ? laneUi.savedLabel || 'Saved'
                                : laneUi.saveLabel || 'Save'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* Popular this week (local + curated, lightweight) */}
          <div className="mb-16">
            <TrendingNamesModule
              presetId={category === 'gta-rp' ? 'gta-rp' : category}
              category={category}
              keyword={keyword}
              pageSlug={pageData.slug}
              favorites={favorites}
              onToggleFavorite={(n) => toggleFavorite(n)}
              title="Trending here"
              compact
            />
          </div>

          {/* Topic Hub recommendation (one per page, contextual) */}
          {pageData.topicHub && !isLolKoreanLane && (
            <div className="mb-10 -mt-6">
              <div className="max-w-4xl mx-auto bg-white/85 border border-slate-200/90 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 dark:bg-dark-800 dark:border-dark-700 dark:shadow-refined">
                <div>
                  <p className={cn('text-xs font-bold tracking-widest uppercase', subtleClass)}>Topic hub</p>
                  <p className={cn('text-lg font-bold mt-1', headingClass)}>{pageData.topicHub.title}</p>
                  <p className={cn('text-sm mt-1 leading-relaxed', bodyClass)}>{pageData.topicHub.desc}</p>
                </div>
                <Link
                  to={pageData.topicHub.path || `/${pageData.topicHub.slug}`}
                  onClick={() =>
                    trackEvent('TOPIC_HUB_CLICK', {
                      pageSlug: pageData.slug,
                      category,
                      keyword,
                      hubPath: pageData.topicHub.path || `/${pageData.topicHub.slug}`,
                      hubSlug: pageData.topicHub.slug,
                      placement: 'recommendation_card',
                    })
                  }
                  className="inline-flex items-center justify-center bg-white/90 border border-slate-200 px-5 py-3 rounded-full text-slate-800 text-sm font-bold hover:text-cyan-700 hover:border-cyan-300 transition-all duration-300 shadow-sm whitespace-nowrap dark:bg-dark-900 dark:border-dark-700 dark:text-dark-50 dark:hover:text-accent-cyan dark:hover:border-accent-cyan/50"
                >
                  {pageData.topicHub.cta}
                </Link>
              </div>
            </div>
          )}

          <InternalLinkGrid
            pageData={pageData}
            category={category}
            keyword={keyword}
            onLinkClick={({ target, placement }) =>
              trackEvent('INTERNAL_LINK_CLICK', {
                pageSlug: pageData.slug,
                category,
                keyword,
                targetSlug: target.slug,
                targetTitle: target.title,
                placement,
              })
            }
          />

          {/* FAQs (Indexable content + JSON-LD in head) */}
          {pageData.faqs && pageData.faqs.length > 0 && (
            <div className={cn('border-t pt-16', dividerClass)}>
              <h2 className={cn('text-3xl font-bold mb-8 text-center', headingClass)}>Frequently Asked Questions</h2>
              <div className="space-y-4 max-w-4xl mx-auto">
                {pageData.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="bg-white/85 border border-slate-200/90 rounded-xl p-6 hover:border-cyan-300 transition-colors shadow-sm dark:bg-dark-800 dark:border-dark-700 dark:hover:border-accent-cyan/40"
                  >
                    <summary className={cn('cursor-pointer select-none font-bold text-lg', headingClass)}>
                      {faq.question}
                    </summary>
                    <div className={cn('mt-3 leading-relaxed', bodyClass)}>{faq.answer}</div>
                  </details>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Floating lineup shelf — primary surface for saves, recents, and similar reads */}
      <div className="fixed inset-x-0 bottom-0 z-50 pointer-events-none">
        <div className="pointer-events-auto mx-auto max-w-5xl px-3 pb-3 sm:pb-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-[0_-20px_60px_-24px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/[0.05] overflow-hidden dark:border-white/[0.09] dark:bg-dark-950/95 dark:shadow-[0_-20px_60px_-16px_rgba(0,0,0,0.75)] dark:ring-white/[0.05]">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-200/80 bg-slate-50/70 dark:border-white/[0.06] dark:bg-dark-900/40">
              <button
                type="button"
                onClick={() => setDrawerOpen((v) => !v)}
                className="flex items-center gap-2.5 text-sm font-black text-slate-900 dark:text-dark-50 min-w-0"
              >
                <span
                  className={cn(
                    'px-3.5 py-2 rounded-full text-xs font-black tracking-[0.18em] uppercase border transition-all duration-200',
                    drawerOpen || activeEvolution
                      ? 'border-cyan-300 bg-cyan-50 text-cyan-700 shadow-[0_0_24px_-16px_rgba(8,145,178,0.35)] dark:border-cyan-400/50 dark:bg-cyan-500/[0.18] dark:text-cyan-50 dark:shadow-[0_0_24px_-10px_rgba(34,211,238,0.45)]'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-dark-600 dark:bg-dark-800 dark:text-dark-100 dark:hover:border-dark-500'
                  )}
                >
                  Lineup
                </span>
                <span className="text-slate-800 dark:text-dark-100 font-bold tabular-nums">{favorites.size}</span>
                <span className="text-slate-500 dark:text-dark-400 text-[11px] font-bold tracking-widest uppercase shrink-0">
                  {drawerOpen ? 'Hide' : 'Open'}
                </span>
              </button>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={exportDiscordPack}
                  className="px-3.5 py-2 rounded-full text-[11px] font-black tracking-[0.14em] uppercase bg-violet-50 border border-violet-200 text-violet-700 hover:bg-violet-100 hover:border-violet-300 hover:shadow-[0_0_18px_-12px_rgba(124,58,237,0.32)] transition-all duration-200 dark:bg-dark-800/90 dark:border-violet-500/35 dark:text-violet-100 dark:hover:bg-violet-500/15 dark:hover:border-violet-400/55 dark:hover:shadow-[0_0_18px_-8px_rgba(139,92,246,0.45)]"
                >
                  Export Discord Pack
                </button>
                <button
                  type="button"
                  onClick={copySharePack}
                  className={cn(
                    'px-3.5 py-2 rounded-full text-[11px] font-black tracking-[0.14em] uppercase border transition-all duration-200',
                    shareCopied
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-[0_0_16px_-10px_rgba(16,185,129,0.32)] dark:bg-emerald-500/20 dark:text-emerald-100 dark:border-emerald-400/45 dark:shadow-[0_0_16px_-8px_rgba(52,211,153,0.4)]'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-300 hover:shadow-[0_0_18px_-12px_rgba(16,185,129,0.28)] dark:bg-dark-800/90 dark:border-emerald-500/25 dark:text-emerald-100/95 dark:hover:border-emerald-400/45 dark:hover:shadow-[0_0_18px_-8px_rgba(52,211,153,0.35)]'
                  )}
                >
                  {shareCopied ? 'Copied' : 'Copy pack'}
                </button>
                <button
                  type="button"
                  onClick={shareLineup}
                  className="px-3.5 py-2 rounded-full text-[11px] font-black tracking-[0.14em] uppercase bg-cyan-50 border border-cyan-200 text-cyan-700 hover:bg-cyan-100 hover:border-cyan-300 hover:shadow-[0_0_18px_-12px_rgba(8,145,178,0.32)] transition-all duration-200 dark:bg-dark-800/90 dark:border-cyan-500/35 dark:text-cyan-50 dark:hover:bg-cyan-500/15 dark:hover:border-cyan-400/50 dark:hover:shadow-[0_0_18px_-8px_rgba(34,211,238,0.4)]"
                >
                  Share
                </button>
              </div>
            </div>

            <div
              className={cn(
                'transition-all duration-300 overflow-hidden',
                drawerOpen ? 'max-h-[75vh] opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="px-4 pb-4 pt-4 space-y-4">
                {activeEvolution && (
                  <section
                    className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-slate-50 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)] dark:border-cyan-500/25 dark:from-cyan-950/55 dark:via-dark-900 dark:to-dark-950 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                    aria-label="Similar reads"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-200/90">Similar reads</p>
                        <p className="text-sm text-slate-700 dark:text-dark-200 mt-1.5">
                          From <span className="font-semibold text-slate-950 dark:text-dark-50">{activeEvolution.base}</span>
                        </p>
                        <p className="text-xs text-slate-500 dark:text-dark-400 mt-1 leading-relaxed max-w-md">
                          Steps stay here with your lineup — scroll sideways on small screens.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveEvolution(null)}
                        className="shrink-0 self-start px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wide border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-950 transition-colors dark:border-dark-600 dark:text-dark-200 dark:hover:border-dark-500 dark:hover:text-dark-50"
                      >
                        Dismiss
                      </button>
                    </div>
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
                      {activeEvolution.variants.map((v, vi) => (
                        <div
                          key={`${vi}-${v}`}
                          className="flex-shrink-0 flex items-center gap-2 rounded-xl border border-slate-200 bg-white/85 px-3 py-2.5 shadow-sm dark:border-dark-600/90 dark:bg-dark-950/80"
                        >
                          <span className="text-sm font-semibold text-slate-950 dark:text-dark-50 max-w-[min(160px,44vw)] truncate" title={v}>
                            {v}
                          </span>
                          <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 shrink-0">
                            <CopyButton
                              textToCopy={v}
                              analytics={{ pageSlug: pageData.slug, category, keyword, source: 'evolution_variant' }}
                              className="w-auto [&_button]:min-h-8 [&_button]:px-2.5 [&_button]:text-[10px]"
                            />
                            <button
                              type="button"
                              onClick={() => toggleFavorite(v)}
                              className={cn(
                                'text-[10px] font-black tracking-widest uppercase px-2.5 py-1.5 rounded-full border transition-colors',
                                favorites.has(v)
                                  ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-500/15 dark:text-amber-100 dark:border-amber-400/45'
                                  : 'border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-700 dark:border-dark-600 dark:text-dark-300 dark:hover:border-amber-400/35 dark:hover:text-amber-100'
                              )}
                            >
                              {favorites.has(v) ? 'Saved' : 'Save'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <section className="bg-white/85 border border-slate-200/90 rounded-2xl p-4 shadow-sm dark:bg-dark-800 dark:border-dark-700">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="text-sm font-black tracking-widest uppercase text-slate-700 dark:text-dark-200">Saved</h3>
                      <button
                        type="button"
                        onClick={() => setFavorites(new Set())}
                        className="px-3 py-2 rounded-full text-xs font-black tracking-widest uppercase bg-white/90 border border-slate-200 text-slate-700 hover:border-red-300 hover:text-red-700 transition-colors dark:bg-dark-900 dark:border-dark-700 dark:text-dark-200 dark:hover:border-red-400/40 dark:hover:text-red-200"
                      >
                        Clear all
                      </button>
                    </div>

                    {favorites.size === 0 ? (
                      <p className={cn('text-sm', bodyClass)}>Save a few names to build a lineup.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {[...favorites].slice(0, 24).map((f) => (
                          <div
                            key={f}
                            className="bg-white/90 border border-slate-200 rounded-full px-3 py-2 flex items-center gap-2 shadow-sm dark:bg-dark-900 dark:border-dark-700"
                          >
                            <button
                              type="button"
                              onClick={() => navigator.clipboard?.writeText?.(f)}
                              className="text-xs font-bold text-slate-950 hover:text-cyan-700 transition-colors dark:text-dark-50 dark:hover:text-accent-cyan"
                            >
                              {f}
                            </button>
                            <CopyButton
                              textToCopy={f}
                              analytics={{ pageSlug: pageData.slug, category, keyword, source: 'favorites_drawer' }}
                              className="w-auto"
                            />
                            <button
                              type="button"
                              onClick={() => toggleFavorite(f)}
                              className="text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded-full border border-slate-200 text-slate-600 hover:text-red-700 hover:border-red-300 transition-colors dark:border-dark-700 dark:text-dark-300 dark:hover:text-red-200 dark:hover:border-red-400/40"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="bg-white/85 border border-slate-200/90 rounded-2xl p-4 shadow-sm dark:bg-dark-800 dark:border-dark-700">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="text-sm font-black tracking-widest uppercase text-slate-700 dark:text-dark-200">Recent picks</h3>
                      <button
                        type="button"
                        onClick={() => setRecentState((p) => ({ ...p, recentNames: [] }))}
                        className="px-3 py-2 rounded-full text-xs font-black tracking-widest uppercase bg-white/90 border border-slate-200 text-slate-700 hover:border-slate-300 transition-colors dark:bg-dark-900 dark:border-dark-700 dark:text-dark-200 dark:hover:border-dark-500"
                      >
                        Clear
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(recentState.recentNames || []).slice(0, 12).map((n) => (
                        <div
                          key={n}
                          className="bg-white/90 border border-slate-200 rounded-full px-3 py-2 flex items-center gap-2 shadow-sm dark:bg-dark-900 dark:border-dark-700"
                        >
                          <button
                            type="button"
                            onClick={() => navigator.clipboard?.writeText?.(n)}
                            className="text-xs font-bold text-slate-950 hover:text-cyan-700 transition-colors dark:text-dark-50 dark:hover:text-accent-cyan"
                          >
                            {n}
                          </button>
                          <CopyButton
                            textToCopy={n}
                            analytics={{ pageSlug: pageData.slug, category, keyword, source: 'recent_name' }}
                            className="w-auto"
                          />
                          <button
                            type="button"
                            onClick={() => toggleFavorite(n)}
                            className={`text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded-full border transition-colors ${
                              favorites.has(n)
                                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-yellow-500/15 dark:text-yellow-200 dark:border-yellow-500/40'
                                : 'border-slate-200 text-slate-600 hover:text-amber-700 hover:border-amber-300 dark:border-dark-700 dark:text-dark-300 dark:hover:text-yellow-200 dark:hover:border-yellow-500/40'
                            }`}
                          >
                            {favorites.has(n) ? 'Saved' : 'Save'}
                          </button>
                        </div>
                      ))}
                      {(recentState.recentNames || []).length === 0 && (
                        <p className={cn('text-sm', bodyClass)}>Use “More like this” to start building recents.</p>
                      )}
                    </div>

                    <div className={cn('mt-4 pt-4 border-t', dividerClass)}>
                      <p className={cn('text-xs font-black tracking-widest uppercase mb-2', subtleClass)}>Last settings</p>
                      <div className="flex flex-wrap gap-2">
                        {recentState.lastMode && (
                          <span className={cn('px-3 py-2 rounded-full text-[10px] font-black tracking-widest uppercase', chipClass)}>
                            Mode: {recentState.lastMode}
                          </span>
                        )}
                        <span className={cn('px-3 py-2 rounded-full text-[10px] font-black tracking-widest uppercase', chipClass)}>
                          Length: {lengthFilter}
                        </span>
                        {asciiOnly && (
                          <span className={cn('px-3 py-2 rounded-full text-[10px] font-black tracking-widest uppercase', chipClass)}>
                            ASCII
                          </span>
                        )}
                        {riotSafe && (
                          <span className={cn('px-3 py-2 rounded-full text-[10px] font-black tracking-widest uppercase', chipClass)}>
                            Riot-safe
                          </span>
                        )}
                        {streamSafe && (
                          <span className={cn('px-3 py-2 rounded-full text-[10px] font-black tracking-widest uppercase', chipClass)}>
                            Stream-safe
                          </span>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdSlot />
      <AnalyticsDebugPanel />
    </>
  );
};

export default SeoTemplate;
