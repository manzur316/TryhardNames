import { useState } from 'react';
import { aiService } from '../services/aiService.js';

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateText = async (prompt) => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.generateText(prompt);
      return result;
    } catch (err) {
      console.warn('useAI error:', err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generateText, loading, error };
};