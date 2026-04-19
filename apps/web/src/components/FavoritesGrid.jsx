import React, { useState } from 'react';
import { Copy, Check, Share2, Trash2, Gamepad2, Tag, User, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRemoveFavorite } from '@/hooks/useFavorites.js';
import { useToast } from '@/hooks/use-toast.js';

const FavoritesGrid = ({ favorites }) => {
  const removeFavorite = useRemoveFavorite();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (name, id) => {
    navigator.clipboard.writeText(name);
    setCopiedId(id);
    toast({
      title: "Copied!",
      description: `${name} copied to clipboard.`,
      className: "bg-card border-primary text-foreground"
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (name) => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this gamer name!',
        text: `I found this awesome name: ${name}`,
        url: window.location.origin
      }).catch(console.error);
    } else {
      handleCopy(name, 'share');
      toast({ description: "Name copied to share!" });
    }
  };

  if (!favorites || favorites.length === 0) {
    return (
      <div className="text-center py-20 bg-card border border-border/50 rounded-2xl">
        <Heart className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-foreground/70">No favorites yet</h3>
        <p className="text-foreground/50 mt-2">Start exploring and heart your favorite names!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <AnimatePresence>
        {favorites.map((fav, index) => (
          <motion.div
            key={fav.nameId || fav.id || index}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/50 transition-all group flex flex-col h-full shadow-sm hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors break-all">
                {fav.name}
              </h3>
              <button
                onClick={() => removeFavorite(fav.nameId || fav.id)}
                className="text-foreground/30 hover:text-red-500 transition-colors p-1"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 mb-6 flex-grow">
              <div className="flex items-center gap-2 text-xs text-foreground/60">
                <Tag className="w-3 h-3" /> {fav.category}
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground/60">
                <Gamepad2 className="w-3 h-3" /> {fav.gameType}
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground/60">
                <User className="w-3 h-3" /> {fav.gender}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/30">
              <span className="text-[10px] text-foreground/40">
                {new Date(fav.addedDate).toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleShare(fav.name)}
                  className="p-2 rounded-lg bg-background border border-border/50 text-foreground/60 hover:text-primary hover:border-primary/50 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCopy(fav.name, fav.nameId || fav.id)}
                  className={`p-2 rounded-lg border transition-colors ${
                    copiedId === (fav.nameId || fav.id)
                      ? 'bg-green-500/10 border-green-500 text-green-500'
                      : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary hover:text-black'
                  }`}
                  title="Copy"
                >
                  {copiedId === (fav.nameId || fav.id) ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FavoritesGrid;