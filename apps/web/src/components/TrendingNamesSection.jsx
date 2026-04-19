import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, Crosshair, Sparkles } from 'lucide-react';
import CopyButton from './CopyButton.jsx';

const TrendingNamesSection = () => {
  const trendingData = [
    { name: 'VoidX', category: 'Aggressive', icon: Flame, color: 'text-red-500', bg: 'bg-red-500/10' },
    { name: 'Reaper✨', category: 'Mythical', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'ProAim', category: 'Competitive', icon: Crosshair, color: 'text-primary', bg: 'bg-primary/10' },
    { name: 'Lethal★', category: 'Aggressive', icon: Flame, color: 'text-red-500', bg: 'bg-red-500/10' },
    { name: 'Phantom⚔️', category: 'Mythical', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'ClutchGod', category: 'Competitive', icon: Crosshair, color: 'text-primary', bg: 'bg-primary/10' },
    { name: 'Savage⚡', category: 'Aggressive', icon: Flame, color: 'text-red-500', bg: 'bg-red-500/10' },
    { name: 'ApexFrag', category: 'Competitive', icon: Crosshair, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 flex items-center justify-center gap-3">
          <TrendingUp className="w-8 h-8 text-primary" />
          Trending Tryhard Names
        </h2>
        <p className="text-foreground/70">The most copied names in the last 24 hours</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trendingData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="bg-card border border-border/50 rounded-xl p-5 flex flex-col justify-between group hover:border-primary/50 transition-all duration-300 shadow-refined hover:scale-[1.02]"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 ${item.bg} ${item.color}`}>
                <item.icon className="w-3 h-3" />
                {item.category}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-wide">
                {item.name}
              </span>
              <CopyButton textToCopy={item.name} className="w-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TrendingNamesSection;