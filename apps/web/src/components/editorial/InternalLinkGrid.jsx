import React from 'react';
import { Link } from 'react-router-dom';

export default function InternalLinkGrid({ pageData, category, keyword, onLinkClick }) {
  const hasBlocks = pageData?.linkBlocks && pageData.linkBlocks.length > 0;
  const hasRelated = pageData?.related && pageData.related.length > 0;
  if (!hasBlocks && !hasRelated) return null;

  return (
    <div className="border-t border-dark-700 pt-16">
      <h2 className="text-3xl font-bold text-dark-50 mb-10 text-center">
        {pageData?.internalExploreTitle || 'Explore More'}
      </h2>

      {hasBlocks && (
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
                    onClick={() => onLinkClick?.({ target: l, placement: block.title, pageData, category, keyword })}
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

      {!hasBlocks && hasRelated && (
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          {pageData.related.map((rel, i) => (
            <Link
              key={i}
              to={`/${rel.slug}`}
              onClick={() => onLinkClick?.({ target: rel, placement: 'related_fallback', pageData, category, keyword })}
              className="bg-dark-800 border border-dark-700 px-6 py-4 rounded-full text-dark-50 font-medium hover:text-accent-cyan hover:border-accent-cyan/50 transition-all duration-300 hover:scale-105 shadow-sm"
            >
              {rel.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

