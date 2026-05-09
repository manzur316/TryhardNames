import React, { useEffect } from 'react';
import { X, Users, Gamepad2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';

const RobloxGameModal = ({ game, isOpen, onClose, onGenerateName }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen && game) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, game, onClose]);

  if (!isOpen || !game) return null;

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
          className="relative w-full max-w-3xl max-h-[90vh] bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
        >
          <div className="relative h-48 sm:h-64 w-full shrink-0">
            <img 
              src={game.image} 
              alt={game.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-6 left-6 sm:left-8">
              <h2 className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg tracking-tight">{game.name}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30 backdrop-blur-md">
                  {game.gameType}
                </span>
                <span className="flex items-center gap-1 text-white/90 text-sm font-medium drop-shadow-md">
                  <Users className="w-4 h-4" /> {game.activePlayers.toLocaleString()} Active
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar space-y-8">
            <section>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-primary" /> About the Game
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                {game.description}
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4">Popular Names in {game.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {game.popularNames.map((name, idx) => (
                  <div key={idx} className="bg-background border border-border/50 p-3 rounded-xl text-center font-bold text-foreground/90">
                    {name}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="p-4 sm:p-6 border-t border-border/50 bg-background/80 backdrop-blur-sm flex justify-end gap-4 shrink-0">
            <Button variant="outline" onClick={onClose} className="px-6">Close</Button>
            <Button 
              onClick={() => {
                onClose();
                if(onGenerateName) onGenerateName(game.gameType);
              }}
              className="bg-primary text-black hover:bg-primary/90 font-bold px-6"
            >
              <Sparkles className="w-4 h-4 mr-2" /> Sample {game.gameType} tags
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RobloxGameModal;