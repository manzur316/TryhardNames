/**
 * Transforms and normalizes stylish text data.
 * @param {Object} data 
 * @returns {Object} Normalized data
 */
export const transformName = (data) => {
  return {
    id: data.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
    text: data.text.trim(),
    style: data.style.trim(),
    timestamp: data.timestamp || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
    ...data
  };
};

/**
 * Transforms and normalizes nickname symbols data.
 * @param {Object} data 
 * @returns {Object} Normalized data
 */
export const transformNickname = (data) => {
  return {
    id: data.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
    nickname: data.nickname.trim(),
    symbols: data.symbols.trim(),
    timestamp: data.timestamp || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
    ...data
  };
};

/**
 * Transforms and normalizes analytics event data.
 * @param {Object} data 
 * @returns {Object} Normalized data
 */
export const transformAnalyticsEvent = (data) => {
  return {
    id: data.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
    type: data.type,
    payload: data.payload || {},
    timestamp: data.timestamp || new Date().toISOString(),
    ...data
  };
};

/**
 * Applies a transformer function to an array of items.
 * @param {Array} items 
 * @param {Function} transformer 
 * @returns {Array} Transformed array
 */
export const transformArray = (items, transformer) => {
  if (!Array.isArray(items)) return [];
  return items.map(item => transformer(item));
};