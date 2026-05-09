import React, { useState, useEffect } from 'react';
import { Clock, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast.js';
import { copyTextToClipboard } from '@/utils/clipboard.js';

const RecentlyGeneratedLoLNames = () => {
  const [recentNames, setRecentNames] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadRecent = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('recentLoLNames') || '[]');
        setRecentNames(stored.slice(0, 6));
      } catch (e) {
        console.error('Error loading recent names', e);
      }
    };

    loadRecent();
    // Listen for storage changes to update across tabs or from generator component
    window.addEventListener('storage', loadRecent);
    // Custom event for same-page updates
    const interval = setInterval(loadRecent, 2000);

    return () => {
      window.removeEventListener('storage', loadRecent);
      clearInterval(interval);
    };
  }, []);

  const handleCopy = async (text, id) => {
    const res = await copyTextToClipboard(text, { preventRepeatMs: 450, vibrateMs: 12 });
    if (!res.ok) {
      toast({ title: "Copy failed", description: "Clipboard blocked by your browser.", variant: "destructive" });
      return;
    }
    setCopiedId(id);
    toast({
      title: "Copied!",
      className: "bg-card border-[#0A8CC9] text-foreground",
      duration: 2000
    });
    setTimeout(() => setCopiedId(null), 1200);
  };

  const formatTime = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  if (recentNames.length === 0) return null;

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-[#0A8CC9]" />
        <h3 className="text-xl font-bold text-foreground">Your Recent Generations</h3>
      </div>
      
      <div className="space-y-3">
        <AnimatePresence>
          {recentNames.map((item, idx) => (
            <motion.div
              key={`${item.name}-${item.timestamp}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/30 hover:border-[#0A8CC9]/30 transition-colors"
            >
              <div className="flex flex-col">
                <span className="font-bold text-foreground">{item.name}</span>
                <span className="text-xs text-foreground/50">{formatTime(item.timestamp)}</span>
              </div>
              <button
                onClick={() => handleCopy(item.name, idx)}
                className="p-2 rounded-md bg-card border border-border/50 text-foreground/60 hover:text-[#0A8CC9] hover:border-[#0A8CC9]/50 transition-colors"
              >
                {copiedId === idx ? <Check className="w-4 h-4 text-[#0A8CC9]" /> : <Copy className="w-4 h-4" />}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RecentlyGeneratedLoLNames;