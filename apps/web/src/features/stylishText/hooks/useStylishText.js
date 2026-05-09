import { useState, useEffect, useCallback, useMemo } from 'react';
import { useData } from '@/core/hooks/useData.js';
import { getAllStyles } from '@/utils/textStyleConverter.js';
import { validateTransform } from '../utils/textStyleConverter.js';

/** Client-side catalog (single source of truth with `textStyles` transforms). Avoids API ids that never matched real transforms. */
export const STYLISH_TEXT_FALLBACK_STYLE_LIST = getAllStyles().slice(0, 12).map(({ id, name, category }) => ({ id, name, category }));

export const useStylishText = () => {
  const { names } = useData();
  const [inputText, setInputText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [savedTexts, setSavedTexts] = useState([]);
  const [isLoadingTexts, setIsLoadingTexts] = useState(false);

  /** Full local catalog — page filters by category/search for instant UX. */
  const styles = useMemo(() => getAllStyles(), []);

  const pagination = useMemo(
    () => ({
      page: 1,
      limit: styles.length,
      total: styles.length,
      pages: 1,
      hasMore: false
    }),
    [styles.length]
  );

  useEffect(() => {
    const loadSavedTexts = async () => {
      setIsLoadingTexts(true);
      try {
        const data = await names.getAll();
        setSavedTexts(data || []);
      } finally {
        setIsLoadingTexts(false);
      }
    };

    loadSavedTexts();
  }, [names]);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const generateStylishText = (text, styleTransform) => {
    return validateTransform(text, styleTransform);
  };

  const saveText = async (text, style) => {
    if (!text || text.trim() === '') return;
    const newItem = await names.save({ text, style });
    if (newItem) {
      const updatedData = await names.getAll();
      setSavedTexts(updatedData);
    }
  };

  const deleteText = async (id) => {
    const success = await names.delete(id);
    if (success) {
      setSavedTexts(prev => prev.filter(item => item.id !== id));
    }
  };

  const updateText = async (id, updates) => {
    const success = await names.update(id, updates);
    if (success) {
      const updatedData = await names.getAll();
      setSavedTexts(updatedData);
    }
  };

  return {
    inputText,
    setInputText,
    selectedStyle,
    setSelectedStyle,
    savedTexts,
    isLoadingTexts,
    styles,
    pagination,
    currentPage,
    searchQuery: '',
    isUsingFallback: false,
    handleSearch: () => {},
    clearSearch: () => {},
    handleNextPage,
    handlePreviousPage,
    isLoadingStyles: false,
    stylesError: null,
    generateStylishText,
    saveText,
    deleteText,
    updateText
  };
};