import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const LeaderboardGamesChart = ({ data }) => {
  const chartData = data.slice(0, 8).map(item => ({
    name: item.gameName,
    players: item.activePlayers
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border/50 p-3 rounded-lg shadow-xl">
          <p className="font-bold text-foreground mb-1">{label}</p>
          <p className="text-green-400 font-mono">{(payload[0].value / 1000000).toFixed(1)}M Players</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 h-[350px]">
      <h3 className="text-lg font-bold mb-6 text-foreground/80">Top Games by Active Players</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis dataKey="name" stroke="#888" fontSize={12} angle={-45} textAnchor="end" height={60} />
          <YAxis stroke="#888" fontSize={12} tickFormatter={(val) => `${(val/1000000).toFixed(0)}M`} />
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
          <Bar dataKey="players" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#4ade80' : '#4ade8080'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeaderboardGamesChart;