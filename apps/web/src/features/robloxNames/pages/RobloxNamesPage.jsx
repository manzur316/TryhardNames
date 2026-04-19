import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RobloxNamesLayout } from '../components/RobloxNamesLayout.jsx';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { ArrowRight } from 'lucide-react';
import { useNameGenerator, NameGeneratorWidget } from '@/features/nameGenerators/index.js';
import { NamesGrid, TrendingNames } from '@/core/components/index.js';

export const RobloxNamesPage = () => {
  const type = 'roblox';
  const category = 'all';
  const { generatedNames, isGenerating, error, generateNames } = useNameGenerator(type, category);

  const trendingNames = ['ShadowNinja', 'NeonGhost', 'FrostBite', 'CyberNinja', 'VoidWalker', 'CrimsonStrike'];
  const [exampleNames] = useState([
    'ShadowNinja', 'PhantomKing', 'VortexStrike', 'NeonGhost', 
    'CrimsonBlade', 'SilentHunter', 'ThunderStorm', 'IceWizard'
  ]);

  useEffect(() => {
    generateNames(12);
  }, [generateNames]);

  const categories = [
    { title: 'Cool', desc: 'Edgy and awesome names that stand out in any server.', link: '/roblox-names/cool', emoji: '⚡', color: 'from-blue-500/10 to-cyan-500/5' },
    { title: 'Funny', desc: 'Hilarious names guaranteed to make other players laugh.', link: '/roblox-names/funny', emoji: '😂', color: 'from-purple-500/10 to-fuchsia-500/5' },
    { title: 'Aesthetic', desc: 'Pleasing, soft, and stylish names for a chill vibe.', link: '/roblox-names/aesthetic', emoji: '✨', color: 'from-pink-500/10 to-rose-500/5' },
    { title: 'Tryhard', desc: 'Sweaty and competitive names for serious players.', link: '/roblox-names/tryhard', emoji: '🎯', color: 'from-red-500/10 to-orange-500/5' }
  ];

  const faqs = [
    { q: 'Can I change my Roblox username?', a: 'Yes, you can change your Roblox username through your account settings. However, while creating an account is free, changing an existing username costs 1,000 Robux. This makes it crucial to pick a name you truly love from the start.' },
    { q: 'Are there username restrictions on Roblox?', a: 'Roblox has strict content moderation to maintain a safe environment. Usernames cannot contain profanity, personal information, or inappropriate references. They must also consist only of alphanumeric characters and a single underscore.' },
    { q: 'How long can a Roblox username be?', a: 'A Roblox username must be between 3 and 20 characters long. We recommend aiming for 5 to 12 characters, as shorter names are easier for other players to read quickly during fast-paced gameplay and look cleaner on leaderboards.' }
  ];

  return (
    <RobloxNamesLayout 
      title="Roblox Names Generator" 
      description="Discover the perfect Roblox username. Browse through our curated categories to find a name that matches your gaming style."
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-dark-50">
          Roblox Name Generator - Create Unique Usernames
        </h1>
        <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
          Navigate the massive ecosystem of Roblox with a username that captures your unique style. Because Roblox hosts millions of active players across thousands of distinct experiences, securing a memorable and available name requires creativity. Our generator is optimized specifically for Roblox's platform culture, helping you bypass the frustration of "username already taken" errors.
        </p>

        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50">
          What are Roblox names?
        </h2>
        <p className="text-slate-700 dark:text-dark-300 mb-4 leading-relaxed">
          Roblox names serve as your permanent digital identity across the entire platform. Unlike display names which can be changed frequently and duplicated, your actual username is entirely unique to you. It appears in the player list, above your avatar in classic games, and is required for friends to search and add your profile.
        </p>
        <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
          Because the platform encompasses everything from intense first-person shooters to relaxing life simulators, Roblox usernames often reflect a player's primary gaming interests. A highly competitive player might choose a sharp, aggressive name, while a roleplay enthusiast might opt for something softer and more aesthetic. Understanding these subcultures is key to picking the right identity.
        </p>

        <TrendingNames title="Trending Roblox Names" names={trendingNames} startIndex={0} maxItems={6} />

        <NamesGrid title="Popular Roblox Name Examples" names={exampleNames} />

        <div id="generator-section" className="mb-12">
          <NameGeneratorWidget 
            type={type}
            category={category}
            onGenerate={generateNames}
            generatedNames={generatedNames}
            isGenerating={isGenerating}
            error={error}
            title="Generate Roblox Names"
            buttonLabel="Generate More Roblox Names"
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
                <Card className={`h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-200 dark:border-dark-700 hover:border-blue-500/40 bg-gradient-to-br ${cat.color} bg-white dark:bg-dark-900`}>
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
            <Link to="/gamer-names" className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors min-h-[44px] flex items-center">Gamer Names</Link>
            <Link to="/stylish-text-generator" className="px-6 py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors min-h-[44px] flex items-center">Stylish Text</Link>
          </div>
        </div>
      </section>
    </RobloxNamesLayout>
  );
};