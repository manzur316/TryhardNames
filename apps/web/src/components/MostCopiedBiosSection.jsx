import React, { useState, useEffect } from 'react';
import { Flame, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { copyTextToClipboard } from '@/utils/clipboard.js';

const popularData = [
  { text: "I carry my team heavier than my groceries. 🔥", copies: 25430 },
  { text: "✦ Casual Gamer | Just here for the vibes ✦", copies: 21200 },
  { text: "Grinding to the top. Fear the unseen. ⚔️", copies: 19850 },
  { text: "My aim is potato, but my heart is gold. 🥔", copies: 18400 },
  { text: "Leveling up in real life and in-game. 🎮", copies: 15200 }
];

const MostCopiedBiosSection = () => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [bios, setBios] = useState(popularData);

  useEffect(() => {
    const interval = setInterval(() => {
      setBios(prev => prev.map(bio => ({
        ...bio,
        copies: bio.copies + Math.floor(Math.random() * 5) + 1
      })));
    }, 3000);
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
        <Flame className="w-8 h-8 text-orange-500" />
        <h2 className="text-3xl font-bold text-foreground">Most Copied Bios All Time</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bios.map((bio, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-card to-background border border-border/50 rounded-xl p-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 rounded-bl-full -z-10"></div>
            
            <div className="flex justify-between items-start mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 font-bold text-sm">
                #{index + 1}
              </span>
              <button
                onClick={() => handleCopy(bio.text, index)}
                className="text-foreground/50 hover:text-orange-500 transition-colors p-2"
              >
                {copiedIndex === index ? <Check className="w-5 h-5 text-orange-500" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            
            <p className="text-lg font-medium text-foreground mb-6">{bio.text}</p>
            
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <Flame className="w-4 h-4 text-orange-500/70" />
              <motion.span
                key={bio.copies}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono font-bold text-orange-400"
              >
                {bio.copies.toLocaleString()}
              </motion.span>
              <span>copies</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default MostCopiedBiosSection;