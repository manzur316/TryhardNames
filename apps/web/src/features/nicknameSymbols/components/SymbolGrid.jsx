import React from 'react';

export const SymbolGrid = ({ symbolSets = [] }) => {
  // Defensive check 1 & 2: Validate array and return empty/loading state
  if (!symbolSets || !Array.isArray(symbolSets)) {
    return (
      <div className="p-8 text-center text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
        Loading symbol sets...
      </div>
    );
  }

  if (symbolSets.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
        No symbol sets found matching your criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {symbolSets.map((set, i) => (
        <div key={set?.id || i} className="p-5 border border-border/50 rounded-xl bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200">
          {/* Defensive check 4: Default values for name and description */}
          <h3 className="font-semibold text-lg mb-1 text-foreground">
            {set?.name || 'Unnamed Set'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {set?.description || 'No description available for this symbol set.'}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {/* Defensive check 3: Handle missing symbols gracefully */}
            {set?.symbols && Array.isArray(set.symbols) && set.symbols.length > 0 ? (
              set.symbols.map((sym, j) => (
                <button 
                  key={j} 
                  onClick={() => navigator.clipboard.writeText(sym)}
                  className="px-3 py-1.5 bg-muted hover:bg-primary hover:text-primary-foreground rounded-md text-sm font-medium transition-colors cursor-pointer"
                  title="Click to copy"
                >
                  {sym}
                </button>
              ))
            ) : (
              <span className="text-sm text-muted-foreground italic py-1">
                No symbols available in this set.
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};