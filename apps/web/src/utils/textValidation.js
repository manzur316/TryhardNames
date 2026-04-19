/**
 * Validates and safely executes a text transformation function.
 * 
 * @param {Function} transformFn - The transformation function to execute
 * @param {string} text - The input text to transform
 * @returns {Object} Result object containing success status, transformed text, warnings, and errors
 */
export const validateTransform = (transformFn, text) => {
  if (!text || text.trim() === '') {
    return { 
      success: true, 
      text: '', 
      hasWarning: false, 
      error: null 
    };
  }

  try {
    const result = transformFn(text);
    
    if (!result || result.trim() === '') {
      return { 
        success: false, 
        text: '', 
        hasWarning: true, 
        error: 'Transformation resulted in empty text' 
      };
    }

    // Check for replacement characters which indicate unsupported unicode mapping
    if (result.includes('\uFFFD') || result.includes('?')) {
      return { 
        success: true, 
        text: result, 
        hasWarning: true, 
        error: 'Result contains unsupported characters' 
      };
    }

    return { 
      success: true, 
      text: result, 
      hasWarning: false, 
      error: null 
    };
  } catch (err) {
    return { 
      success: false, 
      text: '', 
      hasWarning: false, 
      error: err.message || 'An error occurred during transformation' 
    };
  }
};