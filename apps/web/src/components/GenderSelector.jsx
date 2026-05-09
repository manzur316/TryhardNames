import React from 'react';
import { User, UserPlus, Users, Zap, Gamepad2, Tv, Sparkles, Gem, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const GenderSelector = ({ selectedGender, onSelectGender }) => {
  const genders = [
    { id: 'Masculine', icon: User, desc: 'Strong & bold names', color: 'hover:border-blue-500 hover:text-blue-500', activeColor: 'border-blue-500 text-blue-500 bg-blue-500/10' },
    { id: 'Feminine', icon: UserPlus, desc: 'Elegant & cute names', color: 'hover:border-pink-500 hover:text-pink-500', activeColor: 'border-pink-500 text-pink-500 bg-pink-500/10' },
    { id: 'Neutral', icon: Users, desc: 'Balanced & versatile', color: 'hover:border-green-500 hover:text-green-500', activeColor: 'border-green-500 text-green-500 bg-green-500/10' },
    { id: 'Epic', icon: Zap, desc: 'Bold · standout tone', color: 'hover:border-yellow-500 hover:text-yellow-500', activeColor: 'border-yellow-500 text-yellow-500 bg-yellow-500/10' },
    { id: 'Gaming', icon: Gamepad2, desc: 'Sweaty & competitive', color: 'hover:border-red-500 hover:text-red-500', activeColor: 'border-red-500 text-red-500 bg-red-500/10' },
    { id: 'Anime', icon: Tv, desc: 'Weeb & Japanese style', color: 'hover:border-purple-500 hover:text-purple-500', activeColor: 'border-purple-500 text-purple-500 bg-purple-500/10' },
    { id: 'Stylish', icon: Sparkles, desc: 'Aesthetic & clean', color: 'hover:border-cyan-500 hover:text-cyan-500', activeColor: 'border-cyan-500 text-cyan-500 bg-cyan-500/10' },
    { id: 'Rare', icon: Gem, desc: 'Less common reads', color: 'hover:border-indigo-500 hover:text-indigo-500', activeColor: 'border-indigo-500 text-indigo-500 bg-indigo-500/10' },
    { id: 'Trending', icon: TrendingUp, desc: 'Popular right now', color: 'hover:border-orange-500 hover:text-orange-500', activeColor: 'border-orange-500 text-orange-500 bg-orange-500/10' }
  ];

  const handleSelect = (genderId) => {
    onSelectGender(genderId);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-3 mt-6">
      {genders.map((gender) => {
        const isSelected = selectedGender === gender.id;
        return (
          <motion.button
            key={gender.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(gender.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 ${
              isSelected ? gender.activeColor : `border-border/50 text-foreground/70 bg-card ${gender.color}`
            }`}
          >
            <gender.icon className="w-6 h-6 mb-1" />
            <span className="font-bold text-sm">{gender.id}</span>
            <span className="text-[10px] text-center mt-1 opacity-70 hidden md:block leading-tight">{gender.desc}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default GenderSelector;