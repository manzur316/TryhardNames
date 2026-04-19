import React from 'react';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast.js';

const NameCard = ({ name, color }) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(name);
    toast({ 
      title: 'Copied!', 
      description: `${name} copied to clipboard.`, 
      className: "bg-card border-primary text-foreground" 
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="group relative flex items-center justify-between p-4 bg-card border border-border/50 rounded-xl hover:scale-[1.02] hover:shadow-md transition-all duration-300 w-full text-left min-h-[44px]"
      style={{ '--hover-color': color }}
    >
      <span className="font-bold text-base md:text-lg text-foreground group-hover:text-[var(--hover-color)] transition-colors truncate pr-2">
        {name}
      </span>
      <Copy className="w-4 h-4 text-foreground/40 group-hover:text-[var(--hover-color)] transition-colors shrink-0" />
    </button>
  );
};

export default NameCard;