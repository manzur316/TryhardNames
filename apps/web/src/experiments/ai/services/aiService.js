import { apiClient } from '@/core/api/index.js';

export const aiService = {
  generateText: async (prompt) => {
    try {
      // Mocking AI response for now or calling an endpoint
      const response = await apiClient.post('/ai/generate', { prompt });
      return response?.text || `Generated response for: ${prompt}`;
    } catch (error) {
      console.warn('AI generation failed', error);
      return null;
    }
  }
};