/**
 * Creates a debounced function that delays invoking the provided function until after delayMs have elapsed
 * since the last time the debounced function was invoked.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} delayMs - The number of milliseconds to delay
 * @returns {Function} - The new debounced function
 */
export function debounce(func, delayMs) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delayMs);
  };
}

/**
 * Creates a throttled function that only invokes the provided function at most once per every delayMs.
 * 
 * @param {Function} func - The function to throttle
 * @param {number} delayMs - The number of milliseconds to throttle invocations to
 * @returns {Function} - The new throttled function
 */
export function throttle(func, delayMs) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delayMs) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}