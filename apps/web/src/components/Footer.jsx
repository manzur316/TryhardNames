import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Twitter, Youtube, MessageCircle } from 'lucide-react';

const Footer = () => {
  const location = useLocation();

  const footerLinks = {
    tools: [
      { name: 'Fortnite Names', path: '/fortnite-tryhard-names' },
      { name: 'Valorant Names', path: '/valorant-tryhard-names' },
      { name: 'Roblox Names', path: '/roblox-tryhard-names' },
      { name: 'Clan Names', path: '/clan-name-generator' },
      { name: 'Gamer Bio', path: '/gamer-bio-generator' }
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Leaderboards', path: '/leaderboards' }
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy-policy' },
      { name: 'Terms of Service', path: '/terms-of-service' }
    ]
  };

  const socialLinks = [
    { icon: Twitter, label: 'Twitter', url: 'https://twitter.com' },
    { icon: MessageCircle, label: 'Discord', url: 'https://discord.com' },
    { icon: Youtube, label: 'YouTube', url: 'https://youtube.com' }
  ];

  return (
    <footer className="bg-dark-900 border-t border-dark-700 mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-accent-cyan" />
              <span className="text-lg font-bold text-dark-50 tracking-wide">
                Tryhard<span className="text-transparent bg-clip-text bg-gradient-cyan-purple">Names</span>
              </span>
            </div>
            <p className="text-sm text-dark-300 leading-relaxed">
              The ultimate gamer name and bio generator. Generate stylish, sweaty, and aesthetic nicknames instantly for your favorite games.
            </p>
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center text-dark-400 hover:text-accent-cyan hover:border-accent-cyan/50 transition-all duration-300 hover:scale-105"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Tools Links */}
          <div className="space-y-4">
            <span className="text-sm font-bold text-dark-50 uppercase tracking-wider">Tools</span>
            <ul className="space-y-3">
              {footerLinks.tools.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-dark-300 hover:text-accent-cyan transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <span className="text-sm font-bold text-dark-50 uppercase tracking-wider">Company</span>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-dark-300 hover:text-accent-cyan transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <span className="text-sm font-bold text-dark-50 uppercase tracking-wider">Legal</span>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-dark-300 hover:text-accent-cyan transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-dark-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-dark-400">
              © {new Date().getFullYear()} TryhardNames.com. All rights reserved.
            </p>
            <p className="text-sm text-dark-400 flex items-center gap-1">
              Made with <Zap className="w-3 h-3 text-accent-cyan" /> for competitive gamers worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;