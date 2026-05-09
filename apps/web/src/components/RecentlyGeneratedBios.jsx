import React, { useState, useEffect } from 'react';
import { Clock, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { copyTextToClipboard } from '@/utils/clipboard.js';

const RecentlyGeneratedBios = () => {
  const [recentBios, setRecentBios] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    const loadRecent = () => {
      const saved = localStorage.getItem('recentGamerBios');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Ensure we have objects with timestamps, or convert old string arrays
          const formatted = parsed.map(item => 
            typeof item === 'string' ? { text: item, time: Date.now() } : item
          ).slice(0, 6);
          setRecentBios(formatted);
        } catch (e) {
          console.error("Failed to parse recent bios", e);
        }
      }
    };

    loadRecent();
    // Listen for custom event to update list when new bios are generated
    window.addEventListener('bioGenerated', loadRecent);
    return () => window.removeEventListener('bioGenerated', loadRecent);
  }, []);

  const handleCopy = async (text, index) => {
    const res = await copyTextToClipboard(text, { preventRepeatMs: 450, vibrateMs: 12 });
    if (!res.ok) return;
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1200);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const diff = Math.floor((Date.now() - timestamp) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  if (recentBios.length === 0) return null;

  return (
    <section className="py-8">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-6 h-6 text-secondary" />
        <h3 className="text-2xl font-bold text-foreground">Your Recent Generations</h3>
      </div>
      
      <div className="space-y-3">
        <AnimatePresence>
          {recentBios.map((bio, index) => (
            <motion.div
              key={`${bio.text}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-background border border-border/50 rounded-lg p-4 flex items-center justify-between group hover:border-secondary/50 transition-colors"
            >
              <div className="flex-1 pr-4">
                <p className="text-foreground text-sm md:text-base">{bio.text}</p>
                <span className="text-xs text-foreground/40 mt-1 block">{formatTime(bio.time)}</span>
              </div>
              <button
                onClick={() => handleCopy(bio.text, index)}
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

export default RecentlyGeneratedBios;