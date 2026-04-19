import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast.js';

const feedbackMessages = [
  "That looks clean.",
  "Perfect for ranked.",
  "This one hits.",
  "Flex on them.",
  "Ready to stand out.",
  "Copy that vibe."
];

const FontStyleCard = ({ fontName, fontCategory, fontPreview }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(fontPreview);
    setCopied(true);
    
    // Save to recently copied
    try {
      const recent = JSON.parse(localStorage.getItem('recentStyles') || '[]');
      const newRecent = [{ text: fontPreview, name: fontName, id: Date.now() }, ...recent.filter(item => item.text !== fontPreview)].slice(0, 6);
      localStorage.setItem('recentStyles', JSON.stringify(newRecent));
      window.dispatchEvent(new Event('stylesCopied'));
    } catch (e) {
      console.error('Could not save to local storage', e);
    }

    const randomMsg = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
    
    toast({
      title: "Copied to clipboard!",
      description: randomMsg,
      className: "bg-card border-primary text-foreground",
      duration: 2000,
    });

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-card border border-border/40 hover:border-primary/50 rounded-xl p-5 flex flex-col justify-between group shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold px-2 py-1 rounded-md bg-background border border-border/50 text-foreground/60 uppercase tracking-wider">
          {fontCategory || fontName}
        </span>
      </div>
      
      <div className="flex items-center justify-between gap-4">
        <span className="text-xl md:text-2xl text-[#d6d6d6] group-hover:text-white transition-colors break-all line-clamp-2">
          {fontPreview}
        </span>
        
        <button
          onClick={handleCopy}
          className={`flex-shrink-0 p-3 rounded-lg transition-all duration-300 ${
            copied 
              ? 'bg-primary text-black' 
              : 'bg-background border border-border/50 text-foreground/70 group-hover:text-primary group-hover:border-primary/50'
          }`}
          aria-label="Copy style"
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>
    </motion.div>
  );
};

export default FontStyleCard;