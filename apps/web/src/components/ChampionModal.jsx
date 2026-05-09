import React, { useEffect } from 'react';
import { X, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';

const ChampionModal = ({ champion, isOpen, onClose, onGenerateName }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen && champion) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, champion]);

  if (!isOpen || !champion) return null;

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'Easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="absolute inset-0 bg-background/90 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
        >
          {/* Header / Splash Art */}
          <div className="relative h-56 sm:h-72 w-full shrink-0">
            <img 
              src={champion.splashArt} 
              alt={champion.name} 
              className="w-full h-full object-cover object-top"
              onError={(e) => { e.target.src = 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Teemo_0.jpg'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-6 left-6 sm:left-8">
              <h2 className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg tracking-tight">{champion.name}</h2>
              <p className="text-xl text-white/90 font-medium italic drop-shadow-md mt-1">{champion.title}</p>
            </div>
          </div>

          {/* Content Scrollable Area */}
          <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">
                {champion.role}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-secondary/50 text-foreground text-sm font-medium border border-border/50">
                {champion.region}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getDifficultyColor(champion.difficulty)}`}>
                {champion.difficulty}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-background text-foreground/80 text-sm font-medium border border-border/50">
                Released: {champion.releaseYear}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Lore & Abilities */}
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-primary" /> Lore
                  </h3>
                  <p className="text-foreground/80 leading-relaxed text-base">
                    {champion.lore}
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-4">Abilities</h3>
                  <div className="space-y-4">
                    {Object.entries(champion.abilities).map(([key, ability]) => (
                      <div key={key} className="bg-background border border-border/50 p-4 rounded-xl hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-black uppercase border border-primary/20">
                            {key}
                          </span>
                          <span className="font-bold text-lg">{ability.name}</span>
                        </div>
                        <p className="text-sm text-foreground/70 pl-11">{ability.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column: Stats & Meta */}
              <div className="space-y-6">
                <div className="bg-background border border-border/50 rounded-xl p-5">
                  <h3 className="font-bold text-lg mb-4 border-b border-border/50 pb-3">Base Stats</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center"><span className="text-foreground/60">Health</span> <span className="font-bold">{champion.stats.health}</span></div>
                    <div className="flex justify-between items-center"><span className="text-foreground/60">Mana</span> <span className="font-bold">{champion.stats.mana}</span></div>
                    <div className="flex justify-between items-center"><span className="text-foreground/60">Armor</span> <span className="font-bold">{champion.stats.armor}</span></div>
                    <div className="flex justify-between items-center"><span className="text-foreground/60">Magic Resist</span> <span className="font-bold">{champion.stats.magicResist}</span></div>
                    <div className="flex justify-between items-center"><span className="text-foreground/60">Attack Damage</span> <span className="font-bold">{champion.stats.attackDamage}</span></div>
                    <div className="flex justify-between items-center"><span className="text-foreground/60">Attack Speed</span> <span className="font-bold">{champion.stats.attackSpeed}</span></div>
                  </div>
                </div>

                <div className="bg-background border border-border/50 rounded-xl p-5">
                  <h3 className="font-bold text-lg mb-4 border-b border-border/50 pb-3">Meta Stats</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="flex justify-between mb-1.5"><span className="text-foreground/60 font-medium">Win Rate</span> <span className="font-bold text-green-400">{champion.winRate}%</span></div>
                      <div className="w-full bg-card rounded-full h-2"><div className="bg-green-400 h-2 rounded-full" style={{ width: `${champion.winRate}%` }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1.5"><span className="text-foreground/60 font-medium">Pick Rate</span> <span className="font-bold text-blue-400">{champion.pickRate}%</span></div>
                      <div className="w-full bg-card rounded-full h-2"><div className="bg-blue-400 h-2 rounded-full" style={{ width: `${champion.pickRate}%` }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1.5"><span className="text-foreground/60 font-medium">Ban Rate</span> <span className="font-bold text-red-400">{champion.banRate}%</span></div>
                      <div className="w-full bg-card rounded-full h-2"><div className="bg-red-400 h-2 rounded-full" style={{ width: `${champion.banRate}%` }}></div></div>
                    </div>
                  </div>
                </div>

                <div className="bg-background border border-border/50 rounded-xl p-5">
                  <h3 className="font-bold text-lg mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {champion.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-card border border-border/50 rounded-md text-xs font-medium text-foreground/70">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 border-t border-border/50 bg-background/80 backdrop-blur-sm flex justify-end gap-4 shrink-0">
            <Button variant="outline" onClick={onClose} className="px-6">Close</Button>
            <Button 
              onClick={() => {
                onClose();
                onGenerateName(champion);
              }}
              className="bg-primary text-black hover:bg-primary/90 font-bold px-6"
            >
              <Zap className="w-4 h-4 mr-2" /> Sample tag for {champion.name}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ChampionModal;