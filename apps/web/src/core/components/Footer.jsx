
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">TryhardNames</h3>
            <p className="text-sm text-gray-400">Level up your gaming identity with the best name generators on the web.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Roblox Names</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/roblox-names" className="hover:text-white transition-colors">All Roblox Names</Link></li>
              <li><Link to="/roblox-names/cool" className="hover:text-white transition-colors">Cool Roblox Names</Link></li>
              <li><Link to="/roblox-names/funny" className="hover:text-white transition-colors">Funny Roblox Names</Link></li>
              <li><Link to="/roblox-names/aesthetic" className="hover:text-white transition-colors">Aesthetic Roblox Names</Link></li>
              <li><Link to="/roblox-names/tryhard" className="hover:text-white transition-colors">Tryhard Roblox Names</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Gamer Names</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/gamer-names" className="hover:text-white transition-colors">All Gamer Names</Link></li>
              <li><Link to="/gamer-names/cool" className="hover:text-white transition-colors">Cool Gamer Names</Link></li>
              <li><Link to="/gamer-names/funny" className="hover:text-white transition-colors">Funny Gamer Names</Link></li>
              <li><Link to="/gamer-names/pro" className="hover:text-white transition-colors">Pro Gamer Names</Link></li>
              <li><Link to="/gamer-names/edgy" className="hover:text-white transition-colors">Edgy Gamer Names</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Popular Name Guides</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/valorant/sweaty" className="hover:text-white transition-colors">Sweaty Valorant Names</Link></li>
              <li><Link to="/fortnite/tryhard" className="hover:text-white transition-colors">Tryhard Fortnite Names</Link></li>
              <li><Link to="/cod/sweaty" className="hover:text-white transition-colors">Sweaty COD Names</Link></li>
              <li><Link to="/general/best" className="hover:text-white transition-colors">Best Gaming Names</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; 2025 TryhardNames. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/roblox-names" className="hover:text-white transition-colors">Roblox Names</Link>
            <Link to="/gamer-names" className="hover:text-white transition-colors">Gamer Names</Link>
            <Link to="/stylish-text-generator" className="hover:text-white transition-colors">Stylish Text</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
