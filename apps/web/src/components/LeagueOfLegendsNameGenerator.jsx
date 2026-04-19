import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Hash, AtSign, Share2, Copy, Check, Type } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import ToggleSwitch from '@/components/ToggleSwitch.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { useLocation } from 'react-router-dom';

const LeagueOfLegendsNameGenerator = ({ onGenerate }) => {
  const [generatedName, setGeneratedName] = useState('');
  const [multipleNames, setMultipleNames] = useState([]);
  const [addNumbers, setAddNumbers] = useState(false);
  const [addSymbols, setAddSymbols] = useState(false);
  const [shortTagMode, setShortTagMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rewardMsg, setRewardMsg] = useState('');
  const [isRare, setIsRare] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const { toast } = useToast();
  const location = useLocation();

  const wordLibraries = {
    prefixes: ['Shadow', 'Crimson', 'Ice', 'Phoenix', 'Venom', 'Thunder', 'Silent', 'Blaze', 'Frost', 'Iron', 'Steel', 'Dark', 'Light', 'Storm', 'Void', 'Arcane', 'Mystic', 'Rune', 'Astral', 'Nether'],
    core: ['Assassin', 'Mage', 'Warden', 'Rising', 'Strike', 'Lord', 'Hunter', 'Fury', 'Byte', 'Will', 'Heart', 'Sorcerer', 'Bringer', 'Chaser', 'Walker', 'Weaver', 'Blade', 'Knight', 'King', 'God'],
    tags: ['DRG', 'VNM', 'TRX', 'SHD', 'PHX', 'ICE', 'THR', 'INF', 'VTX', 'ELT', 'PRO', 'RNK', 'CMP', 'DOM', 'VCT', 'TSM', 'FNC', 'C9', 'G2', 'T1']
  };

  const symbols = ['★', '✦', '◆', '⚡', '✨', '⚔️', '☠️', '♛', '◈', '◉'];

  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const generateName = (options) => {
    let name = '';

    if (options.shortTagMode) {
      name = getRandomElement(wordLibraries.tags);
    } else {
      name = `${getRandomElement(wordLibraries.prefixes)}${getRandomElement(wordLibraries.core)}`;
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

  const getMicroFeedback = () => {
    const messages = [
      'That name hits.',
      'Sounds like a pro player.',
      'Ready for ranked?',
      'This feels elite.',
      'Champion vibes.',
      'Team ready.'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const saveToRecent = (names) => {
    try {
      const existing = JSON.parse(localStorage.getItem('recentLoLNames') || '[]');
      const newNames = Array.isArray(names) ? names : [names];
      const updated = [...newNames.map(n => ({ name: n, timestamp: Date.now() })), ...existing].slice(0, 10);
      localStorage.setItem('recentLoLNames', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save recent names', e);
    }
  };

  const handleGenerateSingle = () => {
    setIsGenerating(true);
    setMultipleNames([]);
    setRewardMsg('');
    
    setTimeout(() => {
      const name = generateName({ addNumbers, addSymbols, shortTagMode });
      setGeneratedName(name);
      setIsGenerating(false);
      saveToRecent(name);
      
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
      const names = Array.from({ length: 10 }, () => generateName({ addNumbers, addSymbols, shortTagMode }));
      setMultipleNames(names);
      setIsGenerating(false);
      saveToRecent(names);
      
      if (onGenerate) onGenerate();
    }, 500);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    
    toast({
      title: "Copied. Dominate Summoner's Rift.",
      className: "bg-card border-[#C89B3C] text-foreground",
      duration: 2000,
    });

    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = () => {
    const textToShare = generatedName || `Check out these awesome League of Legends names!`;
    if (navigator.share) {
      navigator.share({
        title: `LoL Names Generator`,
        text: textToShare,
        url: window.location.href
      }).catch(() => {});
    } else {
      toast({
        title: "Share",
        description: "Copy the URL to share with friends!",
        className: "bg-card border-[#C89B3C] text-foreground"
      });
    }
  };

  const handleToggle = (toggleName, val, setter) => {
    setter(val);
  };

  return (
    <div className="space-y-8">
      <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-10 shadow-refined relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0A8CC9] via-[#C89B3C] to-[#5B2C6F]"></div>
        
        {/* Generated Name Display */}
        <AnimatePresence mode="wait">
          {generatedName && (
            <motion.div
              key={generatedName}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`text-center space-y-6 py-6 transition-all duration-500 ${isRare ? 'bg-[#C89B3C]/10 rounded-2xl p-8 border border-[#C89B3C]/30 scale-[1.02] shadow-[0_0_15px_rgba(200,155,60,0.2)]' : ''}`}
            >
              {isRare && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-[#C89B3C] font-bold text-sm md:text-base tracking-wider uppercase drop-shadow-[0_0_15px_rgba(200,155,60,0.8)] animate-pulse"
                >
                  ⭐ Rare LoL Name Unlocked
                </motion.div>
              )}
              
              <div className="relative inline-block">
                <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black text-[#0A8CC9] break-all tracking-tight ${isRare ? 'text-[#C89B3C] drop-shadow-[0_0_15px_rgba(200,155,60,0.8)]' : ''}`}>
                  {generatedName}
                </h2>
              </div>
              
              <AnimatePresence>
                {rewardMsg && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }} 
                    className="text-[#0A8CC9]/90 font-medium text-lg animate-pulse-glow"
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
                      ? 'bg-[#C89B3C] text-black shadow-[0_0_15px_rgba(200,155,60,0.6)]' 
                      : 'bg-card border-2 border-[#0A8CC9] text-[#0A8CC9] hover:bg-[#0A8CC9]/10'
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {multipleNames.map((name, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-background border border-border/50 rounded-lg p-4 flex items-center justify-between group hover:border-[#C89B3C]/50 transition-colors duration-300"
              >
                <span className="text-lg font-bold text-foreground group-hover:text-[#C89B3C] transition-colors">{name}</span>
                <button
                  onClick={() => handleCopy(name, `multi-${index}`)}
                  className="p-2 rounded-md bg-card border border-border/50 text-foreground/60 hover:text-[#C89B3C] hover:border-[#C89B3C]/50 transition-colors"
                >
                  {copiedId === `multi-${index}` ? <Check className="w-4 h-4 text-[#C89B3C]" /> : <Copy className="w-4 h-4" />}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Generate Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button
            onClick={handleGenerateSingle}
            disabled={isGenerating}
            className="bg-[#0A8CC9] text-white hover:bg-[#0A8CC9]/90 shadow-[0_0_15px_rgba(10,140,201,0.4)] hover:shadow-[0_0_25px_rgba(10,140,201,0.6)] text-lg py-8 font-bold transition-all duration-300 hover:scale-[1.02] w-full"
          >
            {isGenerating ? <RefreshCw className="w-6 h-6 mr-2 animate-spin" /> : <Sparkles className="w-6 h-6 mr-2" />}
            Generate LoL Name
          </Button>
          <Button
            onClick={handleGenerateMultiple}
            disabled={isGenerating}
            className="bg-[#5B2C6F] text-white hover:bg-[#5B2C6F]/90 text-lg py-8 font-bold transition-smooth hover:scale-[1.02] w-full"
          >
            {isGenerating ? <RefreshCw className="w-6 h-6 mr-2 animate-spin" /> : <Type className="w-6 h-6 mr-2" />}
            Generate 10 Names
          </Button>
        </div>

        {/* Toggle Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border/30">
          <ToggleSwitch 
            id="add-numbers" 
            label="Numbers ON/OFF" 
            checked={addNumbers} 
            onCheckedChange={(val) => handleToggle('add_numbers', val, setAddNumbers)} 
            icon={Hash} 
          />
          <ToggleSwitch 
            id="add-symbols" 
            label="Symbols ON/OFF" 
            checked={addSymbols} 
            onCheckedChange={(val) => handleToggle('add_symbols', val, setAddSymbols)} 
            icon={AtSign} 
          />
          <ToggleSwitch 
            id="short-tag" 
            label="Short Tag Mode" 
            checked={shortTagMode} 
            onCheckedChange={(val) => handleToggle('short_tag_mode', val, setShortTagMode)} 
            icon={Type} 
          />
        </div>
      </div>
    </div>
  );
};

export default LeagueOfLegendsNameGenerator;