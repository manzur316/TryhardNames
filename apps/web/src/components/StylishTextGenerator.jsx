import React, { useState, useMemo } from 'react';
import { X, Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontStyleCard } from './FontStyleCard.jsx';
import { convertText, getAllStyles } from '@/utils/textStyleConverter.js';

const StylishTextGenerator = ({ onNamesGenerated }) => {
  const [inputText, setInputText] = useState('Tryhard');
  const [showMore, setShowMore] = useState(false);
  const maxLength = 100;

  // Group styles by category
  const categorizedStyles = useMemo(() => {
    const allStyles = getAllStyles();
    const categories = {
      'Bold & Italic': ['bold', 'italic', 'boldItalic', 'sansBold', 'sansItalic'],
      'Fancy Fonts': ['fancySerif', 'script', 'scriptBold', 'fraktur', 'frakturBold'],
      'Aesthetic Fonts': ['fullwidth', 'monospace', 'bubble', 'bubbleDark', 'square'],
      'Gaming Fonts': ['smallCaps', 'inverted', 'reversed', 'hacker', 'glitch'],
      'Symbols & Decorative': ['sparkles', 'stars', 'brackets', 'slash', 'underline'],
      'Minimal Fonts': ['superscript', 'subscript', 'spaced']
    };

    const result = {};
    
    // Map available styles to categories
    allStyles.forEach(style => {
      let assigned = false;
      for (const [cat, ids] of Object.entries(categories)) {
        if (ids.includes(style.id)) {
          if (!result[cat]) result[cat] = [];
          result[cat].push(style);
          assigned = true;
          break;
        }
      }
      // Fallback for unassigned styles
      if (!assigned) {
        if (!result['Other Styles']) result['Other Styles'] = [];
        result['Other Styles'].push(style);
      }
    });

    return result;
  }, []);

  const handleClear = () => {
    setInputText('');
  };

  const handleShowMore = () => {
    setShowMore(true);
    if (onNamesGenerated) {
      // Simulate generating more names/styles for the parent component
      const moreStyles = getAllStyles().map(s => convertText(inputText || 'Tryhard', s.id));
      onNamesGenerated(moreStyles);
    }
  };

  const displayCategories = showMore 
    ? Object.keys(categorizedStyles) 
    : Object.keys(categorizedStyles).slice(0, 3);

  return (
    <div className="space-y-12">
      {/* Input Section */}
      <div className="bg-card border border-border/40 rounded-2xl p-6 md:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-50"></div>
        
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex justify-between items-end px-1">
            <label htmlFor="text-input" className="text-sm font-bold text-foreground/60 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Enter your text
            </label>
            <span className={`text-xs font-medium ${inputText.length >= maxLength ? 'text-red-400' : 'text-foreground/40'}`}>
              {inputText.length} / {maxLength}
            </span>
          </div>
          
          <div className="relative">
            <input
              id="text-input"
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (onNamesGenerated) {
                  const newStyles = getAllStyles().slice(0, 12).map(s => convertText(e.target.value || 'Tryhard', s.id));
                  onNamesGenerated(newStyles);
                }
              }}
              placeholder="Enter your text here..."
              className="w-full text-2xl md:text-4xl py-6 md:py-8 px-6 md:px-8 bg-background border-2 border-border/50 focus:border-primary focus:ring-0 text-foreground placeholder:text-foreground/20 rounded-xl transition-all duration-300 outline-none shadow-inner min-h-[80px]"
              maxLength={maxLength}
            />
            
            <AnimatePresence>
              {inputText.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleClear}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-2 bg-card hover:bg-border/50 rounded-full text-foreground/50 hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
                  aria-label="Clear text"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-12">
        {displayCategories.map((category, catIndex) => (
          <motion.div 
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-foreground border-b border-border/15 pb-2">
              {category}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorizedStyles[category].map((style, index) => (
                <div key={style.id}>
                  <FontStyleCard
                    fontName={style.name}
                    fontCategory={category}
                    fontPreview={convertText(inputText || 'Tryhard', style.id)}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {!showMore && Object.keys(categorizedStyles).length > 3 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center pt-8"
          >
            <button
              onClick={handleShowMore}
              className="flex items-center gap-2 bg-card border border-border/50 hover:border-primary/50 text-foreground px-8 py-4 rounded-xl font-bold transition-all duration-200 hover:shadow-md group min-h-[44px] active:scale-95"
            >
              Generate More Styles
              <ChevronDown className="w-5 h-5 text-primary group-hover:translate-y-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StylishTextGenerator;