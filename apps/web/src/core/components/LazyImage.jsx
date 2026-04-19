import React, { useState, useEffect, useRef } from 'react';
import { performanceConfig } from '../config/performanceConfig.js';

/**
 * A component that lazy loads an image using IntersectionObserver.
 * The image is only fetched when it enters the viewport.
 */
export const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = null 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: performanceConfig.lazyLoadThreshold,
        rootMargin: performanceConfig.lazyLoadRootMargin
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {!isLoaded && placeholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          {placeholder}
        </div>
      )}
      
      {isVisible && (
        <img
          src={src}
          alt={alt || ''}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
};