
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ChevronRight, Home } from 'lucide-react';
import { breadcrumbListSchema } from '@/seo/schema.js';
import { getBreadcrumbTrail } from '@/core/utils/breadcrumbTrail.js';

/**
 * Single contextual breadcrumb trail for the whole app (visual + BreadcrumbList JSON-LD).
 * Layouts and tool pages must not render a second trail.
 */
export function Breadcrumbs() {
  const location = useLocation();
  const trail = getBreadcrumbTrail(location.pathname);

  if (!trail?.navItems?.length) {
    return null;
  }

  const jsonLd = breadcrumbListSchema(trail.schemaItems);

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <nav
        className="container mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2 border-b border-slate-200/70 dark:border-dark-800/80 bg-slate-50/80 dark:bg-dark-950/80 backdrop-blur-sm"
        aria-label="Breadcrumb"
      >
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <li className="flex items-center min-w-0">
            <Link
              to="/"
              className="flex items-center shrink-0 hover:text-foreground transition-colors"
              aria-label="Home"
            >
              <Home className="w-4 h-4 mr-1 opacity-80" />
              <span>Home</span>
            </Link>
          </li>
          {trail.navItems.map((item, index) => (
            <React.Fragment key={`${item.path}-${index}`}>
              <li aria-hidden className="flex items-center">
                <ChevronRight className="w-4 h-4 text-muted-foreground/45 shrink-0" />
              </li>
              <li className="min-w-0">
                {item.isLast ? (
                  <span className="text-foreground font-medium truncate max-w-[min(100%,56vw)] sm:max-w-none">
                    {item.name}
                  </span>
                ) : (
                  <Link to={item.path} className="hover:text-foreground transition-colors truncate block max-w-[min(100%,48vw)] sm:max-w-none">
                    {item.name}
                  </Link>
                )}
              </li>
            </React.Fragment>
          ))}
        </ol>
      </nav>
    </>
  );
}

export default Breadcrumbs;
