import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Breadcrumb from '@/components/Breadcrumb.jsx';
import LeagueOfLegendsNameGenerator from '@/components/LeagueOfLegendsNameGenerator.jsx';
import LeagueOfLegendsRoleGenerator from '@/components/LeagueOfLegendsRoleGenerator.jsx';
import ChampionBasedNameGenerator from '@/components/ChampionBasedNameGenerator.jsx';
import ChampionGallery from '@/components/ChampionGallery.jsx';
import WorldStatsSection from '@/components/WorldStatsSection.jsx';
import MetaStatsSection from '@/components/MetaStatsSection.jsx';
import LeagueOfLegendsPageSEOContent from '@/components/LeagueOfLegendsPageSEOContent.jsx';
import LeagueOfLegendsPageFAQ from '@/components/LeagueOfLegendsPageFAQ.jsx';
import TrendingLoLNamesSection from '@/components/TrendingLoLNamesSection.jsx';
import RecentlyGeneratedLoLNames from '@/components/RecentlyGeneratedLoLNames.jsx';
import MostPopularLoLTagsSection from '@/components/MostPopularLoLTagsSection.jsx';
import BuildYourIdentitySection from '@/components/BuildYourIdentitySection.jsx';
import AdPlaceholderZone from '@/components/AdPlaceholderZone.jsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs.jsx';

const LeagueOfLegendsNamesGeneratorPage = () => {
  const [genCount, setGenCount] = useState(0);
  const [activeTab, setActiveTab] = useState("general");
  const [selectedChampionForGen, setSelectedChampionForGen] = useState(null);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const handleGenerateForChampion = (champion) => {
    setSelectedChampionForGen(champion);
    setActiveTab("champion");
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>League of Legends Names Generator – Cool & Competitive LoL Names</title>
        <meta name="description" content="Create the perfect name for your League of Legends champion, team, or account. Generate cool, competitive and unique LoL names instantly." />
      </Helmet>

      <div className="bg-background text-foreground flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 min-h-[400px] flex flex-col justify-center px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A8CC9]/10 via-background to-background z-10"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5B2C6F]/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C89B3C]/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
          </div>
          
          <div className="container mx-auto max-w-4xl relative z-10 text-center space-y-6">
            <Breadcrumb items={[{ name: 'League of Legends Names', path: '/league-of-legends-names' }]} />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight">
              League of Legends <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A8CC9] via-[#C89B3C] to-[#5B2C6F]">
                Names Generator
              </span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 font-medium max-w-2xl mx-auto">
              Create the perfect identity for Summoner's Rift. Generate names by role, champion, or competitive style.
            </p>
          </div>
        </section>

        <AdPlaceholderZone position="top" />

        {/* Main Interactive Section with Tabs */}
        <section className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-transparent h-auto mb-8">
              <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-black border border-border/50 py-3 rounded-xl font-bold">Name Generator</TabsTrigger>
              <TabsTrigger value="gallery" className="data-[state=active]:bg-primary data-[state=active]:text-black border border-border/50 py-3 rounded-xl font-bold">Champions</TabsTrigger>
              <TabsTrigger value="champion" className="data-[state=active]:bg-primary data-[state=active]:text-black border border-border/50 py-3 rounded-xl font-bold">Champion Gen</TabsTrigger>
              <TabsTrigger value="world" className="data-[state=active]:bg-primary data-[state=active]:text-black border border-border/50 py-3 rounded-xl font-bold">World Stats</TabsTrigger>
              <TabsTrigger value="meta" className="data-[state=active]:bg-primary data-[state=active]:text-black border border-border/50 py-3 rounded-xl font-bold">Meta Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-0 space-y-8">
              <div className="max-w-4xl mx-auto">
                <LeagueOfLegendsNameGenerator onGenerate={() => setGenCount(c => c + 1)} />
              </div>
              <div className="max-w-4xl mx-auto">
                <LeagueOfLegendsRoleGenerator />
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="mt-0">
              <ChampionGallery onGenerateName={handleGenerateForChampion} />
            </TabsContent>

            <TabsContent value="champion" className="mt-0">
              <div className="max-w-5xl mx-auto">
                <ChampionBasedNameGenerator initialChampion={selectedChampionForGen} />
              </div>
            </TabsContent>

            <TabsContent value="world" className="mt-0">
              <WorldStatsSection />
            </TabsContent>

            <TabsContent value="meta" className="mt-0">
              <MetaStatsSection />
            </TabsContent>
          </Tabs>
        </section>

        {/* Trending & Recent Section */}
        <section className="container mx-auto max-w-7xl px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TrendingLoLNamesSection />
            </div>
            <div className="space-y-8">
              <RecentlyGeneratedLoLNames />
              <MostPopularLoLTagsSection />
            </div>
          </div>
        </section>

        <AdPlaceholderZone position="mid" />

        {/* SEO Content Section */}
        <section className="container mx-auto max-w-4xl px-4 py-16 border-t border-border/30">
          <LeagueOfLegendsPageSEOContent />
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto max-w-4xl px-4 py-16 border-t border-border/30">
          <LeagueOfLegendsPageFAQ />
        </section>

        {/* Internal Links Section */}
        <section className="container mx-auto px-4 py-16 border-t border-border/30">
          <BuildYourIdentitySection />
        </section>

        <AdPlaceholderZone position="bottom" />
      </div>
    </>
  );
};

export default LeagueOfLegendsNamesGeneratorPage;