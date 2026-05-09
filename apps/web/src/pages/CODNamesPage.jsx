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

const CODNamesPage = () => {
  const [genCount, setGenCount] = useState(0);

  const wordLibraries = {
    prefixes: ['Ghost', 'Reaper', 'Sniper', 'Tactical', 'Bravo', 'Echo', 'Delta', 'Shadow', 'Rogue', 'Elite'],
    core: ['Actual', 'Six', 'Zero', 'Hunter', 'Killer', 'Operator', 'Vanguard', 'Striker', 'Phantom', 'Wraith'],
    suffixes: ['MW', 'WZ', 'Ops', 'TTV', 'Pro', 'God', 'Actual', 'One', 'X', 'Z']
  };

  const trendingNames = ['Ghost★Actual', 'ReaperSix', 'SniperZero', 'TacticalHunter', 'BravoKiller', 'EchoOperator', 'DeltaVanguard', 'ShadowStriker'];

  return (
    <>
      <Helmet>
        <title>COD Name Tags — Warzone & Multiplayer Handles | TryhardNames</title>
        <meta name="description" content="COD tryhard name ideas for killfeed and squad UI—readable tags for Warzone and multiplayer." />
      </Helmet>

      <div className="bg-background text-foreground flex-grow flex flex-col">
        <section className="relative py-12 md:py-16 min-h-[350px] md:min-h-[400px] flex flex-col justify-center px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1543882501-9251a94dc7c3" alt="Call of Duty Background" className="w-full h-full object-cover opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background to-background"></div>
          </div>
          
          <div className="container mx-auto max-w-4xl relative z-10 text-center space-y-6">
            <Breadcrumb items={[{ name: 'COD Names', path: '/cod-tryhard-names' }]} />
            <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight text-balance">
              <span className="block">COD name tags</span>
              <span className="block mt-3 text-lg sm:text-xl md:text-2xl font-semibold text-emerald-400/95">
                Killfeed-first · squad-ready
              </span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 font-medium">Handles tuned for scoreboard reads and comms.</p>
          </div>
        </section>

        <AdPlaceholderZone position="top" />

        <section className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
          <GameNameGenerator 
            gameName="Call of Duty" 
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
              <h3 className="text-xl font-bold text-foreground mb-2">Squad tags</h3>
              <p className="text-sm text-foreground/70 mb-4">Short clan handles that stay legible in rosters and killfeeds.</p>
              <Link to="/clan-name-generator" className="inline-flex items-center px-6 py-3 bg-secondary/10 text-secondary border border-secondary/30 rounded-lg hover:bg-secondary hover:text-white transition-all duration-300 font-medium">
                <Shield className="w-4 h-4 mr-2" /> Clan name ideas
              </Link>
            </motion.div>
          )}
        </section>

        <div className="container mx-auto px-4">
          <GamePageSEOContent game="cod" />
        </div>

        <AdPlaceholderZone position="mid" />

        <div className="container mx-auto px-4">
          <GameFAQSection game="cod" />
        </div>

        <div className="container mx-auto px-4">
          <ExploreMoreToolsSection game="cod" />
        </div>

        <AdPlaceholderZone position="bottom" />
      </div>
    </>
  );
};

export default CODNamesPage;