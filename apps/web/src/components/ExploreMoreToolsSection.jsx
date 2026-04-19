
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Type, UserCircle, Target, Crosshair, Gamepad2, Laugh, Crown } from 'lucide-react';

const crossLinks = {
  fortnite: [
    { path: '/valorant/sweaty', title: 'Valorant Names', desc: 'Sweaty competitive names', icon: Crosshair, color: 'text-red-500' },
    { path: '/cod/sweaty', title: 'COD Names', desc: 'Sweaty COD names', icon: Target, color: 'text-green-600' }
  ],
  valorant: [
    { path: '/fortnite/tryhard', title: 'Fortnite Names', desc: 'Tryhard Fortnite names', icon: Target, color: 'text-purple-500' },
    { path: '/cod/funny', title: 'COD Names', desc: 'Funny COD names', icon: Laugh, color: 'text-orange-500' }
  ],
  roblox: [
    { path: '/valorant/sweaty', title: 'Valorant Names', desc: 'Sweaty Valorant names', icon: Crosshair, color: 'text-red-500' },
    { path: '/fortnite/og', title: 'Fortnite Names', desc: 'OG Fortnite names', icon: Crown, color: 'text-yellow-500' }
  ],
  cod: [
    { path: '/valorant/aesthetic', title: 'Valorant Names', desc: 'Aesthetic Valorant names', icon: Crosshair, color: 'text-pink-400' },
    { path: '/fortnite/tryhard', title: 'Fortnite Names', desc: 'Tryhard Fortnite names', icon: Target, color: 'text-purple-500' }
  ]
};

const ExploreMoreToolsSection = ({ game }) => {
  const specificLinks = crossLinks[game] || crossLinks.fortnite;

  const tools = [
    {
      title: 'Stylish Text Generator',
      description: 'Create stylish text for Discord and Twitch',
      icon: Type,
      path: '/stylish-text-generator',
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'hover:border-primary/50'
    },
    {
      title: 'Clan Name Generator',
      description: 'Generate clan names for your esports team',
      icon: Shield,
      path: '/clan-name-generator',
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
    ...specificLinks.map(link => ({
      title: link.title,
      description: link.desc,
      icon: link.icon,
      path: link.path,
      color: link.color,
      bg: `bg-card`,
      border: `hover:border-border`
    }))
  ];

  return (
    <section className="py-16 border-t border-border/15">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
          Explore More Tools
        </h2>
        <p className="text-lg text-[#d6d6d6] max-w-2xl mx-auto">
          Level up your entire gaming identity with our suite of free generators.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
        {tools.map((tool, index) => (
          <Link key={index} to={tool.path} className="h-full">
            <motion.div
              whileHover={{ y: -5 }}
              className={`bg-card border border-border/40 rounded-xl p-6 h-full flex flex-col items-center text-center transition-all duration-300 shadow-sm hover:shadow-md group ${tool.border}`}
            >
              <div className={`w-12 h-12 rounded-full ${tool.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <tool.icon className={`w-6 h-6 ${tool.color}`} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-white transition-colors">
                {tool.title}
              </h3>
              <p className="text-foreground/60 text-xs leading-relaxed">
                {tool.description}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ExploreMoreToolsSection;
