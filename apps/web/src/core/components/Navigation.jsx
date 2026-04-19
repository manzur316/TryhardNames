
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/core/context/ThemeContext.jsx';
import { Dropdown } from './Dropdown.jsx';

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  const robloxItems = [
    { href: '/roblox-names/cool', label: 'Cool', description: 'Edgy and awesome names', icon: '⚡' },
    { href: '/roblox-names/funny', label: 'Funny', description: 'Hilarious names', icon: '😂' },
    { href: '/roblox-names/aesthetic', label: 'Aesthetic', description: 'Soft and stylish names', icon: '✨' },
    { href: '/roblox-names/tryhard', label: 'Tryhard', description: 'Competitive names', icon: '🎯' },
    { href: '/valorant/sweaty', label: 'Sweaty Names', description: 'Intense competitive names', icon: '💧' },
    { href: '/general/cool', label: 'Cool Names', description: 'Cool gaming names', icon: '❄️' }
  ];

  const gamerItems = [
    { href: '/gamer-names/cool', label: 'Cool', description: 'Sleek gamertags', icon: '⚡' },
    { href: '/gamer-names/funny', label: 'Funny', description: 'Funny gamertags', icon: '😂' },
    { href: '/gamer-names/pro', label: 'Pro', description: 'Professional names', icon: '🏆' },
    { href: '/gamer-names/edgy', label: 'Edgy', description: 'Intimidating names', icon: '💀' },
    { href: '/general/best', label: 'Best Names', description: 'Top gaming names', icon: '🌟' },
    { href: '/valorant/aesthetic', label: 'Aesthetic Names', description: 'Stylish aesthetic names', icon: '✨' }
  ];

  const gameNamesItems = [
    { 
      label: 'Valorant Names',
      items: [
        { href: '/valorant/sweaty', label: 'Sweaty', description: 'Competitive Valorant names', icon: '💧' },
        { href: '/valorant/aesthetic', label: 'Aesthetic', description: 'Stylish Valorant names', icon: '✨' }
      ]
    },
    {
      label: 'Fortnite Names',
      items: [
        { href: '/fortnite/tryhard', label: 'Tryhard', description: 'Tryhard Fortnite names', icon: '🎯' },
        { href: '/fortnite/og', label: 'OG', description: 'OG Fortnite names', icon: '👑' }
      ]
    },
    {
      label: 'COD Names',
      items: [
        { href: '/cod/sweaty', label: 'Sweaty', description: 'Sweaty COD names', icon: '💧' },
        { href: '/cod/funny', label: 'Funny', description: 'Funny COD names', icon: '😂' }
      ]
    },
    {
      label: 'General Names',
      items: [
        { href: '/general/best', label: 'Best', description: 'Best gaming names', icon: '🌟' },
        { href: '/general/cool', label: 'Cool', description: 'Cool gaming names', icon: '❄️' }
      ]
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 group-hover:opacity-80 transition-opacity">
              TryhardNames
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              Home
            </Link>
            <Dropdown label="Roblox Names" items={robloxItems} />
            <Dropdown label="Gamer Names" items={gamerItems} />
            
            {/* Game Names Dropdown with Nested Structure */}
            <div className="relative group">
              <button className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                Game Names
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-popover border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {gameNamesItems.map((category, idx) => (
                    <div key={idx} className="px-2 py-1">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">
                        {category.label}
                      </div>
                      {category.items.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
                        >
                          <span className="text-lg">{item.icon}</span>
                          <div>
                            <div className="font-medium text-foreground">{item.label}</div>
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link to="/stylish-text-generator" className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              Stylish Text
            </Link>
            <Link to="/nickname-symbols" className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              Symbols
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
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
        <div className="md:hidden border-t border-border/40 bg-background transition-colors duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1 h-[calc(100vh-4rem)] overflow-y-auto">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-md text-base font-medium text-foreground hover:bg-accent transition-colors">
              Home
            </Link>
            
            <div className="py-2">
              <div className="px-3 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Roblox Names</div>
              <div className="space-y-1">
                {robloxItems.map(item => (
                  <Link key={item.href} to={item.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium text-foreground hover:bg-accent pl-6 transition-colors">
                    <span className="text-xl">{item.icon}</span> {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="py-2">
              <div className="px-3 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Gamer Names</div>
              <div className="space-y-1">
                {gamerItems.map(item => (
                  <Link key={item.href} to={item.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium text-foreground hover:bg-accent pl-6 transition-colors">
                    <span className="text-xl">{item.icon}</span> {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="py-2">
              <div className="px-3 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Game Names</div>
              <div className="space-y-2">
                {gameNamesItems.map((category, idx) => (
                  <div key={idx}>
                    <div className="px-3 text-xs font-semibold text-muted-foreground/80 mb-1 pl-6">{category.label}</div>
                    {category.items.map((item) => (
                      <Link key={item.href} to={item.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium text-foreground hover:bg-accent pl-10 transition-colors">
                        <span className="text-xl">{item.icon}</span> {item.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 space-y-1 border-t border-border/40 mt-2">
              <Link to="/stylish-text-generator" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-md text-base font-medium text-foreground hover:bg-accent transition-colors">
                Stylish Text
              </Link>
              <Link to="/nickname-symbols" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-md text-base font-medium text-foreground hover:bg-accent transition-colors">
                Symbols
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
