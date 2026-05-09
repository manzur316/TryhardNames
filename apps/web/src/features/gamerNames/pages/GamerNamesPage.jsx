import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GamerNamesLayout } from '../components/GamerNamesLayout.jsx';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { ArrowRight } from 'lucide-react';
import { useNameGenerator, NameGeneratorWidget } from '@/features/nameGenerators/index.js';
import { NamesGrid, TrendingNames } from '@/core/components/index.js';

export const GamerNamesPage = () => {
  const type = 'gamer';
  const category = 'all';
  const { generatedNames, isGenerating, error, generateNames } = useNameGenerator(type, category);

  const trendingNames = ['ShadowAssassin', 'PhantomStrike', 'NeonBlade', 'VortexMaster', 'IceWolf', 'ThunderFury'];
  const [exampleNames] = useState([
    'SilentHunter', 'VoidKnight', 'CrimsonWraith', 'SoulEater', 
    'DarkVortex', 'PhantomLord', 'BloodMoon', 'ZeroKelvin'
  ]);

  useEffect(() => {
    generateNames(12);
  }, [generateNames]);

  const categories = [
    { title: 'Cool', desc: 'Sleek, memorable, and awesome gamertags for any platform.', link: '/gamer-names/cool', emoji: '⚡', color: 'from-blue-500/10 to-indigo-500/5' },
    { title: 'Funny', desc: 'Hilarious gamertags that will get a laugh in every lobby.', link: '/gamer-names/funny', emoji: '😂', color: 'from-purple-500/10 to-violet-500/5' },
    { title: 'Pro', desc: 'Clean, short, and professional names for competitive esports.', link: '/gamer-names/pro', emoji: '🏆', color: 'from-green-500/10 to-emerald-500/5' },
    { title: 'Edgy', desc: 'Dark, intimidating, and fierce names to strike fear into opponents.', link: '/gamer-names/edgy', emoji: '💀', color: 'from-slate-500/10 to-gray-500/5' }
  ];

  const faqs = [
    { q: 'Should I use the same name on all gaming platforms?', a: 'Yes, maintaining consistency across Discord, Steam, Xbox, and PlayStation is highly recommended. It builds your personal brand and makes it significantly easier for friends to find and add you across different ecosystems.' },
    { q: 'What platforms should I prioritize when choosing a gamer name?', a: 'Prioritize the platforms where you spend the most time or plan to build an audience. Steam and Discord are usually the most important for PC gamers, while Xbox Live or PSN take priority for console players.' },
    { q: 'How do I check if my gamer name is available across multiple platforms?', a: 'Before committing to a name, manually search for it on your primary gaming clients and social media platforms (like Twitch and Twitter). If your exact name is taken, try adding a consistent, short prefix to secure it everywhere.' }
  ];

  return (
    <GamerNamesLayout 
      title="Gamer Names Generator" 
      description="Find the ultimate gamertag for Xbox, PlayStation, or PC gaming. Choose a category to get started."
      seoTitle="Gamer Names Generator – Gamertags for PC, Xbox & PlayStation | TryhardNames"
      seoDescription="Cross-platform gamer name ideas: cool, funny, pro and edgy styles. Build a consistent alias for Discord, Steam, consoles and social profiles."
      faqs={faqs}
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-dark-50">
          Gamer Name Generator - Create Unique Gaming Usernames
        </h1>
        <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
          Build a consistent and recognizable identity across the entire gaming landscape. Whether you are chatting on Discord, streaming on Twitch, or climbing the ranks on Steam, a strong gamer name is your universal identifier. Our generator helps you craft a gamertag that translates perfectly across all platforms and communities.
        </p>

        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50">
          What are gamer names?
        </h2>
        <p className="text-slate-700 dark:text-dark-300 mb-4 leading-relaxed">
          Gamer names are universal identifiers that players use to represent themselves in the digital world. Unlike game-specific character names, a true gamertag is designed to be cross-platform functional. It serves as your primary alias for adding friends, joining guilds, and building a reputation in the broader gaming community.
        </p>
        <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
          A high-quality gamer name needs to be versatile. It should be easy to pronounce over voice communications, memorable enough for teammates to recall days later, and unique enough to be available across multiple services. Avoiding excessive numbers and complex spellings ensures your identity remains strong wherever you play.
        </p>

        <TrendingNames title="Trending Gamer Names" names={trendingNames} startIndex={0} maxItems={6} />

        <NamesGrid title="Popular Gamer Name Examples" names={exampleNames} />

        <div id="generator-section" className="mb-12">
          <NameGeneratorWidget 
            type={type}
            category={category}
            onGenerate={generateNames}
            generatedNames={generatedNames}
            isGenerating={isGenerating}
            error={error}
            title="Sample gamer tags"
            buttonLabel="Sample more gamer tags"
            defaultCount={12}
          />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 mb-12">
          {faqs.map((faq, i) => (
            <div key={i} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-slate-900 dark:text-dark-50 mb-2">{faq.q}</h3>
              <p className="text-slate-700 dark:text-dark-300 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50">Browse Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <Link key={cat.title} to={cat.link} className="block group">
                <Card className={`h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-200 dark:border-dark-700 hover:border-purple-500/40 bg-gradient-to-br ${cat.color} bg-white dark:bg-dark-900`}>
                  <CardHeader>
                    <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300 origin-left">
                      {cat.emoji}
                    </div>
                    <CardTitle className="text-2xl flex items-center justify-between text-slate-900 dark:text-dark-50">
                      {cat.title} Names
                      <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </CardTitle>
                    <CardDescription className="text-base mt-2 text-slate-600 dark:text-dark-400">
                      {cat.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 dark:border-dark-800">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50">Ready to Level Up Your Gaming Identity?</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/roblox-names" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors min-h-[44px] flex items-center">Roblox Names</Link>
            <Link to="/stylish-text-generator" className="px-6 py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors min-h-[44px] flex items-center">Stylish Text</Link>
          </div>
        </div>
      </section>
    </GamerNamesLayout>
  );
};