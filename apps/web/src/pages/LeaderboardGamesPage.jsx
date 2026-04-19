import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Breadcrumb from '@/components/Breadcrumb.jsx';
import LeaderboardGamesTable from '@/components/LeaderboardGamesTable.jsx';
import LeaderboardGamesChart from '@/components/LeaderboardGamesChart.jsx';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import pb from '@/lib/pocketbaseClient.js';

const mockData = [
  { id: '1', gameName: 'Roblox', platform: 'Multiplatform', gameType: 'Sandbox', activePlayers: 65000000, namesGenerated: 1250000, trend: 'up', changePercent: 5 },
  { id: '2', gameName: 'Fortnite', platform: 'Multiplatform', gameType: 'Battle Royale', activePlayers: 25000000, namesGenerated: 980000, trend: 'up', changePercent: 2 },
  { id: '3', gameName: 'Valorant', platform: 'PC', gameType: 'Tactical Shooter', activePlayers: 18000000, namesGenerated: 850000, trend: 'up', changePercent: 8 },
  { id: '4', gameName: 'League of Legends', platform: 'PC', gameType: 'MOBA', activePlayers: 150000000, namesGenerated: 720000, trend: 'flat', changePercent: 0 },
  { id: '5', gameName: 'Call of Duty', platform: 'Multiplatform', gameType: 'FPS', activePlayers: 30000000, namesGenerated: 650000, trend: 'down', changePercent: 3 },
  { id: '6', gameName: 'Free Fire', platform: 'Mobile', gameType: 'Battle Royale', activePlayers: 40000000, namesGenerated: 580000, trend: 'up', changePercent: 12 },
];

const LeaderboardGamesPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('popular');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const records = await pb.collection('leaderboard_games').getList(1, 50, {
          sort: '-activePlayers',
          $autoCancel: false
        });
        
        if (records.items.length > 0) {
          setData(records.items);
        } else {
          setData(mockData);
        }
      } catch (error) {
        console.error('Error fetching games leaderboard:', error);
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
        <title>Top Games Leaderboard | TryhardNames</title>
        <meta name="description" content="See which games are currently the most popular and generating the most names." />
      </Helmet>

      <div className="bg-background text-foreground flex-grow flex flex-col">
        <div className="container mx-auto px-4 py-8 max-w-6xl flex-grow">
          <Breadcrumb items={[
            { name: 'Leaderboards', path: '/leaderboards' },
            { name: 'Games', path: '/leaderboard/games' }
          ]} />

          <div className="mb-10 mt-6">
            <h1 className="text-3xl md:text-4xl font-black mb-2">Games Leaderboard</h1>
            <p className="text-foreground/60">Top games by popularity and name generation activity.</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="bg-card border border-border/50">
              <TabsTrigger value="popular">Most Popular</TabsTrigger>
              <TabsTrigger value="trending">Trending Now</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-8">
              <LeaderboardGamesChart data={data} />
              <LeaderboardGamesTable data={data} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LeaderboardGamesPage;