import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast.js';

const RecentlyCopiedModule = () => {
  const [recentItems, setRecentItems] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const { toast } = useToast();

  const loadRecent = () => {
    try {
      const items = JSON.parse(localStorage.getItem('recentStyles') || '[]');
      setRecentItems(items);
    } catch (e) {
      setRecentItems([]);
    }
  };

  useEffect(() => {
    loadRecent();
    window.addEventListener('stylesCopied', loadRecent);
    return () => window.removeEventListener('stylesCopied', loadRecent);
  }, []);

  const handleCopy = (item) => {
    navigator.clipboard.writeText(item.text);
    setCopiedId(item.id);
    
    toast({
      title: "Copied again!",
      description: "Ready to paste.",
      className: "bg-card border-primary text-foreground",
      duration: 2000,
    });

    setTimeout(() => setCopiedId(null), 2000);
  };

  if (recentItems.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/50 border border-border/30 rounded-2xl p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-secondary" />
        <h3 className="text-lg font-bold text-foreground">Recently Copied</h3>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <AnimatePresence>
          {recentItems.map((item) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => handleCopy(item)}
              className="flex items-center gap-2 bg-background border border-border/50 hover:border-secondary/50 px-4 py-2 rounded-lg transition-all group"
            >
              <span className="text-[#d6d6d6] max-w-[150px] truncate">{item.text}</span>
              {copiedId === item.id ? (
                <Check className="w-3.5 h-3.5 text-primary" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-foreground/40 group-hover:text-secondary transition-colors" />
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RecentlyCopiedModule;