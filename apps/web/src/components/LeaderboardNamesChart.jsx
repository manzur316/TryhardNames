import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const LeaderboardNamesChart = ({ data }) => {
  const chartData = data.slice(0, 10).map(item => ({
    name: item.name,
    copies: item.copyCount
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border/50 p-3 rounded-lg shadow-xl">
          <p className="font-bold text-foreground mb-1">{label}</p>
          <p className="text-primary font-mono">{payload[0].value.toLocaleString()} copies</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 h-[400px]">
      <h3 className="text-lg font-bold mb-6 text-foreground/80">Top 10 Most Copied Names</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
          <XAxis type="number" stroke="#888" fontSize={12} tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val} />
          <YAxis dataKey="name" type="category" stroke="#ccc" width={100} fontSize={12} fontWeight="bold" />
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
          <Bar dataKey="copies" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index < 3 ? '#00f0ff' : '#00f0ff80'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeaderboardNamesChart;