import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Shield, Users, Copy, Check } from 'lucide-react';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast.js';
import ClanNameToggleControls from './ClanNameToggleControls.jsx';
import { generateSingleClanName, generateMultipleClanNames, generateClanTag } from '@/utils/clanNameGenerator.js';
import { trackGenerationCount } from '@/utils/behavioralPsychology.js';
import { useLocation } from 'react-router-dom';

const ClanNameGenerator = () => {
  const [customPrefix, setCustomPrefix] = useState('');
  const [generatedName, setGeneratedName] = useState('');
  const [multipleNames, setMultipleNames] = useState([]);
  const [addNumbers, setAddNumbers] = useState(false);
  const [addSymbols, setAddSymbols] = useState(false);
  const [shortTagMode, setShortTagMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [socialProofCount, setSocialProofCount] = useState(85432);
  const [rewardMsg, setRewardMsg] = useState('');
  const [isRare, setIsRare] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setSocialProofCount(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const saveRecent = (names) => {
    const saved = JSON.parse(localStorage.getItem('recentClanNamesList') || '[]');
    const newEntries = names.map(n => ({ text: n, time: Date.now() }));
    const updated = [...newEntries, ...saved].slice(0, 10);
    localStorage.setItem('recentClanNamesList', JSON.stringify(updated));
    window.dispatchEvent(new Event('clanNameGenerated'));
  };

  const getMicroFeedback = () => {
    const messages = [
      "That one hits.",
      "Sounds like a pro team.",
      "Ready for ranked?",
      "This feels elite.",
      "Competitive vibes.",
      "Team ready."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleGenerateSingle = () => {
    setIsGenerating(true);
    setMultipleNames([]);
    setRewardMsg('');
    setIsRare(false);
    
    setTimeout(() => {
      let resultName = '';
      let rareFlag = Math.random() < 0.2; // 1 in 5 chance

      if (shortTagMode) {
        resultName = `[${generateClanTag(Math.floor(Math.random() * 2) + 3)}]`;
      } else {
        const result = generateSingleClanName({ addNumbers, addSymbols, customPrefix });
        resultName = result.name;
        rareFlag = rareFlag || result.isRare;
      }

      setGeneratedName(resultName);
      setIsRare(rareFlag);
      saveRecent([resultName]);
      setIsGenerating(false);
      setSocialProofCount(prev => prev + 1);
      
      trackGenerationCount('clan_name');
      
      setRewardMsg(getMicroFeedback());
      setTimeout(() => setRewardMsg(''), 3000);
    }, 300);
  };

  const handleGenerateMultiple = () => {
    setIsGenerating(true);
    setGeneratedName('');
    setRewardMsg('');
    setIsRare(false);
    
    setTimeout(() => {
      let results = [];
      if (shortTagMode) {
        results = Array.from({ length: 10 }, () => ({
          name: `[${generateClanTag(Math.floor(Math.random() * 2) + 3)}]`,
          isRare: Math.random() < 0.2
        }));
      } else {
        results = generateMultipleClanNames(10, { addNumbers, addSymbols, customPrefix });
        // Ensure 1 in 5 chance applies to the batch
        results = results.map(r => ({...r, isRare: r.isRare || Math.random() < 0.2}));
      }

      setMultipleNames(results);
      saveRecent(results.map(r => r.name));
      setIsGenerating(false);
      setSocialProofCount(prev => prev + 10);
      
      trackGenerationCount('clan_name');
      
      setRewardMsg(getMicroFeedback());
      setTimeout(() => setRewardMsg(''), 3000);
    }, 500);
  };

  // Trigger regeneration when toggles change if we already have generated names
  useEffect(() => {
    if (generatedName) handleGenerateSingle();
    else if (multipleNames.length > 0) handleGenerateMultiple();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addNumbers, addSymbols, shortTagMode]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    
    toast({
      title: "Copied. Dominate the lobby.",
      className: "bg-card border-primary text-foreground",
      duration: 2000,
    });

    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleNumbers = (val) => {
    setAddNumbers(val);
  };

  const handleToggleSymbols = (val) => {
    setAddSymbols(val);
  };

  const handleToggleShortTag = (val) => {
    setShortTagMode(val);
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-10 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>
      
      <div className="max-w-4xl mx-auto space-y-8">
        
        <ClanNameToggleControls 
          addNumbers={addNumbers} setAddNumbers={handleToggleNumbers}
          addSymbols={addSymbols} setAddSymbols={handleToggleSymbols}
          shortTagMode={shortTagMode} setShortTagMode={handleToggleShortTag}
        />

        {/* Custom Prefix Input */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <label htmlFor="prefix-input" className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Custom Prefix (Optional)
          </label>
          <Input
            id="prefix-input"
            type="text"
            value={customPrefix}
            onChange={(e) => setCustomPrefix(e.target.value)}
            placeholder="e.g., FaZe, Team, Dark..."
            className="text-lg py-6 bg-background border-2 border-border focus-visible:border-primary focus-visible:ring-primary text-foreground placeholder:text-foreground/30 rounded-xl transition-all duration-300"
            maxLength={15}
            disabled={shortTagMode}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <Button
            onClick={handleGenerateSingle}
            disabled={isGenerating}
            className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 shadow-[0_0_15px_rgba(0,255,136,0.4)] hover:shadow-[0_0_25px_rgba(0,255,136,0.6)] text-lg py-6 min-h-[48px] font-bold transition-all duration-300 hover:scale-[1.02] w-full rounded-xl"
          >
            {isGenerating ? <RefreshCw className="w-6 h-6 mr-2 animate-spin" /> : <Sparkles className="w-6 h-6 mr-2" />}
            Generate Clan Name
          </Button>
          <Button
            onClick={handleGenerateMultiple}
            disabled={isGenerating}
            className="bg-secondary text-white hover:bg-secondary/90 text-lg py-6 min-h-[48px] font-bold transition-all duration-300 hover:scale-[1.02] w-full rounded-xl"
          >
            {isGenerating ? <RefreshCw className="w-6 h-6 mr-2 animate-spin" /> : <RefreshCw className="w-6 h-6 mr-2" />}
            Generate 10 Names
          </Button>
        </div>

        {/* Generated Name Display */}
        <AnimatePresence mode="wait">
          {generatedName && (
            <motion.div
              key={generatedName}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`text-center space-y-6 py-8 transition-all duration-500 max-w-2xl mx-auto ${isRare ? 'bg-[#00ff88]/10 rounded-2xl p-8 border border-[#00ff88]/50 scale-[1.02] shadow-[0_0_20px_rgba(0,255,136,0.2)]' : ''}`}
            >
              {isRare && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-[#00ff88] font-bold text-sm md:text-base tracking-wider uppercase drop-shadow-[0_0_15px_rgba(0,255,136,0.8)] animate-pulse"
                >
                  ⭐ Rare Clan Name Unlocked
                </motion.div>
              )}
              
              <div className="relative inline-block">
                <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black text-primary break-all tracking-tight ${isRare ? 'text-[#00ff88] drop-shadow-[0_0_15px_rgba(0,255,136,0.8)]' : ''}`}>
                  {generatedName}
                </h2>
              </div>
              
              <div className="flex justify-center">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  animate={{ scale: copiedId === 'main' ? 1.0 : 1 }}
                  onClick={() => handleCopy(generatedName, 'main')}
                  className={`flex items-center justify-center px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 ${
                    copiedId === 'main' 
                      ? 'bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.6)]' 
                      : 'bg-card border-2 border-primary text-primary hover:bg-primary/10'
                  }`}
                >
                  {copiedId === 'main' ? (
                    <><Check className="w-5 h-5 mr-2" /> Copied. Dominate the lobby.</>
                  ) : (
                    <><Copy className="w-5 h-5 mr-2" /> Copy Name</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Multiple Names Display */}
        {multipleNames.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-border/30">
            {multipleNames.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-background border rounded-xl p-4 flex items-center justify-between group transition-all duration-300 ${item.isRare ? 'border-[#00ff88]/50 bg-[#00ff88]/10 shadow-[0_0_15px_rgba(0,255,136,0.2)] scale-[1.02]' : 'border-border/50 hover:border-primary/50'}`}
              >
                <span className={`text-lg font-bold transition-colors ${item.isRare ? 'text-[#00ff88]' : 'text-foreground group-hover:text-primary'}`}>
                  {item.name} {item.isRare && '⭐'}
                </span>
                <button
                  onClick={() => handleCopy(item.name, index)}
                  className={`flex-shrink-0 p-2 rounded-lg transition-all duration-300 ${
                    copiedId === index 
                      ? 'bg-[#00ff88] text-black shadow-[0_0_10px_rgba(0,255,136,0.5)]' 
                      : 'bg-card border border-border hover:border-[#00ff88] hover:text-[#00ff88]'
                  }`}
                >
                  {copiedId === index ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        <AnimatePresence>
          {rewardMsg && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }} 
              className="text-primary/90 font-medium text-center text-lg animate-pulse-glow"
            >
              {rewardMsg}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="text-center pt-4">
          <p className="text-sm text-[#d6d6d6]/50 flex items-center justify-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            {socialProofCount.toLocaleString()} clan names generated today
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClanNameGenerator;