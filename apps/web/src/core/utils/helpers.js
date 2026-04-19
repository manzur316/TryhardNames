/**
 * Combines multiple class names into a single string.
 * Filters out falsy values.
 * 
 * @param {...any} classes - Class names to combine
 * @returns {string} Combined class names
 */
export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};