import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Helmet } from 'react-helmet';

const ClanFAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What makes a good clan name?",
      answer: "A good clan name is memorable, easy to pronounce, and reflects your team's personality. It should be relatively short (1-2 words) so it works well as an in-game tag. The best names strike a balance between sounding professional and intimidating."
    },
    {
      question: "How do I change my clan name?",
      answer: "Changing your clan name depends entirely on the game or platform you are using. In games like Clash of Clans or Destiny 2, you usually need to spend premium currency to change it. On platforms like Discord or Xbox, you can typically change your group name for free in the server or club settings."
    },
    {
      question: "Can I use special characters in clan names?",
      answer: "This varies by game. Titles like Free Fire and PUBG Mobile are famous for allowing complex Unicode symbols (★, ⚡, ♛). However, competitive shooters like Valorant or CS:GO usually restrict names to standard alphanumeric characters to ensure readability."
    },
    {
      question: "What are the best clan names for esports?",
      answer: "For esports, you want a name that sounds like a legitimate organization. One-word names like 'Sentinels', 'Cloud9', or 'Fnatic' are the gold standard. Avoid numbers, excessive symbols, or overly edgy words if you want to attract sponsors and be taken seriously."
    },
    {
      question: "How often can I change my clan name?",
      answer: "Most games impose a cooldown period on name changes to prevent abuse. This can range from 14 days (like Epic Games/Fortnite) to 90 days (like Riot Games/Valorant). Always double-check your spelling before confirming a new clan name."
    },
    {
      question: "Are there naming restrictions for clans?",
      answer: "Yes. Almost all games have profanity filters that block offensive language, hate speech, or inappropriate terms. Additionally, there are usually character limits (often between 3 and 15 characters) and restrictions on impersonating official staff or existing pro teams."
    },
    {
      question: "What makes a clan name stand out?",
      answer: "A clan name stands out when it avoids clichés. Instead of using common suffixes like 'Gaming' or 'Esports', try using unique nouns or mythological references. A clean, symmetrical name without random numbers at the end always looks more premium."
    },
    {
      question: "Can I use the same clan name across platforms?",
      answer: "Yes, you can use the same name across different games and platforms, provided it hasn't already been taken by another group on that specific platform. It's highly recommended to secure your clan name on Twitter, YouTube, and Discord simultaneously to protect your brand."
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
    <section className="py-16 max-w-4xl mx-auto border-t border-border/15">
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
        <p className="text-[#d6d6d6]">Everything you need to know about naming your gaming team</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`bg-card border rounded-xl overflow-hidden transition-colors duration-300 ${openIndex === index ? 'border-primary/50 shadow-sm' : 'border-border/40 hover:border-border'}`}
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
                  <div className="px-6 pb-5 text-[#d6d6d6] leading-relaxed border-t border-border/15 pt-4">
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

export default ClanFAQSection;