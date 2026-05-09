
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Zap, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet.jsx';
import { Button } from '@/components/ui/button.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.jsx';
import { getPagesByCluster } from '@/utils/pageLoader.js';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const mainGameLinks = [
    { name: 'Fortnite Names', path: '/fortnite/tryhard' },
    { name: 'Valorant Names', path: '/valorant/sweaty' },
    { name: 'Roblox Names', path: '/roblox-tryhard-names' },
    { name: 'COD Names', path: '/cod/sweaty' },
    { name: 'League of Legends', path: '/league-of-legends' },
  ];

  // Load dynamic pages for the dropdown
  const dynamicGameLinks = [
    ...getPagesByCluster('valorant'),
    ...getPagesByCluster('fortnite'),
    ...getPagesByCluster('cod')
  ].map(page => ({
    name: page.title.split(' - ')[0],
    path: `/${page.slug}`
  }));

  const allGameLinks = [...mainGameLinks, ...dynamicGameLinks];

  const toolLinks = [
    { name: 'Stylish Text', path: '/stylish-text-generator' },
    { name: 'Clan Names', path: '/clan-name-generator' },
    { name: 'Gamer Bio', path: '/gamer-bio-generator' }
  ];

  const companyLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms of Service', path: '/terms-of-service' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-dark-900/95 backdrop-blur supports-[backdrop-filter]:bg-dark-900/80 border-b border-dark-700">
      <div className="container mx-auto px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={handleLinkClick} className="flex items-center gap-2 group">
            <div className="relative">
              <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-accent-cyan group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-dark-50 tracking-wide">
              Tryhard<span className="text-accent-cyan">Names</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-6 lg:gap-8">
            <Link 
              to="/" 
              className={`text-sm lg:text-base font-medium transition-colors duration-300 ${isActive('/') ? 'text-accent-cyan drop-shadow-sm' : 'text-dark-300 hover:text-accent-cyan'}`}
            >
              Home
            </Link>
            
            {/* CSS Group Hover Dropdown for Games */}
            <div className="relative group py-4">
              <button className="flex items-center gap-1 text-sm lg:text-base font-medium text-dark-300 hover:text-accent-cyan transition-colors duration-300 outline-none">
                Games <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 w-56 bg-dark-800 border border-dark-700 shadow-xl rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="py-2">
                  {allGameLinks.map((link) => (
                    <Link 
                      key={link.path}
                      to={link.path} 
                      className={`block px-4 py-2 text-sm ${isActive(link.path) ? 'text-accent-cyan font-semibold bg-dark-700' : 'text-dark-300 hover:text-accent-cyan hover:bg-dark-700'}`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {toolLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm lg:text-base font-medium transition-colors duration-300 relative group ${isActive(link.path) ? 'text-accent-cyan drop-shadow-sm' : 'text-dark-300 hover:text-accent-cyan'}`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-accent-cyan transition-all duration-300 ${isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm lg:text-base font-medium text-dark-300 hover:text-accent-cyan transition-colors duration-300 outline-none">
                More <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-dark-800 border-dark-700 shadow-xl">
                {companyLinks.map((link) => (
                  <DropdownMenuItem key={link.path} asChild className="hover:bg-dark-700 focus:bg-dark-700 cursor-pointer">
                    <Link 
                      to={link.path} 
                      className={`w-full ${isActive(link.path) ? 'text-accent-cyan font-semibold' : 'text-dark-300 hover:text-accent-cyan'}`}
                    >
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="sm:hidden active:scale-90 transition-transform">
              <Button variant="ghost" size="icon" className="text-dark-300 hover:text-accent-cyan">
                <Menu className="w-6 h-6 text-2xl" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-dark-900 border-dark-700 w-[300px] overflow-y-auto custom-scrollbar">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-accent-cyan" />
                  <span className="text-dark-50 tracking-wide">
                    Tryhard<span className="text-accent-cyan">Names</span>
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-6 mt-8">
                <Link 
                  to="/" 
                  onClick={handleLinkClick} 
                  className={`text-base font-medium py-2 px-4 rounded-lg transition-colors ${isActive('/') ? 'text-accent-cyan bg-accent-cyan/10' : 'text-dark-300 hover:text-accent-cyan hover:bg-dark-800'}`}
                >
                  Home
                </Link>
                
                <div className="px-4">
                  <span className="text-xs font-bold text-dark-500 uppercase tracking-wider mb-3 block">Games</span>
                  <div className="flex flex-col gap-1 border-l border-dark-700 ml-2 pl-4 max-h-60 overflow-y-auto custom-scrollbar">
                    {allGameLinks.map((link) => (
                      <Link 
                        key={link.path} 
                        to={link.path} 
                        onClick={handleLinkClick} 
                        className={`text-base py-2 transition-colors ${isActive(link.path) ? 'text-accent-cyan font-semibold' : 'text-dark-400 hover:text-accent-cyan'}`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="px-4">
                  <span className="text-xs font-bold text-dark-500 uppercase tracking-wider mb-3 block">Tools</span>
                  <div className="flex flex-col gap-1 border-l border-dark-700 ml-2 pl-4">
                    {toolLinks.map((link) => (
                      <Link 
                        key={link.path} 
                        to={link.path} 
                        onClick={handleLinkClick} 
                        className={`text-base py-2 transition-colors ${isActive(link.path) ? 'text-accent-cyan font-semibold' : 'text-dark-400 hover:text-accent-cyan'}`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="px-4">
                  <span className="text-xs font-bold text-dark-500 uppercase tracking-wider mb-3 block">Company</span>
                  <div className="flex flex-col gap-1 border-l border-dark-700 ml-2 pl-4">
                    {companyLinks.map((link) => (
                      <Link 
                        key={link.path} 
                        to={link.path} 
                        onClick={handleLinkClick} 
                        className={`text-base py-2 transition-colors ${isActive(link.path) ? 'text-accent-cyan font-semibold' : 'text-dark-400 hover:text-accent-cyan'}`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
