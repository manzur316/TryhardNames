import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Type, UserCircle, Sparkles, Gamepad2, ArrowRight } from 'lucide-react';

const BuildYourIdentitySection = () => {
  const tools = [
    {
      title: 'Stylish Text Generator',
      description: 'Convert normal text into cool, aesthetic fonts for your profile.',
      icon: Type,
      path: '/stylish-text-generator',
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'hover:border-primary/50'
    },
    {
      title: 'Gamer Bio Generator',
      description: 'Create the perfect bio for Discord, Twitch, and Instagram.',
      icon: UserCircle,
      path: '/gamer-bio-generator',
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      border: 'hover:border-secondary/50'
    },
    {
      title: 'Tryhard Names',
      description: 'Ranked-forward tags for competitive lobbies.',
      icon: Sparkles,
      path: '/fortnite-names',
      color: 'text-accent',
      bg: 'bg-accent/10',
      border: 'hover:border-accent/50'
    },
    {
      title: 'Game Specific Names',
      description: 'Find names tailored for Valorant, COD, Roblox, and more.',
      icon: Gamepad2,
      path: '/valorant-names',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'hover:border-purple-500/50'
    }
  ];

  return (
    <section className="py-16 border-t border-border/30">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-dark-50 mb-4 tracking-tight">
          Complete Your Competitive Profile
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A great clan name is just the beginning. Level up your entire gaming identity with our suite of free tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool, index) => (
          <Link key={index} to={tool.path} className="h-full block">
            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`bg-card border border-border/40 rounded-xl p-6 h-full flex flex-col shadow-lg hover:shadow-2xl group ${tool.border}`}
            >
              <div className={`w-12 h-12 rounded-xl ${tool.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <tool.icon className={`w-6 h-6 ${tool.color}`} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-dark-50 mb-2 group-hover:text-primary transition-colors">
                {tool.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-dark-300 leading-relaxed mb-6 flex-grow">
                {tool.description}
              </p>
              <div className={`flex items-center font-bold text-sm ${tool.color} mt-auto`}>
                Explore <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BuildYourIdentitySection;