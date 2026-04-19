import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Helmet } from 'react-helmet';

const StylishTextFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What is a stylish text generator?",
      answer: "A stylish text generator is a free online tool that converts standard keyboard text into fancy fonts, cool symbols, and aesthetic text using Unicode characters. It allows you to copy and paste unique text styles for social media bios, gaming names, and messaging apps without needing to install any custom fonts."
    },
    {
      question: "How do I copy and paste stylish fonts?",
      answer: "It's incredibly simple: type your desired text into the large input box at the top of the page. The generator will instantly create dozens of variations. Browse through the categories, find a style you like, and click the 'Copy' button next to it. The text is now saved to your clipboard and ready to be pasted (Ctrl+V or Cmd+V) anywhere."
    },
    {
      question: "Can I use stylish fonts on Instagram and TikTok?",
      answer: "Yes! The fancy fonts generated here use standard Unicode characters that are fully supported by Instagram, TikTok, Twitter, and Facebook. You can safely copy and paste them into your Instagram bio, TikTok captions, and comments to make your profile stand out from the crowd."
    },
    {
      question: "Are stylish fonts compatible with all platforms?",
      answer: "Most of our stylish fonts are compatible with major platforms, modern web browsers, and smartphones (iOS and Android). However, some older devices or highly specific games might not render complex symbols correctly, displaying them as empty boxes (often called 'tofu'). If this happens, try a simpler font style like 'Small Caps' or 'Monospace'."
    },
    {
      question: "How many font styles are available?",
      answer: "Our generator currently produces over 50 unique font styles and combinations, organized into categories like Bold & Italic, Fancy Fonts, Symbols & Decorative, Aesthetic Fonts, Gaming Fonts, and Minimal Fonts. We regularly update our database with new trending styles."
    },
    {
      question: "Can I customize the stylish fonts?",
      answer: "While the generator provides pre-made styles based on your input, you can customize them further by combining different outputs. For example, you can generate a 'Bold' name, paste it somewhere, and then generate 'Aesthetic Sparkles' to add around it manually."
    },
    {
      question: "Is the stylish text generator free?",
      answer: "Absolutely! Our stylish text generator is 100% free to use. There are no hidden fees, no subscriptions, and no limits on how many times you can generate or copy text. We support the site through unobtrusive advertisements."
    },
    {
      question: "What are the best stylish fonts for gaming?",
      answer: "For competitive gaming (like Fortnite, Valorant, or Call of Duty), players typically prefer clean, readable, but aggressive styles. 'Small Caps', 'Double Struck', and 'Monospace' are highly popular. Adding subtle gamer symbols like stars (★), crosses (✟), or lightning bolts (⚡) is also a great way to create a tryhard aesthetic."
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
        <p className="text-[#d6d6d6]">Everything you need to know about fancy fonts and symbols</p>
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

export default StylishTextFAQ;