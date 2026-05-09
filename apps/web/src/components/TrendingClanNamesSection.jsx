import React, { useState, useEffect } from 'react';
import { TrendingUp, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { copyTextToClipboard } from '@/utils/clipboard.js';

const trendingData = [
  { text: "SweatyLegion", category: "Tryhard", copies: 15420 },
  { text: "PhoenixEsports", category: "Esports", copies: 12350 },
  { text: "PRX", category: "Short Tags", copies: 11200 },
  { text: "✨ Aesthetic Clan ✨", category: "Aesthetic", copies: 9840 },
  { text: "CompetitiveForce", category: "Tryhard", copies: 8750 },
  { text: "DragonSlayers", category: "Esports", copies: 7620 },
  { text: "GOD", category: "Short Tags", copies: 6540 },
  { text: "⭐ Elite Squad ⭐", category: "Aesthetic", copies: 5430 }
];

const TrendingClanNamesSection = () => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [names, setNames] = useState(trendingData);

  useEffect(() => {
    const interval = setInterval(() => {
      setNames(prev => prev.map(item => ({
        ...item,
        copies: item.copies + Math.floor(Math.random() * 4)
      })));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = async (text, index) => {
    const res = await copyTextToClipboard(text, { preventRepeatMs: 450, vibrateMs: 12 });
    if (!res.ok) return;
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1200);
  };

  return (
    <section className="py-12 border-t border-border/30">
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-bold text-foreground">Trending Clan Names</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {names.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -2 }}
            className="bg-card border border-border/50 rounded-xl p-5 flex flex-col justify-between group hover:border-primary/50 transition-colors"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary/80 mb-2 block">
                {item.category}
              </span>
              <p className="text-xl font-bold text-foreground mb-4">{item.text}</p>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
              <span className="text-xs text-foreground/50 font-mono">
                {item.copies.toLocaleString()} copies
              </span>
              <button
                onClick={() => handleCopy(item.text, index)}
                className="flex items-center gap-2 text-xs font-bold text-foreground/50 hover:text-primary transition-colors p-2 rounded-md hover:bg-primary/10"
                aria-label="Copy name"
              >
                {copiedIndex === index ? (
                  <><Check className="w-4 h-4 text-primary" /> <span className="text-primary">Copied. Dominate the lobby.</span></>
                ) : (
                  <><Copy className="w-4 h-4" /> Copy</>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TrendingClanNamesSection;