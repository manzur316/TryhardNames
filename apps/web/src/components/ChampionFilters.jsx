import React from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';

const ChampionFilters = ({ filters, setFilters, totalCount }) => {
  const roles = ["All", "Top", "Jungle", "Mid", "ADC", "Support"];
  const regions = ["All", "Noxus", "Demacia", "Ionia", "Piltover", "Zaun", "Bilgewater", "Freljord", "Shurima", "Targon", "Ixtal", "Vastaya", "Shadow Isles", "Void"];
  const difficulties = ["All", "Easy", "Medium", "Hard"];
  const types = ["All", "Assassin", "Mage", "Marksman", "Support", "Tank", "Fighter"];
  const sorts = ["Name", "Win Rate", "Pick Rate", "Release Year"];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const resetFilters = () => {
    setFilters({ role: 'All', region: 'All', difficulty: 'All', type: 'All', search: '', sort: 'Name' });
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 mb-6 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg">Filters</h3>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-foreground/40" />
          </div>
          <Input
            type="text"
            placeholder="Search champions..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-10 bg-background border-border/50 focus-visible:ring-primary"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
            {totalCount} Champions
          </span>
          <Button variant="outline" size="sm" onClick={resetFilters} className="h-9">
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Role</label>
          <select 
            value={filters.role} 
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-sm focus:border-primary outline-none transition-colors"
          >
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Region</label>
          <select 
            value={filters.region} 
            onChange={(e) => handleFilterChange('region', e.target.value)}
            className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-sm focus:border-primary outline-none transition-colors"
          >
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Difficulty</label>
          <select 
            value={filters.difficulty} 
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-sm focus:border-primary outline-none transition-colors"
          >
            {difficulties.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Type</label>
          <select 
            value={filters.type} 
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-sm focus:border-primary outline-none transition-colors"
          >
            {types.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Sort By</label>
          <select 
            value={filters.sort} 
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-sm focus:border-primary outline-none transition-colors"
          >
            {sorts.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ChampionFilters;