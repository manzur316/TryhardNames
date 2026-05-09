import React, { useState, useEffect } from 'react';
import { Tag, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { copyTextToClipboard } from '@/utils/clipboard.js';

const popularTagsData = [
  { text: "PRO", copies: 34200 },
  { text: "GOD", copies: 28500 },
  { text: "ACE", copies: 25100 },
  { text: "TRY", copies: 22400 },
  { text: "SWY", copies: 19800 },
  { text: "PRX", copies: 17500 },
  { text: "ZEN", copies: 15200 },
  { text: "NRG", copies: 14100 }
];

const MostPopularClanTagsSection = () => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [tags, setTags] = useState(popularTagsData);

  useEffect(() => {
    const interval = setInterval(() => {
      setTags(prev => prev.map(tag => ({
        ...tag,
        copies: tag.copies + Math.floor(Math.random() * 6) + 1
      })));
    }, 3500);
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
        <Tag className="w-8 h-8 text-accent" />
        <h2 className="text-3xl font-bold text-foreground">Most Popular Clan Tags</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tags.map((tag, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            className="bg-gradient-to-br from-card to-background border border-border/50 rounded-xl p-5 relative overflow-hidden group flex flex-col items-center text-center"
          >
            <div className="absolute top-0 right-0 w-12 h-12 bg-accent/10 rounded-bl-full -z-10"></div>
            
            <span className="text-2xl font-black text-foreground tracking-widest mb-3 group-hover:text-accent transition-colors">
              [{tag.text}]
            </span>
            
            <div className="flex items-center gap-2 text-xs text-foreground/60 mb-4">
              <motion.span
                key={tag.copies}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono font-bold text-accent"
              >
                {tag.copies.toLocaleString()}
              </motion.span>
              <span>copies</span>
            </div>

            <button
              onClick={() => handleCopy(`[${tag.text}]`, index)}
              className="w-full py-2 rounded-lg bg-background border border-border hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-2 text-sm font-bold"
            >
              {copiedIndex === index ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Tag</>}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default MostPopularClanTagsSection;