import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Hash, AtSign, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import ToggleSwitch from '@/components/ToggleSwitch.jsx';
import { useToast } from '@/hooks/use-toast.js';
import GenderSelector from './GenderSelector.jsx';
import robloxNamesDatabase from '@/data/robloxNamesDatabase.js';
import { copyTextToClipboard } from '@/utils/clipboard.js';

const RobloxNameGenerator = ({ onGenerate }) => {
  const [generatedName, setGeneratedName] = useState('');
  const [multipleNames, setMultipleNames] = useState([]);
  const [addNumbers, setAddNumbers] = useState(false);
  const [addSymbols, setAddSymbols] = useState(false);
  const [selectedGender, setSelectedGender] = useState('Trending');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const { toast } = useToast();

  const symbols = ['★', '✦', '◆', '⚡', '✨', '⚔️', '☠️', '♛', '◈', '◉'];

  const generateNames = (count) => {
    const filteredDb = robloxNamesDatabase.filter(n => n.category === selectedGender);
    const pool = filteredDb.length > 0 ? filteredDb : robloxNamesDatabase;
    
    const results = [];
    for (let i = 0; i < count; i++) {
      let baseName = pool[Math.floor(Math.random() * pool.length)].name;
      
      // Strip existing numbers if we want to control them
      baseName = baseName.replace(/[0-9]/g, '');
      
      if (addNumbers) {
        baseName += Math.floor(Math.random() * 9999);
      }
      
      if (addSymbols) {
        const sym = symbols[Math.floor(Math.random() * symbols.length)];
        baseName = Math.random() > 0.5 ? `${sym}${baseName}` : `${baseName}${sym}`;
      }
      
      results.push(baseName);
    }
    return results;
  };

  const handleGenerateSingle = () => {
    setIsGenerating(true);
    setMultipleNames([]);
    
    setTimeout(() => {
      setGeneratedName(generateNames(1)[0]);
      setIsGenerating(false);
      if (onGenerate) onGenerate();
    }, 300);
  };

  const handleGenerateMultiple = () => {
    setIsGenerating(true);
    setGeneratedName('');
    
    setTimeout(() => {
      setMultipleNames(generateNames(10));
      setIsGenerating(false);
      if (onGenerate) onGenerate();
    }, 500);
  };

  const handleCopy = async (text, id) => {
    const res = await copyTextToClipboard(text, { preventRepeatMs: 450, vibrateMs: 12 });
    if (!res.ok) {
      toast({ title: "Copy failed", description: "Clipboard blocked by your browser.", variant: "destructive" });
      return;
    }
    setCopiedId(id);
    toast({ title: "Copied!", description: `${text} copied to clipboard.`, className: "bg-card border-primary text-foreground" });
    setTimeout(() => setCopiedId(null), 1200);
  };

  return (
    <div className="space-y-8">
      <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-10 shadow-refined relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Roblox Name Generator</h2>
          <p className="text-foreground/60">Select a style and generate your perfect Roblox identity.</p>
        </div>

        <GenderSelector selectedGender={selectedGender} onSelectGender={setSelectedGender} />

        <div className="mt-8 space-y-8">
          <AnimatePresence mode="wait">
            {generatedName && (
              <motion.div
                key={generatedName}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-6"
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary break-all tracking-tight mb-6">
                  {generatedName}
                </h2>
                <Button
                  onClick={() => handleCopy(generatedName, 'main')}
                  className={`px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 ${
                    copiedId === 'main' ? 'bg-green-500 text-black' : 'bg-card border-2 border-primary text-primary hover:bg-primary/10'
                  }`}
                >
                  {copiedId === 'main' ? <><Check className="w-5 h-5 mr-2" /> Copied!</> : <><Copy className="w-5 h-5 mr-2" /> Copy Name</>}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {multipleNames.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {multipleNames.map((name, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-background border border-border/50 rounded-lg p-4 flex items-center justify-between group hover:border-primary/50 transition-colors"
                >
                  <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{name}</span>
                  <button
                    onClick={() => handleCopy(name, `multi-${index}`)}
                    className="p-2 rounded-md bg-card border border-border/50 text-foreground/60 hover:text-primary hover:border-primary/50 transition-colors"
                  >
                    {copiedId === `multi-${index}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleGenerateSingle} disabled={isGenerating} className="bg-primary text-black hover:bg-primary/90 text-lg py-8 font-bold w-full">
              {isGenerating ? <RefreshCw className="w-6 h-6 mr-2 animate-spin" /> : <Sparkles className="w-6 h-6 mr-2" />}
              Sample name
            </Button>
            <Button onClick={handleGenerateMultiple} disabled={isGenerating} className="bg-secondary text-white hover:bg-secondary/90 text-lg py-8 font-bold w-full">
              {isGenerating ? <RefreshCw className="w-6 h-6 mr-2 animate-spin" /> : <Sparkles className="w-6 h-6 mr-2" />}
              Sample 10 names
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/30">
            <ToggleSwitch id="add-numbers" label="Numbers ON/OFF" checked={addNumbers} onCheckedChange={setAddNumbers} icon={Hash} />
            <ToggleSwitch id="add-symbols" label="Symbols ON/OFF" checked={addSymbols} onCheckedChange={setAddSymbols} icon={AtSign} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobloxNameGenerator;