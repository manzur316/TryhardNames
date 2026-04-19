import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input.jsx';

const FavoritesFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  categoryFilter, 
  setCategoryFilter, 
  sortBy, 
  setSortBy,
  categories,
  resultCount
}) => {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
          <Input
            type="text"
            placeholder="Search favorites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border/50 text-foreground"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-background border border-border/50 rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary min-w-[120px]"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-background border border-border/50 rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary min-w-[120px]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="nameAsc">Name (A-Z)</option>
            <option value="nameDesc">Name (Z-A)</option>
          </select>

          {(searchQuery || categoryFilter !== 'All' || sortBy !== 'newest') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('All');
                setSortBy('newest');
              }}
              className="flex items-center gap-1 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-md transition-colors whitespace-nowrap"
            >
              <X className="w-4 h-4" /> Reset
            </button>
          )}
        </div>
      </div>
      
      <div className="text-xs text-foreground/50 flex items-center gap-1">
        <Filter className="w-3 h-3" /> Showing {resultCount} names
      </div>
    </div>
  );
};

export default FavoritesFilters;