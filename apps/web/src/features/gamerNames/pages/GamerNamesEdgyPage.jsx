import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GamerNamesLayout } from '../components/GamerNamesLayout.jsx';
import { ArrowLeft } from 'lucide-react';
import { useNameGenerator, NameGeneratorWidget } from '@/features/nameGenerators/index.js';
import { NamesGrid, TrendingNames } from '@/core/components/index.js';

export const GamerNamesEdgyPage = () => {
  const type = 'gamer';
  const category = 'edgy';
  const { generatedNames, isGenerating, error, generateNames } = useNameGenerator(type, category);

  const trendingNames = ['VoidReaper', 'ShadowDemon', 'AbyssalKnight', 'CrimsonWraith', 'SoulEater', 'DarkVortex'];
  const [exampleNames] = useState([
    'PhantomLord', 'BloodMoon', 'DarkKnight', 'ShadowKing', 
    'FrostBite', 'CyberNinja', 'NeonPulse', 'VoidWalker'
  ]);

  useEffect(() => {
    generateNames(12);
  }, [generateNames]);

  const faqs = [
    { q: 'Are edgy names considered "tryhard"?', a: 'They can be! Edgy names often overlap with tryhard names because both aim to project skill and dominance. However, edgy names focus more on dark aesthetics rather than pure competitive branding.' },
    { q: 'Can an edgy name be too offensive?', a: 'Yes. While you want to sound dangerous, avoid crossing the line into terms that violate a game\'s Terms of Service (like hate speech or extreme violence). Stick to fantasy and sci-fi darkness.' },
    { q: 'What games are best for edgy names?', a: 'Edgy names fit perfectly in competitive shooters (Valorant, CS:GO), battle royales (Apex Legends, Warzone), and dark fantasy MMOs or RPGs.' }
  ];

  return (
    <GamerNamesLayout 
      title="Edgy Gamer Names" 
      description="Dark, intimidating, and fierce names to strike fear into opponents."
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/gamer-names" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-purple-600 dark:text-dark-400 dark:hover:text-purple-400 transition-colors min-h-[44px]">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Categories
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-dark-50">
          Edgy Gamer Names - Bold Gaming Usernames
        </h1>
        <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
          Strike fear into the hearts of your opponents before the match even begins. Edgy gamer names are perfect for lone wolves, assassins, and players who prefer the shadows. These dark and intimidating usernames set a serious tone and let everyone know you're a dangerous adversary.
        </p>

        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50">
          What are edgy gamer names?
        </h2>
        <p className="text-slate-700 dark:text-dark-300 mb-4 leading-relaxed">
          Edgy gamer names utilize dark imagery, themes of destruction, shadows, or mythical monsters. They are designed to sound fierce, mysterious, and highly lethal, avoiding any humor or softness.
        </p>
        <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
          Combine words like 'Void', 'Abyss', 'Reaper', or 'Shadow' with aggressive nouns like 'Blade', 'Soul', or 'Walker'. Keep the formatting clean—avoiding numbers helps maintain the serious, intimidating aesthetic.
        </p>

        <TrendingNames title="Trending Edgy Gamer Names" names={trendingNames} startIndex={4} maxItems={6} />

        <NamesGrid title="Edgy Gamer Name Examples" names={exampleNames} />

        <div id="generator-section" className="mb-12">
          <NameGeneratorWidget 
            type={type}
            category={category}
            onGenerate={generateNames}
            generatedNames={generatedNames}
            isGenerating={isGenerating}
            error={error}
            title="Generate Edgy Names"
            buttonLabel="Generate Edgy Gamer Names"
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
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50">Explore More Tools</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/roblox-names" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors min-h-[44px] flex items-center">Roblox Names</Link>
            <Link to="/stylish-text-generator" className="px-6 py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors min-h-[44px] flex items-center">Stylish Text</Link>
          </div>
        </div>
      </section>
    </GamerNamesLayout>
  );
};