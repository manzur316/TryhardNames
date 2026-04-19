import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Breadcrumb from '@/components/Breadcrumb.jsx';
import LeaderboardNamesTable from '@/components/LeaderboardNamesTable.jsx';
import LeaderboardNamesChart from '@/components/LeaderboardNamesChart.jsx';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import pb from '@/lib/pocketbaseClient.js';

const mockData = [
  { id: '1', name: 'xX_Demon_Xx', category: 'Tryhard', gameType: 'Fortnite', gender: 'Neutral', copyCount: 15420, trend: 'up', changePercent: 12 },
  { id: '2', name: 'ToxicSniper', category: 'Sweaty', gameType: 'Call of Duty', gender: 'Masculine', copyCount: 12350, trend: 'up', changePercent: 8 },
  { id: '3', name: 'LunaStar', category: 'Aesthetic', gameType: 'Valorant', gender: 'Feminine', copyCount: 10200, trend: 'down', changePercent: 3 },
  { id: '4', name: 'ProGamer99', category: 'Classic', gameType: 'Roblox', gender: 'Neutral', copyCount: 9800, trend: 'flat', changePercent: 0 },
  { id: '5', name: 'ShadowNinja', category: 'Anime', gameType: 'Free Fire', gender: 'Masculine', copyCount: 8450, trend: 'up', changePercent: 15 },
  { id: '6', name: 'FairyDust', category: 'Cute', gameType: 'Roblox', gender: 'Feminine', copyCount: 7200, trend: 'up', changePercent: 5 },
  { id: '7', name: 'GodlyAim', category: 'Tryhard', gameType: 'Valorant', gender: 'Neutral', copyCount: 6900, trend: 'down', changePercent: 2 },
  { id: '8', name: 'Kitsune', category: 'Anime', gameType: 'League of Legends', gender: 'Neutral', copyCount: 6500, trend: 'up', changePercent: 20 },
  { id: '9', name: 'DarkLord', category: 'Edgy', gameType: 'Fortnite', gender: 'Masculine', copyCount: 5800, trend: 'flat', changePercent: 0 },
  { id: '10', name: 'Bella', category: 'Short', gameType: 'Roblox', gender: 'Feminine', copyCount: 5100, trend: 'up', changePercent: 4 },
];

const LeaderboardNamesPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('popular');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const records = await pb.collection('leaderboard_names').getList(1, 50, {
          sort: '-copyCount',
          $autoCancel: false
        });
        
        if (records.items.length > 0) {
          setData(records.items);
        } else {
          setData(mockData);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  return (
    <>
      <Helmet>
        <title>Top Gaming Names Leaderboard | TryhardNames</title>
        <meta name="description" content="Discover the most popular and trending gaming names across Fortnite, Valorant, Roblox, and more." />
      </Helmet>

      <div className="bg-background text-foreground flex-grow flex flex-col">
        <div className="container mx-auto px-4 py-8 max-w-6xl flex-grow">
          <Breadcrumb items={[
            { name: 'Leaderboards', path: '/leaderboards' },
            { name: 'Names', path: '/leaderboard/names' }
          ]} />

          <div className="mb-10 mt-6">
            <h1 className="text-3xl md:text-4xl font-black mb-2">Names Leaderboard</h1>
            <p className="text-foreground/60">The most copied and favorited names across all games.</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="bg-card border border-border/50">
              <TabsTrigger value="popular">Most Popular</TabsTrigger>
              <TabsTrigger value="trending">Trending Now</TabsTrigger>
              <TabsTrigger value="rising">Rising Fast</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-8">
              <LeaderboardNamesChart data={data} />
              <LeaderboardNamesTable data={data} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LeaderboardNamesPage;