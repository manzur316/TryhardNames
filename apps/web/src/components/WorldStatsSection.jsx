import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Globe, Target, ShieldAlert } from 'lucide-react';

const WorldStatsSection = () => {
  const [selectedYear, setSelectedYear] = useState('2023');

  const years = ['2023', '2022', '2021', '2020', '2019'];

  // Mock data for visualization
  const mostPickedData = [
    { name: 'Kai\'Sa', value: 78 },
    { name: 'Rell', value: 65 },
    { name: 'Xayah', value: 59 },
    { name: 'Orianna', value: 54 },
    { name: 'Azir', value: 48 },
  ];

  const mostBannedData = [
    { name: 'Maokai', value: 82 },
    { name: 'Kalista', value: 75 },
    { name: 'Neeko', value: 68 },
    { name: 'Rumble', value: 61 },
    { name: 'Jarvan IV', value: 55 },
  ];

  const regionWinsData = [
    { name: 'LCK (KR)', value: 8 },
    { name: 'LPL (CN)', value: 3 },
    { name: 'LEC (EU)', value: 1 },
    { name: 'LCS (NA)', value: 0 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border/50 p-3 rounded-lg shadow-xl">
          <p className="font-bold text-foreground">{label}</p>
          <p className="text-primary font-medium">{payload[0].value} Games</p>
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
            <Trophy className="w-6 h-6 text-yellow-500" /> World Championship Stats
          </h2>
          <p className="text-foreground/60">Historical data from LoL Esports</p>
        </div>
        <div className="flex gap-2">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                selectedYear === year 
                  ? 'bg-primary text-black' 
                  : 'bg-background border border-border/50 text-foreground/70 hover:text-primary'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Picked */}
        <div className="bg-card border border-border/50 p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" /> Most Picked Champions ({selectedYear})
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mostPickedData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="name" type="category" stroke="#ccc" width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {mostPickedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#3b82f6" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Banned */}
        <div className="bg-card border border-border/50 p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" /> Most Banned Champions ({selectedYear})
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mostBannedData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="name" type="category" stroke="#ccc" width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {mostBannedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#ef4444" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Region Wins */}
        <div className="bg-card border border-border/50 p-6 rounded-2xl lg:col-span-2">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-400" /> All-Time World Championships by Region
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionWinsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '8px' }}
                  itemStyle={{ color: '#4ade80', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" fill="#4ade80" radius={[4, 4, 0, 0]} maxBarSize={80} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldStatsSection;