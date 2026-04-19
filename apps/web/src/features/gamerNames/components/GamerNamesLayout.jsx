import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const GamerNamesLayout = ({ children, title, description }) => {
  const location = useLocation();
  
  const navLinks = [
    { path: '/gamer-names', label: 'All Names', isParent: true },
    { path: '/gamer-names/cool', label: 'Cool', isParent: false },
    { path: '/gamer-names/funny', label: 'Funny', isParent: false },
    { path: '/gamer-names/pro', label: 'Pro', isParent: false },
    { path: '/gamer-names/edgy', label: 'Edgy', isParent: false },
  ];
  
  return (
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-dark-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-sm text-slate-500 dark:text-dark-400 mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
          <span className="text-slate-900 dark:text-dark-50 font-medium" aria-current="page">Gamer Names</span>
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
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' 
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50'
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
          <p>&copy; {new Date().getFullYear()} TryhardNames. All rights reserved. Level up your gaming identity.</p>
        </footer>
      </main>
    </div>
  );
};