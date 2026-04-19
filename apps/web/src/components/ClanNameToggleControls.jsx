import React from 'react';
import { Switch } from '@/components/ui/switch.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Hash, AtSign, Tag } from 'lucide-react';

const ClanNameToggleControls = ({ 
  addNumbers, setAddNumbers, 
  addSymbols, setAddSymbols, 
  shortTagMode, setShortTagMode 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-background/50 border border-border/50 rounded-xl mb-6">
      <div className="flex items-center justify-between space-x-2 bg-card p-3 rounded-lg border border-border/30 hover:border-primary/30 transition-colors">
        <Label htmlFor="toggle-numbers" className="flex items-center gap-2 cursor-pointer text-foreground/80">
          <Hash className="w-4 h-4 text-primary" />
          Add Numbers
        </Label>
        <Switch 
          id="toggle-numbers" 
          checked={addNumbers} 
          onCheckedChange={setAddNumbers} 
          disabled={shortTagMode}
        />
      </div>
      
      <div className="flex items-center justify-between space-x-2 bg-card p-3 rounded-lg border border-border/30 hover:border-primary/30 transition-colors">
        <Label htmlFor="toggle-symbols" className="flex items-center gap-2 cursor-pointer text-foreground/80">
          <AtSign className="w-4 h-4 text-secondary" />
          Add Symbols
        </Label>
        <Switch 
          id="toggle-symbols" 
          checked={addSymbols} 
          onCheckedChange={setAddSymbols} 
          disabled={shortTagMode}
        />
      </div>

      <div className="flex items-center justify-between space-x-2 bg-card p-3 rounded-lg border border-border/30 hover:border-primary/30 transition-colors">
        <Label htmlFor="toggle-tags" className="flex items-center gap-2 cursor-pointer text-foreground/80">
          <Tag className="w-4 h-4 text-accent" />
          Short Tag Mode
        </Label>
        <Switch 
          id="toggle-tags" 
          checked={shortTagMode} 
          onCheckedChange={(val) => {
            setShortTagMode(val);
            if (val) {
              setAddNumbers(false);
              setAddSymbols(false);
            }
          }} 
        />
      </div>
    </div>
  );
};

export default ClanNameToggleControls;