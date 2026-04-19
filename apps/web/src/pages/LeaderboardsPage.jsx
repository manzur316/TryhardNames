import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Trophy, Users, Gamepad2, ArrowRight, TrendingUp } from 'lucide-react';

const LeaderboardsPage = () => {
  const sections = [
    {
      title: "Top Names",
      description: "The most copied, favorited, and trending names across all games.",
      icon: Trophy,
      path: "/leaderboard/names",
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30 hover:border-yellow-500"
    },
    {
      title: "Top Games",
      description: "See which games are generating the most names and activity.",
      icon: Gamepad2,
      path: "/leaderboard/games",
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/30 hover:border-primary"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Gaming Name Leaderboards | TryhardNames</title>
        <meta name="description" content="Discover the most popular, trending, and highly-rated gaming names and games on TryhardNames." />
      </Helmet>

      <div className="bg-background text-foreground flex-grow flex flex-col">
        <div className="container mx-auto px-4 py-12 max-w-5xl flex-grow">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 flex items-center justify-center gap-4">
              <Trophy className="w-10 h-10 text-yellow-500" />
              Global Leaderboards
            </h1>
            <p className="text-xl text-foreground/60">See what's trending in the gaming community right now.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, idx) => (
              <Link 
                key={idx} 
                to={section.path}
                className={`group relative bg-card border-2 ${section.border} rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${section.bg} rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110`} />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-xl ${section.bg} ${section.color} flex items-center justify-center mb-6`}>
                    <section.icon className="w-8 h-8" />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-3">{section.title}</h2>
                  <p className="text-foreground/60 mb-8 line-clamp-2">{section.description}</p>
                  
                  <div className={`flex items-center font-bold ${section.color}`}>
                    View Leaderboard <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 bg-card border border-border/50 rounded-2xl p-8 text-center">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-bold mb-2">Real-Time Statistics</h3>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              Our leaderboards are updated in real-time based on community interactions, copies, and favorites. Check back often to see the latest trends!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeaderboardsPage;