import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RobloxNamesLayout } from '../components/RobloxNamesLayout.jsx';
import { ArrowLeft } from 'lucide-react';
import { useNameGenerator, NameGeneratorWidget } from '@/features/nameGenerators/index.js';
import { NamesGrid, TrendingNames } from '@/core/components/index.js';

export const RobloxNamesFunnyPage = () => {
  const type = 'roblox';
  const category = 'funny';
  const { generatedNames, isGenerating, error, generateNames } = useNameGenerator(type, category);

  const trendingNames = ['SirDerpsALot', 'TacticalPotato', 'CouchCommando', 'BreadPitt', 'Error404Skill', 'WalkingTarget'];
  const [exampleNames] = useState([
    'CerealKiller', 'ObiWanCannoli', 'NoobMaster99', 'LaggingLegend', 
    'SaltySpitoon', 'ChunkyMonkey', 'WaffleStomper', 'NoodleArms'
  ]);

  useEffect(() => {
    generateNames(12);
  }, [generateNames]);

  const faqs = [
    { q: 'Will a funny name hurt my reputation in competitive games?', a: 'Not necessarily. Many highly skilled players use funny names as a form of psychological warfare. Dominating a server while named "TacticalPotato" often frustrates opponents more than a serious name would.' },
    { q: 'How do I balance humor with professionalism in my username?', a: 'If you want a name that is funny but not overly ridiculous, rely on clever wordplay or mild self-deprecation rather than random internet humor. Puns based on common gaming terms work exceptionally well.' },
    { q: 'Are there types of humor that work better in Roblox?', a: 'Roblox has a younger demographic, so clean, absurd humor (like combining food items with military terms) tends to be the most successful and well-received by the community.' }
  ];

  return (
    <RobloxNamesLayout 
      title="Funny Roblox Names" 
      description="Hilarious and goofy names guaranteed to make other players laugh."
      seoTitle="Funny Roblox Names – Meme & Comedy Username Ideas | TryhardNames"
      seoDescription="Funny Roblox username ideas for players who want humor without breaking username rules. Clever wordplay, clean jokes, and memorable tags."
      faqs={faqs}
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/roblox-names" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-purple-600 dark:text-dark-400 dark:hover:text-purple-400 transition-colors min-h-[44px]">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Categories
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-dark-50">
          Funny Roblox Names - Humorous & Entertaining Usernames
        </h1>
        <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
          Gaming is ultimately about having fun, and a humorous username is the perfect way to spread entertainment across the platform. A funny Roblox name breaks the ice in social games, diffuses tension in competitive matches, and guarantees you will get a reaction from other players the moment you join a server.
        </p>

        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50">
          What makes a funny Roblox name?
        </h2>
        <p className="text-slate-700 dark:text-dark-300 mb-4 leading-relaxed">
          Funny Roblox names rely heavily on clever wordplay, unexpected contrasts, and comedic timing. They often take a very serious concept—like an assassin or a knight—and pair it with something completely mundane or absurd, like a household appliance or a snack food.
        </p>
        <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
          Puns are also incredibly popular in this category. Modifying famous phrases, celebrity names, or common gaming terminology to create a silly new meaning shows creativity. The best funny names are instantly understandable, ensuring the joke lands perfectly when someone reads it in the chat box.
        </p>

        <TrendingNames title="Trending Funny Roblox Names" names={trendingNames} startIndex={2} maxItems={6} />

        <NamesGrid title="Funny Roblox Name Examples" names={exampleNames} />

        <div id="generator-section" className="mb-12">
          <NameGeneratorWidget 
            type={type}
            category={category}
            onGenerate={generateNames}
            generatedNames={generatedNames}
            isGenerating={isGenerating}
            error={error}
            title="Sample funny tags"
            buttonLabel="Sample more funny tags"
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