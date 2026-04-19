import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { TrendingUp, Users, Activity, Clock } from 'lucide-react';

const RobloxStatsSection = () => {
  const [timeFilter, setTimeFilter] = useState('Last Month');

  const periods = ['Last Week', 'Last Month', 'Last Year', 'Last 5 Years'];

  // Simulated data
  const trendData = [
    { date: 'Week 1', 'Aesthetic': 45, 'Tryhard': 30, 'Anime': 25 },
    { date: 'Week 2', 'Aesthetic': 48, 'Tryhard': 35, 'Anime': 28 },
    { date: 'Week 3', 'Aesthetic': 52, 'Tryhard': 42, 'Anime': 30 },
    { date: 'Week 4', 'Aesthetic': 55, 'Tryhard': 48, 'Anime': 35 },
  ];

  const categoryData = [
    { name: 'Roleplay', value: 85 },
    { name: 'Simulator', value: 65 },
    { name: 'Horror', value: 55 },
    { name: 'PvP', value: 45 },
    { name: 'Tycoon', value: 35 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border/50 p-3 rounded-lg shadow-xl">
          <p className="font-bold text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-medium text-sm">
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card border border-border/50 p-6 rounded-2xl">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" /> Community Statistics
          </h2>
          <p className="text-foreground/60">Roblox naming trends and game popularity</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {periods.map(period => (
            <button
              key={period}
              onClick={() => setTimeFilter(period)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                timeFilter === period 
                  ? 'bg-primary text-black' 
                  : 'bg-background border border-border/50 text-foreground/70 hover:text-primary'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Name Style Trends */}
        <div className="bg-card border border-border/50 p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" /> Name Style Trends
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="Aesthetic" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Tryhard" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Anime" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Game Types */}
        <div className="bg-card border border-border/50 p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-400" /> Most Played Game Types
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                <XAxis type="number" stroke="#888" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#ccc" width={80} fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '8px' }}
                  itemStyle={{ color: '#4ade80', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#4ade80" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobloxStatsSection;