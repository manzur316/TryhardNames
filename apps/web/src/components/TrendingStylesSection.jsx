import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast.js';

const initialTrending = [
  { id: 1, text: '★ 𝘛𝘰𝘹𝘪𝘤 𝘎𝘢𝘮𝘦𝘳 ★', category: 'Gaming' },
  { id: 2, text: '✧･ﾟ: *✧･ﾟ:* 𝓥𝒾𝒷ℯ𝓈 *:･ﾟ✧*:･ﾟ✧', category: 'Aesthetic' },
  { id: 3, text: 'TTV_S̶w̶e̶a̶t̶y̶', category: 'Gaming' },
  { id: 4, text: '𝕯𝖆𝖗𝖐 𝕷𝖊𝖌𝖎𝖔𝖓', category: 'Bold' },
  { id: 5, text: 'ⓑⓤⓑⓑⓛⓔⓢ', category: 'Aesthetic' },
  { id: 6, text: 'G̸l̸i̸t̸c̸h̸', category: 'Symbols' },
  { id: 7, text: 'Pʀᴏ ᴾˡᵃʸᵉʳ', category: 'Gaming' },
  { id: 8, text: 'ａｅｓｔｈｅｔｉｃ', category: 'Aesthetic' },
  { id: 9, text: '【N】【i】【n】【j】【a】', category: 'Bold' },
  { id: 10, text: '꧁༒☬Crown☬༒꧂', category: 'Symbols' }
];

const TrendingStylesSection = () => {
  const [trending, setTrending] = useState(initialTrending);
  const [copiedId, setCopiedId] = useState(null);
  const { toast } = useToast();

  // Simulate dynamic updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTrending(prev => {
        const newArr = [...prev];
        // Swap two random items to simulate movement
        const idx1 = Math.floor(Math.random() * newArr.length);
        const idx2 = Math.floor(Math.random() * newArr.length);
        const temp = newArr[idx1];
        newArr[idx1] = newArr[idx2];
        newArr[idx2] = temp;
        return newArr;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (item) => {
    navigator.clipboard.writeText(item.text);
    setCopiedId(item.id);
    
    toast({
      title: "Trending style copied!",
      description: "Ready to use.",
      className: "bg-card border-primary text-foreground",
      duration: 2000,
    });

    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="py-12 border-t border-border/15">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 flex items-center justify-center gap-3">
          <TrendingUp className="w-7 h-7 text-secondary" />
          Trending Text Combinations
        </h2>
        <p className="text-[#d6d6d6]">The most copied styles by the community right now</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <AnimatePresence mode="popLayout">
          {trending.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="bg-card border border-border/40 rounded-xl p-4 flex flex-col justify-between group hover:border-secondary/50 transition-colors"
            >
              <div className="mb-3">
                <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-base text-[#d6d6d6] group-hover:text-white transition-colors truncate">
                  {item.text}
                </span>
                <button
                  onClick={() => handleCopy(item)}
                  className="p-2 rounded-md bg-background border border-border/50 text-foreground/60 hover:text-secondary hover:border-secondary/50 transition-colors"
                >
                  {copiedId === item.id ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TrendingStylesSection;