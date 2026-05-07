import React, { useState } from 'react';
import SeoHead from '@/seo/SeoHead.jsx';
import { faqPageSchema } from '@/seo/schema.js';
import { HOME_PAGE_FAQS } from '@/seo/data/homeFaqs.js';
import { Sparkles, RefreshCw, Hash, AtSign, Share2, ChevronDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSingleName, generateMultipleNames } from '@/utils/nameGenerator.js';
import CopyButton from '@/components/CopyButton.jsx';
import ToggleSwitch from '@/components/ToggleSwitch.jsx';
import AdPlaceholderZone from '@/components/AdPlaceholderZone.jsx';
import TrustIndicators from '@/components/TrustIndicators.jsx';
import TrendingNamesSection from '@/components/TrendingNamesSection.jsx';
import RecentlyGeneratedFeed from '@/components/RecentlyGeneratedFeed.jsx';
import BuildYourIdentitySection from '@/components/BuildYourIdentitySection.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import PopularToolsSection from '@/components/PopularToolsSection.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { Link } from 'react-router-dom';
import { generateRandomMessage, checkVariableReward, trackGenerationCount } from '@/utils/behavioralPsychology.js';
import { useTheme } from '@/core/context/ThemeContext.jsx';

const HomePage = () => {
  const { isDarkMode } = useTheme();
  const [generatedName, setGeneratedName] = useState('');
  const [multipleNames, setMultipleNames] = useState([]);
  const [addNumbers, setAddNumbers] = useState(false);
  const [addSymbols, setAddSymbols] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rewardMsg, setRewardMsg] = useState('');
  const [isRare, setIsRare] = useState(false);
  const [genCount, setGenCount] = useState(0);
  const { toast } = useToast();

  const triggers = [
    'Your name says everything before the match starts',
    'First impression matters. Make it count.',
    'Your name is your reputation.',
    'Stand out from the competition.'
  ];
  const [triggerText] = useState(triggers[Math.floor(Math.random() * triggers.length)]);

  const handleGenerateSingle = () => {
    setIsGenerating(true);
    setMultipleNames([]);
    setRewardMsg('');
    
    setTimeout(() => {
      const name = generateSingleName({ addNumbers, addSymbols });
      setGeneratedName(name);
      setIsGenerating(false);
      
      setGenCount(prev => prev + 1);
      trackGenerationCount('home_name');
      const rare = checkVariableReward();
      setIsRare(rare);
      setRewardMsg(generateRandomMessage());
      setTimeout(() => setRewardMsg(''), 3000);
    }, 300);
  };

  const handleGenerateMultiple = () => {
    setIsGenerating(true);
    setGeneratedName('');
    setRewardMsg('');
    
    setTimeout(() => {
      const names = generateMultipleNames(10, { addNumbers, addSymbols });
      setMultipleNames(names);
      setIsGenerating(false);
      
      setGenCount(prev => prev + 1);
      trackGenerationCount('home_name');
    }, 500);
  };

  const handleShare = () => {
    const textToShare = generatedName || 'Check out TryhardNames.com for awesome gaming names!';
    if (navigator.share) {
      navigator.share({
        title: 'Tryhard Names Generator',
        text: textToShare,
        url: window.location.href
      }).catch(() => {});
    } else {
      toast({
        title: "Share",
        description: "Copy the URL to share with friends!",
        className: "bg-white dark:bg-dark-800 border-accent-cyan text-slate-900 dark:text-dark-50"
      });
    }
  };

  const rareNamesList = [
    { category: 'Aggressive', names: ['Lethal★', 'Savage⚡', 'Venom◆'] },
    { category: 'Mythical', names: ['Reaper✨', 'Phantom⚔️', 'Wraith☠️'] },
    { category: 'Dark', names: ['VoidX', 'AbyssZ', 'Shadow99'] },
    { category: 'Esports', names: ['ProAim', 'ClutchGod', 'ApexFrag'] }
  ];

  const examples = [
    'ShadowNinja', 'PhantomKing', 'VortexStrike', 'NeonGhost', 
    'CrimsonBlade', 'SilentHunter', 'ThunderStorm', 'IceWizard'
  ];

  const popularCategories = [
    { title: 'Roblox Names', desc: 'Cool, funny, aesthetic, tryhard.', to: '/roblox-names' },
    { title: 'Gamer Names', desc: 'Cool, pro, funny, edgy.', to: '/gamer-names' },
    { title: 'Stylish Text', desc: 'Fonts for Discord, TikTok, Twitch.', to: '/stylish-text-generator' },
    { title: 'Nickname Symbols', desc: 'Symbols, separators, decorations.', to: '/nickname-symbols' },
  ];

  const trendingStyles = [
    { label: 'Tryhard', to: '/roblox-names/tryhard' },
    { label: 'Cool', to: '/gamer-names/cool' },
    { label: 'Funny', to: '/roblox-names/funny' },
    { label: 'Aesthetic', to: '/roblox-names/aesthetic' },
    { label: 'Pro', to: '/gamer-names/pro' },
    { label: 'Edgy', to: '/gamer-names/edgy' },
  ];

  const popularGames = [
    { label: 'Valorant', to: '/valorant/sweaty' },
    { label: 'Fortnite', to: '/fortnite/tryhard' },
    { label: 'Call of Duty', to: '/cod/sweaty' },
    { label: 'Free Fire', to: '/free-fire' },
    { label: 'League of Legends', to: '/league-of-legends-names' },
  ];

  const faqs = [
    { q: 'Are these names free to use?', a: 'Yes, our platform is completely free. You can generate, copy, and use as many names as you want without any hidden fees or subscriptions. We believe everyone deserves a great gaming identity.' },
    { q: 'Can I use these names on any platform?', a: 'Absolutely. The names generated here are designed to be compatible with major gaming platforms including PC, Xbox, PlayStation, Nintendo Switch, and mobile games. Just be sure to check the specific character limits of the game you are playing.' },
    { q: 'How often are new names generated?', a: 'Our AI-powered system creates names dynamically, meaning there are virtually unlimited combinations. Every time you click generate, the algorithm pulls from an extensive database of gaming terminology to provide fresh, unique results.' }
  ];

  return (
    <div className="bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-dark-300 flex-grow flex flex-col transition-colors duration-300">
      <SeoHead
        title="Tryhard Names Generator – Stylish Gamer Tags & Clan Names"
        description="Generate sweaty tryhard names, stylish gamer tags and powerful clan names instantly. Copy-ready for competitive games—browse Roblox & gamer hubs, stylish text and symbol tools."
        path="/"
        jsonLd={[faqPageSchema(HOME_PAGE_FAQS)]}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-6 sm:py-12 md:py-16 lg:py-20 min-h-[400px] flex flex-col justify-center px-4">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1589241062313-35890684416a?q=80&w=2070&auto=format&fit=crop" 
            alt="Tryhard names generator interface showing stylish gamer tags and clan names" 
            loading="lazy"
            className="w-full h-full object-cover opacity-10 dark:opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-slate-50 dark:from-dark-900/90 dark:via-dark-900/80 dark:to-dark-950 transition-colors duration-300"></div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-dark-50 tracking-tight leading-tight">
              Tryhard Names Generator<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple block mt-2">Create Stylish Gamer Tags</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl leading-loose text-slate-600 dark:text-dark-300 max-w-3xl mx-auto font-medium">
              Generate unlimited <span className="text-accent-purple font-semibold">sweaty</span>, <span className="text-accent-pink font-semibold">stylish</span>, and <span className="text-accent-cyan font-semibold">competitive</span> gaming names instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                onClick={() => document.getElementById('generator').scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto bg-gradient-cyan-purple text-white hover:opacity-90 text-lg py-4 sm:py-3 px-8 font-bold glow-neon transition-smooth hover:scale-[1.02] active:scale-95"
              >
                Generate Your Gamer Name
              </Button>
              <Link
                to="/roblox-names"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-dark-700 bg-white/70 dark:bg-dark-900/60 px-8 py-4 sm:py-3 font-bold text-slate-900 dark:text-dark-50 hover:border-accent-cyan/50 hover:text-accent-cyan transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Browse Popular Categories
              </Link>
            </div>

            <nav aria-label="Trending styles" className="pt-2">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {trendingStyles.map((s) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    className="px-3 py-2 rounded-full text-sm font-semibold bg-white/70 dark:bg-dark-900/60 border border-slate-200 dark:border-dark-700 text-slate-700 dark:text-dark-200 hover:border-accent-purple/50 hover:text-accent-purple transition-colors"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </nav>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 -mt-0 md:-mt-8 relative z-20">
        <TrustIndicators />
      </div>

      <AdPlaceholderZone position="top" />

      {/* Main Generator Section */}
      <section id="generator" className="container mx-auto max-w-6xl px-4 py-6 sm:py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          
          {/* Generator Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="text-center mb-4">
              <p className="text-sm font-medium text-slate-500 dark:text-dark-400 uppercase tracking-widest">{triggerText}</p>
            </div>
            
            <div className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-2xl p-4 sm:p-6 md:p-10 shadow-refined space-y-3 sm:space-y-4 transition-colors duration-300">
              <AnimatePresence mode="wait">
                {generatedName && (
                  <motion.div
                    key={generatedName}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`text-center space-y-6 py-6 transition-all duration-500 ${isRare ? 'bg-accent-cyan/10 rounded-2xl p-4 sm:p-8 border border-accent-cyan/30 scale-[1.02]' : ''}`}
                  >
                    <div className="relative inline-block">
                      <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-accent-cyan break-all tracking-tight ${isRare ? 'drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]' : ''}`}>
                        {generatedName}
                      </h2>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 justify-center">
                      <CopyButton textToCopy={generatedName} className="text-base px-8 py-4 sm:py-3 w-full sm:w-auto active:scale-95" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {multipleNames.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {multipleNames.map((name, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-lg p-4 sm:p-6 flex items-center justify-between group hover:border-accent-cyan/50 transition-all duration-300 active:scale-95"
                    >
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-dark-50 group-hover:text-accent-cyan transition-colors">{name}</span>
                      <CopyButton textToCopy={name} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Button
                  onClick={handleGenerateSingle}
                  disabled={isGenerating}
                  className="bg-gradient-cyan-purple text-white hover:opacity-90 text-lg py-4 sm:py-3 w-full font-bold glow-neon transition-smooth hover:scale-[1.02] active:scale-95"
                >
                  {isGenerating ? <RefreshCw className="w-6 h-6 mr-2 animate-spin" /> : <Sparkles className="w-6 h-6 mr-2" />}
                  Generate Tryhard Name
                </Button>
                <Button
                  onClick={handleGenerateMultiple}
                  disabled={isGenerating}
                  className="bg-gradient-purple-pink text-white hover:opacity-90 text-lg py-4 sm:py-3 w-full font-bold glow-blue transition-smooth hover:scale-[1.02] active:scale-95"
                >
                  {isGenerating ? <RefreshCw className="w-6 h-6 mr-2 animate-spin" /> : <TrendingUp className="w-6 h-6 mr-2" />}
                  Generate 10 Names
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-slate-200 dark:border-dark-700">
                <ToggleSwitch id="add-numbers" label="Add Numbers" checked={addNumbers} onCheckedChange={setAddNumbers} icon={Hash} />
                <ToggleSwitch id="add-symbols" label="Add Symbols" checked={addSymbols} onCheckedChange={setAddSymbols} icon={AtSign} />
              </div>
            </div>
          </div>

          {/* Feed Column */}
          <div className="lg:col-span-1">
            <RecentlyGeneratedFeed />
          </div>
        </div>
      </section>

      {/* Internal Linking + Engagement Sections */}
      <section className="container mx-auto max-w-6xl px-4 pb-6 sm:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <section className="lg:col-span-2 bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-2xl p-5 sm:p-8 shadow-refined">
            <header className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-dark-50 tracking-tight">
                Popular Categories
              </h2>
              <p className="text-slate-600 dark:text-dark-300 mt-2 leading-relaxed">
                Jump into the most-used generators and explore deeper pages that match your vibe.
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {popularCategories.map((c) => (
                <Link
                  key={c.to}
                  to={c.to}
                  className="group rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-900 p-4 sm:p-5 hover:border-accent-cyan/50 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-dark-50 group-hover:text-accent-cyan transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-dark-300 mt-1 leading-relaxed">
                        {c.desc}
                      </p>
                    </div>
                    <ChevronDown className="w-5 h-5 text-slate-400 dark:text-dark-400 group-hover:text-accent-cyan transition-colors rotate-[-90deg] mt-1" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-dark-700">
              <h3 className="text-lg font-black text-slate-900 dark:text-dark-50 mb-3">
                Trending Name Styles
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingStyles.map((s) => (
                  <Link
                    key={`style-${s.to}`}
                    to={s.to}
                    className="px-3 py-2 rounded-full text-sm font-bold bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-slate-700 dark:text-dark-200 hover:border-accent-purple/50 hover:text-accent-purple transition-colors"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <aside className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-2xl p-5 sm:p-8 shadow-refined h-full">
            <header className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-dark-50 tracking-tight">
                Popular Games
              </h2>
              <p className="text-slate-600 dark:text-dark-300 mt-2 leading-relaxed">
                Game-specific pages help you find names that “fit” the community faster.
              </p>
            </header>

            <div className="flex flex-wrap gap-2">
              {popularGames.map((g) => (
                <Link
                  key={g.to}
                  to={g.to}
                  className="px-3 py-2 rounded-full text-sm font-bold bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 text-slate-800 dark:text-dark-100 hover:border-accent-cyan/50 hover:text-accent-cyan transition-colors"
                >
                  {g.label}
                </Link>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-dark-700">
              <h3 className="text-lg font-black text-slate-900 dark:text-dark-50 mb-2">
                Future Ad Slot
              </h3>
              <p className="text-sm text-slate-600 dark:text-dark-300 leading-relaxed">
                Reserved space for in-content monetization (no ads shown in dev).
              </p>
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 dark:border-dark-600 bg-slate-50/60 dark:bg-dark-900/40 min-h-[140px] flex items-center justify-center text-xs font-bold text-slate-500 dark:text-dark-400">
                In-content placeholder
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4">
        <TrendingNamesSection />
      </section>

      <section className="container mx-auto max-w-6xl px-4">
        <PopularToolsSection />
      </section>

      <section className="container mx-auto max-w-6xl px-4">
        <BuildYourIdentitySection />
      </section>

      {/* Standardized SEO Section */}
      <section className="mt-16 max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900 dark:text-dark-50 tracking-tight">
          Free Online Name Generators & Stylish Text Tools
        </h2>
        <p className="text-slate-700 dark:text-dark-300 mb-4 leading-relaxed">
          Discover the ultimate AI-powered name generators designed specifically for building your gaming identity. Whether you are launching a new streaming channel, joining a competitive esports team, or simply starting a fresh playthrough, finding the perfect username is your first critical step. Our advanced algorithms analyze thousands of gaming trends to deliver names that command respect and capture attention.
        </p>

        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50 mt-12">
          What are online name generators?
        </h2>
        <p className="text-slate-700 dark:text-dark-300 mb-4 leading-relaxed">
          Online name generators are sophisticated tools that combine linguistic patterns, gaming terminology, and stylistic formatting to produce unique digital identities. Instead of staring at a blank registration screen trying to think of a name that isn't already taken, these generators instantly provide hundreds of viable options tailored to your specific preferences.
        </p>
        <p className="text-slate-700 dark:text-dark-300 mb-4 leading-relaxed">
          Our specialized generators go beyond simple random word combinations. They understand the nuances of different gaming communities—knowing that a Roblox roleplay server requires a vastly different naming style than a highly competitive Valorant lobby. By categorizing names into themes like "Tryhard," "Aesthetic," and "Funny," we ensure you find a name that perfectly matches your intended vibe.
        </p>

        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50 mt-12">
          Popular Name Examples
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-12">
          {examples.map((ex, i) => (
            <div key={i} className="p-3 bg-slate-100 dark:bg-dark-800 rounded text-center text-slate-900 dark:text-dark-50 font-medium">
              {ex}
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50 mt-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 mb-12">
          {faqs.map((faq, i) => (
            <div key={i} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-slate-900 dark:text-dark-50 mb-2">{faq.q}</h3>
              <p className="text-slate-700 dark:text-dark-300 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-dark-800">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50">Ready to Level Up Your Gaming Identity?</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/roblox-names" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Explore Roblox Names</Link>
            <Link to="/gamer-names" className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">Discover Gamer Names</Link>
          </div>
        </div>
      </section>

      <AdPlaceholderZone position="bottom" />
    </div>
  );
};

export default HomePage;