import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAddFavorite, useRemoveFavorite, useIsFavorite } from '@/hooks/useFavorites.js';
import { useToast } from '@/hooks/use-toast.js';

const FavoriteButton = ({ name, category = 'General', gameType = 'General', gender = 'Neutral', className = '' }) => {
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const isFavorite = useIsFavorite();
  const { toast } = useToast();

  const nameId = name.toLowerCase().replace(/\s+/g, '_');
  const isFav = isFavorite(nameId);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFav) {
      removeFavorite(nameId);
      toast({
        description: (
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-foreground/50" />
            <span>Removed from Favorites!</span>
          </div>
        ),
        duration: 2000,
        className: "bg-card border-border/50 text-foreground"
      });
    } else {
      addFavorite(name, category, gameType, gender);
      toast({
        description: (
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>Added to Favorites!</span>
          </div>
        ),
        duration: 2000,
        className: "bg-card border-red-500/50 text-foreground"
      });
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className={`p-2 rounded-full transition-colors ${isFav ? 'bg-red-500/10 text-red-500' : 'bg-card border border-border/50 text-foreground/50 hover:text-red-500 hover:border-red-500/50'} ${className}`}
      title={isFav ? "Remove from Favorites" : "Add to Favorites"}
      aria-label={isFav ? "Remove from Favorites" : "Add to Favorites"}
    >
      <Heart className={`w-5 h-5 transition-all duration-300 ${isFav ? 'fill-current' : ''}`} />
    </motion.button>
  );
};

export default FavoriteButton;