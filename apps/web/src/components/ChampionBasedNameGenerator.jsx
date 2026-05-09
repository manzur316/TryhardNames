import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast.js';
import { copyTextToClipboard } from '@/utils/clipboard.js';
import leagueOfLegendsChampions from '@/data/leagueOfLegendsChampions.js';

const ChampionBasedNameGenerator = ({ initialChampion = null }) => {
  const [selectedChampion, setSelectedChampion] = useState(initialChampion || leagueOfLegendsChampions[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [generatedNames, setGeneratedNames] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialChampion) {
      setSelectedChampion(initialChampion);
      handleGenerate(initialChampion);
    }
  }, [initialChampion]);

  const filteredChampions = leagueOfLegendsChampions.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateChampionNames = (champ) => {
    const prefixes = [champ.name, champ.region, champ.role, "Master", "Lord", "King", "Pro", "Elite", "Shadow", "Light"];
    const suffixes = ["Main", "God", "OneTrick", "OTP", "Slayer", "Strike", "Force", "Player", "Carry", "Pro"];
    
    if (champ.name === 'Ahri') {
      prefixes.push("Mystic", "Fox", "Nine", "Spirit");
      suffixes.push("Kitsune", "Weaver", "Soul");
    } else if (champ.name === 'Darius') {
      prefixes.push("Blood", "Axe", "Noxian");
      suffixes.push("Dunk", "Bleed", "Guillotine");
    } else if (champ.name === 'Lux') {
      prefixes.push("Light", "Prismatic", "Radiant");
      suffixes.push("Beam", "Spark", "Illumination");
    }

    const names = [];
    for (let i = 0; i < 6; i++) {
      const p = prefixes[Math.floor(Math.random() * prefixes.length)];
      const s = suffixes[Math.floor(Math.random() * suffixes.length)];
      names.push(`${p}${s}`);
    }
    return [...new Set(names)].slice(0, 5);
  };

  const handleGenerate = (champ = selectedChampion) => {
    setIsGenerating(true);

    setTimeout(() => {
      setGeneratedNames(generateChampionNames(champ));
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
    toast({
      title: "Copied!",
      description: `${text} copied to clipboard.`,
      className: "bg-card border-primary text-foreground"
    });
    setTimeout(() => setCopiedId(null), 1200);
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-refined">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left: Champion Selection */}
        <div className="w-full md:w-1/3 space-y-4">
          <h3 className="text-xl font-bold">Select Champion</h3>
          
          <div className="relative">
            <div 
              className="w-full bg-background border border-border/50 rounded-xl p-3 text-lg flex justify-between items-center cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{selectedChampion.name}</span>
              <Search className="w-5 h-5 text-foreground/50" />
            </div>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-card border border-border/50 rounded-xl shadow-xl z-20 max-h-60 overflow-hidden flex flex-col">
                <div className="p-2 border-b border-border/50">
                  <Input 
                    autoFocus
                    placeholder="Search champion..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="overflow-y-auto custom-scrollbar p-2">
                  {filteredChampions.map(c => (
                    <div 
                      key={c.id}
                      className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedChampion(c);
                        setIsDropdownOpen(false);
                        setSearchQuery('');
                      }}
                    >
                      {c.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="aspect-square rounded-xl overflow-hidden border-2 border-border/50 relative group">
            <img 
              src={selectedChampion.image} 
              alt={selectedChampion.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => { e.target.src = 'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Teemo.png'; }}
            />
            <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-sm p-3 text-center">
              <span className="text-white font-bold block">{selectedChampion.title}</span>
              <span className="text-primary text-xs font-medium uppercase tracking-wider">{selectedChampion.role}</span>
            </div>
          </div>

          <Button 
            onClick={() => handleGenerate(selectedChampion)} 
            disabled={isGenerating}
            className="w-full bg-primary text-black hover:bg-primary/90 font-bold py-6"
          >
            {isGenerating ? <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
            Sample tags
          </Button>
        </div>

        {/* Right: Generated Names */}
        <div className="w-full md:w-2/3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Samples · {selectedChampion.name}</h3>
            {generatedNames.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => handleGenerate(selectedChampion)} disabled={isGenerating}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} /> Refresh
              </Button>
            )}
          </div>
          
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
                  <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p>Click generate to see champion-specific names</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChampionBasedNameGenerator;