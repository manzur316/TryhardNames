import React, { useState, useEffect } from 'react';
import { Clock, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RecentlyGeneratedClanNames = () => {
  const [recentNames, setRecentNames] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    const loadRecent = () => {
      const saved = localStorage.getItem('recentClanNamesList');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setRecentNames(parsed.slice(0, 6));
        } catch (e) {
          console.error("Failed to parse recent clan names", e);
        }
      }
    };

    loadRecent();
    window.addEventListener('clanNameGenerated', loadRecent);
    return () => window.removeEventListener('clanNameGenerated', loadRecent);
  }, []);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const diff = Math.floor((Date.now() - timestamp) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  if (recentNames.length === 0) {
    return (
      <section className="py-8">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-6 h-6 text-secondary" />
          <h3 className="text-2xl font-bold text-foreground">Recent Generations</h3>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-8 text-center text-foreground/50">
          No clan names generated yet. Start generating to see your history!
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-6 h-6 text-secondary" />
        <h3 className="text-2xl font-bold text-foreground">Recent Generations</h3>
      </div>
      
      <div className="space-y-3">
        <AnimatePresence>
          {recentNames.map((item, index) => (
            <motion.div
              key={`${item.text}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-background border border-border/50 rounded-lg p-4 flex items-center justify-between group hover:border-secondary/50 transition-colors"
            >
              <div className="flex-1 pr-4">
                <p className="text-foreground font-bold text-lg">{item.text}</p>
                <span className="text-xs text-foreground/40 mt-1 block">{formatTime(item.time)}</span>
              </div>
              <button
                onClick={() => handleCopy(item.text, index)}
                className="flex-shrink-0 p-2 rounded-md bg-card border border-border hover:border-secondary hover:text-secondary transition-colors"
              >
                {copiedIndex === index ? <Check className="w-4 h-4 text-secondary" /> : <Copy className="w-4 h-4" />}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default RecentlyGeneratedClanNames;