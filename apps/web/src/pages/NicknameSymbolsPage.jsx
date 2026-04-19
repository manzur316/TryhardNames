import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Copy, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import Breadcrumb from '@/components/Breadcrumb.jsx';
import AdPlaceholderZone from '@/components/AdPlaceholderZone.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { NamesGrid, TrendingNames } from '@/core/components/index.js';

const NicknameSymbolsPage = () => {
  const { toast } = useToast();
  const [copiedSymbol, setCopiedSymbol] = useState(null);

  const trendingSymbols = ['꧁', '꧂', '⚡', '☠️', '★', '༺'];
  const exampleNames = ['꧁Shadow꧂', '⚡Pulse⚡', '☠️Reaper☠️', '★Star★', '༺King༻', '⚔️Knight⚔️', '✿Flower✿', '👑Royal👑'];

  const symbolCategories = [
    {
      name: 'Stars & Sparkles',
      symbols: ['★', '☆', '✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰', '✨', '❇', '❈', '❅', '❄', '❆', '✵', '❊']
    },
    {
      name: 'Brackets & Borders',
      symbols: ['【', '】', '༺', '༻', '꧁', '꧂', '『', '』', '「', '」', '«', '»', '‹', '›', '⟨', '⟩', '☾', '☽', '⦅', '⦆']
    },
    {
      name: 'Weapons & Combat',
      symbols: ['⚔️', '🗡️', '🔫', '🏹', '🛡️', '💣', '🧨', '🔪', '☠️', '💀', '🎯', '🩸', '🔥', '💥', '⚡', '☢️', '☣️', '☣', '⚠', '⚡']
    },
    {
      name: 'Hearts & Love',
      symbols: ['♥', '♡', '❤', '❥', '❣', '❦', '❧', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '💔', '❤️‍🔥', '❤️‍🩹', '💌', '🏩']
    },
    {
      name: 'Music & Notes',
      symbols: ['♩', '♪', '♫', '♬', '♭', '♮', '♯', '🎵', '🎶', '🎼', '🎧', '🎤', '🎸', '🎹', '🎺', '🎻', '📻', '🎷', '🪕', '🥁']
    },
    {
      name: 'Crosses & Religion',
      symbols: ['†', '☨', '✞', '✟', '☩', '✙', '✚', '✛', '✜', '✝', '☦', '♱', '☥', '♆', '☯', '☮', '☪', 'ॐ', '☸', '✡']
    }
  ];

  const handleCopy = (symbol) => {
    navigator.clipboard.writeText(symbol);
    setCopiedSymbol(symbol);
    toast({
      title: "Copied!",
      description: `Symbol ${symbol} copied to clipboard.`,
    });
    setTimeout(() => setCopiedSymbol(null), 2000);
  };

  const faqs = [
    { q: 'Will these symbols work in my game?', a: 'Most modern games support standard Unicode symbols, but some older or highly restrictive games might filter them out. It is always best to test the symbol in the game\'s chat or profile editor first.' },
    { q: 'How do I use these symbols?', a: 'Simply click on any symbol to copy it to your clipboard, then paste it into your game\'s name change field, your social media bio, or anywhere else you want to use it.' },
    { q: 'Can I combine multiple symbols?', a: 'Yes! You can copy and paste multiple symbols to create complex borders or unique designs around your username.' }
  ];

  return (
    <>
      <Helmet>
        <title>Nickname Symbols Generator – Add Special Characters & Decorations</title>
        <meta name="description" content="Decorate your gaming name with cool symbols, stars, brackets, and special characters. Copy and paste aesthetic symbols for your gamertag." />
      </Helmet>

      <div className="bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-dark-50 flex-grow flex flex-col min-h-screen transition-colors duration-300">
        <section className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <Breadcrumb items={[{ name: 'Nickname Symbols', path: '/nickname-symbols' }]} />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-dark-50 text-center">
              Nickname Symbols Generator - Add Special Characters
            </h1>
            <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed text-center max-w-3xl mx-auto">
              Elevate your gaming identity with unique symbols and special characters. Our nickname symbols generator provides a vast collection of aesthetic decorations to make your name truly one-of-a-kind. Stand out in any lobby with perfectly crafted visual flair.
            </p>

            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50">
              What are nickname symbols?
            </h2>
            <p className="text-slate-700 dark:text-dark-300 mb-4 leading-relaxed">
              Nickname symbols are special Unicode characters that can be added to usernames to create visual interest. They include stars, brackets, crosses, and other decorative elements that aren't found on a standard keyboard.
            </p>
            <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
              By strategically placing these symbols around your base name, you can create a framed, symmetrical, or highly stylized look that draws attention on leaderboards and in chat windows.
            </p>

            <TrendingNames title="Trending Symbols" names={trendingSymbols} startIndex={0} maxItems={6} />

            <NamesGrid title="Popular Symbol Examples" names={exampleNames} />

            <div className="space-y-8 mb-12">
              {symbolCategories.map((category, idx) => (
                <div key={idx} className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-dark-50">
                    <Sparkles className="w-5 h-5 text-green-500" />
                    {category.name}
                  </h2>
                  <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                    {category.symbols.map((symbol, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleCopy(symbol)}
                        className="aspect-square flex items-center justify-center text-2xl bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-xl hover:border-green-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all active:scale-95 relative group min-h-[44px] min-w-[44px]"
                        title={`Copy ${symbol}`}
                      >
                        {copiedSymbol === symbol ? (
                          <Check className="w-6 h-6 text-green-500" />
                        ) : (
                          symbol
                        )}
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          Copy
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4 mb-12">
              {faqs.map((faq, i) => (
                <div key={i} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h3 className="font-bold text-slate-900 dark:text-dark-50 mb-2">{faq.q}</h3>
                  <p className="text-slate-700 dark:text-dark-300 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
            
            <div className="pt-8 border-t border-slate-200 dark:border-dark-800">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50">Explore More Tools</h2>
              <div className="flex flex-wrap gap-4">
                <Link to="/roblox-names" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors min-h-[44px] flex items-center">Roblox Names</Link>
                <Link to="/gamer-names" className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors min-h-[44px] flex items-center">Gamer Names</Link>
              </div>
            </div>

          </div>
        </section>

        <AdPlaceholderZone position="bottom" />
      </div>
    </>
  );
};

export default NicknameSymbolsPage;