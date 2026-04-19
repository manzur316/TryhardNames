import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Breadcrumb from '@/components/Breadcrumb.jsx';
import RobloxNameGenerator from '@/components/RobloxNameGenerator.jsx';
import RobloxGameTypeGenerator from '@/components/RobloxGameTypeGenerator.jsx';
import RobloxPopularGamesGallery from '@/components/RobloxPopularGamesGallery.jsx';
import RobloxHistorySection from '@/components/RobloxHistorySection.jsx';
import RobloxStatsSection from '@/components/RobloxStatsSection.jsx';
import GamePageSEOContent from '@/components/GamePageSEOContent.jsx';
import GameFAQSection from '@/components/GameFAQSection.jsx';
import ExploreMoreToolsSection from '@/components/ExploreMoreToolsSection.jsx';
import AdPlaceholderZone from '@/components/AdPlaceholderZone.jsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs.jsx';

const RobloxNamesPage = () => {
  const [genCount, setGenCount] = useState(0);
  const [activeTab, setActiveTab] = useState("generator");

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const handleGenerateForGame = (gameType) => {
    setActiveTab("gametype");
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Roblox Tryhard Names – Stylish & Competitive Gamer Tags 2026</title>
        <meta name="description" content="Generate stylish and competitive tryhard names for Roblox. Cool, sweaty and aesthetic gamer tags instantly." />
      </Helmet>

      <div className="bg-background text-foreground flex-grow flex flex-col">
        <section className="relative py-12 md:py-16 min-h-[350px] md:min-h-[400px] flex flex-col justify-center px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1612404730960-5c71577fca11" alt="Roblox Background" className="w-full h-full object-cover opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background to-background"></div>
          </div>
          
          <div className="container mx-auto max-w-4xl relative z-10 text-center space-y-6">
            <Breadcrumb items={[{ name: 'Roblox Names', path: '/roblox-tryhard-names' }]} />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight">
              Roblox Tryhard Names Generator – <br className="hidden md:block" />
              <span className="text-accent glow-cyan">Cool & Competitive</span> Gamer Tags
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 font-medium">Trusted by competitive players worldwide.</p>
          </div>
        </section>

        <AdPlaceholderZone position="top" />

        <section className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-transparent h-auto mb-8">
              <TabsTrigger value="generator" className="data-[state=active]:bg-primary data-[state=active]:text-black border border-border/50 py-3 rounded-xl font-bold">Name Generator</TabsTrigger>
              <TabsTrigger value="gametype" className="data-[state=active]:bg-primary data-[state=active]:text-black border border-border/50 py-3 rounded-xl font-bold">By Game Type</TabsTrigger>
              <TabsTrigger value="games" className="data-[state=active]:bg-primary data-[state=active]:text-black border border-border/50 py-3 rounded-xl font-bold">Popular Games</TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-black border border-border/50 py-3 rounded-xl font-bold">History</TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-primary data-[state=active]:text-black border border-border/50 py-3 rounded-xl font-bold">Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="mt-0">
              <div className="max-w-4xl mx-auto">
                <RobloxNameGenerator onGenerate={() => setGenCount(c => c + 1)} />
              </div>
            </TabsContent>

            <TabsContent value="gametype" className="mt-0">
              <div className="max-w-5xl mx-auto">
                <RobloxGameTypeGenerator />
              </div>
            </TabsContent>

            <TabsContent value="games" className="mt-0">
              <RobloxPopularGamesGallery onGenerateName={handleGenerateForGame} />
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <div className="max-w-4xl mx-auto">
                <RobloxHistorySection />
              </div>
            </TabsContent>

            <TabsContent value="stats" className="mt-0">
              <RobloxStatsSection />
            </TabsContent>
          </Tabs>
        </section>

        <div className="container mx-auto px-4">
          <GamePageSEOContent game="roblox" />
        </div>

        <AdPlaceholderZone position="mid" />

        <div className="container mx-auto px-4">
          <GameFAQSection game="roblox" />
        </div>

        <div className="container mx-auto px-4">
          <ExploreMoreToolsSection game="roblox" />
        </div>

        <AdPlaceholderZone position="bottom" />
      </div>
    </>
  );
};

export default RobloxNamesPage;