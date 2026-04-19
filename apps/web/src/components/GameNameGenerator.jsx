import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Hash, AtSign, Share2, TrendingUp, Clock, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import ToggleSwitch from '@/components/ToggleSwitch.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { trackGenerationCount } from '@/utils/behavioralPsychology.js';
import { useLocation } from 'react-router-dom';

const GameNameGenerator = ({ gameName, wordLibraries, trendingNames, onGenerate }) => {
  const [generatedName, setGeneratedName] = useState('');
  const [multipleNames, setMultipleNames] = useState([]);
  const [addNumbers, setAddNumbers] = useState(false);
  const [addSymbols, setAddSymbols] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentNames, setRecentNames] = useState([]);
  const [rewardMsg, setRewardMsg] = useState('');
  const [isRare, setIsRare] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const { toast } = useToast();
  const location = useLocation();

  const symbols = ['★', '✦', '◆', '⚡', '✨', '⚔️', '☠️', '♛', '◈', '◉'];

  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const generateName = (options) => {
    const { prefixes, core, suffixes } = wordLibraries;
    const structure = Math.random();
    let name = '';

    if (structure < 0.33) {
      name = `${getRandomElement(prefixes)}${getRandomElement(core)}`;
    } else if (structure < 0.66) {
      name = `${getRandomElement(core)}${getRandomElement(suffixes)}`;
    } else {
      name = `${getRandomElement(prefixes)}${getRandomElement(suffixes)}`;
    }

    if (options.addNumbers && Math.random() > 0.3) {
      name += Math.floor(Math.random() * 999);
    }

    if (options.addSymbols && Math.random() > 0.3) {
      const sym = getRandomElement(symbols);
      name = Math.random() > 0.5 ? `${sym}${name}` : `${name}${sym}`;
    }

    return name;
  };

  useEffect(() => {
    const initialRecent = Array.from({ length: 8 }, () => generateName({ addNumbers: true, addSymbols: true }));
    setRecentNames(initialRecent);

    const interval = setInterval(() => {
      setRecentNames(prev => {
        const newName = generateName({ addNumbers: Math.random() > 0.5, addSymbols: Math.random() > 0.5 });
        return [newName, ...prev.slice(0, 7)];
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getMicroFeedback = () => {
    const messages = [
      "That one hits.",
      "Ready for ranked?",
      "This sounds pro.",
      `Perfect for ${gameName}.`,
      "Flex on them.",
      "Competitive vibes."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleGenerateSingle = () => {
    setIsGenerating(true);
    setMultipleNames([]);
    setRewardMsg('');
    
    setTimeout(() => {
      const name = generateName({ addNumbers, addSymbols });
      setGeneratedName(name);
      setIsGenerating(false);
      setRecentNames(prev => [name, ...prev.slice(0, 7)]);
      
      trackGenerationCount('game_name');
      
      // 1 in 5 chance for rare
      const rare = Math.random() < 0.2;
      setIsRare(rare);
      
      setRewardMsg(getMicroFeedback());
      setTimeout(() => setRewardMsg(''), 3000);
      
      if (onGenerate) onGenerate();
    }, 300);
  };

  const handleGenerateMultiple = () => {
    setIsGenerating(true);
    setGeneratedName('');
    setRewardMsg('');
    
    setTimeout(() => {
      const names = Array.from({ length: 10 }, () => generateName({ addNumbers, addSymbols }));
      setMultipleNames(names);
      setIsGenerating(false);
      
      trackGenerationCount('game_name');
      if (onGenerate) onGenerate();
    }, 500);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    
    toast({
      title: "Copied. Dominate the match.",
      className: "bg-card border-primary text-foreground",
      duration: 2000,
    });

    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = () => {
    const textToShare = generatedName || `Check out these awesome ${gameName} names!`;
    if (navigator.share) {
      navigator.share({
        title: `${gameName} Names Generator`,
        text: textToShare,
        url: window.location.href
      }).catch(() => {});
    } else {
      toast({
        title: "Share",
        description: "Copy the URL to share with friends!",
        className: "bg-card border-primary text-foreground"
      });
    }
  };

  const handleToggleNumbers = (val) => {
    setAddNumbers(val);
  };

  const handleToggleSymbols = (val) => {
    setAddSymbols(val);
  };

  return (
    <div className="space-y-12">
      <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-10 shadow-refined space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>
        
        {/* Generated Name Display */}
        <AnimatePresence mode="wait">
          {generatedName && (
            <motion.div
              key={generatedName}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`text-center space-y-6 py-6 transition-all duration-500 ${isRare ? 'bg-[#00ff88]/10 rounded-2xl p-8 border border-[#00ff88]/30 scale-[1.02] shadow-[0_0_15px_rgba(0,255,136,0.2)]' : ''}`}
            >
              {isRare && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-[#00ff88] font-bold text-sm md:text-base tracking-wider uppercase drop-shadow-[0_0_15px_rgba(0,255,136,0.8)] animate-pulse"
                >
                  ⭐ Rare Tryhard Name Unlocked
                </motion.div>
              )}
              
              <div className="relative inline-block">
                <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black text-primary break-all tracking-tight ${isRare ? 'text-[#00ff88] drop-shadow-[0_0_15px_rgba(0,255,136,0.8)]' : ''}`}>
                  {generatedName}
                </h2>
              </div>
              
              <AnimatePresence>
                {rewardMsg && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }} 
                    className="text-primary/90 font-medium text-lg animate-pulse-glow"
                  >
                    {rewardMsg}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="flex flex-wrap gap-4 justify-center">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  animate={{ scale: copiedId === 'main' ? 1.05 : 1 }}
                  onClick={() => handleCopy(generatedName, 'main')}
                  className={`flex items-center justify-center px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 ${
                    copiedId === 'main' 
                      ? 'bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.6)]' 
                      : 'bg-card border-2 border-primary text-primary hover:bg-primary/10'
                  }`}
                >
                  {copiedId === 'main' ? (
                    <><Check className="w-5 h-5 mr-2" /> Copied!</>
                  ) : (
                    <><Copy className="w-5 h-5 mr-2" /> Copy Name</>
                  )}
                </motion.button>
                <Button onClick={handleShare} className="bg-accent text-black hover:bg-accent/90 text-base px-8 py-6 transition-smooth hover:scale-[1.02]">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Multiple Names Display */}
        {multipleNames.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {multipleNames.map((name, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-background border border-border/50 rounded-lg p-4 flex items-center justify-between group hover:border-[#00ff88]/50 transition-colors duration-300"
              >
                <span className="text-lg font-bold text-foreground group-hover:text-[#00ff88] transition-colors">{name}</span>
                <button
                  onClick={() => handleCopy(name, `multi-${index}`)}
                  className="p-2 rounded-md bg-card border border-border/50 text-foreground/60 hover:text-[#00ff88] hover:border-[#00ff88]/50 transition-colors"
                >
                  {copiedId === `multi-${index}` ? <Check className="w-4 h-4 text-[#00ff88]" /> : <Copy className="w-4 h-4" />}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Generate Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleGenerateSingle}
            disabled={isGenerating}
            className="bg-[#00ff88] text-black hover:bg-[#00cc6a] shadow-[0_0_15px_rgba(0,255,136,0.4)] hover:shadow-[0_0_25px_rgba(0,255,136,0.6)] text-lg py-8 font-bold transition-all duration-300 hover:scale-[1.02] w-full"
          >
            {isGenerating ? <RefreshCw className="w-6 h-6 mr-2 animate-spin" /> : <Sparkles className="w-6 h-6 mr-2" />}
            Generate {gameName} Name
          </Button>
          <Button
            onClick={handleGenerateMultiple}
            disabled={isGenerating}
            className="bg-secondary text-white hover:bg-secondary/90 text-lg py-8 font-bold glow-blue transition-smooth hover:scale-[1.02] w-full"
          >
            {isGenerating ? <RefreshCw className="w-6 h-6 mr-2 animate-spin" /> : <TrendingUp className="w-6 h-6 mr-2" />}
            Generate 10 Names
          </Button>
        </div>

        {/* Toggle Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/30">
          <ToggleSwitch id="add-numbers" label="Numbers ON/OFF" checked={addNumbers} onCheckedChange={handleToggleNumbers} icon={Hash} />
          <ToggleSwitch id="add-symbols" label="Symbols ON/OFF" checked={addSymbols} onCheckedChange={handleToggleSymbols} icon={AtSign} />
        </div>
      </div>

      {/* Trending Names */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" /> Trending {gameName} Names
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trendingNames.map((name, index) => (
            <div
              key={index}
              onClick={() => { setGeneratedName(name); setMultipleNames([]); }}
              className="bg-card border border-border/50 rounded-lg p-5 text-center hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer group shadow-refined"
            >
              <span className="font-bold text-foreground group-hover:text-primary transition-colors">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Names */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            <Clock className="w-6 h-6 text-secondary" /> Recently Generated
          </h3>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-6 max-h-64 overflow-y-auto custom-scrollbar shadow-refined">
          <AnimatePresence>
            {recentNames.map((name, index) => (
              <motion.div
                key={`${name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between py-3 border-b border-border/30 last:border-0 hover:bg-background/50 transition-colors px-4 rounded-lg"
              >
                <span className="font-semibold text-foreground">{name}</span>
                <span className="text-xs text-foreground/50">Just now</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default GameNameGenerator;