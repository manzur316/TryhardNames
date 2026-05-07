
import React from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '@/seo/SeoHead.jsx';
import CopyButton from '@/components/CopyButton.jsx';

const SeoTemplate = ({ pageData }) => {
  const path = `/${pageData.slug}`;

  // Split H1 to make the last word a gradient
  const h1Words = pageData.h1.split(' ');
  const lastWord = h1Words.pop();
  const restH1 = h1Words.join(' ');

  return (
    <>
      <SeoHead
        title={pageData.title}
        description={pageData.description}
        path={path}
        ogType="article"
        jsonLd={pageData.jsonLd || []}
      />

      <div className="bg-gradient-dark text-dark-300 min-h-screen py-20 px-4 flex-grow flex flex-col">
        <div className="container mx-auto max-w-5xl">
          
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-6">
            <h1 className="text-4xl md:text-6xl font-black text-dark-50 tracking-tight">
              {restH1} <span className="text-transparent bg-clip-text bg-gradient-cyan-purple">{lastWord}</span>
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              {pageData.description}
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-12 mb-16">
            {pageData.sections.map((sec, i) => (
              <section 
                key={i} 
                className="bg-dark-800 border border-dark-700 rounded-2xl p-8 md:p-10 hover:border-accent-cyan/50 transition-colors duration-300 shadow-refined"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-dark-50 mb-6">{sec.title}</h2>
                {Array.isArray(sec.content) ? (
                  <ul className="space-y-4 list-disc pl-6">
                    {sec.content.map((p, j) => (
                      <li key={j} className="text-lg leading-relaxed">{p}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-lg leading-relaxed">{sec.content}</p>
                )}
              </section>
            ))}
          </div>

          {/* Names Grid */}
          {pageData.names && pageData.names.length > 0 && (
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-dark-50 mb-8 text-center">Top {pageData.h1}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {pageData.names.map((name, i) => (
                  <div 
                    key={i} 
                    className="bg-dark-900 border border-dark-700 rounded-xl p-4 flex justify-between items-center group hover:border-accent-purple/50 transition-colors duration-300"
                  >
                    <span className="font-medium text-dark-50 group-hover:text-accent-cyan transition-colors">{name}</span>
                    <CopyButton textToCopy={name} className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Pages */}
          {(pageData.linkBlocks && pageData.linkBlocks.length > 0) || (pageData.related && pageData.related.length > 0) ? (
            <div className="border-t border-dark-700 pt-16">
              <h2 className="text-3xl font-bold text-dark-50 mb-10 text-center">Explore More</h2>

              {pageData.linkBlocks && pageData.linkBlocks.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                  {pageData.linkBlocks.map((block, i) => (
                    <section
                      key={i}
                      className="bg-dark-800 border border-dark-700 rounded-2xl p-6 md:p-7 hover:border-accent-cyan/40 transition-colors shadow-refined"
                      aria-label={block.title}
                    >
                      <h3 className="text-xl font-bold text-dark-50 mb-4">{block.title}</h3>
                      <div className="flex flex-wrap gap-3">
                        {block.links.map((l) => (
                          <Link
                            key={l.slug}
                            to={`/${l.slug}`}
                            className="bg-dark-900 border border-dark-700 px-4 py-3 rounded-full text-dark-50 text-sm font-semibold hover:text-accent-cyan hover:border-accent-cyan/50 transition-all duration-300 shadow-sm"
                          >
                            {l.title}
                          </Link>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}

              {/* Backwards-compatible fallback */}
              {(!pageData.linkBlocks || pageData.linkBlocks.length === 0) && pageData.related && pageData.related.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
                  {pageData.related.map((rel, i) => (
                    <Link
                      key={i}
                      to={`/${rel.slug}`}
                      className="bg-dark-800 border border-dark-700 px-6 py-4 rounded-full text-dark-50 font-medium hover:text-accent-cyan hover:border-accent-cyan/50 transition-all duration-300 hover:scale-105 shadow-sm"
                    >
                      {rel.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {/* FAQs (Indexable content + JSON-LD in head) */}
          {pageData.faqs && pageData.faqs.length > 0 && (
            <div className="border-t border-dark-700 pt-16">
              <h2 className="text-3xl font-bold text-dark-50 mb-8 text-center">Frequently Asked Questions</h2>
              <div className="space-y-4 max-w-4xl mx-auto">
                {pageData.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-accent-cyan/40 transition-colors"
                  >
                    <summary className="cursor-pointer select-none font-bold text-dark-50 text-lg">
                      {faq.question}
                    </summary>
                    <div className="mt-3 text-dark-300 leading-relaxed">{faq.answer}</div>
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

export default SeoTemplate;
