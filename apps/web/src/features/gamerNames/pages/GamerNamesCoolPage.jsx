import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GamerNamesLayout } from '../components/GamerNamesLayout.jsx';
import { ArrowLeft } from 'lucide-react';
import { useNameGenerator, NameGeneratorWidget } from '@/features/nameGenerators/index.js';
import { NamesGrid, TrendingNames } from '@/core/components/index.js';

export const GamerNamesCoolPage = () => {
  const type = 'gamer';
  const category = 'cool';
  const { generatedNames, isGenerating, error, generateNames } = useNameGenerator(type, category);

  const trendingNames = ['NeonPulse', 'CyberGhost', 'AstralKnight', 'VenomStrike', 'ZeroKelvin', 'QuantumRogue'];
  const [exampleNames] = useState([
    'FrostBite', 'ShadowWeaver', 'DarkVortex', 'NeonBlade', 
    'IceWolf', 'ThunderFury', 'SilentHunter', 'VoidKnight'
  ]);

  useEffect(() => {
    generateNames(12);
  }, [generateNames]);

  const faqs = [
    { q: 'Will a cool gamer name help me get more followers on Twitch?', a: 'Yes, branding is crucial for content creation. A cool, memorable name makes it easier for viewers to find you, remember your channel, and recommend you to others. It acts as the foundation of your streaming brand.' },
    { q: 'How do cool gamer names differ from cool Roblox names?', a: 'Gamer names tend to be more universal and mature, designed to fit into any genre from tactical shooters to grand strategy games. Roblox names often lean slightly more toward specific platform trends and younger aesthetics.' },
    { q: 'Can I use a cool gamer name for content creation?', a: 'Absolutely. When choosing a name for YouTube or streaming, ensure it is easy to say out loud, looks good in a logo, and is available across all major social media platforms to secure your brand.' }
  ];

  return (
    <GamerNamesLayout 
      title="Cool Gamer Names" 
      description="Sleek, memorable, and awesome gamertags for any platform."
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/gamer-names" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-purple-600 dark:text-dark-400 dark:hover:text-purple-400 transition-colors min-h-[44px]">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Categories
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-dark-50">
          Cool Gamer Names - Stylish Gaming Usernames
        </h1>
        <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
          Establish a professional and commanding presence across streaming platforms and competitive leagues. A cool gamer name is essential for players who want to be taken seriously in the broader gaming community. It provides a sleek, sophisticated identity that works just as well in a casual Discord call as it does on a tournament broadcast.
        </p>

        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50">
          What are cool gamer names?
        </h2>
        <p className="text-slate-700 dark:text-dark-300 mb-4 leading-relaxed">
          Cool gamer names masterfully balance sophistication with gaming culture. They avoid the cliché tropes of early internet usernames, opting instead for clean, evocative word combinations. These names often draw from cyberpunk, fantasy, or tactical themes to create an aura of skill and mystery.
        </p>
        <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
          The best cool names have strong esports appeal. They are concise, usually consisting of one or two syllables, making them perfect for quick callouts during intense gameplay. By avoiding numbers and special characters, these names maintain a premium, branded look that is highly respected in modern gaming.
        </p>

        <TrendingNames title="Trending Cool Gamer Names" names={trendingNames} startIndex={1} maxItems={6} />

        <NamesGrid title="Cool Gamer Name Examples" names={exampleNames} />

        <div id="generator-section" className="mb-12">
          <NameGeneratorWidget 
            type={type}
            category={category}
            onGenerate={generateNames}
            generatedNames={generatedNames}
            isGenerating={isGenerating}
            error={error}
            title="Generate Cool Names"
            buttonLabel="Generate Cool Gamer Names"
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