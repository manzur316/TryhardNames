import { useState, useCallback, useRef } from 'react';
import { generateRandomNames, generateRandomName } from '../services/nameGeneratorService.js';

/**
 * Single source of truth: `generatedNames` + `error` are mutually exclusive for display
 * (error only when the latest generation returned zero names).
 * generationRef avoids stale setTimeout callbacks (Strict Mode / rapid clicks).
 */
export const useNameGenerator = (type, category) => {
  const [generatedNames, setGeneratedNames] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const generationRef = useRef(0);

  const generateNames = useCallback(
    (count = 10) => {
      const runId = ++generationRef.current;
      setIsGenerating(true);
      setError(null);

      const LATENCY_MS = 300;

      setTimeout(() => {
        if (runId !== generationRef.current) {
          return;
        }

        try {
          const names = generateRandomNames(type, category, count);
          if (!names || names.length === 0) {
            setGeneratedNames([]);
            setError('No names found for this category.');
          } else {
            setGeneratedNames(names);
            setError(null);
          }
        } catch (err) {
          setGeneratedNames([]);
            setError('Could not load names. Please try again.');
          console.error(err);
        } finally {
          if (runId === generationRef.current) {
            setIsGenerating(false);
          }
        }
      }, LATENCY_MS);
    },
    [type, category]
  );

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
