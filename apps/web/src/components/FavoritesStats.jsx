import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Heart, Hash, Clock, TrendingUp } from 'lucide-react';

const FavoritesStats = ({ favorites }) => {
  if (!favorites || favorites.length === 0) return null;

  // Calculate stats
  const total = favorites.length;
  
  const categoryCount = favorites.reduce((acc, fav) => {
    acc[fav.category] = (acc[fav.category] || 0) + 1;
    return acc;
  }, {});
  
  const categoryData = Object.keys(categoryCount).map(key => ({
    name: key,
    value: categoryCount[key]
  })).sort((a, b) => b.value - a.value).slice(0, 5);

  const gameTypeCount = favorites.reduce((acc, fav) => {
    acc[fav.gameType] = (acc[fav.gameType] || 0) + 1;
    return acc;
  }, {});

  const gameTypeData = Object.keys(gameTypeCount).map(key => ({
    name: key,
    value: gameTypeCount[key]
  })).sort((a, b) => b.value - a.value).slice(0, 5);

  const COLORS = ['#00f0ff', '#ff003c', '#facc15', '#a855f7', '#4ade80', '#f97316'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border/50 p-2 rounded shadow-xl text-sm">
          <p className="font-bold text-foreground">{payload[0].name}</p>
          <p className="text-primary">{payload[0].value} names</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Summary Cards */}
      <div className="space-y-4">
        <div className="bg-card border border-border/50 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-lg text-red-500">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-foreground/60">Total Favorites</p>
            <p className="text-2xl font-black">{total}</p>
          </div>
        </div>
        <div className="bg-card border border-border/50 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-foreground/60">Top Category</p>
            <p className="text-xl font-bold truncate">{categoryData[0]?.name || 'N/A'}</p>
          </div>
        </div>
        <div className="bg-card border border-border/50 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-foreground/60">Latest Addition</p>
            <p className="text-lg font-bold truncate">{favorites[0]?.name || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Category Chart */}
      <div className="bg-card border border-border/50 p-4 rounded-xl flex flex-col">
        <h3 className="text-sm font-bold text-foreground/70 mb-2 text-center">By Category</h3>
        <div className="flex-grow min-h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Game Type Chart */}
      <div className="bg-card border border-border/50 p-4 rounded-xl flex flex-col">
        <h3 className="text-sm font-bold text-foreground/70 mb-2 text-center">By Game Type</h3>
        <div className="flex-grow min-h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gameTypeData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                {gameTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FavoritesStats;