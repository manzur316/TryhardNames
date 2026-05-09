import { useState, useEffect, useMemo, useCallback } from 'react';
import { useData } from '@/core/hooks/useData.js';
import { filterGlyphs, buildComboRows, SYMBOL_CATEGORIES } from '../utils/symbolCatalog.js';

/**
 * Local-first nickname symbols — catalog ships with the bundle (no symbol API round-trip).
 */
export const useNicknameSymbols = () => {
  const { nicknames } = useData();
  const [previewTag, setPreviewTag] = useState('Shadow');
  const [activeCategory, setActiveCategory] = useState('All');
  const [savedNicknames, setSavedNicknames] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await nicknames.getAll();
        if (!cancelled) setSavedNicknames(data || []);
      } catch {
        if (!cancelled) setSavedNicknames([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nicknames]);

  const glyphs = useMemo(() => filterGlyphs(activeCategory), [activeCategory]);

  const combos = useMemo(() => buildComboRows(previewTag), [previewTag]);

  const deleteNickname = useCallback(
    async (id) => {
      const ok = await nicknames.delete(id);
      if (ok) setSavedNicknames((prev) => prev.filter((x) => x.id !== id));
    },
    [nicknames]
  );

  const recordCopy = useCallback(
    async (text) => {
      if (!text?.trim()) return;
      await nicknames.save({ nickname: text, symbols: 'clipboard' });
      const data = await nicknames.getAll();
      setSavedNicknames(data || []);
    },
    [nicknames]
  );

  return {
    previewTag,
    setPreviewTag,
    activeCategory,
    setActiveCategory,
    symbolCategories: SYMBOL_CATEGORIES,
    glyphs,
    combos,
    savedNicknames,
    deleteNickname,
    recordCopy
  };
};
