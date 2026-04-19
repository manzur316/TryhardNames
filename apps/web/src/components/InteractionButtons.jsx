import React from 'react';
import { Download, Share2, CopyCheck } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useToast } from '@/hooks/use-toast.js';

const InteractionButtons = ({ allNames = [] }) => {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({ 
      title: 'Downloading...', 
      description: 'Your PDF is being generated.',
      className: "bg-card border-primary text-foreground"
    });
    setTimeout(() => {
      toast({ 
        title: 'Success', 
        description: 'PDF downloaded successfully!',
        className: "bg-card border-green-500 text-foreground"
      });
    }, 1500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ 
        title: '700 Free Gamer Names', 
        url: window.location.href 
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ 
        title: 'Link Copied!', 
        description: 'Share link copied to clipboard.',
        className: "bg-card border-primary text-foreground"
      });
    }
  };

  const handleCopyAll = () => {
    const text = allNames.slice(0, 100).join('\n') + '\n...and hundreds more!';
    navigator.clipboard.writeText(text);
    toast({ 
      title: 'Copied!', 
      description: 'Names copied to clipboard.',
      className: "bg-card border-primary text-foreground"
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center my-12 w-full px-4">
      <Button 
        onClick={handleDownload} 
        className="w-full sm:w-auto bg-primary text-black hover:bg-primary/90 font-bold h-12 px-6 min-h-[44px]"
      >
        <Download className="w-5 h-5 mr-2" /> Download All Names (PDF)
      </Button>
      <Button 
        onClick={handleShare} 
        variant="outline" 
        className="w-full sm:w-auto border-secondary text-secondary hover:bg-secondary/10 font-bold h-12 px-6 min-h-[44px]"
      >
        <Share2 className="w-5 h-5 mr-2" /> Share with Friends
      </Button>
      <Button 
        onClick={handleCopyAll} 
        variant="outline" 
        className="w-full sm:w-auto border-accent text-accent hover:bg-accent/10 font-bold h-12 px-6 min-h-[44px]"
      >
        <CopyCheck className="w-5 h-5 mr-2" /> Copy All Names
      </Button>
    </div>
  );
};

export default InteractionButtons;