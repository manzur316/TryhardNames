import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RobloxNamesLayout } from '../components/RobloxNamesLayout.jsx';
import { ArrowLeft } from 'lucide-react';
import { useNameGenerator, NameGeneratorWidget } from '@/features/nameGenerators/index.js';
import { NamesGrid, TrendingNames } from '@/core/components/index.js';

export const RobloxNamesTryhardPage = () => {
  const type = 'roblox';
  const category = 'tryhard';
  const { generatedNames, isGenerating, error, generateNames } = useNameGenerator(type, category);

  const trendingNames = ['TTV_AimGod', 'NotFlick', 'LethalStrike', 'SweatyWraith', 'ToxicBlade', 'ClutchKing'];
  const [exampleNames] = useState([
    'ProSniper', 'ApexFrag', 'TryhardTimmy', 'SweatLord', 
    'NoScopeNinja', 'FlickShot', 'HeadshotHero', 'ToxicTroll'
  ]);

  useEffect(() => {
    generateNames(12);
  }, [generateNames]);

  const faqs = [
    { q: 'Will a tryhard name make me a target in games?', a: 'Yes, it often will. When you use a highly competitive name, other players expect you to be skilled and may focus their efforts on defeating you. It is a badge of honor that invites a challenge.' },
    { q: 'How do I choose a tryhard name that matches my actual skill level?', a: 'If you are still improving, avoid names that claim absolute dominance (like "AimGod"). Instead, opt for sharp, aggressive names that sound intimidating without making specific claims about your rank or accuracy.' },
    { q: 'Can tryhard names help me get recruited for gaming teams?', a: 'Absolutely. Clan leaders and competitive teams look for players who take the game seriously. A clean, professional tryhard name signals dedication and makes you look like a viable recruit.' }
  ];

  return (
    <RobloxNamesLayout 
      title="Tryhard Roblox Names" 
      description="Sweaty, competitive, and intimidating names for serious players."
      seoTitle="Tryhard Roblox Names – Sweaty & Competitive Tags | TryhardNames"
      seoDescription="Tryhard Roblox username ideas built for competitive servers: aggressive tone, clean formatting, and naming patterns that read serious on profiles."
      faqs={faqs}
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/roblox-names" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-red-600 dark:text-dark-400 dark:hover:text-red-400 transition-colors min-h-[44px]">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Categories
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-dark-50">
          Tryhard Roblox Names - Competitive & Serious Usernames
        </h1>
        <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
          Establish dominance before the match even begins with a username that projects competitive prowess and dedication. Tryhard Roblox names are designed for players who play to win, whether in intense shooters, fast-paced minigames, or ranked arenas. These names let everyone in the lobby know that you are a serious threat.
        </p>

        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50">
          What are tryhard Roblox names?
        </h2>
        <p className="text-slate-700 dark:text-dark-300 mb-4 leading-relaxed">
          Tryhard names are characterized by their intensity and skill projection. They utilize aggressive terminology, powerful imagery, and specific gaming jargon to create an intimidating persona. You will rarely see numbers or random characters in a true tryhard name, as they aim for a clean, professional esports aesthetic.
        </p>
        <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
          Common elements include prefixes like "Not" or "Real", references to mechanical skills (like aim, movement, or clutching), and streaming tags like "TTV". The goal is to create a short, punchy name that looks great on a leaderboard and strikes fear into opponents when they see it in the kill feed.
        </p>

        <TrendingNames title="Trending Tryhard Roblox Names" names={trendingNames} startIndex={4} maxItems={6} />

        <NamesGrid title="Tryhard Roblox Name Examples" names={exampleNames} />

        <div id="generator-section" className="mb-12">
          <NameGeneratorWidget 
            type={type}
            category={category}
            onGenerate={generateNames}
            generatedNames={generatedNames}
            isGenerating={isGenerating}
            error={error}
            title="Sample tryhard tags"
            buttonLabel="Sample more tryhard tags"
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