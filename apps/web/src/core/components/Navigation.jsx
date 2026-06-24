
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, UserCircle } from 'lucide-react';
import { useTheme } from '@/core/context/ThemeContext.jsx';
import { useAuth } from '@/core/hooks/useAuth.js';
import { getAccountNavigationState } from '@/core/routing/accountNavigation.js';
import { Dropdown } from './Dropdown.jsx';

/** Dark-integrated links — navbar chrome is always atmospheric (see .th-nav-shell); no light-branch. */
const NAV_LINK =
  'px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all duration-200';
const NAV_PANEL = 'th-nav-panel';

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { isConfigured, session } = useAuth();
  const accountNavigation = getAccountNavigationState({ isConfigured, session });

  const robloxItems = [
    { href: '/roblox-names/cool', label: 'Cool', description: 'Sharp tone · readable', icon: '⚡' },
    { href: '/roblox-names/funny', label: 'Funny', description: 'Playful · memorable', icon: '😂' },
    { href: '/roblox-names/aesthetic', label: 'Aesthetic', description: 'Soft · stylish read', icon: '✨' },
    { href: '/roblox-names/tryhard', label: 'Tryhard', description: 'Ranked-forward tone', icon: '🎯' },
    { href: '/valorant/sweaty', label: 'Sweaty Names', description: 'High-intensity competitive', icon: '💧' },
    { href: '/general/cool', label: 'Cool Names', description: 'Versatile gaming tags', icon: '❄️' }
  ];

  const gamerItems = [
    { href: '/gamer-names/cool', label: 'Cool', description: 'Sleek · readable', icon: '⚡' },
    { href: '/gamer-names/funny', label: 'Funny', description: 'Playful gamertags', icon: '😂' },
    { href: '/gamer-names/pro', label: 'Pro', description: 'Esports-clean tone', icon: '🏆' },
    { href: '/gamer-names/edgy', label: 'Edgy', description: 'Harder silhouette', icon: '💀' },
    { href: '/general/best', label: 'Best Names', description: 'Curated picks', icon: '🌟' },
    { href: '/valorant/aesthetic', label: 'Aesthetic Names', description: 'Stylish · minimal noise', icon: '✨' }
  ];

  const gameNamesItems = [
    {
      label: 'League of Legends',
      items: [
        {
          href: '/league-of-legends',
          label: 'Identity hub',
          description: 'Summoner lanes & culture',
          icon: '◇',
        },
      ],
    },
    { 
      label: 'Valorant Names',
      items: [
        { href: '/valorant/sweaty', label: 'Sweaty', description: 'Ranked Valorant read', icon: '💧' },
        { href: '/valorant/aesthetic', label: 'Aesthetic', description: 'Clean stylish tags', icon: '✨' }
      ]
    },
    {
      label: 'Fortnite Names',
      items: [
        { href: '/fortnite/tryhard', label: 'Tryhard', description: 'Competitive Fortnite tone', icon: '🎯' },
        { href: '/fortnite/og', label: 'OG', description: 'OG · short silhouettes', icon: '👑' }
      ]
    },
    {
      label: 'COD Names',
      items: [
        { href: '/cod/sweaty', label: 'Sweaty', description: 'Aggressive COD read', icon: '💧' },
        { href: '/cod/funny', label: 'Funny', description: 'Playful COD tags', icon: '😂' }
      ]
    },
    {
      label: 'General Names',
      items: [
        { href: '/general/best', label: 'Best', description: 'Broad gaming picks', icon: '🌟' },
        { href: '/general/cool', label: 'Cool', description: 'Cool neutral tags', icon: '❄️' }
      ]
    }
  ];

  return (
    <header className="th-nav-shell transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl font-semibold tracking-tight text-white transition-all duration-200 group-hover:[text-shadow:0_0_22px_rgba(34,211,238,0.22)]">
              TryhardNames
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            <Link to="/" className={NAV_LINK}>
              Home
            </Link>
            <Link to="/identity-kit" className={NAV_LINK}>
              Identity Kit
            </Link>
            <Link to="/gaming-passport" className={NAV_LINK}>
              Gaming Passport
            </Link>
            <Dropdown label="Roblox Names" items={robloxItems} />
            <Dropdown label="Gamer Names" items={gamerItems} />
            
            {/* Game Names Dropdown with Nested Structure */}
            <div className="relative group">
              <button type="button" className={NAV_LINK}>
                Game hubs
              </button>
              <div
                className={`absolute left-0 mt-2 w-56 ${NAV_PANEL} opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50`}
              >
                <div className="py-2">
                  {gameNamesItems.map((category, idx) => (
                    <div key={idx} className="px-2 py-1">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-1">
                        {category.label}
                      </div>
                      {category.items.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/[0.07] hover:text-white transition-colors duration-200"
                        >
                          <span className="text-lg">{item.icon}</span>
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-slate-500">{item.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link to="/stylish-text-generator" className={NAV_LINK}>
              Stylish Text
            </Link>
            <Link to="/nickname-symbols" className={NAV_LINK}>
              Symbols
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {accountNavigation && (
              <Link
                to={accountNavigation.href}
                className="hidden sm:inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all duration-200"
              >
                <UserCircle className="h-4 w-4" aria-hidden="true" />
                {accountNavigation.label}
              </Link>
            )}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#05070d]/98 backdrop-blur-xl transition-colors duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1 h-[calc(100vh-4rem)] overflow-y-auto">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-white/[0.06] hover:text-white transition-colors duration-200">
              Home
            </Link>
            <Link to="/identity-kit" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-white/[0.06] hover:text-white transition-colors duration-200">
              Identity Kit
            </Link>
            <Link to="/gaming-passport" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-white/[0.06] hover:text-white transition-colors duration-200">
              Gaming Passport
            </Link>
            
            <div className="py-2">
              <div className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Roblox Names</div>
              <div className="space-y-1">
                {robloxItems.map(item => (
                  <Link key={item.href} to={item.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white pl-6 transition-colors duration-200">
                    <span className="text-xl">{item.icon}</span> {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="py-2">
              <div className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Gamer Names</div>
              <div className="space-y-1">
                {gamerItems.map(item => (
                  <Link key={item.href} to={item.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white pl-6 transition-colors duration-200">
                    <span className="text-xl">{item.icon}</span> {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="py-2">
              <div className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Game hubs</div>
              <div className="space-y-2">
                {gameNamesItems.map((category, idx) => (
                  <div key={idx}>
                    <div className="px-3 text-xs font-semibold text-slate-500 mb-1 pl-6">{category.label}</div>
                    {category.items.map((item) => (
                      <Link key={item.href} to={item.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white pl-10 transition-colors duration-200">
                        <span className="text-xl">{item.icon}</span> {item.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 space-y-1 border-t border-white/[0.08] mt-2">
              {accountNavigation && (
                <Link to={accountNavigation.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-white/[0.06] hover:text-white transition-colors duration-200">
                  <UserCircle className="h-5 w-5" aria-hidden="true" />
                  {accountNavigation.label}
                </Link>
              )}
              <Link to="/stylish-text-generator" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-white/[0.06] hover:text-white transition-colors duration-200">
                Stylish Text
              </Link>
              <Link to="/nickname-symbols" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-white/[0.06] hover:text-white transition-colors duration-200">
                Symbols
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
