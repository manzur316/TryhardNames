import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { HOME_PAGE_FAQS } from '@/seo/data/homeFaqs.js';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = HOME_PAGE_FAQS;

  return (
    <section className="py-16 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <HelpCircle className="w-8 h-8 text-primary" />
          Frequently Asked Questions
        </h2>
        <p className="text-foreground/70">Everything you need to know about our gaming tools</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`bg-card border rounded-xl overflow-hidden transition-colors duration-300 ${openIndex === index ? 'border-primary/40' : 'border-border/50 hover:border-border'}`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="font-bold text-lg text-foreground pr-4">{faq.question}</span>
              <ChevronDown 
                className={`w-5 h-5 text-primary transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`} 
              />
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-5 text-foreground/80 leading-relaxed border-t border-border/15 pt-4">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;