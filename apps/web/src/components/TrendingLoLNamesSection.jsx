import React, { useState, useEffect } from 'react';
import { TrendingUp, Copy, Check, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast.js';

const TrendingLoLNamesSection = () => {
  const [copiedId, setCopiedId] = useState(null);
  const [viewers, setViewers] = useState(142);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const trendingNames = [
    { name: 'ShadowAssassin', category: 'Champion' },
    { name: 'TitanForce', category: 'Team' },
    { name: 'RankedGrinder', category: 'Account' },
    { name: 'VNM', category: 'Short Tag' },
    { name: 'ArcaneForce', category: 'Champion' },
    { name: 'EliteSquad', category: 'Team' },
    { name: 'ProSummoner', category: 'Account' },
    { name: 'SHD', category: 'Short Tag' },
    { name: 'IronWall', category: 'Champion' },
    { name: 'DominantForce', category: 'Team' }
  ];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    
    toast({
      title: "Copied!",
      description: `${text} copied to clipboard.`,
      className: "bg-card border-[#C89B3C] text-foreground"
    });

    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-card/30 border border-border/50 rounded-2xl p-6 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#C89B3C]/10 rounded-xl">
            <TrendingUp className="w-6 h-6 text-[#C89B3C]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Trending LoL Names</h2>
            <p className="text-sm text-foreground/60">Most copied names today</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-full border border-border/50">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <Users className="w-4 h-4 text-foreground/60" />
          <span className="text-sm font-medium">{viewers} viewing now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {trendingNames.map((item, idx) => (
          <div 
            key={idx} 
            className="bg-background border border-border/50 rounded-xl p-4 flex flex-col justify-between group hover:border-[#C89B3C]/50 transition-all duration-300 hover:-translate-y-1 shadow-sm"
          >
            <div className="mb-4">
              <span className="text-xs font-bold text-[#0A8CC9] uppercase tracking-wider mb-1 block">{item.category}</span>
              <span className="font-bold text-foreground text-lg truncate block" title={item.name}>{item.name}</span>
            </div>
            <button
              onClick={() => handleCopy(item.name, idx)}
              className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                copiedId === idx 
                  ? 'bg-[#C89B3C] text-black' 
                  : 'bg-card border border-border/50 text-foreground/80 hover:text-[#C89B3C] hover:border-[#C89B3C]/50'
              }`}
            >
              {copiedId === idx ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingLoLNamesSection;