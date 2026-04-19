import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const ComingSoonPage = ({ title = 'Coming Soon' }) => {
  return (
    <>
      <Helmet>
        <title>{`${title} - TryhardNames.com`}</title>
        <meta name="description" content={`${title} feature coming soon to TryhardNames.com`} />
      </Helmet>

      <div className="bg-background text-foreground flex-grow flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center space-y-8 max-w-2xl">
            <div className="relative inline-block">
              <Sparkles className="w-24 h-24 text-primary glow-neon mx-auto" />
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-foreground">
              {title}
            </h1>
            
            <p className="text-xl text-foreground/70">
              This feature is currently under development. Check back soon for awesome new content!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="bg-primary text-black hover:bg-primary/90 text-lg px-8 py-6 font-bold">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Generator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComingSoonPage;