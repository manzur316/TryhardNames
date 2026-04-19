import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: "What makes a good gamer bio?",
    a: "A good gamer bio is concise, reflects your personality or playstyle, and clearly states your main games. It should use formatting like line breaks, emojis, or symbols to stand out and be easy to read on platforms like Discord or Twitch."
  },
  {
    q: "How do I change my gamer bio?",
    a: "Changing your bio depends on the platform. On Discord, go to User Settings > Profiles. On Twitch, go to Settings > Channel and Videos > About. On Instagram/TikTok, tap 'Edit Profile' on your main page."
  },
  {
    q: "What are the best gamer bios for Instagram?",
    a: "For Instagram, short and punchy bios work best. Use 1-2 lines, include your main game or rank, and add a link to your Twitch or YouTube channel. Emojis help break up the text visually."
  },
  {
    q: "Can I use special characters in gamer bios?",
    a: "Yes! Most modern platforms (Discord, Instagram, Twitch, TikTok) fully support Unicode special characters and symbols. Using stars (★), lightning bolts (⚡), or custom fonts can make your bio look much more aesthetic."
  },
  {
    q: "What are trending gamer bio styles?",
    a: "Currently, 'Tryhard' (aggressive, competitive quotes) and 'Aesthetic' (lowercase, minimal symbols like 🌙 or ✨) are the most popular styles. Minimalist bios with just your game and rank are also trending for esports players."
  },
  {
    q: "How often should I update my gamer bio?",
    a: "Update your bio whenever your main game changes, you hit a new rank, or you join a new clan/esports team. Keeping it fresh shows your profile is active and relevant."
  },
  {
    q: "What makes a gamer bio stand out?",
    a: "To stand out, avoid generic phrases. Combine unique tones (like Dark or Aesthetic) with cool symbols. Using custom fonts or clever formatting (like clean borders ╔══ ══╗) also helps catch the eye."
  },
  {
    q: "Can I use the same bio across all platforms?",
    a: "While you can, it's better to adapt it. A Twitch bio can be longer and more detailed, while a Discord or TikTok bio needs to be very short. Keep the core message the same, but adjust the length for the platform."
  }
];

const GamerBioFAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-16 border-t border-border/30">
      <div className="flex items-center gap-3 mb-10 justify-center">
        <HelpCircle className="w-8 h-8 text-primary" />
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center">Frequently Asked Questions</h2>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`border rounded-xl overflow-hidden transition-colors duration-300 ${openIndex === index ? 'border-primary/50 bg-primary/5' : 'border-border/50 bg-card hover:border-border'}`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
            >
              <span className="font-semibold text-lg text-foreground pr-4">{faq.q}</span>
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
                  <div className="p-5 pt-0 text-foreground/80 leading-relaxed border-t border-border/10">
                    {faq.a}
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

export default GamerBioFAQSection;