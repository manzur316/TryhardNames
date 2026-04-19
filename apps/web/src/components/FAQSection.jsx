import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Helmet } from 'react-helmet';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What makes a good tryhard gamer name?",
      answer: "A good tryhard name combines aggressive or competitive words with stylish symbols and numbers. It should sound intimidating, memorable, and reflect your gaming prowess. Popular elements include dark themes (Shadow, Phantom), competitive terms (Clutch, Cracked), and stylish Unicode symbols (★, ⚡, ✨)."
    },
    {
      question: "Are these generated names unique?",
      answer: "Our generator creates millions of unique combinations by mixing different word categories, numbers, and symbols. While we can't guarantee absolute uniqueness across all gaming platforms, the vast combination possibilities make it highly likely your generated name will be available."
    },
    {
      question: "Can I use these names on console (PlayStation/Xbox)?",
      answer: "Yes! The base alphanumeric names work perfectly on PSN and Xbox Live. However, keep in mind that console networks often restrict special Unicode symbols (like ★ or ⚡). If you're generating a name for console, we recommend toggling off the 'Add Symbols' option."
    },
    {
      question: "How do I change my name in Fortnite or Valorant?",
      answer: "For Fortnite, log into your Epic Games account online and edit your Display Name (can be changed every 2 weeks). For Valorant, log into your Riot Games account and change your Riot ID and Tagline (can be changed every 90 days)."
    },
    {
      question: "What is a sweaty gamer name?",
      answer: "Sweaty gamer names are competitive, tryhard-style nicknames that convey skill, dedication, and intensity. They often include words like 'Grind', 'Sweat', 'Clutch', 'Cracked', or 'Goated' combined with aggressive or dark-themed words."
    },
    {
      question: "Is the stylish text generator safe to use?",
      answer: "Absolutely. Our stylish text generator simply converts standard text into Unicode characters. It does not use any hacks, exploits, or third-party software. It's 100% safe to copy and paste these fonts into your social media bios or game profiles."
    },
    {
      question: "Are all these tools completely free?",
      answer: "Yes! TryhardNames.com is completely free to use. You can generate unlimited gamer names, clan names, stylish texts, and bios without any hidden fees, subscriptions, or sign-ups required."
    }
  ];

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
    <section className="py-16 max-w-4xl mx-auto">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

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
            className={`bg-card border rounded-xl overflow-hidden transition-colors duration-300 ${openIndex === index ? 'border-primary/50 shadow-[0_0_15px_rgba(0,255,136,0.05)]' : 'border-border/50 hover:border-border'}`}
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