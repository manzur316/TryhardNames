import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Monitor, Smartphone, Gamepad2 } from 'lucide-react';
import { generateSingleName } from '@/utils/nameGenerator.js';

const RecentlyGeneratedFeed = () => {
  const [feed, setFeed] = useState([]);

  const platforms = [
    { icon: Monitor, color: 'text-blue-400' },
    { icon: Smartphone, color: 'text-green-400' },
    { icon: Gamepad2, color: 'text-purple-400' }
  ];

  const generateFeedItem = () => {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: generateSingleName({ addNumbers: Math.random() > 0.5, addSymbols: Math.random() > 0.5 }),
      time: 'Just now',
      platform: platform,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}&backgroundColor=1a1a1a`
    };
  };

  useEffect(() => {
    // Initial load
    setFeed(Array.from({ length: 5 }, generateFeedItem));

    // Simulate real-time updates
    const interval = setInterval(() => {
      setFeed(prev => {
        const newItem = generateFeedItem();
        return [newItem, ...prev.slice(0, 4)];
      });
    }, Math.floor(Math.random() * 4000) + 8000); // 8-12 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-refined h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/30">
        <div className="relative">
          <Clock className="w-5 h-5 text-secondary" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping"></span>
        </div>
        <h3 className="text-xl font-bold text-foreground">Live Generation Feed</h3>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none"></div>
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {feed.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-between bg-background/50 p-3 rounded-xl border border-border/30"
              >
                <div className="flex items-center gap-3">
                  <img src={item.avatar} alt="User Avatar" className="w-10 h-10 rounded-full bg-background border border-border/50" />
                  <div>
                    <p className="font-bold text-foreground text-sm md:text-base">{item.name}</p>
                    <p className="text-xs text-foreground/50">{item.time}</p>
                  </div>
                </div>
                <div className={`p-2 rounded-lg bg-background border border-border/50 ${item.platform.color}`}>
                  <item.platform.icon className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RecentlyGeneratedFeed;