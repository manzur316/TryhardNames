import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GamerNamesLayout } from '../components/GamerNamesLayout.jsx';
import { ArrowLeft } from 'lucide-react';
import { useNameGenerator, NameGeneratorWidget } from '@/features/nameGenerators/index.js';
import { NamesGrid, TrendingNames } from '@/core/components/index.js';

export const GamerNamesProPage = () => {
  const type = 'gamer';
  const category = 'pro';
  const { generatedNames, isGenerating, error, generateNames } = useNameGenerator(type, category);

  const trendingNames = ['Faker', 'TenZ', 'Scump', 'S1mple', 'Caps', 'Bugha'];
  const [exampleNames] = useState([
    'Shroud', 'ImperialHal', 'Rookie', 'ShowMaker', 
    'Chovy', 'Ruler', 'Deft', 'Viper'
  ]);

  useEffect(() => {
    generateNames(12);
  }, [generateNames]);

  const faqs = [
    { q: 'How important is a pro gamer name for esports success?', a: 'Incredibly important. A clean, professional name aids in brand recognition, makes it easier for shoutcasters to talk about you during broadcasts, and signals to esports organizations that you take your career seriously.' },
    { q: 'Should I change my name if I turn professional?', a: 'If your current name is overly long, contains inappropriate jokes, or is hard to pronounce, yes. Many players rebrand when entering the pro scene to ensure their identity is marketable and broadcast-friendly.' },
    { q: 'What makes a pro gamer name sponsorship-friendly?', a: 'Sponsors look for names that are clean, memorable, and free of controversy. A short, distinct name without numbers or edgy references is much easier to print on merchandise and feature in advertising campaigns.' }
  ];

  return (
    <GamerNamesLayout 
      title="Pro Gamer Names" 
      description="Clean, short, and professional names for competitive esports."
      seoTitle="Pro Gamer Names – Clean Esports & Competitive Tags | TryhardNames"
      seoDescription="Pro-style gamertags: short, broadcast-friendly aliases that read serious on leaderboards and are easier to reuse across brands."
      faqs={faqs}
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/gamer-names" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-purple-600 dark:text-dark-400 dark:hover:text-purple-400 transition-colors min-h-[44px]">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Categories
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-dark-50">
          Pro Gamer Names - Professional Gaming Usernames
        </h1>
        <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
          Launch your esports career with a username that commands respect and professional credibility. If you are competing in tournaments, climbing the highest ranked ladders, or seeking team recruitment, your name is your brand. A pro gamer name ensures you are taken seriously by organizations, sponsors, and the competitive community.
        </p>

        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50">
          What are pro gamer names?
        </h2>
        <p className="text-slate-700 dark:text-dark-300 mb-4 leading-relaxed">
          Pro gamer names are the gold standard of competitive gaming identities. They reflect high skill, marketability, and adherence to esports standards. These names are almost universally short—typically between three and six letters—making them incredibly easy for commentators to shout during fast-paced tournament broadcasts.
        </p>
        <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
          Unlike casual usernames, pro names strip away all unnecessary elements. You will not find random numbers, excessive underscores, or clan tags baked into the core name. Instead, they rely on strong, distinct phonetic sounds that look perfect printed on the back of a team jersey or featured in a sponsorship announcement.
        </p>

        <TrendingNames title="Trending Pro Gamer Names" names={trendingNames} startIndex={3} maxItems={6} />

        <NamesGrid title="Pro Gamer Name Examples" names={exampleNames} />

        <div id="generator-section" className="mb-12">
          <NameGeneratorWidget 
            type={type}
            category={category}
            onGenerate={generateNames}
            generatedNames={generatedNames}
            isGenerating={isGenerating}
            error={error}
            title="Sample pro-clean tags"
            buttonLabel="Sample more pro tags"
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