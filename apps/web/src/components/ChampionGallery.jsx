import React, { useState, useMemo } from 'react';
import leagueOfLegendsChampions from '@/data/leagueOfLegendsChampions.js';
import ChampionFilters from './ChampionFilters.jsx';
import ChampionModal from './ChampionModal.jsx';
import { Swords, MapPin } from 'lucide-react';

const ChampionGallery = ({ onGenerateName }) => {
  const [filters, setFilters] = useState({
    role: 'All',
    region: 'All',
    difficulty: 'All',
    type: 'All',
    search: '',
    sort: 'Name'
  });
  const [selectedChampion, setSelectedChampion] = useState(null);

  const filteredChampions = useMemo(() => {
    let result = leagueOfLegendsChampions.filter(champ => {
      const matchRole = filters.role === 'All' || champ.role === filters.role || champ.secondaryRole === filters.role;
      const matchRegion = filters.region === 'All' || champ.region === filters.region;
      const matchDiff = filters.difficulty === 'All' || champ.difficulty === filters.difficulty;
      const matchType = filters.type === 'All' || champ.tags.includes(filters.type);
      const matchSearch = filters.search === '' || 
        champ.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        champ.title.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchRole && matchRegion && matchDiff && matchType && matchSearch;
    });

    // Sorting
    result.sort((a, b) => {
      if (filters.sort === 'Name') return a.name.localeCompare(b.name);
      if (filters.sort === 'Win Rate') return parseFloat(b.winRate) - parseFloat(a.winRate);
      if (filters.sort === 'Pick Rate') return parseFloat(b.pickRate) - parseFloat(a.pickRate);
      if (filters.sort === 'Release Year') return b.releaseYear - a.releaseYear;
      return 0;
    });

    return result;
  }, [filters]);

  const handleChampionClick = (champ) => {
    setSelectedChampion(champ);
  };

  return (
    <div className="space-y-6">
      <ChampionFilters filters={filters} setFilters={setFilters} totalCount={filteredChampions.length} />

      {filteredChampions.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border/50 rounded-xl">
          <h3 className="text-2xl font-bold text-foreground/60">No champions found</h3>
          <p className="text-foreground/40 mt-2">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredChampions.map(champ => (
            <div 
              key={champ.id}
              onClick={() => handleChampionClick(champ)}
              className="group relative bg-card border border-border/50 rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl flex flex-col"
            >
              <div className="aspect-square overflow-hidden relative">
                <img 
                  src={champ.image} 
                  alt={champ.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-0"
                  onError={(e) => { e.target.src = 'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Teemo.png'; }}
                />
                <img 
                  src={champ.splashArt} 
                  alt={`${champ.name} Splash`} 
                  className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-105"
                  onError={(e) => { e.target.src = 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Teemo_0.jpg'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-white text-sm font-medium line-clamp-2 mb-2">{champ.title}</span>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-green-400">WR: {champ.winRate}%</span>
                    <span className="text-blue-400">PR: {champ.pickRate}%</span>
                  </div>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors">{champ.name}</h3>
                  <div className="flex items-center gap-3 mt-2 text-xs font-medium text-foreground/70">
                    <span className="flex items-center gap-1"><Swords className="w-3 h-3" /> {champ.role}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {champ.region}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                    champ.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
                    champ.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {champ.difficulty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ChampionModal 
        champion={selectedChampion} 
        isOpen={!!selectedChampion} 
        onClose={() => setSelectedChampion(null)} 
        onGenerateName={onGenerateName}
      />
    </div>
  );
};

export default ChampionGallery;