import React, { useMemo, useEffect } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import SeoHead from '@/seo/SeoHead.jsx';
import { getTopicHubBySlug } from '../seo/programmatic/hubs.js';

/**
 * Topic intent hubs — aligned with sitewide slate / dark-950 grammar (Roblox & Home),
 * not a separate “SEO dark mode” dialect.
 */
const TopicHubPage = ({ hubSlug }) => {
  const { pathname } = useLocation();

  const hub = useMemo(() => getTopicHubBySlug(hubSlug), [hubSlug]);

  useEffect(() => {
    if (hub) window.scrollTo(0, 0);
  }, [pathname, hub]);

  if (!hub) return <Navigate to="/404" replace />;

  const canonicalPath = `/${hub.slug}`;

  return (
    <>
      <SeoHead
        title={hub.title}
        description={hub.description}
        path={canonicalPath}
        ogType="article"
        jsonLd={hub.jsonLd || []}
      />

      <div className="bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-dark-300 min-h-screen py-16 md:py-20 px-4 flex-grow flex flex-col transition-colors duration-300">
        <div className="container mx-auto max-w-5xl">
          <header className="text-center mb-12 md:mb-14 space-y-5">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-dark-50 tracking-tight text-balance">
              {hub.h1}
            </h1>
            <p className="text-base sm:text-lg max-w-3xl mx-auto leading-relaxed text-slate-600 dark:text-dark-400">
              {hub.description}
            </p>
          </header>

          <div className="space-y-8 md:space-y-10 mb-14 md:mb-16">
            {hub.sections.map((sec, i) => (
              <section
                key={i}
                className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-2xl p-6 md:p-10 hover:border-slate-300 dark:hover:border-dark-600 transition-colors shadow-refined"
              >
                <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-dark-50 mb-4 md:mb-6">
                  {sec.title}
                </h2>
                {Array.isArray(sec.content) ? (
                  <ul className="space-y-3 list-disc pl-5 text-slate-700 dark:text-dark-300 leading-relaxed">
                    {sec.content.map((p, j) => (
                      <li key={j}>{p}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-700 dark:text-dark-300 leading-relaxed">{sec.content}</p>
                )}
              </section>
            ))}
          </div>

          {hub.linkBlocks && hub.linkBlocks.length > 0 && (
            <div className="border-t border-slate-200 dark:border-dark-700 pt-12 md:pt-16">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-dark-50 mb-8 text-center">
                Explore more
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
                {hub.linkBlocks.map((block, i) => (
                  <section
                    key={i}
                    className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-2xl p-6 md:p-7 hover:border-slate-300 dark:hover:border-dark-600 transition-colors shadow-refined"
                    aria-label={block.title}
                  >
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-50 mb-4">{block.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {block.links.map((l) => (
                        <Link
                          key={l.slug}
                          to={`/${l.slug}`}
                          className="bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 px-4 py-2.5 rounded-full text-slate-800 dark:text-dark-100 text-sm font-medium hover:border-slate-300 dark:hover:border-dark-600 transition-colors"
                        >
                          {l.title}
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          )}

          {hub.faqs && hub.faqs.length > 0 && (
            <div className="border-t border-slate-200 dark:border-dark-700 pt-12 md:pt-16">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-dark-50 mb-8 text-center">
                Frequently asked questions
              </h2>
              <div className="space-y-3 max-w-4xl mx-auto">
                {hub.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-xl p-5 md:p-6 hover:border-slate-300 dark:hover:border-dark-600 transition-colors"
                  >
                    <summary className="cursor-pointer select-none font-semibold text-slate-900 dark:text-dark-50 text-base md:text-lg">
                      {faq.question}
                    </summary>
                    <div className="mt-3 text-slate-700 dark:text-dark-300 leading-relaxed">{faq.answer}</div>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TopicHubPage;
