import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react';

const MetaStatsSection = () => {
  // Mock trend data
  const trendData = [
    { day: 'Mon', 'Smolder': 48.2, 'Maokai': 52.1, 'Jinx': 50.5 },
    { day: 'Tue', 'Smolder': 49.5, 'Maokai': 51.8, 'Jinx': 50.2 },
    { day: 'Wed', 'Smolder': 50.8, 'Maokai': 51.5, 'Jinx': 49.8 },
    { day: 'Thu', 'Smolder': 51.5, 'Maokai': 51.2, 'Jinx': 49.5 },
    { day: 'Fri', 'Smolder': 52.3, 'Maokai': 50.9, 'Jinx': 49.1 },
    { day: 'Sat', 'Smolder': 53.1, 'Maokai': 50.5, 'Jinx': 48.8 },
    { day: 'Sun', 'Smolder': 53.8, 'Maokai': 50.1, 'Jinx': 48.5 },
  ];

  const topWinRates = [
    { name: 'Janna', role: 'Support', rate: '53.4%', change: '+1.2%' },
    { name: 'Smolder', role: 'ADC', rate: '53.1%', change: '+4.9%' },
    { name: 'Zac', role: 'Jungle', rate: '52.8%', change: '+0.5%' },
    { name: 'Twisted Fate', role: 'Mid', rate: '52.5%', change: '-0.3%' },
    { name: 'Aatrox', role: 'Top', rate: '52.2%', change: '+0.1%' },
  ];

  const decliningChamps = [
    { name: 'K\'Sante', role: 'Top', rate: '46.8%', change: '-2.4%' },
    { name: 'Aphelios', role: 'ADC', rate: '47.1%', change: '-1.8%' },
    { name: 'Syndra', role: 'Mid', rate: '47.5%', change: '-1.5%' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card border border-border/50 p-6 rounded-2xl">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" /> Current Meta Stats
          </h2>
          <p className="text-foreground/60">Patch 14.4 Analysis</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-green-400 bg-green-400/10 px-4 py-2 rounded-full">
          <Clock className="w-4 h-4" /> Updated 2 hours ago
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Win Rate Trends Chart */}
        <div className="bg-card border border-border/50 p-6 rounded-2xl lg:col-span-2">
          <h3 className="text-lg font-bold mb-6">Win Rate Trends (Last 7 Days)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#888" tickFormatter={(val) => `${val}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '8px' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend />
                <Line type="monotone" dataKey="Smolder" stroke="#C89B3C" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Maokai" stroke="#0A8CC9" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Jinx" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performers */}
        <div className="space-y-6">
          <div className="bg-card border border-border/50 p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" /> Top Win Rates
            </h3>
            <div className="space-y-3">
              {topWinRates.map((champ, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 hover:bg-background rounded-lg transition-colors">
                  <div>
                    <span className="font-bold block">{champ.name}</span>
                    <span className="text-xs text-foreground/60">{champ.role}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-green-400 block">{champ.rate}</span>
                    <span className="text-xs text-green-400/70">{champ.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border/50 p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-400" /> Declining
            </h3>
            <div className="space-y-3">
              {decliningChamps.map((champ, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 hover:bg-background rounded-lg transition-colors">
                  <div>
                    <span className="font-bold block">{champ.name}</span>
                    <span className="text-xs text-foreground/60">{champ.role}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-red-400 block">{champ.rate}</span>
                    <span className="text-xs text-red-400/70">{champ.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaStatsSection;