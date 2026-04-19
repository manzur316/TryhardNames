import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { motion } from 'framer-motion';

const CopyButton = ({ textToCopy, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!textToCopy) {
      toast({
        title: "Nothing to copy",
        description: "Generate a name first!",
        variant: "destructive"
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div 
      whileTap={{ scale: 0.95 }} 
      animate={copied ? { scale: [0.95, 1.02, 1] } : {}}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Button
        onClick={handleCopy}
        className={`w-full relative overflow-hidden transition-all duration-300 ${
          copied 
            ? 'bg-primary/20 text-primary hover:bg-primary/30 border border-primary' 
            : 'bg-secondary text-white hover:bg-secondary/90'
        }`}
        disabled={!textToCopy}
      >
        {copied ? (
          <span className="flex items-center font-bold drop-shadow-[0_0_8px_rgba(0,255,136,0.8)]">
            <Check className="w-5 h-5 mr-2 animate-in zoom-in duration-200" />
            Copied. Destroy them.
          </span>
        ) : (
          <span className="flex items-center">
            <Copy className="w-5 h-5 mr-2" />
            Copy Name
          </span>
        )}
      </Button>
    </motion.div>
  );
};

export default CopyButton;