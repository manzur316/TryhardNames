import React from 'react';
import { Link } from 'react-router-dom';
import GamerBioGenerator from '@/components/GamerBioGenerator.jsx';
import GamerBioPageSEOContent from '@/components/GamerBioPageSEOContent.jsx';
import GamerBioFAQSection from '@/components/GamerBioFAQSection.jsx';
import TrendingBiosSection from '@/components/TrendingBiosSection.jsx';
import RecentlyGeneratedBios from '@/components/RecentlyGeneratedBios.jsx';
import MostCopiedBiosSection from '@/components/MostCopiedBiosSection.jsx';
import BuildYourIdentitySection from '@/components/BuildYourIdentitySection.jsx';
import { ArrowDown } from 'lucide-react';
import SeoHead from '@/seo/SeoHead.jsx';

const GamerBioGeneratorPage = () => {
  const scrollToGenerator = () => {
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
    <SeoHead
      title="Gamer Bio Generator – Discord, Twitch & Social Bios | TryhardNames"
      description="Short gaming bios for Discord, Twitch, and profiles—tryhard, aesthetic, and clean tones with copy-ready lines."
      path="/gamer-bio-generator"
    />
    <div className="bg-gradient-dark text-dark-300 selection:bg-accent-cyan/30 flex-grow flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-4 overflow-hidden min-h-[350px] md:min-h-[400px] flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-950 to-dark-950 z-0"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-cyan/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-dark-50 tracking-tight leading-tight">
            Gamer Bio Generator – <br className="hidden md:block" />
            <span className="text-accent-cyan">Tryhard & Aesthetic</span> Bios
          </h1>
          <p className="text-lg md:text-xl text-dark-300 max-w-2xl mx-auto font-medium">
            Lines tuned for how bios read in Discord, Twitch, and profiles—pick a tone, copy, refine.
          </p>
          <p className="text-sm text-dark-400 max-w-xl mx-auto">
            <Link to="/identity-kit" className="text-accent-cyan/90 hover:underline underline-offset-4">
              Drop your best line into an Identity Kit
            </Link>
            —bundle it with your handle and export a card.
          </p>
          
          <div className="pt-4">
            <button 
              onClick={scrollToGenerator}
              className="bg-gradient-cyan-purple text-white hover:opacity-90 text-lg px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 mx-auto w-full sm:w-auto justify-center"
            >
              Explore bios <ArrowDown className="w-5 h-5 animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Generator */}
      <section id="generator" className="container mx-auto max-w-5xl px-4 py-10">
        <GamerBioGenerator />
      </section>

      {/* Dynamic Sections */}
      <div className="container mx-auto max-w-6xl px-4 space-y-16 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TrendingBiosSection />
          </div>
          <div>
            <RecentlyGeneratedBios />
          </div>
        </div>
        
        <div className="w-full h-px bg-dark-700"></div>
        
        <MostCopiedBiosSection />
      </div>

      {/* SEO Content */}
      <section className="container mx-auto px-4 py-10">
        <GamerBioPageSEOContent />
      </section>

      <div className="w-full h-px bg-dark-700 max-w-6xl mx-auto"></div>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-10">
        <GamerBioFAQSection />
      </section>

      <div className="w-full h-px bg-dark-700 max-w-6xl mx-auto"></div>

      {/* Related Tools */}
      <section className="container mx-auto px-4 py-10">
        <BuildYourIdentitySection />
      </section>
    </div>
    </>
  );
};

export default GamerBioGeneratorPage;