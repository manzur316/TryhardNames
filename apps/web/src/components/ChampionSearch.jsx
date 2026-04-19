import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input.jsx';

const ChampionSearch = ({ filters, setFilters }) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-foreground/40" />
      </div>
      <Input
        type="text"
        placeholder="Search champions by name, role, or region..."
        value={filters.search}
        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
        className="pl-10 py-6 bg-card border-border/50 text-lg rounded-xl focus-visible:ring-primary"
      />
    </div>
  );
};

export default ChampionSearch;