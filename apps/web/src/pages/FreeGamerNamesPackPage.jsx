import React, { useMemo } from 'react';
import { Swords, Sparkles, Zap, Trophy, Gem, TrendingUp, ChevronDown, Copy } from 'lucide-react';
import freeGamerNamesData from '@/data/freeGamerNamesData.js';
import NamesGrid from '@/components/NamesGrid.jsx';
import InteractionButtons from '@/components/InteractionButtons.jsx';
import { Button } from '@/components/ui/button.jsx';
import SeoHead from '@/seo/SeoHead.jsx';

const iconMap = {
  Swords,
  Sparkles,
  Zap,
  Trophy,
  Gem,
  TrendingUp
};

const FreeGamerNamesPackPage = () => {
  const allNames = useMemo(() => {
    return freeGamerNamesData.flatMap(section => section.names);
  }, []);

  const scrollToFirstSection = () => {
    document.getElementById('section-0')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenerateClick = () => {
    alert('Random name generated! (Demo)');
  };

  const handleCopyClick = () => {
    alert('Name copied to clipboard! (Demo)');
  };

  return (
    <>
    <SeoHead
      title="Free Gamer Names Pack – Curated Username List | TryhardNames"
      description="Browse a large curated list of gamer name ideas—tap to copy. Internal catalog page (noindex) for TryhardNames visitors."
      path="/free-gamer-names-pack"
      noIndex
      skipCanonical
    />
    <div className="bg-gradient-dark text-dark-300 font-sans selection:bg-accent-cyan/30 flex-grow flex flex-col">
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 flex flex-col items-center justify-center text-center min-h-[70vh]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-accent-cyan/5 via-dark-900 to-dark-950"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan font-bold text-sm mb-4">
            Exclusive Collection
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight text-dark-50">
            700 Free <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-cyan-purple">Gamer Names</span>
          </h1>
          <p className="text-lg md:text-xl text-dark-300 max-w-2xl mx-auto">
            Scroll through our massive, hand-curated list of the best gaming usernames. Click any name to copy it instantly.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button 
              onClick={scrollToFirstSection}
              className="bg-gradient-cyan-purple text-white hover:opacity-90 font-bold text-lg h-14 px-8 rounded-full animate-bounce"
            >
              Start Scrolling <ChevronDown className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              onClick={handleGenerateClick}
              variant="outline"
              className="border-accent-cyan/50 text-accent-cyan hover:bg-accent-cyan/10 font-bold text-lg h-14 px-8 rounded-full"
            >
              <Zap className="mr-2 w-5 h-5" /> Generate Random
            </Button>

            <Button 
              onClick={handleCopyClick}
              variant="outline"
              className="border-accent-purple/50 text-accent-purple hover:bg-accent-purple/10 font-bold text-lg h-14 px-8 rounded-full"
            >
              <Copy className="mr-2 w-5 h-5" /> Copy Random
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 pb-24 space-y-16 flex-grow">
        {freeGamerNamesData.map((section, index) => {
          const Icon = iconMap[section.icon] || Sparkles;
          
          return (
            <React.Fragment key={section.id}>
              <section id={`section-${index}`} className="scroll-mt-8">
                <div className="mb-8 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-dark-800 border border-dark-700" style={{ color: section.color }}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-dark-50">{section.title}</h2>
                  </div>
                  <p className="text-dark-400 text-lg">{section.description}</p>
                </div>

                <NamesGrid names={section.names} color={section.color} />
              </section>

              {/* Interaction Buttons after specific sections */}
              {(index === 1 || index === 3) && (
                <div className="space-y-8">
                  <InteractionButtons allNames={allNames} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </main>

      {/* Bottom Section */}
      <section className="border-t border-dark-700 bg-dark-800 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <h3 className="text-3xl font-black text-accent-cyan">Thanks for scrolling!</h3>
          <p className="text-dark-300">
            Did you find the perfect name? Share this page with your squad so they can upgrade their tags too.
          </p>
          <InteractionButtons allNames={allNames} />
        </div>
      </section>
    </div>
    </>
  );
};

export default FreeGamerNamesPackPage;