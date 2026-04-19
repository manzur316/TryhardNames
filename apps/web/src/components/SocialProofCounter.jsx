import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Sparkles } from 'lucide-react';

const SocialProofCounter = () => {
  const [count, setCount] = useState(0);
  const target = 210000;

  useEffect(() => {
    let startTimestamp = null;
    const duration = 2500;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * target));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center space-y-2 py-6"
    >
      <div className="flex items-center gap-3 text-primary">
        <Sparkles className="w-5 h-5 animate-pulse" />
        <h3 className="text-3xl md:text-4xl font-black tracking-tight">
          {count.toLocaleString()}+
        </h3>
        <Sparkles className="w-5 h-5 animate-pulse" />
      </div>
      <p className="text-sm md:text-base text-[#d6d6d6] font-medium uppercase tracking-widest">
        Styles Generated Today
      </p>
      <div className="flex items-center gap-2 mt-2 text-foreground/60 bg-card/50 px-4 py-1.5 rounded-full border border-border/30">
        <Users className="w-4 h-4" />
        <span className="text-xs font-semibold">Join 85,000+ gamers and creators</span>
      </div>
    </motion.div>
  );
};

export default SocialProofCounter;