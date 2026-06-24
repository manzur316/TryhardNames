import React, { useState } from 'react';
import SeoHead from '@/seo/SeoHead.jsx';
import { faqPageSchema } from '@/seo/schema.js';
import { HOME_PAGE_FAQS } from '@/seo/data/homeFaqs.js';
import { Hash, AtSign, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSingleName, generateMultipleNames } from '@/utils/nameGenerator.js';
import CopyButton from '@/components/CopyButton.jsx';
import ToggleSwitch from '@/components/ToggleSwitch.jsx';
import AdPlaceholderZone from '@/components/AdPlaceholderZone.jsx';
import TrustIndicators from '@/components/TrustIndicators.jsx';
import TrendingNamesSection from '@/components/TrendingNamesSection.jsx';
import HomeExploreAside from '@/components/HomeExploreAside.jsx';
import BuildYourIdentitySection from '@/components/BuildYourIdentitySection.jsx';
import PopularToolsSection from '@/components/PopularToolsSection.jsx';
import { Link } from 'react-router-dom';
import HeroIdentitySection from '@/components/identity/HeroIdentitySection.jsx';

const HomePage = () => {
  const [generatedName, setGeneratedName] = useState('');
  const [multipleNames, setMultipleNames] = useState([]);
  const [addNumbers, setAddNumbers] = useState(false);
  const [addSymbols, setAddSymbols] = useState(true);

  const handleNewName = () => {
    setMultipleNames([]);
    const name = generateSingleName({ addNumbers, addSymbols });
    setGeneratedName(name);
  };

  const handleTenIdeas = () => {
    setGeneratedName('');
    const names = generateMultipleNames(10, { addNumbers, addSymbols });
    setMultipleNames(names);
  };

  const examples = [
    'ShadowNinja',
    'PhantomKing',
    'VortexStrike',
    'NeonGhost',
    'CrimsonBlade',
    'SilentHunter',
    'ThunderStorm',
    'IceWizard',
  ];

  const popularCategories = [
    { title: 'Gaming Passport', desc: 'Private-first player resume for future verified proofs.', to: '/gaming-passport' },
    { title: 'Identity Kit', desc: 'Compose a paste-ready bundle + card export.', to: '/identity-kit' },
    { title: 'Roblox Names', desc: 'Cool, funny, aesthetic, tryhard.', to: '/roblox-names' },
    { title: 'Gamer Names', desc: 'Cool, pro, funny, edgy.', to: '/gamer-names' },
    { title: 'Stylish Text', desc: 'Unicode styles for Discord and bios.', to: '/stylish-text-generator' },
    { title: 'Nickname Symbols', desc: 'Marks, separators, decorations.', to: '/nickname-symbols' },
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
    { label: 'League of Legends', to: '/league-of-legends' },
  ];

  const primaryBtn =
    'w-full font-bold text-base py-6 sm:py-3.5 rounded-xl text-white active:scale-[0.99] transition-all duration-200 bg-gradient-to-r from-slate-900 to-slate-800 shadow-[0_14px_40px_-14px_rgba(15,23,42,0.45)] ring-1 ring-black/15 hover:brightness-110 dark:from-cyan-500 dark:via-teal-500 dark:to-violet-600 dark:shadow-[0_18px_48px_-14px_rgba(34,211,238,0.38)] dark:ring-white/25 dark:hover:shadow-[0_22px_52px_-12px_rgba(139,92,246,0.35)]';

  const secondaryBtn =
    'w-full font-semibold text-[0.9375rem] py-5 sm:py-3 rounded-xl border border-slate-300/95 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-400 dark:border-white/14 dark:bg-white/[0.04] dark:text-slate-300 dark:shadow-none dark:hover:bg-white/[0.08] dark:hover:text-white dark:hover:border-white/22 active:scale-[0.99] transition-all duration-200';

  return (
    <div className="bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-dark-300 flex-grow flex flex-col transition-colors duration-300">
      <SeoHead
        title="TryhardNames — Identity handles, stylish text & symbols"
        description="Explore gaming handles by lane, style Unicode text, and copy readable tags—built for Discord culture and public profiles."
        path="/"
        jsonLd={[faqPageSchema(HOME_PAGE_FAQS)]}
      />

      <HeroIdentitySection trendingStyles={trendingStyles} />

      <div className="container mx-auto max-w-6xl px-4 -mt-0 md:-mt-8 relative z-20">
        <TrustIndicators />
      </div>

      <AdPlaceholderZone position="top" />

      <section id="generator" className="container mx-auto max-w-6xl px-4 py-10 sm:py-14 md:py-20 lg:py-24 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-7">
          <div className="lg:col-span-2 space-y-7 sm:space-y-8">
            <div className="text-center space-y-3 sm:space-y-4 mb-1">
              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-dark-400">
                Quick sample
              </p>
              <p className="text-lg sm:text-xl text-slate-700 dark:text-dark-200 max-w-xl mx-auto leading-relaxed font-semibold tracking-tight">
                Draw a tag from the same lanes as our hubs—copy it, open a lane to refine, or sample again.
              </p>
            </div>

            <div className="relative bg-white dark:bg-dark-800/95 border border-slate-200/95 dark:border-dark-600/80 rounded-[1.75rem] p-5 sm:p-8 md:p-10 lg:p-12 shadow-[0_28px_64px_-30px_rgba(15,23,42,0.22)] dark:shadow-[0_32px_80px_-36px_rgba(0,0,0,0.72)] space-y-5 sm:space-y-6 transition-colors duration-300 overflow-hidden ring-1 ring-slate-900/[0.06] dark:ring-white/[0.08]">
              <div className="pointer-events-none absolute -inset-px rounded-[1.75rem] bg-gradient-to-br from-cyan-400/[0.06] via-transparent to-violet-500/[0.08] opacity-80 dark:opacity-100" aria-hidden />
              <div className="pointer-events-none absolute inset-0 opacity-100 dark:opacity-100" aria-hidden>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_75%_at_50%_15%,rgba(15,23,42,0.055),transparent_62%)] dark:bg-[radial-gradient(ellipse_88%_72%_at_50%_12%,rgba(56,189,248,0.075),transparent_58%)]" />
                <div className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_55%_42%_at_100%_0%,rgba(167,139,250,0.075),transparent_68%)] dark:block" aria-hidden />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/70 to-transparent dark:via-cyan-200/15" />
              </div>

              <div className="relative z-[1]">
                <AnimatePresence mode="wait">
                  {generatedName && (
                    <motion.div
                      key={generatedName}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="text-center space-y-6 sm:space-y-8 py-2 sm:py-6 md:py-8"
                    >
                      <div className="relative mx-auto max-w-[min(100%,52rem)]">
                        <div
                          className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-cyan-400/55 via-violet-500/45 to-fuchsia-500/40 opacity-95 dark:from-cyan-400/45 dark:via-violet-500/40 dark:to-fuchsia-600/35"
                          aria-hidden
                        />
                        <div className="relative overflow-hidden rounded-2xl bg-[#040912] px-5 py-10 sm:px-10 sm:py-12 md:py-14 ring-1 ring-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07)]">
                          <div
                            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,rgba(34,211,238,0.12),transparent_55%)]"
                            aria-hidden
                          />
                          <p className="relative text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.38em] text-slate-400">
                            Your tag
                          </p>
                          <h2 className="relative mt-5 text-[2.35rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] font-black tracking-[-0.04em] leading-[1.02] text-white break-words hyphens-none [text-shadow:0_2px_48px_rgba(34,211,238,0.18),0_1px_0_rgba(255,255,255,0.08)]">
                            {generatedName}
                          </h2>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 justify-center pt-2 max-w-md mx-auto">
                        <CopyButton
                          textToCopy={generatedName}
                          className="max-w-md w-full sm:w-auto text-base px-12 py-4 sm:py-3.5 font-bold rounded-xl"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {multipleNames.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pb-2"
                  >
                    <p className="col-span-full text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-dark-400 pb-1">
                      Preview set
                    </p>
                    {multipleNames.map((name, index) => (
                      <motion.div
                        key={`${name}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.32, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-slate-50 dark:bg-dark-900 border border-slate-200/95 dark:border-dark-700/90 rounded-xl p-4 sm:p-5 flex items-center justify-between gap-3 group hover:border-slate-300 dark:hover:border-cyan-400/22 hover:shadow-md dark:hover:shadow-[0_12px_36px_-18px_rgba(0,0,0,0.55)] transition-all duration-200"
                      >
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-dark-50 tracking-tight min-w-0">
                          {name}
                        </span>
                        <CopyButton
                          textToCopy={name}
                          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shrink-0 transition-opacity duration-200"
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3">
                  <button type="button" onClick={handleNewName} className={primaryBtn}>
                    Another sample
                  </button>
                  <button type="button" onClick={handleTenIdeas} className={secondaryBtn}>
                    Ten samples
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-slate-200 dark:border-dark-700">
                <ToggleSwitch
                  id="add-numbers"
                  label="Add numbers"
                  checked={addNumbers}
                  onCheckedChange={setAddNumbers}
                  icon={Hash}
                />
                <ToggleSwitch
                  id="add-symbols"
                  label="Add symbols"
                  checked={addSymbols}
                  onCheckedChange={setAddSymbols}
                  icon={AtSign}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <HomeExploreAside />
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 pb-6 sm:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <section className="lg:col-span-2 bg-white dark:bg-dark-800 border border-slate-200/95 dark:border-dark-700/90 rounded-2xl p-5 sm:p-8 shadow-[0_18px_48px_-28px_rgba(15,23,42,0.14)] dark:shadow-[0_24px_56px_-32px_rgba(0,0,0,0.55)] ring-1 ring-slate-900/[0.04] dark:ring-white/[0.05]">
            <header className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-dark-50 tracking-tight">
                Hubs & tools
              </h2>
              <p className="text-slate-600 dark:text-dark-300 mt-2 leading-relaxed">
                Same identity stack across the site—pick a lane and stay consistent.
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {popularCategories.map((c) => (
                <Link
                  key={c.to}
                  to={c.to}
                  className="group rounded-xl border border-slate-200/95 dark:border-dark-700/85 bg-slate-50 dark:bg-dark-900 p-4 sm:p-5 hover:border-slate-300 dark:hover:border-cyan-400/20 hover:shadow-md dark:hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.55)] transition-all duration-200 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-50 group-hover:text-slate-700 dark:group-hover:text-dark-100 transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-dark-300 mt-1 leading-relaxed">{c.desc}</p>
                    </div>
                    <ChevronDown className="w-5 h-5 text-slate-400 dark:text-dark-400 rotate-[-90deg] mt-1 shrink-0" aria-hidden />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-dark-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-50 mb-3">Browse by style</h3>
              <div className="flex flex-wrap gap-2">
                {trendingStyles.map((s) => (
                  <Link
                    key={`style-${s.to}`}
                    to={s.to}
                    className="px-3 py-2 rounded-full text-sm font-medium bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-slate-700 dark:text-dark-200 hover:border-slate-300 dark:hover:border-dark-600 transition-colors"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <aside className="bg-white dark:bg-dark-800 border border-slate-200/95 dark:border-dark-700/90 rounded-2xl p-5 sm:p-8 shadow-[0_18px_48px_-28px_rgba(15,23,42,0.14)] dark:shadow-[0_24px_56px_-32px_rgba(0,0,0,0.55)] ring-1 ring-slate-900/[0.04] dark:ring-white/[0.05] h-full">
            <header className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-dark-50 tracking-tight">Game-specific pages</h2>
              <p className="text-slate-600 dark:text-dark-300 mt-2 leading-relaxed">
                Editorial context and examples tuned per community—not generic filler.
              </p>
            </header>

            <div className="flex flex-wrap gap-2">
              {popularGames.map((g) => (
                <Link
                  key={g.to}
                  to={g.to}
                  className="px-3 py-2 rounded-full text-sm font-medium bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 text-slate-800 dark:text-dark-100 hover:border-slate-300 dark:hover:border-dark-600 transition-colors"
                >
                  {g.label}
                </Link>
              ))}
            </div>

            <p className="mt-8 pt-6 border-t border-slate-200 dark:border-dark-700 text-sm text-slate-600 dark:text-dark-400 leading-relaxed">
              Looking for policy or contact?{' '}
              <Link to="/about" className="font-medium text-slate-900 dark:text-dark-200 underline-offset-4 hover:underline">
                About
              </Link>
              {' · '}
              <Link to="/contact" className="font-medium text-slate-900 dark:text-dark-200 underline-offset-4 hover:underline">
                Contact
              </Link>
            </p>
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

      <section className="mt-16 max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 dark:text-dark-50 tracking-tight">
          Gaming identity utilities
        </h2>
        <p className="text-slate-700 dark:text-dark-300 mb-4 leading-relaxed">
          TryhardNames is a set of lightweight tools for naming and styling: curated suggestion lists, Unicode text
          styles, and symbol decorations you can copy anywhere your platform allows. Use the quick sampler above, then
          go deeper in a hub when you want a clearer lane or game-specific guidance.
        </p>

        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-dark-50 mt-10">Example handles</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-12">
          {examples.map((ex, i) => (
            <div
              key={i}
              className="p-3 bg-slate-100 dark:bg-dark-800 border border-slate-200/80 dark:border-dark-700 rounded-lg text-center text-slate-900 dark:text-dark-50 text-sm font-medium"
            >
              {ex}
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-dark-50">Frequently asked questions</h2>
        <div className="space-y-3 mb-12">
          {HOME_PAGE_FAQS.map((faq, i) => (
            <div
              key={i}
              className="p-4 bg-white dark:bg-dark-800 rounded-xl border border-slate-200 dark:border-dark-700"
            >
              <h3 className="font-semibold text-slate-900 dark:text-dark-50 mb-2">{faq.question}</h3>
              <p className="text-slate-700 dark:text-dark-300 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-dark-800">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-dark-50">Go deeper</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/roblox-names"
              className="px-5 py-2.5 rounded-lg font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition-colors"
            >
              Roblox names
            </Link>
            <Link
              to="/gamer-names"
              className="px-5 py-2.5 rounded-lg font-medium border border-slate-300 dark:border-dark-600 text-slate-900 dark:text-dark-50 hover:bg-slate-100 dark:hover:bg-dark-900 transition-colors"
            >
              Gamer names
            </Link>
          </div>
        </div>
      </section>

      <AdPlaceholderZone position="bottom" />
    </div>
  );
};

export default HomePage;
