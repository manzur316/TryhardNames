import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { performanceConfig } from '../config/performanceConfig.js';

/**
 * A wrapper component that triggers a callback when the user scrolls near the bottom.
 * Useful for implementing infinite scrolling lists.
 */
export const InfiniteScroll = ({ 
  children, 
  onLoadMore, 
  hasMore, 
  isLoading, 
  threshold = performanceConfig.lazyLoadThreshold 
}) => {
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { 
        threshold, 
        rootMargin: performanceConfig.lazyLoadRootMargin 
      }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, onLoadMore, threshold]);

  return (
    <div className="flex flex-col w-full">
      {children}
      
      {/* Intersection Observer Target */}
      <div 
        ref={observerTarget} 
        className="w-full h-16 flex items-center justify-center py-4 mt-4"
      >
        {isLoading && (
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        )}
        {!hasMore && !isLoading && children && (
          <span className="text-sm text-muted-foreground">No more items to load</span>
        )}
      </div>
    </div>
  );
};