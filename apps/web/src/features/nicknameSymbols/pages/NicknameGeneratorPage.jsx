import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '@/seo/SeoHead.jsx';
import { Check, AlertCircle, History, Trash2, ArrowRight } from 'lucide-react';
import AdPlaceholderZone from '@/components/AdPlaceholderZone.jsx';
import { useTheme } from '@/core/context/ThemeContext.jsx';
import { SymbolExplorer } from '../components/SymbolExplorer.jsx';
import { CuratedSymbolRails } from '../components/CuratedSymbolRails.jsx';
import { PreviewTagStrip } from '../components/PreviewTagStrip.jsx';
import { useNicknameSymbols } from '../hooks/useNicknameSymbols.js';
import { copyTextToClipboard } from '@/utils/clipboard.js';

const NicknameGeneratorPage = () => {
  const { isDarkMode } = useTheme();
  const {
    previewTag,
    setPreviewTag,
    activeCategory,
    setActiveCategory,
    glyphs,
    combos,
    savedNicknames,
    deleteNickname,
    recordCopy
  } = useNicknameSymbols();

  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 2600);
  }, []);

  const handleCopy = useCallback(
    async (text, id) => {
      const res = await copyTextToClipboard(text, { preventRepeatMs: 450, vibrateMs: 12 });
      if (!res.ok) {
        showToast('Copy failed', 'error');
        return;
      }
      setCopiedId(id);
      await recordCopy(text);
      showToast('Copied to clipboard!');
      setTimeout(() => setCopiedId(null), 1200);
    },
    [recordCopy, showToast]
  );

  const bgMain = isDarkMode ? 'bg-dark-950' : 'bg-slate-50';
  const textMain = isDarkMode ? 'text-dark-50' : 'text-slate-900';
  const borderCard = isDarkMode ? 'border-dark-700' : 'border-slate-200';
  const textMuted = isDarkMode ? 'text-dark-400' : 'text-slate-500';
  const bgCard = isDarkMode ? 'bg-dark-900' : 'bg-white';

  return (
    <>
      <SeoHead
        title="Nickname Symbols Generator – Cool Characters for Gaming Names | TryhardNames"
        description="Decorate nicknames with aesthetic symbols and Unicode extras—built for short gaming handles. Copy-ready characters for mobile shooters, Roblox and Discord."
        path="/nickname-symbols"
      />

      <div className={`${bgMain} ${textMain} flex-grow flex flex-col min-h-screen transition-colors duration-300`}>
        <section className={`relative pt-10 pb-6 px-4 border-b ${borderCard}`}>
          <div className="container mx-auto max-w-5xl text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              Nickname Symbols Library
            </h1>
            <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${textMuted}`}>
              Explore hundreds of copy-ready Unicode marks and framed layouts. Tap anything — no generate step.
            </p>
            <div className="flex justify-center pt-2">
              <Link
                to={`/identity-kit${previewTag.trim() ? `?primary=${encodeURIComponent(previewTag.trim())}` : ''}`}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${borderCard} bg-white/90 dark:bg-dark-900/90 hover:border-accent-cyan/45 hover:text-accent-cyan`}
              >
                Build an Identity Kit <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        <AdPlaceholderZone position="top" />

        <section className="container mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <div className="max-w-5xl mx-auto space-y-10">
            <PreviewTagStrip
              previewTag={previewTag}
              onPreviewChange={setPreviewTag}
              isDarkMode={isDarkMode}
            />

            <CuratedSymbolRails
              combos={combos}
              onCopy={handleCopy}
              copiedId={copiedId}
              isDarkMode={isDarkMode}
            />

            <SymbolExplorer
              glyphs={glyphs}
              combos={combos}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              copiedId={copiedId}
              onCopy={handleCopy}
              isDarkMode={isDarkMode}
            />

            {savedNicknames.length > 0 && (
              <div className={`${bgCard} border ${borderCard} rounded-xl p-4`}>
                <h3 className={`text-sm font-semibold uppercase tracking-wide mb-3 flex items-center gap-2 ${textMuted}`}>
                  <History className="w-4 h-4 text-accent-pink shrink-0" aria-hidden />
                  Recent copies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {savedNicknames.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-1 pl-2 pr-1 py-1 rounded-lg border min-h-[40px] ${
                        isDarkMode ? 'bg-dark-800 border-dark-700' : 'bg-slate-100 border-slate-200'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleCopy(item.nickname, `hist-${item.id}`)}
                        className="text-sm truncate max-w-[min(280px,70vw)] text-left hover:text-accent-purple"
                        title={item.nickname}
                      >
                        {item.nickname}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteNickname(item.id)}
                        className="p-2 rounded-md text-slate-400 hover:text-red-500 shrink-0"
                        aria-label="Remove from history"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <AdPlaceholderZone position="bottom" />

        <div
          aria-live="polite"
          aria-atomic="true"
          className={`fixed bottom-4 right-4 z-50 transition-all duration-300 transform ${
            toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
          }`}
        >
          <div
            className={`px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 font-medium ${
              toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-600 text-white'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
            {toast.message}
          </div>
        </div>
      </div>
    </>
  );
};

export default NicknameGeneratorPage;
