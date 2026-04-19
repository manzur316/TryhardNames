import React, { useState, useEffect } from 'react';
import { TrendingUp, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const trendingData = [
  { text: "★ Ranked Demon ★ | No excuses, just results. 💀", style: "Tryhard", copies: 1420 },
  { text: "🌙 lost in the digital world 🌙", style: "Aesthetic", copies: 1250 },
  { text: "I play on mute so I don't hear the haters. 🤫", style: "Funny", copies: 980 },
  { text: "Esports Athlete 🏆 | Victory is the only option.", style: "Competitive", copies: 890 },
  { text: "🖤 shadows only 🖤", style: "Dark", copies: 750 },
  { text: "Gamer | Creator | Always Learning", style: "Minimal", copies: 620 },
  { text: "If you're reading this, you're already in my crosshairs. 🎯", style: "Tryhard", copies: 1100 },
  { text: "pixelated dreams & neon nights ✨", style: "Aesthetic", copies: 940 }
];

const TrendingBiosSection = () => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [bios, setBios] = useState(trendingData);

  useEffect(() => {
    const interval = setInterval(() => {
      setBios(prev => prev.map(bio => ({
        ...bio,
        copies: bio.copies + Math.floor(Math.random() * 3)
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="py-12 border-t border-border/30">
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-bold text-foreground">Trending Gamer Bios Today</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {bios.map((bio, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -2 }}
            className="bg-card border border-border/50 rounded-xl p-5 flex flex-col justify-between group hover:border-primary/50 transition-colors"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary/80 mb-2 block">
                {bio.style}
              </span>
              <p className="text-foreground font-medium mb-4 whitespace-pre-wrap">{bio.text}</p>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
              <span className="text-xs text-foreground/50 font-mono">
                {bio.copies.toLocaleString()} copies
              </span>
              <button
                onClick={() => handleCopy(bio.text, index)}
                className="text-foreground/50 hover:text-primary transition-colors p-2 rounded-md hover:bg-primary/10"
                aria-label="Copy bio"
              >
                {copiedIndex === index ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TrendingBiosSection;