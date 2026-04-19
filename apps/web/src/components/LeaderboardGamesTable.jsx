import React from 'react';
import { TrendingUp, TrendingDown, Minus, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useNavigate } from 'react-router-dom';

const LeaderboardGamesTable = ({ data }) => {
  const navigate = useNavigate();

  const renderTrend = (trend, percent) => {
    if (trend === 'up') return <span className="text-green-500 flex items-center gap-1 text-xs"><TrendingUp className="w-3 h-3"/> +{percent}%</span>;
    if (trend === 'down') return <span className="text-red-500 flex items-center gap-1 text-xs"><TrendingDown className="w-3 h-3"/> -{percent}%</span>;
    return <span className="text-foreground/50 flex items-center gap-1 text-xs"><Minus className="w-3 h-3"/> 0%</span>;
  };

  const getGamePath = (gameName) => {
    const map = {
      'Fortnite': '/fortnite-tryhard-names',
      'Valorant': '/valorant-tryhard-names',
      'Roblox': '/roblox-tryhard-names',
      'Call of Duty': '/cod-tryhard-names',
      'Free Fire': '/free-fire-tryhard-names',
      'League of Legends': '/league-of-legends-names'
    };
    return map[gameName] || '/';
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border/50 bg-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-background/50 text-foreground/70 uppercase text-xs font-bold border-b border-border/50">
          <tr>
            <th className="px-4 py-4 text-center w-16">#</th>
            <th className="px-4 py-4">Game</th>
            <th className="px-4 py-4 hidden md:table-cell">Platform</th>
            <th className="px-4 py-4 text-right">Active Players</th>
            <th className="px-4 py-4 text-right hidden sm:table-cell">Names Gen.</th>
            <th className="px-4 py-4 text-right hidden lg:table-cell">Trend</th>
            <th className="px-4 py-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {data.map((item, index) => (
            <tr key={item.id} className="hover:bg-background/30 transition-colors group">
              <td className="px-4 py-4 text-center font-bold text-foreground/50">
                {index === 0 ? <span className="text-yellow-500 text-lg">1</span> : 
                 index === 1 ? <span className="text-gray-400 text-lg">2</span> : 
                 index === 2 ? <span className="text-amber-600 text-lg">3</span> : index + 1}
              </td>
              <td className="px-4 py-4 font-black text-base text-foreground group-hover:text-primary transition-colors">
                {item.gameName}
              </td>
              <td className="px-4 py-4 hidden md:table-cell text-foreground/70">
                <span className="bg-background px-2 py-1 rounded text-xs border border-border/50">{item.platform}</span>
              </td>
              <td className="px-4 py-4 text-right font-mono text-primary">
                {(item.activePlayers / 1000000).toFixed(1)}M
              </td>
              <td className="px-4 py-4 text-right hidden sm:table-cell font-mono text-foreground/80">
                {item.namesGenerated.toLocaleString()}
              </td>
              <td className="px-4 py-4 text-right hidden lg:table-cell">
                {renderTrend(item.trend, item.changePercent)}
              </td>
              <td className="px-4 py-4 text-center">
                <Button 
                  size="sm" 
                  onClick={() => navigate(getGamePath(item.gameName))}
                  className="bg-primary/10 text-primary hover:bg-primary hover:text-black font-bold text-xs"
                >
                  <Sparkles className="w-3 h-3 mr-1" /> Gen Names
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardGamesTable;