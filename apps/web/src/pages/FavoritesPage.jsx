import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Download, Upload, Trash2, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useFavorites, useClearFavorites, useExportFavorites, useImportFavorites } from '@/hooks/useFavorites.js';
import FavoritesGrid from '@/components/FavoritesGrid.jsx';
import FavoritesStats from '@/components/FavoritesStats.jsx';
import FavoritesFilters from '@/components/FavoritesFilters.jsx';
import { useToast } from '@/hooks/use-toast.js';

const FavoritesPage = () => {
  const favorites = useFavorites();
  const clearFavorites = useClearFavorites();
  const exportFavorites = useExportFavorites();
  const importFavorites = useImportFavorites();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const categories = useMemo(() => {
    const cats = new Set(favorites.map(f => f.category));
    return Array.from(cats).sort();
  }, [favorites]);

  const filteredAndSortedFavorites = useMemo(() => {
    let result = [...favorites];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(f => f.name.toLowerCase().includes(q));
    }

    if (categoryFilter !== 'All') {
      result = result.filter(f => f.category === categoryFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.addedDate) - new Date(b.addedDate);
        case 'nameAsc':
          return a.name.localeCompare(b.name);
        case 'nameDesc':
          return b.name.localeCompare(a.name);
        case 'newest':
        default:
          return new Date(b.addedDate) - new Date(a.addedDate);
      }
    });

    return result;
  }, [favorites, searchQuery, categoryFilter, sortBy]);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all your favorites? This cannot be undone.')) {
      clearFavorites();
      toast({ title: "Cleared", description: "All favorites have been removed." });
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const result = await importFavorites(event.target.result);
          if (result.success) {
            toast({ title: "Imported", description: `Successfully imported ${result.count} favorites.`, className: "bg-card border-green-500 text-foreground" });
          } else {
            toast({ title: "Error", description: "Failed to import favorites. Invalid file format.", variant: "destructive" });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleShareAll = () => {
    const names = favorites.map(f => f.name).join('\n');
    navigator.clipboard.writeText(names);
    toast({ title: "Copied All", description: "All favorite names copied to clipboard!", className: "bg-card border-primary text-foreground" });
  };

  return (
    <>
      <Helmet>
        <title>My Favorite Names | TryhardNames</title>
        <meta name="description" content="View and manage your collection of favorite tryhard, aesthetic, and gaming names." />
      </Helmet>

      <div className="bg-background text-foreground flex-grow flex flex-col">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl flex-grow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-black flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                My Favorites
              </h1>
              <p className="text-foreground/60 mt-2">Your personal collection of top-tier gaming names.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleShareAll} className="border-border/50 hover:border-primary hover:text-primary">
                <Share2 className="w-4 h-4 mr-2" /> Copy All
              </Button>
              <Button variant="outline" onClick={exportFavorites} className="border-border/50 hover:border-primary hover:text-primary">
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
              <Button variant="outline" onClick={handleImport} className="border-border/50 hover:border-primary hover:text-primary">
                <Upload className="w-4 h-4 mr-2" /> Import
              </Button>
              {favorites.length > 0 && (
                <Button variant="outline" onClick={handleClearAll} className="border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white">
                  <Trash2 className="w-4 h-4 mr-2" /> Clear All
                </Button>
              )}
            </div>
          </div>

          <FavoritesStats favorites={favorites} />

          <FavoritesFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categories={categories}
            resultCount={filteredAndSortedFavorites.length}
          />

          <FavoritesGrid favorites={filteredAndSortedFavorites} />

        </div>
      </div>
    </>
  );
};

export default FavoritesPage;