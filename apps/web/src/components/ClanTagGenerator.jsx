import React, { useState, useEffect } from 'react';
import { RefreshCw, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import CopyButton from '@/components/CopyButton.jsx';
import { generateClanTag } from '@/utils/clanNameGenerator.js';
import { motion, AnimatePresence } from 'framer-motion';

const ClanTagGenerator = () => {
  const [tags, setTags] = useState([]);
  const [tagLength, setTagLength] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTags = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newTags = Array.from({ length: 12 }, () => generateClanTag(tagLength));
      setTags(newTags);
      setIsGenerating(false);
    }, 300);
  };

  useEffect(() => {
    generateTags();
  }, [tagLength]);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-lg space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Hash className="w-5 h-5 text-primary" />
          Short Clan Tags
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-foreground/60 mr-1">Length:</span>
          {[2, 3, 4].map(len => (
            <Button
              key={len}
              variant={tagLength === len ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTagLength(len)}
              className={tagLength === len ? 'bg-primary text-black hover:bg-primary/90' : ''}
            >
              {len}
            </Button>
          ))}
          <Button 
            variant="outline" 
            onClick={generateTags}
            disabled={isGenerating}
            className="ml-2 border-primary text-primary hover:bg-primary/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            New tags
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        <AnimatePresence mode="popLayout">
          {tags.map((tag, index) => (
            <motion.div
              key={`${tag}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.02 }}
              className="bg-background border border-border rounded-lg p-3 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors group"
            >
              <span className="text-lg font-black text-foreground tracking-widest group-hover:text-primary transition-colors glow-neon">
                [{tag}]
              </span>
              <CopyButton textToCopy={`[${tag}]`} className="w-full h-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClanTagGenerator;