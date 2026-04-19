import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Type, UserCircle, Sparkles, Target, Crosshair, Gamepad2, Smartphone, Swords } from 'lucide-react';

const ClanExploreMoreSection = () => {
  const tools = [
    {
      title: 'Tryhard Name Generator',
      description: 'Generate tryhard names for competitive players',
      icon: Sparkles,
      path: '/',
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'hover:border-primary/50'
    },
    {
      title: 'Stylish Text Generator',
      description: 'Create stylish text for your clan name',
      icon: Type,
      path: '/stylish-text-generator',
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      border: 'hover:border-secondary/50'
    },
    {
      title: 'Gamer Bio Generator',
      description: 'Build your perfect gamer bio',
      icon: UserCircle,
      path: '/gamer-bio-generator',
      color: 'text-accent',
      bg: 'bg-accent/10',
      border: 'hover:border-accent/50'
    },
    {
      title: 'Fortnite Names',
      description: 'Find names for specific games',
      icon: Target,
      path: '/fortnite-names',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'hover:border-purple-500/50'
    },
    {
      title: 'Valorant Names',
      description: 'Find names for specific games',
      icon: Crosshair,
      path: '/valorant-names',
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'hover:border-red-500/50'
    },
    {
      title: 'Roblox Names',
      description: 'Find names for specific games',
      icon: Gamepad2,
      path: '/roblox-names',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'hover:border-blue-400/50'
    },
    {
      title: 'Free Fire Names',
      description: 'Find names for specific games',
      icon: Smartphone,
      path: '/free-fire-names',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      border: 'hover:border-orange-500/50'
    },
    {
      title: 'COD Names',
      description: 'Find names for specific games',
      icon: Swords,
      path: '/cod-names',
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      border: 'hover:border-green-500/50'
    }
  ];

  return (
    <section className="py-16 border-t border-border/15">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
          Explore More Gamer Tools
        </h2>
        <p className="text-lg text-[#d6d6d6] max-w-2xl mx-auto">
          Level up your entire gaming identity with our suite of free generators.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {tools.map((tool, index) => (
          <Link key={index} to={tool.path} className="h-full">
            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`bg-card border border-border/40 rounded-xl p-6 h-full flex flex-col items-center text-center shadow-lg group ${tool.border}`}
            >
              <div className={`w-14 h-14 rounded-full ${tool.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <tool.icon className={`w-7 h-7 ${tool.color}`} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-white transition-colors">
                {tool.title}
              </h3>
              <p className="text-[#d6d6d6] text-sm leading-relaxed">
                {tool.description}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ClanExploreMoreSection;