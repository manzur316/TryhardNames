import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Breadcrumb from '@/components/Breadcrumb.jsx';
import GameNameGenerator from '@/components/GameNameGenerator.jsx';
import GamePageSEOContent from '@/components/GamePageSEOContent.jsx';
import GameFAQSection from '@/components/GameFAQSection.jsx';
import ExploreMoreToolsSection from '@/components/ExploreMoreToolsSection.jsx';
import AdPlaceholderZone from '@/components/AdPlaceholderZone.jsx';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FortniteNamesPage = () => {
  const [genCount, setGenCount] = useState(0);

  const wordLibraries = {
    prefixes: ['Sweaty', 'Toxic', 'Lethal', 'Cracked', 'Goated', 'TTV', 'Faze', 'Ninja', 'Ghost', 'Dark'],
    core: ['Builder', 'Cranker', 'Sniper', 'Reaper', 'Phantom', 'Apex', 'Slayer', 'Demon', 'God', 'King'],
    suffixes: ['Xx', 'YT', 'Live', 'Pro', 'God', 'Prime', 'Zero', 'One', 'FPS', 'FN']
  };

  const trendingNames = ['Cracked⚡Builder', 'TTV_Sweaty', 'Lethal★Ninja', 'Ghost◆Reaper', 'Toxic✨Demon', 'GoatedSniper', 'DarkApex⚔️', 'Faze_Phantom'];

  return (
    <>
      <Helmet>
        <title>Fortnite Tryhard Names – Stylish & Competitive Gamer Tags 2026</title>
        <meta name="description" content="Generate stylish and competitive tryhard names for Fortnite. Cool, sweaty and aesthetic gamer tags instantly." />
      </Helmet>

      <div className="bg-background text-foreground flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 min-h-[350px] md:min-h-[400px] flex flex-col justify-center px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1576990049702-8418081b420e" alt="Fortnite Background" className="w-full h-full object-cover opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background to-background"></div>
          </div>
          
          <div className="container mx-auto max-w-4xl relative z-10 text-center space-y-6">
            <Breadcrumb items={[{ name: 'Fortnite Names', path: '/fortnite-tryhard-names' }]} />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight">
              Fortnite Tryhard Names Generator – <br className="hidden md:block" />
              <span className="text-primary glow-neon">Cool & Competitive</span> Gamer Tags
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 font-medium">Trusted by competitive players worldwide.</p>
          </div>
        </section>

        <AdPlaceholderZone position="top" />

        <section className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
          <GameNameGenerator 
            gameName="Fortnite" 
            wordLibraries={wordLibraries} 
            trendingNames={trendingNames} 
            onGenerate={() => setGenCount(c => c + 1)}
          />
          
          {genCount >= 3 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mt-8 bg-gradient-to-r from-card to-background border border-secondary/30 rounded-xl p-6 text-center shadow-refined"
            >
              <h3 className="text-xl font-bold text-foreground mb-2">Want something more aggressive?</h3>
              <p className="text-sm text-foreground/70 mb-4">Create a unified identity for your entire squad.</p>
              <Link to="/clan-name-generator" className="inline-flex items-center px-6 py-3 bg-secondary/10 text-secondary border border-secondary/30 rounded-lg hover:bg-secondary hover:text-white transition-all duration-300 font-medium">
                <Shield className="w-4 h-4 mr-2" /> Explore Clan Name Generator
              </Link>
            </motion.div>
          )}
        </section>

        <div className="container mx-auto px-4">
          <GamePageSEOContent game="fortnite" />
        </div>

        <AdPlaceholderZone position="mid" />

        <div className="container mx-auto px-4">
          <GameFAQSection game="fortnite" />
        </div>

        <div className="container mx-auto px-4">
          <ExploreMoreToolsSection game="fortnite" />
        </div>

        <AdPlaceholderZone position="bottom" />
      </div>
    </>
  );
};

export default FortniteNamesPage;