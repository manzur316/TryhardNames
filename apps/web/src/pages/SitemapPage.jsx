import React, { useEffect } from 'react';
import { generateSitemap } from '@/utils/sitemapGenerator.js';

const SitemapPage = () => {
  useEffect(() => {
    document.title = 'sitemap.xml';
  }, []);

  return (
    <pre className="bg-dark-950 text-dark-300 p-8 text-sm font-mono overflow-x-auto min-h-screen">
      {generateSitemap()}
    </pre>
  );
};

export default SitemapPage;