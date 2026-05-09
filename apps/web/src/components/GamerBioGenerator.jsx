import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, X, Copy, Check } from 'lucide-react';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast.js';
import { copyTextToClipboard } from '@/utils/clipboard.js';
import BioStyleSelector from './BioStyleSelector.jsx';
import { generateSingleBio, generateMultipleBios } from '@/utils/gamerBioGenerator.js';

const GamerBioGenerator = () => {
  const [customName, setCustomName] = useState('');
  const [style, setStyle] = useState('Tryhard');
  const [generatedBios, setGeneratedBios] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rewardMsg, setRewardMsg] = useState('');
  const [isRare, setIsRare] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const { toast } = useToast();

  const microFeedbacks = [
    'That one hits.',
    'Perfect for socials.',
    'Ready for ranked.',
    'This one looks clean.',
    'Flex on them.',
    'Social vibes.'
  ];

  const handleGenerate = (count = 1) => {
    setIsGenerating(true);
    setRewardMsg('');
    setIsRare(false);
    
    setTimeout(() => {
      const options = { style, customName, length: 'Medium', useEmojis: true, useSymbols: true };
      const bios = generateMultipleBios(count, options);
      
      setGeneratedBios(bios);
      setIsGenerating(false);
      
      // Rare highlight logic (1 in 6)
      if (Math.random() < (1/6)) {
        setIsRare(true);
      }

      // Micro-feedback
      setRewardMsg(microFeedbacks[Math.floor(Math.random() * microFeedbacks.length)]);
      setTimeout(() => setRewardMsg(''), 3000);

      // Save to localStorage
      const saved = JSON.parse(localStorage.getItem('recentGamerBios') || '[]');
      const newEntries = bios.map(b => ({ text: b, time: Date.now() }));
      const updated = [...newEntries, ...saved].slice(0, 10);
      localStorage.setItem('recentGamerBios', JSON.stringify(updated));
      
      // Dispatch event for RecentlyGeneratedBios component
      window.dispatchEvent(new Event('bioGenerated'));
    }, 400);
  };

  const handleCopy = async (text, index) => {
    const res = await copyTextToClipboard(text, { preventRepeatMs: 450, vibrateMs: 12 });
    if (!res.ok) {
      toast({ title: "Copy failed", description: "Clipboard blocked by your browser.", variant: "destructive" });
      return;
    }
    setCopiedIndex(index);
    
    toast({
      title: "Copied. Ready to flex?",
      className: "bg-card border-primary text-foreground",
      duration: 2000,
    });

    setTimeout(() => setCopiedIndex(null), 1200);
  };

  const handleStyleSelect = (newStyle) => {
    setStyle(newStyle);
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-10 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>
      
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 relative">
            <label className="text-sm font-semibold text-foreground/80 block">Username (Optional)</label>
            <div className="relative">
              <Input
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Enter your username..."
                className="bg-background border-2 border-border focus-visible:border-primary pr-10 py-6 text-lg rounded-xl"
                maxLength={25}
              />
              {customName && (
                <button 
                  onClick={() => setCustomName('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="text-right text-xs text-foreground/40 mt-1">
              {customName.length}/25
            </div>
          </div>
          
          <div className="space-y-2">
            <BioStyleSelector selectedStyle={style} onSelect={handleStyleSelect} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={() => handleGenerate(1)}
            disabled={isGenerating}
            className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 text-lg py-6 min-h-[48px] font-bold shadow-md transition-colors duration-300 w-full rounded-xl"
          >
            {isGenerating ? <RefreshCw className="w-6 h-6 mr-2 animate-spin" /> : <Sparkles className="w-6 h-6 mr-2" />}
            Sample one bio
          </Button>
          <Button
            onClick={() => handleGenerate(5)}
            disabled={isGenerating}
            className="bg-secondary text-white hover:bg-secondary/90 text-lg py-6 min-h-[48px] font-bold transition-colors duration-300 w-full rounded-xl"
          >
            {isGenerating ? <RefreshCw className="w-6 h-6 mr-2 animate-spin" /> : <RefreshCw className="w-6 h-6 mr-2" />}
            Sample five bios
          </Button>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {generatedBios.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 pt-6 border-t border-border/30"
            >
              {isRare && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="text-[#00ff88] font-bold text-center mb-4 text-sm tracking-wider uppercase drop-shadow-[0_0_15px_rgba(0,255,136,0.8)] animate-pulse"
                >
                  Standout variant
                </motion.div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {generatedBios.map((bio, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-background border rounded-xl p-5 flex items-center justify-between group transition-all duration-300 ${
                      isRare && index === 0 
                        ? 'border-[#00ff88]/50 bg-[#00ff88]/10 shadow-[0_0_15px_rgba(0,255,136,0.2)] scale-[1.02]' 
                        : 'border-border/50 hover:border-primary/50'
                    }`}
                  >
                    <p className="text-foreground font-medium whitespace-pre-wrap pr-4 text-lg">{bio}</p>
                    <button
                      onClick={() => handleCopy(bio, index)}
                      className={`flex-shrink-0 p-3 rounded-lg transition-all duration-300 ${
                        copiedIndex === index 
                          ? 'bg-[#00ff88] text-black shadow-[0_0_10px_rgba(0,255,136,0.5)]' 
                          : 'bg-card border border-border hover:border-[#00ff88] hover:text-[#00ff88]'
                      }`}
                    >
                      {copiedIndex === index ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </motion.div>
                ))}
              </div>

              <AnimatePresence>
                {rewardMsg && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }} 
                    className="text-primary/90 font-medium text-center mt-4"
                  >
                    {rewardMsg}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GamerBioGenerator;