import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import SeoHead from '@/seo/SeoHead.jsx';

const NotFoundPage = () => {
  return (
    <>
    <SeoHead
      title="Page not found – TryhardNames"
      description="The page you requested is not available. Return home to browse generators for gamer names, Unicode text and nickname symbols."
      path="/"
      noIndex
      skipCanonical
    />
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-black text-primary mb-4">404</h1>
      <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved to a new URL.
      </p>
      <Link 
        to="/" 
        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
      >
        <Home className="w-5 h-5 mr-2" />
        Back to Home
      </Link>
    </div>
    </>
  );
};

export default NotFoundPage;