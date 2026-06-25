import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SeoHead from '@/seo/SeoHead.jsx';
import { faqPageSchema } from '@/seo/schema.js';

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
  const jsonLd = [faqSchemaFromQA(faqs)].filter(Boolean);

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
      <div className="th-feature-generator-shell min-h-screen transition-colors duration-300 text-slate-900 dark:text-dark-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 sm:pt-6">
        <div className="relative mb-7 md:mb-9 overflow-hidden rounded-[2rem] border border-slate-200/95 dark:border-dark-700/90 bg-gradient-to-b from-white via-slate-50 to-slate-100/90 dark:from-dark-900 dark:via-dark-950 dark:to-[#07080c] px-5 py-7 sm:px-8 sm:py-9 md:py-10 shadow-[0_28px_70px_-38px_rgba(15,23,42,0.35)] dark:shadow-[0_32px_80px_-36px_rgba(0,0,0,0.75)] ring-1 ring-slate-900/[0.05] dark:ring-white/[0.06]">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_-25%,rgba(59,130,246,0.11),transparent_58%)] dark:bg-[radial-gradient(ellipse_72%_52%_at_50%_-22%,rgba(96,165,250,0.12),transparent_58%)]"
            aria-hidden
          />
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/25 to-transparent dark:via-blue-400/20" aria-hidden />

          <header className="relative text-center max-w-4xl mx-auto">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.32em] text-blue-700/90 dark:text-blue-400/95 mb-4">
              Roblox identity hub
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] font-black tracking-[-0.035em] leading-[1.08] mb-4 text-balance text-slate-950 dark:text-dark-50">
              {title}
            </h1>
            {description && (
              <p className="text-lg md:text-xl text-slate-600 dark:text-dark-300 max-w-2xl mx-auto text-balance leading-relaxed font-medium">
                {description}
              </p>
            )}
          </header>

          <div className="relative flex flex-wrap justify-center gap-3 mt-7 pt-2">
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
        </div>

        {/* Main Content Area */}
        <article className="space-y-20">
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
