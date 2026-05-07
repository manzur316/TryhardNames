import React, { useState, useContext } from 'react';
import SeoHead from '@/seo/SeoHead.jsx';
import { Check, AlertCircle, Sparkles, History, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import Breadcrumb from '@/components/Breadcrumb.jsx';
import AdPlaceholderZone from '@/components/AdPlaceholderZone.jsx';
import { ThemeContext } from '@/core/context/ThemeContext.jsx';
import { SymbolInput } from '../components/SymbolInput.jsx';
import { SymbolGrid } from '../components/SymbolGrid.jsx';
import { useNicknameSymbols } from '../hooks/useNicknameSymbols.js';

const NicknameGeneratorPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { 
    inputNickname, 
    setInputNickname, 
    selectedSymbolSet, 
    setSelectedSymbolSet, 
    savedNicknames, 
    symbolSets,
    isLoadingSymbols,
    symbolsError,
    saveNickname, 
    deleteNickname,
    generateSymbols
  } = useNicknameSymbols();
  
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3000);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    saveNickname(text, selectedSymbolSet);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerate = () => {
    if (inputNickname && symbolSets.length > 0) {
      generateSymbols(inputNickname, selectedSymbolSet);
      saveNickname(inputNickname, selectedSymbolSet);
      showToast('Nickname generated and saved!');
    }
  };

  // Theme Classes
  const bgMain = isDarkMode ? 'bg-dark-950' : 'bg-gray-50';
  const textMain = isDarkMode ? 'text-dark-50' : 'text-gray-900';
  const bgCard = isDarkMode ? 'bg-dark-900' : 'bg-white';
  const borderCard = isDarkMode ? 'border-dark-700' : 'border-gray-200';
  const textMuted = isDarkMode ? 'text-dark-400' : 'text-gray-500';
  const bgInput = isDarkMode ? 'bg-dark-800' : 'bg-gray-100';

  return (
    <>
      <SeoHead
        title="Nickname Symbols Generator – Cool Characters for Gaming Names | TryhardNames"
        description="Decorate nicknames with aesthetic symbols and Unicode extras—built for short gaming handles. Copy-ready characters for mobile shooters, Roblox and Discord."
        path="/nickname-symbols"
      />

      <div className={`${bgMain} ${textMain} flex-grow flex flex-col min-h-screen transition-colors duration-300`}>
        
        {/* Header / Hero */}
        <section className={`relative pt-12 pb-8 px-4 overflow-hidden flex flex-col items-center justify-center border-b ${borderCard}`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-purple/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
          
          <div className="container mx-auto max-w-5xl relative z-10 text-center space-y-6">
            <div className="flex justify-center mb-2">
              <Breadcrumb items={[{ name: 'Nickname Symbols', path: '/nickname-symbols' }]} />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
              Nickname Symbols <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-pink">Generator</span>
            </h1>
            <p className={`text-base sm:text-lg md:text-xl ${textMuted} max-w-2xl mx-auto font-medium`}>
              Decorate your gaming name with cool symbols, special characters, and aesthetic text.
            </p>
          </div>
        </section>

        <AdPlaceholderZone position="top" />

        {/* Main Generator Area */}
        <section className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Input Section */}
            <div className={`${bgCard} border ${borderCard} rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow relative`}>
              <SymbolInput 
                value={inputNickname} 
                onChange={setInputNickname} 
                onClear={() => setInputNickname('')} 
                isDarkMode={isDarkMode}
              />
              
              <div className="mt-4 flex gap-2">
                <Button 
                  onClick={handleGenerate}
                  disabled={isLoadingSymbols || symbolSets.length === 0 || !inputNickname}
                  className="bg-accent-purple text-white hover:bg-accent-purple/90 font-semibold"
                >
                  <Sparkles className="w-4 h-4 mr-2" /> Generate
                </Button>
              </div>
            </div>

            {/* History */}
            {savedNicknames.length > 0 && (
              <div className={`${bgCard} border ${borderCard} rounded-xl p-4`}>
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${textMuted}`}>
                  <History className="w-4 h-4 text-accent-pink" /> Recent Nicknames
                </h3>
                <div className="flex flex-wrap gap-2">
                  {savedNicknames.map((item) => (
                    <div key={item.id} className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg ${bgInput} hover:bg-accent-pink/10 transition-colors`}>
                      <button 
                        onClick={() => {
                          setInputNickname(item.nickname);
                          handleCopy(item.nickname, item.id);
                        }}
                        className="hover:text-accent-pink truncate max-w-[150px]"
                        title={item.nickname}
                      >
                        {item.nickname}
                      </button>
                      <button onClick={() => deleteNickname(item.id)} className="text-red-400 hover:text-red-600 ml-1">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results Grid */}
            {isLoadingSymbols ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-accent-purple" />
                <p className={textMuted}>Loading symbols from server...</p>
              </div>
            ) : symbolsError ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4 text-red-500">
                <AlertCircle className="w-10 h-10" />
                <p>Failed to load symbols: {symbolsError.message}</p>
              </div>
            ) : symbolSets.length > 0 ? (
              <SymbolGrid 
                nickname={inputNickname}
                symbolSet={selectedSymbolSet}
                onSymbolSetChange={setSelectedSymbolSet}
                copiedId={copiedId} 
                onCopy={handleCopy} 
                isDarkMode={isDarkMode} 
                generateSymbols={generateSymbols}
              />
            ) : (
              <div className="text-center py-12 text-muted-foreground">No symbols available.</div>
            )}

          </div>
        </section>

        <AdPlaceholderZone position="bottom" />

        {/* Global Toast Notification */}
        <div 
          aria-live="polite" 
          aria-atomic="true"
          className={`fixed bottom-4 right-4 z-50 transition-all duration-300 transform ${toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
        >
          <div className={`px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 font-medium ${
            toast.type === 'error' ? 'bg-red-500 text-white' : 
            toast.type === 'warning' ? 'bg-yellow-500 text-white' : 
            'bg-green-500 text-white'
          }`}>
            {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
            {toast.message}
          </div>
        </div>

      </div>
    </>
  );
};

export default NicknameGeneratorPage;