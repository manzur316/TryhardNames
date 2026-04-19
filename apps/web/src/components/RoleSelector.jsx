import React from 'react';
import { Swords, Axe, Wand2, Crosshair, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const RoleSelector = ({ selectedRole, onSelectRole }) => {
  const roles = [
    { id: 'Top', icon: Swords, desc: 'Frontline Bruisers & Tanks', color: 'hover:border-red-500 hover:text-red-500', activeColor: 'border-red-500 text-red-500 bg-red-500/10' },
    { id: 'Jungle', icon: Axe, desc: 'Ambush & Objective Control', color: 'hover:border-green-500 hover:text-green-500', activeColor: 'border-green-500 text-green-500 bg-green-500/10' },
    { id: 'Mid', icon: Wand2, desc: 'Magic Damage & Assassins', color: 'hover:border-purple-500 hover:text-purple-500', activeColor: 'border-purple-500 text-purple-500 bg-purple-500/10' },
    { id: 'ADC', icon: Crosshair, desc: 'Ranged Physical Damage', color: 'hover:border-blue-500 hover:text-blue-500', activeColor: 'border-blue-500 text-blue-500 bg-blue-500/10' },
    { id: 'Support', icon: Shield, desc: 'Utility, Healing & Vision', color: 'hover:border-yellow-500 hover:text-yellow-500', activeColor: 'border-yellow-500 text-yellow-500 bg-yellow-500/10' }
  ];

  const handleSelect = (roleId) => {
    onSelectRole(roleId);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {roles.map((role) => {
        const isSelected = selectedRole === role.id;
        return (
          <motion.button
            key={role.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(role.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${
              isSelected ? role.activeColor : `border-border/50 text-foreground/70 bg-card ${role.color}`
            }`}
          >
            <role.icon className="w-8 h-8 mb-2" />
            <span className="font-bold text-lg">{role.id}</span>
            <span className="text-xs text-center mt-1 opacity-70 hidden md:block">{role.desc}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default RoleSelector;