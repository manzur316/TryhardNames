import React, { useState } from 'react';
import { Copy, Check, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import { useToast } from '@/hooks/use-toast.js';

const LeaderboardNamesTable = ({ data }) => {
  const [copiedId, setCopiedId] = useState(null);
  const { toast } = useToast();

  const handleCopy = (name, id) => {
    navigator.clipboard.writeText(name);
    setCopiedId(id);
    toast({ title: "Copied!", description: `${name} copied to clipboard.`, className: "bg-card border-primary text-foreground" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderTrend = (trend, percent) => {
    if (trend === 'up') return <span className="text-green-500 flex items-center gap-1 text-xs"><TrendingUp className="w-3 h-3"/> +{percent}%</span>;
    if (trend === 'down') return <span className="text-red-500 flex items-center gap-1 text-xs"><TrendingDown className="w-3 h-3"/> -{percent}%</span>;
    return <span className="text-foreground/50 flex items-center gap-1 text-xs"><Minus className="w-3 h-3"/> 0%</span>;
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border/50 bg-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-background/50 text-foreground/70 uppercase text-xs font-bold border-b border-border/50">
          <tr>
            <th className="px-4 py-4 text-center w-16">#</th>
            <th className="px-4 py-4">Name</th>
            <th className="px-4 py-4 hidden md:table-cell">Category</th>
            <th className="px-4 py-4 hidden lg:table-cell">Game</th>
            <th className="px-4 py-4 text-right">Copies</th>
            <th className="px-4 py-4 text-right hidden sm:table-cell">Trend</th>
            <th className="px-4 py-4 text-center w-24">Actions</th>
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
                {item.name}
              </td>
              <td className="px-4 py-4 hidden md:table-cell text-foreground/70">
                <span className="bg-background px-2 py-1 rounded text-xs border border-border/50">{item.category}</span>
              </td>
              <td className="px-4 py-4 hidden lg:table-cell text-foreground/70">{item.gameType}</td>
              <td className="px-4 py-4 text-right font-mono text-primary">{item.copyCount.toLocaleString()}</td>
              <td className="px-4 py-4 text-right hidden sm:table-cell">
                {renderTrend(item.trend, item.changePercent)}
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-center gap-2">
                  <FavoriteButton name={item.name} category={item.category} gameType={item.gameType} className="w-8 h-8 p-1.5" />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleCopy(item.name, item.id)}
                    className={`w-8 h-8 ${copiedId === item.id ? 'text-green-500' : 'text-foreground/50 hover:text-primary'}`}
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardNamesTable;