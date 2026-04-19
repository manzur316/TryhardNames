import { useState, useEffect, useCallback } from 'react';
import { useData } from '@/core/hooks/useData.js';
import { useLazyFetch } from '@/core/hooks/useLazyFetch.js';
import { useDebouncedSearch } from '@/core/hooks/useDebouncedSearch.js';
import { dataService } from '@/core/api/dataService.js';
import { generateSymbols as generateSymbolsUtil } from '../utils/symbolGenerator.js';

// 1. Add FALLBACK_SYMBOLS constant with default symbol sets
const FALLBACK_SYMBOLS_DATA = [
  { id: 'default', name: 'Default', category: 'All', description: 'Standard popular symbols', symbols: ['★', '☆', '✦', '✧', '✪', '✫', '✬', '✭'] },
  { id: 'arrows', name: 'Arrows', category: 'Arrows', description: 'Directional and decorative arrows', symbols: ['←', '↑', '→', '↓', '↔', '↕', '↖', '↗', '↘', '↙', '↚', '↛'] },
  { id: 'math', name: 'Math', category: 'Math', description: 'Mathematical operators and shapes', symbols: ['±', '×', '÷', '≈', '≠', '∑', '∞', 'µ', '∫', '∆', '∏', '√'] },
  { id: 'special', name: 'Special', category: 'Special', description: 'Special characters and punctuation', symbols: ['©', '®', '™', '℠', '§', '¶', '†', '‡', '•', '‣'] }
];

const FALLBACK_SYMBOLS = {
  success: true,
  data: FALLBACK_SYMBOLS_DATA,
  pagination: { page: 1, limit: 50, total: 4, pages: 1, hasMore: false }
};

export const useNicknameSymbols = () => {
  const { nicknames } = useData();
  const [inputNickname, setInputNickname] = useState('');
  const [selectedSymbolSet, setSelectedSymbolSet] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [savedNicknames, setSavedNicknames] = useState([]);
  const [isLoadingNicknames, setIsLoadingNicknames] = useState(false);
  const limit = 50;

  const { 
    query: searchQuery, 
    handleSearch, 
    clearSearch 
  } = useDebouncedSearch(async (q) => {
    setCurrentPage(1);
    return q;
  }, 300);

  // 3. Add error handling in useLazyFetch with fallbackData option
  const { 
    data: symbolsData, 
    isLoading: isLoadingSymbols, 
    error: symbolsError, 
    fetch: fetchSymbols,
    isFallback: isUsingFallback
  } = useLazyFetch(
    (page, l, cat, search) => dataService.getSymbols(page, l, cat, search),
    { 
      useHybridCache: true, 
      cacheKey: `symbols-${currentPage}-${limit}-${selectedSymbolSet}-${searchQuery}`,
      fallbackData: FALLBACK_SYMBOLS
    }
  );

  useEffect(() => {
    const loadSavedNicknames = async () => {
      setIsLoadingNicknames(true);
      try {
        const data = await nicknames.getAll();
        setSavedNicknames(data || []);
      } finally {
        setIsLoadingNicknames(false);
      }
    };
    
    loadSavedNicknames();
  }, [nicknames]);

  useEffect(() => {
    fetchSymbols(currentPage, limit, selectedSymbolSet, searchQuery);
  }, [currentPage, limit, selectedSymbolSet, searchQuery, fetchSymbols]);

  const handleNextPage = useCallback(() => {
    if (symbolsData?.pagination?.hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [symbolsData]);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  }, []);

  const generateSymbols = (nickname, symbolSet) => {
    return generateSymbolsUtil(nickname, symbolSet);
  };

  const saveNickname = async (nickname, symbols) => {
    if (!nickname || nickname.trim() === '') return;
    const newItem = await nicknames.save({ nickname, symbols });
    if (newItem) {
      const updatedData = await nicknames.getAll();
      setSavedNicknames(updatedData);
    }
  };

  const deleteNickname = async (id) => {
    const success = await nicknames.delete(id);
    if (success) {
      setSavedNicknames(prev => prev.filter(item => item.id !== id));
    }
  };

  const updateNickname = async (id, updates) => {
    const success = await nicknames.update(id, updates);
    if (success) {
      const updatedData = await nicknames.getAll();
      setSavedNicknames(updatedData);
    }
  };

  // 2 & 5. Ensure symbolsData?.data always defaults to FALLBACK_SYMBOLS and returns an array guaranteed
  const symbolSets = Array.isArray(symbolsData?.data) ? symbolsData.data : FALLBACK_SYMBOLS_DATA;
  
  // 4. Ensure pagination object has default values
  const pagination = symbolsData?.pagination || { 
    page: 1, 
    limit: 50, 
    total: symbolSets.length, 
    pages: 1, 
    hasMore: false 
  };

  return { 
    inputNickname, 
    setInputNickname, 
    selectedSymbolSet, 
    setSelectedSymbolSet, 
    savedNicknames, 
    isLoadingNicknames,
    symbolSets,
    pagination,
    currentPage,
    searchQuery,
    isUsingFallback,
    handleSearch,
    clearSearch,
    handleNextPage,
    handlePreviousPage,
    isLoadingSymbols,
    symbolsError,
    generateSymbols, 
    saveNickname, 
    deleteNickname,
    updateNickname
  };
};