import { useState, useCallback } from 'react';
import { generateRandomNames, generateRandomName } from '../services/nameGeneratorService.js';

export const useNameGenerator = (type, category) => {
  const [generatedNames, setGeneratedNames] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateNames = useCallback((count = 10) => {
    setIsGenerating(true);
    setError(null);

    // Artificial delay for better UX
    setTimeout(() => {
      try {
        const names = generateRandomNames(type, category, count);
        if (names.length === 0) {
          setError('No names found for this category.');
        } else {
          setGeneratedNames(names);
        }
      } catch (err) {
        setError('Failed to generate names. Please try again.');
        console.error(err);
      } finally {
        setIsGenerating(false);
      }
    }, 300);
  }, [type, category]);

  const generateSingleName = useCallback(() => {
    return generateRandomName(type, category);
  }, [type, category]);

  const clearNames = useCallback(() => {
    setGeneratedNames([]);
    setError(null);
  }, []);

  return {
    generatedNames,
    isGenerating,
    error,
    generateNames,
    generateSingleName,
    clearNames
  };
};