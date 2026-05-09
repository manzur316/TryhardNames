import React, { useState } from 'react';
import { Copy, Check, MessageSquare, Twitch, Instagram, Youtube, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { copyTextToClipboard } from '@/utils/clipboard.js';

const BioPreview = ({ bio }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!bio) return;

    const res = await copyTextToClipboard(bio, { preventRepeatMs: 450, vibrateMs: 12 });
    if (!res.ok) {
      toast({ title: "Copy failed", description: "Clipboard blocked by your browser.", variant: "destructive" });
      return;
    }

    setCopied(true);
    toast({
      title: "Bio Copied!",
      description: "Ready to paste into your profile.",
      className: "bg-card border-primary text-foreground"
    });

    setTimeout(() => {
      setCopied(false);
    }, 1200);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-lg hover:shadow-2xl hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between gap-4 group h-full">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex gap-2 text-foreground/40 group-hover:text-primary/60 transition-colors">
            <MessageSquare className="w-4 h-4" />
            <Twitch className="w-4 h-4" />
            <Instagram className="w-4 h-4" />
            <Youtube className="w-4 h-4" />
            <Gamepad2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono text-foreground/50 bg-background px-2 py-1 rounded-md">
            {bio.length} chars
          </span>
        </div>
        
        <div className="bg-background/50 p-4 rounded-lg border border-border/50 min-h-[100px] flex items-center">
          <p className="text-sm md:text-base text-foreground whitespace-pre-wrap font-medium leading-relaxed group-hover:glow-neon transition-all duration-300">
            {bio}
          </p>
        </div>
      </div>
      
      <Button
        onClick={handleCopy}
        variant="secondary"
        className={`w-full transition-all duration-300 ${
          copied 
            ? 'bg-primary text-black hover:bg-primary/90' 
            : 'bg-secondary/20 text-secondary hover:bg-secondary hover:text-white'
        }`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2 animate-in zoom-in duration-200" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Copy Bio
          </>
        )}
      </Button>
    </div>
  );
};

export default BioPreview;