
import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Crosshair, Gamepad2, Type, Zap, Crown, Laugh, Star, Hash, Sparkles } from 'lucide-react';

const PopularToolsSection = () => {
  const tools = [
    { name: 'Sweaty Valorant', path: '/valorant/sweaty', icon: Crosshair, color: 'text-red-500' },
    { name: 'Aesthetic Valorant', path: '/valorant/aesthetic', icon: Sparkles, color: 'text-pink-400' },
    { name: 'Tryhard Fortnite', path: '/fortnite/tryhard', icon: Target, color: 'text-purple-500' },
    { name: 'OG Fortnite', path: '/fortnite/og', icon: Crown, color: 'text-yellow-500' },
    { name: 'Sweaty COD', path: '/cod/sweaty', icon: Target, color: 'text-green-600' },
    { name: 'Funny COD', path: '/cod/funny', icon: Laugh, color: 'text-orange-500' },
    { name: 'Best Names', path: '/general/best', icon: Star, color: 'text-primary' },
    { name: 'Cool Names', path: '/general/cool', icon: Zap, color: 'text-accent' },
    { name: '3-Letter Names', path: '/general/3-letter', icon: Hash, color: 'text-secondary' },
    { name: 'Anime Names', path: '/general/anime', icon: Sparkles, color: 'text-pink-500' },
  ];

  return (
    <section className="py-16 border-t border-border/15">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 flex items-center justify-center gap-2">
          <Zap className="w-6 h-6 text-primary" />
          Popular lanes
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
        {tools.map((tool, index) => (
          <Link key={index} to={tool.path}>
            <div className="bg-background border border-border/50 rounded-xl p-4 flex items-center gap-3 hover:border-primary/50 hover:bg-card transition-all duration-300 group shadow-sm hover:shadow-md">
              <div className={`p-2 rounded-lg bg-card border border-border/50 group-hover:scale-110 transition-transform ${tool.color}`}>
                <tool.icon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm md:text-base text-foreground group-hover:text-primary transition-colors">
                {tool.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PopularToolsSection;
