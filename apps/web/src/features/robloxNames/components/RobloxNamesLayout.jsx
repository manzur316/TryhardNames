import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import SeoHead from '@/seo/SeoHead.jsx';
import { faqPageSchema } from '@/seo/schema.js';
import { robloxHubBreadcrumbJsonLd } from '@/seo/layoutBreadcrumbs.js';

const CHILD_LABEL = {
  cool: 'Cool',
  funny: 'Funny',
  aesthetic: 'Aesthetic',
  tryhard: 'Tryhard',
};

/** @param {{ q: string, a: string }[]} faqs */
function faqSchemaFromQA(faqs) {
  if (!faqs?.length) return null;
  return faqPageSchema(faqs.map((f) => ({ question: f.q, answer: f.a })));
}

export const RobloxNamesLayout = ({
  children,
  title,
  description,
  seoTitle,
  seoDescription,
  faqs,
}) => {
  const location = useLocation();
  const pathname = location.pathname;
  const isHub = pathname === '/roblox-names';
  const childKey = pathname.startsWith('/roblox-names/') ? pathname.replace('/roblox-names/', '') : '';
  const jsonLd = [
    robloxHubBreadcrumbJsonLd(pathname),
    faqSchemaFromQA(faqs),
  ].filter(Boolean);

  const pageTitle = seoTitle || `${title} | TryhardNames`;
  const pageDesc = seoDescription || description || '';

  const navLinks = [
    { path: '/roblox-names', label: 'All Names', isParent: true },
    { path: '/roblox-names/cool', label: 'Cool', isParent: false },
    { path: '/roblox-names/funny', label: 'Funny', isParent: false },
    { path: '/roblox-names/aesthetic', label: 'Aesthetic', isParent: false },
    { path: '/roblox-names/tryhard', label: 'Tryhard', isParent: false },
  ];
  
  return (
    <>
      <SeoHead title={pageTitle} description={pageDesc} path={pathname} jsonLd={jsonLd} />
      <div className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-dark-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-sm text-slate-500 dark:text-dark-400 mb-8 flex-wrap" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 opacity-50 flex-shrink-0" />
          {!isHub ? (
            <>
              <Link to="/roblox-names" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Roblox Names</Link>
              <ChevronRight className="w-4 h-4 mx-2 opacity-50 flex-shrink-0" />
              <span className="text-slate-900 dark:text-dark-50 font-medium" aria-current="page">
                {CHILD_LABEL[childKey] || childKey}
              </span>
            </>
          ) : (
            <span className="text-slate-900 dark:text-dark-50 font-medium" aria-current="page">Roblox Names</span>
          )}
        </nav>

        {/* Page Header */}
        <header className="text-center mb-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-balance" style={{ letterSpacing: '-0.02em' }}>
            {title}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-slate-600 dark:text-dark-300 max-w-2xl mx-auto text-balance leading-relaxed">
              {description}
            </p>
          )}
        </header>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            if (link.isParent) {
              return (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            }
            return (
              <Link 
                key={link.path}
                to={link.path}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 shadow-sm' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:bg-dark-900 dark:text-dark-400 dark:border-dark-700 dark:hover:border-dark-600 dark:hover:bg-dark-800/50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Main Content Area */}
        <article className="space-y-24">
          {children}
        </article>

        {/* Section Footer */}
        <footer className="mt-24 pt-8 border-t border-slate-200 dark:border-dark-800 text-center text-sm text-slate-500 dark:text-dark-400">
          <p>&copy; {new Date().getFullYear()} TryhardNames. All rights reserved. Not affiliated with or endorsed by Roblox Corporation.</p>
        </footer>
      </main>
    </div>
    </>
  );
};