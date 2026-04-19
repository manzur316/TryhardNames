import { useState, useEffect, useCallback } from 'react';
import { useData } from '@/core/hooks/useData.js';
import { useLazyFetch } from '@/core/hooks/useLazyFetch.js';
import { useDebouncedSearch } from '@/core/hooks/useDebouncedSearch.js';
import { dataService } from '@/core/api/dataService.js';
import { validateTransform } from '../utils/textStyleConverter.js';

const FALLBACK_STYLES = {
  success: true,
  data: [
    { id: 'bold', name: 'Bold', category: 'All' },
    { id: 'italic', name: 'Italic', category: 'All' },
    { id: 'monospace', name: 'Monospace', category: 'All' },
    { id: 'script', name: 'Script', category: 'All' }
  ],
  pagination: { page: 1, limit: 50, total: 4, pages: 1, hasMore: false }
};

export const useStylishText = () => {
  const { names } = useData();
  const [inputText, setInputText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [savedTexts, setSavedTexts] = useState([]);
  const [isLoadingTexts, setIsLoadingTexts] = useState(false);
  const limit = 50;

  const { 
    query: searchQuery, 
    handleSearch, 
    clearSearch 
  } = useDebouncedSearch(async (q) => {
    setCurrentPage(1);
    return q;
  }, 300);

  const { 
    data: stylesData, 
    isLoading: isLoadingStyles, 
    error: stylesError, 
    fetch: fetchStyles,
    isFallback: isUsingFallback
  } = useLazyFetch(
    (page, l, cat, search) => dataService.getStyles(page, l, cat, search),
    { 
      useHybridCache: true, 
      cacheKey: `styles-${currentPage}-${limit}-${selectedStyle}-${searchQuery}`,
      fallbackData: FALLBACK_STYLES
    }
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

  useEffect(() => {
    fetchStyles(currentPage, limit, selectedStyle, searchQuery);
  }, [currentPage, limit, selectedStyle, searchQuery, fetchStyles]);

  const handleNextPage = useCallback(() => {
    if (stylesData?.pagination?.hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [stylesData]);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
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
    styles: stylesData?.data || [],
    pagination: stylesData?.pagination || null,
    currentPage,
    searchQuery,
    isUsingFallback,
    handleSearch,
    clearSearch,
    handleNextPage,
    handlePreviousPage,
    isLoadingStyles,
    stylesError,
    generateStylishText, 
    saveText, 
    deleteText,
    updateText
  };
};