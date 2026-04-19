import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Helmet } from 'react-helmet';

const faqData = {
  fortnite: [
    { question: "What makes a good Fortnite tryhard name?", answer: "A good Fortnite tryhard name is usually short, aggressive, and clean. Words like 'Cracked', 'Lethal', or 'Sweat' combined with minimal symbols or a clan tag create an intimidating presence in the kill feed." },
    { question: "How do I change my Fortnite username?", answer: "You can change your Fortnite display name for free once every two weeks by logging into your Epic Games account on their website and navigating to the Account Settings page." },
    { question: "Can I use special characters in Fortnite names?", answer: "Yes, Fortnite supports many standard Unicode characters, including stars (★) and lightning bolts (⚡). However, complex emojis or unsupported fonts will appear as blank boxes." },
    { question: "What are the best Fortnite names for ranked?", answer: "For ranked (Arena/FNCS), players prefer 3-4 letter names or clean, one-word names without numbers. This looks professional and makes callouts easier for your trio or duo." },
    { question: "How often can I change my Fortnite name?", answer: "Epic Games allows you to change your display name once every 14 days." },
    { question: "Are there naming restrictions in Fortnite?", answer: "Yes, names must be between 3 and 16 characters long and cannot contain offensive language or violate Epic Games' terms of service." },
    { question: "What makes a name stand out in Fortnite?", answer: "Symmetry, rare symbols, and avoiding random numbers at the end of your name make it stand out as a 'clean' and experienced player's tag." },
    { question: "Can I use the same name across platforms?", answer: "Yes, your Epic Games display name is unified across PC, PlayStation, Xbox, Switch, and mobile, provided your accounts are linked." }
  ],
  valorant: [
    { question: "What makes a good Valorant tryhard name?", answer: "A good Valorant name is clean, often lowercase, and references mechanical skill (Aim, Tap, Flick) or high ranks (Radiant, Immortal). It should look professional on the scoreboard." },
    { question: "How do I change my Valorant username?", answer: "You can change your Valorant name by logging into your Riot Games account online and updating your Riot ID and Tagline." },
    { question: "Can I use special characters in Valorant names?", answer: "Riot IDs support a wide range of Unicode characters, including Japanese/Korean letters and basic symbols, but it's best to keep it minimal for a clean aesthetic." },
    { question: "What are the best Valorant names for ranked?", answer: "Short, 3-4 letter names or single words related to your main agent (e.g., 'Dash' for Jett) are considered the best for high Elo ranked play." },
    { question: "How often can I change my Valorant name?", answer: "You can change your Riot ID (which serves as your Valorant name) for free once every 90 days." },
    { question: "Are there naming restrictions in Valorant?", answer: "The display name must be 3-16 characters long, and the tagline must be 3-5 characters. Offensive names are strictly prohibited and will be flagged." },
    { question: "What makes a name stand out in Valorant?", answer: "A name stands out in Valorant by being incredibly short or using a very clean, minimalist aesthetic without any numbers or cluttered symbols." },
    { question: "Can I use the same name across platforms?", answer: "Valorant is primarily on PC and consoles, and your Riot ID is your unified identity across all Riot Games titles." }
  ],
  roblox: [
    { question: "What makes a good Roblox tryhard name?", answer: "A good Roblox tryhard name is edgy, uses 'X' or 'Z' creatively, and avoids numbers. Words like 'Void', 'Demon', or 'Slayer' are very popular in competitive Roblox games." },
    { question: "How do I change my Roblox username?", answer: "Changing your actual Roblox username costs 1,000 Robux in your account settings. However, you can change your Display Name for free." },
    { question: "Can I use special characters in Roblox names?", answer: "No, actual Roblox usernames only allow alphanumeric characters (A-Z, 0-9) and underscores (_). Display names have slightly more flexibility but still restrict complex symbols." },
    { question: "What are the best Roblox names for ranked?", answer: "For competitive games like Arsenal or Da Hood, short names or 'barcode' names (using I and l) are considered the most sweaty and tryhard." },
    { question: "How often can I change my Roblox name?", answer: "You can change your paid username as often as you have the Robux for it. You can change your free Display Name once every 7 days." },
    { question: "Are there naming restrictions in Roblox?", answer: "Usernames must be 3-20 characters long, unique across the entire platform, and pass Roblox's strict chat filter." },
    { question: "What makes a name stand out in Roblox?", answer: "Having a 3 or 4-letter username is the ultimate standout feature, as they are extremely rare. Otherwise, a clean name without numbers stands out." },
    { question: "Can I use the same name across platforms?", answer: "Your Roblox account and username are the same whether you play on PC, mobile, or console." }
  ],
  "free-fire": [
    { question: "What makes a good Free Fire tryhard name?", answer: "A good Free Fire name combines aggressive words (Boss, Killer) with highly stylized fonts and symbols like the umbrella (☂) or crown (♛)." },
    { question: "How do I change my Free Fire username?", answer: "You can change your name in the profile section using a Name Change Card or by spending 390 Diamonds." },
    { question: "Can I use special characters in Free Fire names?", answer: "Yes, Free Fire is famous for supporting a massive variety of Unicode symbols, invisible spaces, and fancy fonts." },
    { question: "What are the best Free Fire names for ranked?", answer: "Names with '999', 'YT', or 'FF' suffixes combined with a stylish font are considered the most competitive for ranked matches." },
    { question: "How often can I change my Free Fire name?", answer: "You can change it as often as you want, provided you have the required Diamonds or Name Change Cards." },
    { question: "Are there naming restrictions in Free Fire?", answer: "Names can be up to 12 characters long. While many symbols are allowed, offensive words are filtered." },
    { question: "What makes a name stand out in Free Fire?", answer: "Using invisible space characters to create gaps in your name, or using rare, perfectly symmetrical symbols makes a name stand out." },
    { question: "Can I use the same name across platforms?", answer: "Free Fire is a mobile game, and your account name remains the same whether you play on Android or iOS." }
  ],
  cod: [
    { question: "What makes a good COD tryhard name?", answer: "A good COD name sounds like a military callsign (Actual, Bravo, Six) or references sweaty movement mechanics. It should be short and punchy." },
    { question: "How do I change my COD username?", answer: "You can change your Activision ID in-game through the account settings or via the Call of Duty website using a Name Change Token." },
    { question: "Can I use special characters in COD names?", answer: "Activision IDs generally support standard alphanumeric characters. Complex symbols are often blocked or display incorrectly." },
    { question: "What are the best COD names for ranked?", answer: "Clean, one-word names (like 'Ghost', 'Void', or 'Aim') without numbers are considered the best for ranked play and GameBattles." },
    { question: "How often can I change my COD name?", answer: "You earn one Name Change Token every 6 months, and you can hold a maximum of 2 tokens at a time." },
    { question: "Are there naming restrictions in COD?", answer: "Display names must be between 2 and 16 characters long and must pass the profanity filter." },
    { question: "What makes a name stand out in COD?", answer: "A very short name (2-4 letters) paired with a recognizable competitive clan tag (like [FaZe] or [TTV]) stands out the most." },
    { question: "Can I use the same name across platforms?", answer: "Yes, your Activision ID is cross-platform, meaning your name is the same on PlayStation, Xbox, and PC." }
  ]
};

const GameFAQSection = ({ game }) => {
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = faqData[game];

  if (!faqs) return null;

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
        <p className="text-[#d6d6d6]">Everything you need to know about naming in this game</p>
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

export default GameFAQSection;