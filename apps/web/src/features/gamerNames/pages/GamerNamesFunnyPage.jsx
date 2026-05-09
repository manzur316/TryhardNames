import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GamerNamesLayout } from '../components/GamerNamesLayout.jsx';
import { ArrowLeft } from 'lucide-react';
import { useNameGenerator, NameGeneratorWidget } from '@/features/nameGenerators/index.js';
import { NamesGrid, TrendingNames } from '@/core/components/index.js';

export const GamerNamesFunnyPage = () => {
  const type = 'gamer';
  const category = 'funny';
  const { generatedNames, isGenerating, error, generateNames } = useNameGenerator(type, category);

  const trendingNames = ['CtrlAltDefeat', 'CerealKiller', 'ObiWanCannoli', 'Error404Aim', 'TacticalToaster', 'MorganFreekill'];
  const [exampleNames] = useState([
    'BreadPitt', 'CouchCommando', 'NoobMaster99', 'LaggingLegend', 
    'SaltySpitoon', 'ChunkyMonkey', 'WaffleStomper', 'NoodleArms'
  ]);

  useEffect(() => {
    generateNames(12);
  }, [generateNames]);

  const faqs = [
    { q: 'Are funny names good for streaming and content creation?', a: 'Absolutely. A funny name immediately signals to viewers that your content is entertaining and lighthearted. It increases audience engagement and makes your channel highly memorable in a crowded market.' },
    { q: 'How do I ensure my funny name doesn\'t become outdated?', a: 'Avoid basing your name on temporary internet trends or fleeting memes. Instead, rely on timeless humor like clever puns, self-deprecation, or universally understood gaming jokes that will still be funny years from now.' },
    { q: 'Can funny names work in professional gaming contexts?', a: 'While rare at the highest tiers of esports, many semi-pro players and popular streamers successfully use funny names. It shows personality and helps build a dedicated fanbase, though it may contrast with a highly serious team brand.' }
  ];

  return (
    <GamerNamesLayout 
      title="Funny Gamer Names" 
      description="Hilarious gamertags that will get a laugh in every lobby."
      seoTitle="Funny Gamer Names – Comedy Gamertags & Meme Tags | TryhardNames"
      seoDescription="Funny gamertag ideas for streams and casual play: clean jokes, clever wordplay, and memorable punchlines without risky wording."
      faqs={faqs}
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/gamer-names" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-purple-600 dark:text-dark-400 dark:hover:text-purple-400 transition-colors min-h-[44px]">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Categories
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-dark-50">
          Funny Gamer Names - Humorous Gaming Usernames
        </h1>
        <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
          Build a memorable persona that brings joy to every lobby you enter. A funny gamer name showcases your personality and proves you are here for a good time. Whether you are playing casual co-op games with friends or breaking the tension in a ranked match, humor is a fantastic way to connect with the gaming community.
        </p>

        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50">
          What are funny gamer names?
        </h2>
        <p className="text-slate-700 dark:text-dark-300 mb-4 leading-relaxed">
          Funny gamer names leverage gaming references, internet culture, and clever wordplay to create an entertaining alias. They often poke fun at common gaming frustrations—like bad aim, lag, or camping—turning shared annoyances into a source of comedy that other players instantly recognize and appreciate.
        </p>
        <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
          The most successful funny names create a strong community connection. By using puns based on famous characters, food items, or tech terminology (like "CtrlAltDefeat"), you create an immediate icebreaker. These names are designed to be read aloud, ensuring they get a chuckle when your name pops up in the kill feed.
        </p>

        <TrendingNames title="Trending Funny Gamer Names" names={trendingNames} startIndex={2} maxItems={6} />

        <NamesGrid title="Funny Gamer Name Examples" names={exampleNames} />

        <div id="generator-section" className="mb-12">
          <NameGeneratorWidget 
            type={type}
            category={category}
            onGenerate={generateNames}
            generatedNames={generatedNames}
            isGenerating={isGenerating}
            error={error}
            title="Sample funny gamertags"
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
            <Link to="/roblox-names" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors min-h-[44px] flex items-center">Roblox Names</Link>
            <Link to="/stylish-text-generator" className="px-6 py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors min-h-[44px] flex items-center">Stylish Text</Link>
          </div>
        </div>
      </section>
    </GamerNamesLayout>
  );
};