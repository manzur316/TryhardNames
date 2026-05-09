import React from 'react';
import { Helmet } from 'react-helmet';
import Breadcrumb from '@/components/Breadcrumb.jsx';
import ClanNameGenerator from '@/components/ClanNameGenerator.jsx';
import ClanPageSEOContent from '@/components/ClanPageSEOContent.jsx';
import ClanFAQSection from '@/components/ClanFAQSection.jsx';
import TrendingClanNamesSection from '@/components/TrendingClanNamesSection.jsx';
import RecentlyGeneratedClanNames from '@/components/RecentlyGeneratedClanNames.jsx';
import MostPopularClanTagsSection from '@/components/MostPopularClanTagsSection.jsx';
import BuildYourIdentitySection from '@/components/BuildYourIdentitySection.jsx';
import AdPlaceholderZone from '@/components/AdPlaceholderZone.jsx';
import { ArrowDown } from 'lucide-react';

const ClanNameGeneratorPage = () => {
  const scrollToGenerator = () => {
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Clan Names & Team Tags — Esports-Readable Rosters | TryhardNames</title>
        <meta name="description" content="Clan name ideas for squads and esports—short team tags that read clean on leaderboards and streams." />
      </Helmet>

      <div className="bg-background text-[#d6d6d6] selection:bg-primary/30 flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="relative pt-20 pb-12 px-4 overflow-hidden min-h-[350px] md:min-h-[400px] flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background z-0"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
          
          <div className="container mx-auto max-w-4xl relative z-10 text-center space-y-6">
            <div className="flex justify-center mb-2">
              <Breadcrumb items={[{ name: 'Clan Name Generator', path: '/clan-name-generator' }]} />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
              Clan names & team tags – <br className="hidden md:block" />
              <span className="text-primary">Esports-ready · roster-clear</span>
            </h1>
            <p className="text-lg md:text-xl text-[#d6d6d6] max-w-2xl mx-auto font-medium">
              Sample squad titles and taglines tuned for leaderboards, streams, and rosters.
            </p>
            
            <div className="pt-4">
              <button 
                onClick={scrollToGenerator}
                className="bg-primary text-black hover:bg-primary/90 text-lg px-8 py-4 rounded-xl font-bold transition-colors duration-300 flex items-center gap-2 mx-auto w-full sm:w-auto justify-center"
              >
                Open samples <ArrowDown className="w-5 h-5 animate-bounce" />
              </button>
            </div>
          </div>
        </section>

        {/* Main Generator Area */}
        <section id="generator" className="container mx-auto max-w-6xl px-4 py-10">
          <ClanNameGenerator />
        </section>

        {/* Dynamic Sections */}
        <div className="container mx-auto max-w-6xl px-4 space-y-16 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TrendingClanNamesSection />
            </div>
            <div>
              <RecentlyGeneratedClanNames />
            </div>
          </div>
          
          <div className="w-full h-px bg-border/30"></div>
          
          <MostPopularClanTagsSection />
        </div>

        {/* SEO Content */}
        <section className="container mx-auto px-4 py-10">
          <ClanPageSEOContent />
        </section>

        <AdPlaceholderZone position="mid" />

        {/* Related Tools */}
        <section className="container mx-auto px-4 py-10">
          <BuildYourIdentitySection />
        </section>

        <div className="w-full h-px bg-border/30 max-w-6xl mx-auto"></div>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-10">
          <ClanFAQSection />
        </section>

        <AdPlaceholderZone position="bottom" />
      </div>
    </>
  );
};

export default ClanNameGeneratorPage;