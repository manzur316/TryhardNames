import React from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '@/seo/SeoHead.jsx';
import { Zap, Gamepad2, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const AboutPage = () => {
  const features = [
    {
      icon: Zap,
      title: 'Fast & Easy',
      description: 'Pull large lists quickly—sample until something clicks.'
    },
    {
      icon: Gamepad2,
      title: 'Gaming Focused',
      description: 'Tailored specifically for popular games like Fortnite, Valorant, Roblox, and more.'
    },
    {
      icon: Sparkles,
      title: 'Creative & Unique',
      description: 'Stand out from the crowd with aesthetic, sweaty, and truly unique username combinations.'
    },
    {
      icon: ShieldCheck,
      title: 'Completely Free',
      description: 'All our tools and generators are 100% free to use, forever. No hidden fees.'
    }
  ];

  return (
    <>
    <SeoHead
      title="About TryhardNames – Gaming Name & Unicode Tools"
      description="Free tools for gaming handles, Roblox and gamer hubs, Unicode text, and nickname symbols—built for readable online identity."
      path="/about"
    />
    <div className="bg-gradient-dark text-dark-300 font-sans selection:bg-accent-cyan/30 flex-grow flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent-cyan/10 rounded-full blur-[120px] pointer-events-none"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan font-bold text-sm mb-4">
            Our Mission
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight text-dark-50">
            Level Up Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-cyan-purple">Gaming Identity</span>
          </h1>
          <p className="text-lg md:text-xl text-dark-300 max-w-2xl mx-auto leading-relaxed">
            TryhardNames was built by gamers, for gamers. We know how hard it is to find that perfect, untaken username that strikes fear into your opponents. Our mission is to provide the ultimate suite of tools to help you craft your perfect gaming persona.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto max-w-6xl px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-50 mb-4">Why Choose Us?</h2>
          <p className="text-dark-300 max-w-2xl mx-auto">Everything you need to build your gaming brand, all in one place.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-dark-800 border border-dark-700 p-8 rounded-2xl hover:border-accent-cyan/50 transition-colors duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-accent-cyan/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-7 h-7 text-accent-cyan" />
                </div>
                <h3 className="text-xl font-bold text-dark-50 mb-3">{feature.title}</h3>
                <p className="text-dark-300 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="bg-dark-800 border border-dark-700 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-cyan-purple opacity-5"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-dark-50 mb-6">Got Questions or Suggestions?</h2>
            <p className="text-dark-300 mb-8 max-w-xl mx-auto">
              We're always looking to improve our generators and add new features. If you have an idea or just want to say hi, we'd love to hear from you.
            </p>
            <Button asChild className="bg-gradient-cyan-purple text-white hover:opacity-90 font-bold text-lg h-14 px-8 rounded-full transition-all duration-300 hover:scale-105">
              <Link to="/contact">
                Get in Touch <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default AboutPage;