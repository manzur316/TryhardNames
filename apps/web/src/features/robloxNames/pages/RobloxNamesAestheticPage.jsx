import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RobloxNamesLayout } from '../components/RobloxNamesLayout.jsx';
import { ArrowLeft } from 'lucide-react';
import { useNameGenerator, NameGeneratorWidget } from '@/features/nameGenerators/index.js';
import { NamesGrid, TrendingNames } from '@/core/components/index.js';

export const RobloxNamesAestheticPage = () => {
  const type = 'roblox';
  const category = 'aesthetic';
  const { generatedNames, isGenerating, error, generateNames } = useNameGenerator(type, category);

  const trendingNames = ['stxrrynight', 'velvetclouds', 'lxvender', 'oceanbreeze', 'mxcha', 'peachysky'];
  const [exampleNames] = useState([
    'cxsmic', 'sxftie', 'moonlxght', 'angxl', 
    'blxssom', 'crystxl', 'dxisy', 'ethxr'
  ]);

  useEffect(() => {
    generateNames(12);
  }, [generateNames]);

  const faqs = [
    { q: 'What makes a name aesthetically pleasing?', a: 'Aesthetic names rely on visual harmony and phonetic flow. They avoid harsh consonants and numbers, favoring soft sounds, lowercase letters, and themes related to nature, space, or gentle emotions.' },
    { q: 'Do aesthetic names work well in competitive gaming?', a: 'While they are most popular in social and roleplay games, using an aesthetic name in a competitive shooter can create a fun contrast. It shows you are relaxed and confident in your abilities.' },
    { q: 'How can I make my aesthetic name more unique?', a: 'Combine aesthetic principles with personal touches. Instead of just "stxrry", try combining it with a favorite color or a subtle emotion. Replacing vowels with "x" or "v" is a common technique to ensure the name is available.' }
  ];

  return (
    <RobloxNamesLayout 
      title="Aesthetic Roblox Names" 
      description="Soft, pleasing, and stylish names for a chill vibe."
      seoTitle="Aesthetic Roblox Names – Soft, Stylish & Cute Ideas | TryhardNames"
      seoDescription="Aesthetic Roblox name styles: lowercase vibes, soft themes, and clean spelling swaps that still fit Roblox username rules."
      faqs={faqs}
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/roblox-names" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-pink-600 dark:text-dark-400 dark:hover:text-pink-400 transition-colors min-h-[44px]">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Categories
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-dark-50">
          Aesthetic Roblox Names - Beautiful & Artistic Usernames
        </h1>
        <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
          Express your artistic side with a username that prioritizes visual harmony and poetic elegance. Aesthetic Roblox names are incredibly popular in fashion showcases, building games, and roleplay communities. They signal to other players that you appreciate design, mood, and a relaxed gaming atmosphere.
        </p>

        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50">
          What are aesthetic Roblox names?
        </h2>
        <p className="text-slate-700 dark:text-dark-300 mb-4 leading-relaxed">
          Aesthetic names are carefully crafted to look and sound beautiful. They focus heavily on flow, symmetry, and soft phonetic sounds. Unlike other categories that try to be loud or aggressive, aesthetic names are intentionally understated, often utilizing all-lowercase formatting to maintain a minimalist appearance.
        </p>
        <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
          These usernames frequently draw vocabulary from celestial bodies, weather phenomena, soft colors, and gentle emotions. A common trend in the aesthetic community is the strategic replacement of vowels with the letter 'x' or 'v', which not only looks visually distinct but helps players secure names that would otherwise be taken.
        </p>

        <TrendingNames title="Trending Aesthetic Roblox Names" names={trendingNames} startIndex={3} maxItems={6} />

        <NamesGrid title="Aesthetic Roblox Name Examples" names={exampleNames} />

        <div id="generator-section" className="mb-12">
          <NameGeneratorWidget 
            type={type}
            category={category}
            onGenerate={generateNames}
            generatedNames={generatedNames}
            isGenerating={isGenerating}
            error={error}
            title="Generate Aesthetic Names"
            buttonLabel="Generate Aesthetic Roblox Names"
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