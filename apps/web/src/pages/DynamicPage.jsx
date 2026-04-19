
import React, { useMemo, useEffect } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import { getPageBySlug, isValidSlug } from '@/utils/pageLoader.js';
import SeoTemplate from '@/components/SeoTemplate.jsx';

const DynamicPage = () => {
  // 1. Call all hooks unconditionally at the top
  const { category, keyword } = useParams();
  const { pathname } = useLocation();
  
  // 2. Construct slug from category and keyword
  const slug = useMemo(() => {
    if (!category || !keyword) return null;
    return `${category}/${keyword}`;
  }, [category, keyword]);

  // 3. Get page data using the constructed slug
  const pageData = useMemo(() => {
    if (!slug || !isValidSlug(slug)) {
      return null;
    }
    return getPageBySlug(slug);
  }, [slug]);

  // 4. Scroll to top on route change
  useEffect(() => {
    if (pageData) {
      window.scrollTo(0, 0);
    }
  }, [pathname, pageData]);

  // 5. Slug validation (after all hooks)
  if (!slug || !isValidSlug(slug)) {
    return <Navigate to="/404" replace />;
  }

  // 6. Page data validation (after all hooks)
  if (!pageData) {
    return <Navigate to="/404" replace />;
  }

  // 7. Render component
  return <SeoTemplate pageData={pageData} />;
};

export default DynamicPage;
