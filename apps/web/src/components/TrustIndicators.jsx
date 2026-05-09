import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Star, ShieldCheck } from 'lucide-react';

const Counter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

const TrustIndicators = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 md:py-8 border-y border-border/30 bg-card/30 backdrop-blur-sm rounded-2xl px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center text-center space-y-2"
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <h4 className="text-3xl font-bold text-foreground tracking-tight">
          <Counter end={128000} suffix="+" />
        </h4>
        <p className="text-sm text-foreground/60 font-medium uppercase tracking-wider">Samples today</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center text-center space-y-2"
      >
        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
          <Users className="w-6 h-6 text-secondary" />
        </div>
        <h4 className="text-3xl font-bold text-foreground tracking-tight">
          <Counter end={45000} suffix="+" />
        </h4>
        <p className="text-sm text-foreground/60 font-medium uppercase tracking-wider">Players browsing</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center text-center space-y-2"
      >
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
          <Star className="w-6 h-6 text-accent fill-accent" />
        </div>
        <h4 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-1">
          4.8 <span className="text-lg text-foreground/50 font-medium">/ 5</span>
        </h4>
        <p className="text-sm text-foreground/60 font-medium uppercase tracking-wider">Avg. rating (signals)</p>
      </motion.div>
    </div>
  );
};

export default TrustIndicators;