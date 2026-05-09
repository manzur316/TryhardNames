import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { copyTextToClipboard } from '@/utils/clipboard.js';

const StylePreview = ({ styleName, text }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!text) return;

    const res = await copyTextToClipboard(text, { preventRepeatMs: 450, vibrateMs: 12 });
    if (!res.ok) {
      toast({ title: "Copy failed", description: "Clipboard blocked by your browser.", variant: "destructive" });
      return;
    }

    setCopied(true);
    toast({
      title: "Copied!",
      description: `Copied to clipboard`,
      className: "bg-card border-primary text-foreground"
    });

      setTimeout(() => {
        setCopied(false);
      }, 1200);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-lg hover:shadow-2xl hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between gap-4 group">
      <div>
        <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2 group-hover:text-primary transition-colors">
          {styleName}
        </p>
        <p 
          className="text-lg md:text-xl text-foreground break-all"
          style={{ textShadow: '0 0 10px rgba(0, 255, 0, 0.3)' }}
        >
          {text || 'Preview'}
        </p>
      </div>
      
      <Button
        onClick={handleCopy}
        variant="secondary"
        className={`w-full transition-all duration-300 ${
          copied 
            ? 'bg-primary text-black hover:bg-primary/90' 
            : 'bg-secondary/20 text-secondary hover:bg-secondary hover:text-white'
        }`}
        disabled={!text}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2 animate-in zoom-in duration-200" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </>
        )}
      </Button>
    </div>
  );
};

export default StylePreview;