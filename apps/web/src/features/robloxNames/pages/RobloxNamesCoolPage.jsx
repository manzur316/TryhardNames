import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RobloxNamesLayout } from '../components/RobloxNamesLayout.jsx';
import { ArrowLeft } from 'lucide-react';
import { useNameGenerator, NameGeneratorWidget } from '@/features/nameGenerators/index.js';
import { NamesGrid, TrendingNames } from '@/core/components/index.js';

export const RobloxNamesCoolPage = () => {
  const type = 'roblox';
  const category = 'cool';
  const { generatedNames, isGenerating, error, generateNames } = useNameGenerator(type, category);

  const trendingNames = ['FrostBite', 'CyberNinja', 'NeonPulse', 'VoidWalker', 'CrimsonStrike', 'ShadowWeaver'];
  const [exampleNames] = useState([
    'AstralKnight', 'VenomFang', 'DarkVortex', 'NeonBlade', 
    'IceWolf', 'ThunderFury', 'SilentHunter', 'VoidKnight'
  ]);

  useEffect(() => {
    generateNames(12);
  }, [generateNames]);

  const faqs = [
    { q: 'Are cool names more likely to be taken?', a: 'Yes, because they rely on popular, strong vocabulary, many single-word cool names are already claimed. You will often need to combine two words or use creative spelling to secure your desired username.' },
    { q: 'Can I use special characters in cool names?', a: 'Roblox only allows letters, numbers, and a single underscore. You cannot use spaces or special symbols like asterisks or brackets. To keep a name looking cool, we recommend using CamelCase (capitalizing the first letter of each word) instead of underscores.' },
    { q: 'How often should I change my cool name?', a: 'Because changing a Roblox username costs 1,000 Robux, you should view your name as a long-term investment. Aim to keep a cool name for at least 6 to 12 months to build brand consistency and recognition among your friends.' }
  ];

  return (
    <RobloxNamesLayout 
      title="Cool Roblox Names" 
      description="Edgy, awesome, and unforgettable names for your Roblox character."
      seoTitle="Cool Roblox Names – Stylish & Edgy Username Ideas | TryhardNames"
      seoDescription="Generate cool Roblox display-name ideas: sleek, edgy styles that read clean on profiles and friend lists. Tips for availability and username rules included."
      faqs={faqs}
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/roblox-names" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-dark-400 dark:hover:text-blue-400 transition-colors min-h-[44px]">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Categories
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-dark-50">
          Cool Roblox Names - Stylish & Impressive Usernames
        </h1>
        <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
          Elevate your presence in any server with a sleek, sophisticated username. A cool Roblox name acts as your digital calling card, instantly communicating confidence and style to other players. Whether you are dominating in action games or leading a popular group, an impressive name ensures you are remembered long after the session ends.
        </p>

        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50">
          What makes a cool Roblox name?
        </h2>
        <p className="text-slate-700 dark:text-dark-300 mb-4 leading-relaxed">
          Cool Roblox names strike a balance between sophistication and memorability. They avoid the clutter of excessive numbers or random keyboard smashes, opting instead for clean, impactful word combinations. These names often draw inspiration from sci-fi, mythology, or elemental forces to create a strong visual and phonetic impression.
        </p>
        <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
          The best cool names frequently utilize alliteration or strong consonant sounds (like 'V', 'X', or 'Z') to sound sharp and decisive. They are easy to pronounce but carry an edge, making them perfect for players who want to be taken seriously without crossing into overly aggressive "tryhard" territory.
        </p>

        <TrendingNames title="Trending Cool Roblox Names" names={trendingNames} startIndex={1} maxItems={6} />

        <NamesGrid title="Cool Roblox Name Examples" names={exampleNames} />

        <div id="generator-section" className="mb-12">
          <NameGeneratorWidget 
            type={type}
            category={category}
            onGenerate={generateNames}
            generatedNames={generatedNames}
            isGenerating={isGenerating}
            error={error}
            title="Sample cool tags"
            buttonLabel="Sample more cool tags"
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