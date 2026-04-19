
import { useEffect } from 'react';

const updateMetaTag = (name, content, attribute = 'name') => {
  if (!content) return;
  
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

export const useSEO = ({ title, description, image, url, type = 'website' }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
      updateMetaTag('og:title', title, 'property');
      updateMetaTag('twitter:title', title, 'name');
    }
    
    if (description) {
      updateMetaTag('description', description, 'name');
      updateMetaTag('og:description', description, 'property');
      updateMetaTag('twitter:description', description, 'name');
    }
    
    if (image) {
      updateMetaTag('og:image', image, 'property');
      updateMetaTag('twitter:image', image, 'name');
    }
    
    if (url) {
      updateMetaTag('og:url', url, 'property');
      updateMetaTag('twitter:url', url, 'name');
      
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);
    }
    
    if (type) {
      updateMetaTag('og:type', type, 'property');
    }
  }, [title, description, image, url, type]);
};
