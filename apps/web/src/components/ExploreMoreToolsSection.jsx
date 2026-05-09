
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Type, UserCircle, Target, Crosshair, Gamepad2, Laugh, Crown } from 'lucide-react';

const crossLinks = {
  fortnite: [
    { path: '/valorant/sweaty', title: 'Valorant Names', desc: 'Ranked tags & killfeed reads', icon: Crosshair, color: 'text-red-500' },
    { path: '/cod/sweaty', title: 'COD Names', desc: 'Squad-ready aliases', icon: Target, color: 'text-green-600' }
  ],
  valorant: [
    { path: '/fortnite/tryhard', title: 'Fortnite Names', desc: 'Display names & overlays', icon: Target, color: 'text-purple-500' },
    { path: '/cod/funny', title: 'COD Names', desc: 'Humor-forward tags', icon: Laugh, color: 'text-orange-500' }
  ],
  roblox: [
    { path: '/valorant/sweaty', title: 'Valorant Names', desc: 'Tactical tags for Riot UI', icon: Crosshair, color: 'text-red-500' },
    { path: '/fortnite/og', title: 'Fortnite Names', desc: 'Classic OG-style handles', icon: Crown, color: 'text-yellow-500' }
  ],
  cod: [
    { path: '/valorant/aesthetic', title: 'Valorant Names', desc: 'Minimal & aesthetic reads', icon: Crosshair, color: 'text-pink-400' },
    { path: '/fortnite/tryhard', title: 'Fortnite Names', desc: 'Tryhard display energy', icon: Target, color: 'text-purple-500' }
  ]
};

const ExploreMoreToolsSection = ({ game }) => {
  const specificLinks = crossLinks[game] || crossLinks.fortnite;

  const tools = [
    {
      title: 'Stylish text',
      description: 'Unicode styles for Discord, bios, and chats',
      icon: Type,
      path: '/stylish-text-generator',
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'hover:border-primary/50'
    },
    {
      title: 'Clan names',
      description: 'Team tags for rosters, streams, and squads',
      icon: Shield,
      path: '/clan-name-generator',
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      border: 'hover:border-secondary/50'
    },
    {
      title: 'Gamer bios',
      description: 'Profile lines for Discord, Twitch, and in-game',
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
          More identity tools
        </h2>
        <p className="text-lg text-[#d6d6d6] max-w-2xl mx-auto">
          Same trunk—handles, bios, and text styling you can paste anywhere.
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
