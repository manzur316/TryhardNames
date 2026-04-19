import { useState, useMemo, useCallback } from 'react';
import { performanceConfig } from '../config/performanceConfig.js';

/**
 * Hook for virtualizing large lists to improve rendering performance.
 * Only renders items that are currently visible in the viewport plus a buffer.
 * 
 * @param {Array} items - The full array of items to render
 * @param {number} itemHeight - Fixed height of each item in pixels
 * @param {number} containerHeight - Height of the scrollable container in pixels
 * @returns {Object} Virtualization state and handlers
 */
export const useVirtualizedList = (
  items = [], 
  itemHeight = performanceConfig.virtualListItemHeight, 
  containerHeight = 400
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  const { visibleItems, visibleRange, totalHeight, offsetY } = useMemo(() => {
    const totalHeight = items.length * itemHeight;
    
    // Calculate start and end indices based on scroll position
    const startIndex = Math.max(
      0, 
      Math.floor(scrollTop / itemHeight) - performanceConfig.virtualListBufferSize
    );
    
    const endIndex = Math.min(
      items.length - 1, 
      Math.ceil((scrollTop + containerHeight) / itemHeight) + performanceConfig.virtualListBufferSize
    );

    const visibleItems = items.slice(startIndex, endIndex + 1);
    const offsetY = startIndex * itemHeight;

    return {
      visibleItems,
      visibleRange: { start: startIndex, end: endIndex },
      totalHeight,
      offsetY
    };
  }, [items, itemHeight, containerHeight, scrollTop]);

  return { 
    visibleItems, 
    visibleRange, 
    handleScroll, 
    totalHeight, 
    offsetY 
  };
};