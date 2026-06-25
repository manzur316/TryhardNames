import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Star, Copy, X } from 'lucide-react';
import { copyTextToClipboard } from '@/utils/clipboard.js';
import { trackEvent } from '@/utils/analytics.js';
import { INTERACTION_TIMING, useTransientKey } from '@/utils/interactionState.js';
import {
  readFavoritesArray,
  subscribeFavorites,
  removeFavoriteName,
} from '@/utils/localFavoritesBridge.js';

/**
 * Tiny global access to saved names: micro trigger + anchored peek (not a modal).
 */
const MinimalFavoritesPeek = () => {
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(() => readFavoritesArray());
  const { key: copiedName, trigger: flashCopiedName } = useTransientKey({ durationMs: INTERACTION_TIMING.feedbackMs });

  const refresh = useCallback(() => {
    setItems([...new Set(readFavoritesArray())]);
  }, []);

  useEffect(() => subscribeFavorites(refresh), [refresh]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (!rootRef.current || rootRef.current.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDoc, true);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDoc, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const count = items.length;
  const countLabel = useMemo(() => (count > 99 ? '99+' : String(count)), [count]);

  const toggleOpen = () => {
    setOpen((v) => {
      const next = !v;
      if (next) refresh();
      return next;
    });
  };

  const onCopy = async (name) => {
    const n = String(name || '').trim();
    if (!n) return;
    const res = await copyTextToClipboard(n, { preventRepeatMs: 320, vibrateMs: 10 });
    if (res.ok) {
      flashCopiedName(n);
      trackEvent('COPY_NAME', {
        pageSlug: typeof window !== 'undefined' ? window.location?.pathname || '/' : '/',
        source: 'minimal_favorites_peek',
        name: n,
      });
    }
  };

  const onRemove = (name) => {
    const n = String(name || '').trim();
    if (!n) return;
    trackEvent('REMOVE_FAVORITE', {
      pageSlug: typeof window !== 'undefined' ? window.location?.pathname || '/' : '/',
      name: n,
      source: 'minimal_favorites_peek',
    });
    removeFavoriteName(n);
  };

  return (
    <div
      ref={rootRef}
      className="fixed z-40 flex flex-col items-end gap-0"
      style={{
        bottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))',
        right: 'max(0.75rem, env(safe-area-inset-right, 0px))',
      }}
    >
      <div
        id="minimal-favorites-peek-panel"
        className={[
          'overflow-hidden rounded-2xl border border-border/50 bg-background/92 shadow-lg backdrop-blur-md transition-[opacity,transform,max-height] duration-200 ease-out',
          open ? 'pointer-events-auto mb-2 max-h-[min(40vh,280px)] w-[min(calc(100vw-1.5rem),16rem)] opacity-100 translate-y-0' : 'pointer-events-none mb-0 max-h-0 w-[min(calc(100vw-1.5rem),16rem)] opacity-0 translate-y-1',
        ].join(' ')}
        aria-hidden={!open}
      >
        <div className="max-h-[min(40vh,280px)] overflow-y-auto overscroll-contain px-2 py-2">
          {count === 0 ? (
            <p className="px-2 py-6 text-center text-[11px] leading-relaxed text-muted-foreground">
              Star names while browsing to keep them here.
            </p>
          ) : (
            <ul className="space-y-1">
              {items.map((name) => (
                <li
                  key={name}
                  className="group flex items-center gap-1 rounded-lg px-1 py-1 hover:bg-accent/40"
                >
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium tracking-tight text-foreground" title={name}>
                    {name}
                  </span>
                  <button
                    type="button"
                    onClick={() => onCopy(name)}
                    className={[
                      'shrink-0 rounded-md p-1.5 transition-colors hover:bg-background',
                      copiedName === name ? 'text-emerald-500' : 'text-muted-foreground hover:text-emerald-500',
                    ].join(' ')}
                    aria-label={`Copy ${name}`}
                  >
                    <Copy className="h-3.5 w-3.5" strokeWidth={2.25} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(name)}
                    className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-red-400"
                    aria-label={`Remove ${name}`}
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={2.25} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={toggleOpen}
        className={[
          'pointer-events-auto inline-flex h-9 items-center gap-1 rounded-full border px-2.5 text-xs font-semibold shadow-sm transition-[transform,box-shadow,background-color] duration-150 active:scale-[0.98]',
          open
            ? 'border-accent-purple/40 bg-accent/30 text-foreground shadow-accent-purple/10'
            : 'border-border/60 bg-background/85 text-muted-foreground hover:border-accent-purple/35 hover:text-foreground',
        ].join(' ')}
        aria-expanded={open}
        aria-controls="minimal-favorites-peek-panel"
        aria-label="Saved names"
      >
        <Star className={`h-3.5 w-3.5 ${count > 0 ? 'fill-amber-400/25 text-amber-400' : ''}`} strokeWidth={2.25} />
        <span className="tabular-nums text-[11px] text-foreground/90">{countLabel}</span>
      </button>
    </div>
  );
};

export default MinimalFavoritesPeek;
