/**
 * Validates a generic ID.
 * @param {string|number} id 
 * @throws {Error} If invalid
 */
export const validateId = (id) => {
  if (id === undefined || id === null || id === '') {
    throw new Error('ID is required and cannot be empty');
  }
  return true;
};

/**
 * Validates stylish text data.
 * @param {Object} data 
 * @throws {Error} If invalid
 */
export const validateName = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Name data must be an object');
  }
  if (!data.text || typeof data.text !== 'string') {
    throw new Error('Name data must include a valid "text" string');
  }
  if (!data.style || typeof data.style !== 'string') {
    throw new Error('Name data must include a valid "style" string');
  }
  return true;
};

/**
 * Validates nickname symbols data.
 * @param {Object} data 
 * @throws {Error} If invalid
 */
export const validateNickname = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Nickname data must be an object');
  }
  if (!data.nickname || typeof data.nickname !== 'string') {
    throw new Error('Nickname data must include a valid "nickname" string');
  }
  if (!data.symbols || typeof data.symbols !== 'string') {
    throw new Error('Nickname data must include a valid "symbols" string');
  }
  return true;
};

/**
 * Validates analytics event data.
 * @param {Object} data 
 * @throws {Error} If invalid
 */
export const validateAnalyticsEvent = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Analytics event data must be an object');
  }
  if (!data.type || typeof data.type !== 'string') {
    throw new Error('Analytics event must include a valid "type" string');
  }
  return true;
};