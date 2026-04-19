import React, { useState } from 'react';
import { Hash, Copy, Check, Flame } from 'lucide-react';
import { useToast } from '@/hooks/use-toast.js';

const MostPopularLoLTagsSection = () => {
  const [copiedId, setCopiedId] = useState(null);
  const { toast } = useToast();

  const popularTags = [
    { tag: 'T1', copies: '12.4k', trend: 'up' },
    { tag: 'G2', copies: '10.2k', trend: 'up' },
    { tag: 'FNC', copies: '8.9k', trend: 'neutral' },
    { tag: 'C9', copies: '7.5k', trend: 'down' },
    { tag: 'PRO', copies: '6.8k', trend: 'up' },
    { tag: 'GOD', copies: '5.4k', trend: 'up' },
    { tag: 'VNM', copies: '4.2k', trend: 'neutral' },
    { tag: 'SHD', copies: '3.9k', trend: 'up' }
  ];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    
    toast({
      title: "Tag Copied!",
      className: "bg-card border-[#5B2C6F] text-foreground",
      duration: 2000
    });

    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-[#5B2C6F]" />
          <h3 className="text-xl font-bold text-foreground">Popular Tags</h3>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-red-400 bg-red-400/10 px-2 py-1 rounded-full">
          <Flame className="w-3 h-3" /> Hot
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {popularTags.map((item, idx) => (
          <div 
            key={idx}
            className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/30 hover:border-[#5B2C6F]/50 transition-colors group"
          >
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-wider text-foreground group-hover:text-[#5B2C6F] transition-colors">{item.tag}</span>
              <span className="text-xs text-foreground/50">{item.copies} copies</span>
            </div>
            <button
              onClick={() => handleCopy(item.tag, idx)}
              className="p-2 rounded-md bg-card border border-border/50 text-foreground/60 hover:text-[#5B2C6F] hover:border-[#5B2C6F]/50 transition-colors"
            >
              {copiedId === idx ? <Check className="w-4 h-4 text-[#5B2C6F]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MostPopularLoLTagsSection;