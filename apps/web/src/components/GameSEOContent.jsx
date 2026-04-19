import React from 'react';
import { Helmet } from 'react-helmet';

const GameSEOContent = ({ gameName, content }) => {
  const { intro, sections, exampleNames, faqs } = content;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <section className="max-w-4xl mx-auto py-12 space-y-12 md:space-y-16">
        {/* Intro */}
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-foreground/90 leading-relaxed">{intro}</p>
        </div>

        {/* Navigation Links */}
        <nav className="bg-card border border-border/50 rounded-lg p-6 shadow-refined">
          <h2 className="text-xl font-bold text-primary mb-4">Quick Navigation</h2>
          <ul className="grid grid-cols-2 md:grid-cols-2 gap-3">
            {sections.map((section, idx) => (
              <li key={idx}>
                <a href={`#section-${idx}`} className="text-secondary hover:text-primary transition-colors">
                  {section.title}
                </a>
              </li>
            ))}
            <li><a href="#examples" className="text-secondary hover:text-primary transition-colors">Example Names</a></li>
            <li><a href="#faq" className="text-secondary hover:text-primary transition-colors">FAQ</a></li>
          </ul>
        </nav>

        {/* Dynamic Sections */}
        {sections.map((section, idx) => (
          <article id={`section-${idx}`} key={idx} className="space-y-4 border-t border-border/15 pt-10 md:pt-14">
            <h2 className="text-3xl font-bold text-primary">{section.title}</h2>
            <div className="text-foreground/90 leading-relaxed space-y-4">
              {section.content.map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}

        {/* Example Names List */}
        <article id="examples" className="space-y-6 border-t border-border/15 pt-10 md:pt-14">
          <h2 className="text-3xl font-bold text-secondary">50+ {gameName} Tryhard Names</h2>
          <div className="bg-card border border-border/50 rounded-lg p-6 shadow-refined">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {exampleNames.map((name, idx) => (
                <div key={idx} className="text-foreground/80 font-medium hover:text-primary transition-colors">
                  {name}
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* FAQ Section */}
        <article id="faq" className="space-y-8 bg-card border border-border/50 rounded-lg p-8 shadow-refined mt-16">
          <h2 className="text-3xl font-bold text-accent">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="space-y-2 border-b border-border/15 pb-6 last:border-0 last:pb-0">
                <h3 className="text-xl font-semibold text-secondary">{faq.question}</h3>
                <p className="text-foreground/90 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
};

export default GameSEOContent;