import React, { useState } from 'react';
import { Sparkles, Copy, Check, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast.js';
import { copyTextToClipboard } from '@/utils/clipboard.js';
import robloxNamesDatabase from '@/data/robloxNamesDatabase.js';

const RobloxGameTypeGenerator = () => {
  const gameTypes = ['Simulator', 'Roleplay', 'Survival', 'Tycoon', 'Obby', 'Parkour', 'Horror', 'PvP', 'Casual', 'Building', 'Racing', 'Sports', 'Adventure'];
  const [selectedType, setSelectedType] = useState(gameTypes[0]);
  const [generatedNames, setGeneratedNames] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const { toast } = useToast();

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const filtered = robloxNamesDatabase.filter(n => n.gameType === selectedType);
      const pool = filtered.length > 10 ? filtered : robloxNamesDatabase;
      
      const names = [];
      for(let i=0; i<5; i++) {
        names.push(pool[Math.floor(Math.random() * pool.length)].name);
      }
      setGeneratedNames(names);
      setIsGenerating(false);
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
    <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-refined">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        <div className="w-full md:w-1/3 space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Gamepad2 className="w-5 h-5 text-primary" /> Game Type</h3>
            <p className="text-sm text-foreground/60 mb-4">Select the type of Roblox game you play most to get tailored names.</p>
            
            <div className="grid grid-cols-2 gap-2">
              {gameTypes.map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                  }}
                  className={`p-2 text-sm rounded-lg border transition-all ${
                    selectedType === type 
                      ? 'bg-primary/10 border-primary text-primary font-bold' 
                      : 'bg-background border-border/50 text-foreground/70 hover:border-primary/50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full bg-primary text-black hover:bg-primary/90 font-bold py-6"
          >
            {isGenerating ? <Sparkles className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
            Sample {selectedType} tags
          </Button>
        </div>

        <div className="w-full md:w-2/3">
          <h3 className="text-xl font-bold mb-4">Generated Names for {selectedType}</h3>
          
          <div className="space-y-3">
            <AnimatePresence>
              {generatedNames.length > 0 ? generatedNames.map((name, idx) => (
                <motion.div
                  key={name + idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between bg-background border border-border/50 p-4 rounded-xl hover:border-primary/50 transition-colors group"
                >
                  <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleCopy(name, idx)}
                    className={copiedId === idx ? "text-green-500" : "text-foreground/60 hover:text-primary"}
                  >
                    {copiedId === idx ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </Button>
                </motion.div>
              )) : (
                <div className="text-center py-16 text-foreground/50 border-2 border-dashed border-border/50 rounded-xl bg-background/50">
                  <Gamepad2 className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p>Select a game type and click generate</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RobloxGameTypeGenerator;