import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { 
  Copy, Check, Trash2, AlertCircle, Sparkles, Type, Zap, 
  Search, Download, FileJson, FileSpreadsheet, Share2, 
  History, Moon, Sun, Command, X, Settings, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import Breadcrumb from '@/components/Breadcrumb.jsx';
import AdPlaceholderZone from '@/components/AdPlaceholderZone.jsx';
import { NamesGrid, GenerateButton, TrendingNames } from '@/core/components/index.js';
import { 
  textStyles, 
  validateTransform, 
  getAllCategories, 
  searchStyles, 
  exportAsText, 
  exportAsJSON, 
  exportAsCSV,
  generateCustomNicknameSymbols,
  getNicknameSymbolCategories
} from '@/utils/textStyleConverter.js';
import { copyTextToClipboard } from '@/utils/clipboard.js';

const CATEGORIES = ['All', 'Math', 'Width', 'Numbers', 'Decorative', 'Symbols', 'Spacing', 'Flip'];
const PRESETS = ['Gaming', 'Stylish', 'Cool', 'Gamer', 'Clan'];
const MAX_INPUT_LENGTH = 500;

const StylishTextGeneratorPage = () => {
  const [activeTab, setActiveTab] = useState('stylish');
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const trendingStyles = ['𝕿𝖗𝖞𝖍𝖆𝖗𝖉', '𝓣𝓇𝓎𝒽𝒶𝓇𝒹', '𝕋𝕣𝕪𝕙𝕒𝕣𝕕', '🅃𝕣𝕪𝕙𝕒𝕣𝕕', '꓄𝕣𝕪𝕙𝕒𝕣𝕕', 'T̷r̷y̷h̷a̷r̷d̷'];
  const exampleStyles = ['𝕾т𝖞𝖑𝖎ѕ𝖍', '𝒮𝓽𝓎𝓁𝒾𝓈𝒽', '𝕊𝕥𝕪𝕝𝕚𝕤𝕙', '🅂𝕥𝕪𝕝𝕚𝕤𝕙', '🆂𝕥𝕪𝕝𝕚𝕤𝕙', '🅢𝕥𝕪𝕝𝕚𝕤𝕙', 'ꌗ𝕥𝕪𝕝𝕚𝕤𝕙', 'ꑄ𝕥𝕪𝕝𝕚𝕤𝕙'];

  // Nickname Symbols State
  const [nicknameInput, setNicknameInput] = useState('');
  const [generatedSymbols, setGeneratedSymbols] = useState([]);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  
  const [symPosition, setSymPosition] = useState('both');
  const [symCount, setSymCount] = useState(1);
  const [symSpacing, setSymSpacing] = useState(1);
  const [selectedSymCategories, setSelectedSymCategories] = useState([]);

  const availableSymCategories = useMemo(() => getNicknameSymbolCategories(), []);

  useEffect(() => {
    const savedHistory = localStorage.getItem('stylishTextHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key === 'a' && document.activeElement.id !== 'text-input') {
        e.preventDefault();
        const input = document.getElementById('text-input');
        if (input) {
          input.focus();
          input.select();
        }
      }
      if (cmdOrCtrl && e.key === 'c' && document.activeElement.id !== 'text-input') {
        if (activeTab === 'stylish' && transformedTexts.length > 0 && transformedTexts[0].success) {
          e.preventDefault();
          handleCopy(transformedTexts[0].text, transformedTexts[0].id);
        }
      }
      if (cmdOrCtrl && e.key === 'x' && document.activeElement.id !== 'text-input') {
        e.preventDefault();
        if (activeTab === 'stylish') setInputText('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputText, activeTab]);

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3000);
  };

  const addToHistory = (text) => {
    if (!text || text.trim() === '') return;
    const newHistory = [text, ...history.filter(h => h !== text)].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('stylishTextHistory', JSON.stringify(newHistory));
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val.length <= MAX_INPUT_LENGTH) {
      setInputText(val);
    } else {
      showToast(`Maximum length is ${MAX_INPUT_LENGTH} characters`, 'error');
    }
  };

  const handleInputBlur = () => {
    addToHistory(inputText);
  };

  const applyPreset = (preset) => {
    setInputText(preset);
    addToHistory(preset);
  };

  const handleCopy = (text, id) => {
    copyTextToClipboard(text, { preventRepeatMs: 450, vibrateMs: 12 }).then((res) => {
      if (!res.ok) {
        showToast('Copy failed', 'error');
        return;
      }
      setCopiedId(id);
      showToast('Copied to clipboard!');
      setTimeout(() => setCopiedId(null), 1200);
    });
  };

  const handleGenerateSymbols = () => {
    if (!nicknameInput.trim()) return;
    const symbols = generateCustomNicknameSymbols(nicknameInput.trim(), {
      position: symPosition,
      symbolCount: symCount,
      spacing: symSpacing,
      categories: selectedSymCategories
    });
    setGeneratedSymbols(symbols);
  };

  const toggleSymCategory = (catId) => {
    setSelectedSymCategories(prev => 
      prev.includes(catId) 
        ? prev.filter(id => id !== catId)
        : [...prev, catId]
    );
  };

  const transformedTexts = useMemo(() => {
    const textToTransform = inputText || 'Stylish Text';
    return Object.entries(textStyles).map(([id, style]) => {
      const { success, text, hasWarning, error } = validateTransform(textToTransform, style.transform);
      return { id, ...style, success, text, hasWarning, error };
    });
  }, [inputText]);

  const searchFilteredStyles = useMemo(() => {
    return transformedTexts.filter(style => {
      const matchesCategory = selectedCategory === 'All' || style.category === selectedCategory;
      const matchesSearch = style.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            style.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [transformedTexts, selectedCategory, searchQuery]);

  const stats = useMemo(() => {
    return transformedTexts.reduce((acc, curr) => {
      acc.total++;
      if (curr.success && !curr.hasWarning) acc.success++;
      if (curr.hasWarning) acc.warnings++;
      if (!curr.success) acc.errors++;
      return acc;
    }, { total: 0, success: 0, warnings: 0, errors: 0 });
  }, [transformedTexts]);

  const copyAllStyles = () => {
    const allText = searchFilteredStyles.filter(s => s.success).map(s => s.text).join('\n');
    copyTextToClipboard(allText, { preventRepeatMs: 650, vibrateMs: 12 }).then((res) => {
      if (!res.ok) {
        showToast('Copy failed', 'error');
        return;
      }
      showToast('All styles copied to clipboard!');
    });
  };

  const handleDownloadFile = () => {
    const allText = exportAsText(searchFilteredStyles);
    const blob = new Blob([allText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stylish-text.txt';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded as TXT file');
  };

  const handleExportJSON = () => {
    const jsonString = exportAsJSON(inputText, searchFilteredStyles);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stylish-text.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported as JSON');
  };

  const handleExportCSV = () => {
    const csvString = exportAsCSV(searchFilteredStyles);
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stylish-text.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported as CSV');
  };

  const shareOnSocial = () => {
    const textToShare = transformedTexts.length > 0 ? transformedTexts[0].text : 'Check out this stylish text generator!';
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShare)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const bgMain = isDarkMode ? 'bg-dark-950' : 'bg-gray-50';
  const textMain = isDarkMode ? 'text-dark-50' : 'text-gray-900';
  const bgCard = isDarkMode ? 'bg-dark-900' : 'bg-white';
  const borderCard = isDarkMode ? 'border-dark-700' : 'border-gray-200';
  const textMuted = isDarkMode ? 'text-dark-400' : 'text-gray-500';
  const bgInput = isDarkMode ? 'bg-dark-800' : 'bg-gray-100';

  const faqs = [
    { q: 'Where can I use these stylish fonts?', a: 'You can use them almost anywhere that accepts text input! They work great on Instagram, Twitter, TikTok, Discord, WhatsApp, and most gaming platforms.' },
    { q: 'Why do some characters show up as boxes?', a: 'Some older devices or specific apps might not support all Unicode characters. If you see boxes, try a different style that uses more common symbols.' },
    { q: 'Is there a limit to how much text I can convert?', a: 'Our tool currently supports up to 500 characters at a time to ensure fast performance and prevent browser lag.' }
  ];

  return (
    <>
      <Helmet>
        <title>Stylish Text Generator – Convert Text to Cool Fonts & Styles</title>
        <meta name="description" content="Convert text into 50+ Unicode styles—bold, italic, aesthetic, and symbol-framed layouts for bios, Discord, and gaming profiles." />
      </Helmet>

      <div className={`${bgMain} ${textMain} flex-grow flex flex-col min-h-screen transition-colors duration-300`}>
        <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-dark-800 text-yellow-400' : 'bg-gray-200 text-gray-700'} hover:scale-110 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center`}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <section className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-6">
              <Breadcrumb items={[{ name: 'Stylish Text Generator', path: '/stylish-text-generator' }]} />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-dark-50 text-center">
              Stylish Text Generator - Create Decorative Fonts & Symbols
            </h1>
            <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed text-center max-w-3xl mx-auto">
              Transform your standard text into eye-catching, decorative fonts instantly. Our stylish text generator helps you stand out on social media, gaming profiles, and messaging apps. With dozens of unique styles, you can perfectly match your digital aesthetic.
            </p>

            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50">
              What are stylish text generators?
            </h2>
            <p className="text-slate-700 dark:text-dark-300 mb-4 leading-relaxed">
              Stylish text generators use Unicode characters to create text that looks like different fonts. Since they use standard characters, you can copy and paste them anywhere that supports text input, bypassing the need for custom font files.
            </p>
            <p className="text-slate-700 dark:text-dark-300 mb-12 leading-relaxed">
              These tools map regular letters to their visually similar counterparts in other Unicode blocks, such as mathematical alphanumeric symbols, enclosed alphanumerics, or fullwidth forms, allowing for incredible creativity in your digital presence.
            </p>

            <TrendingNames title="Trending Styles" names={trendingStyles} startIndex={0} maxItems={6} />

            <div className={`flex justify-center mb-8 border-b ${borderCard}`}>
              <button
                onClick={() => setActiveTab('stylish')}
                className={`px-6 py-3 font-bold text-lg transition-colors min-h-[44px] ${
                  activeTab === 'stylish' 
                    ? 'text-accent-cyan border-b-2 border-accent-cyan' 
                    : `${textMuted} hover:${textMain}`
                }`}
              >
                Stylish Text
              </button>
              <button
                onClick={() => setActiveTab('symbols')}
                className={`px-6 py-3 font-bold text-lg transition-colors min-h-[44px] ${
                  activeTab === 'symbols' 
                    ? 'text-accent-cyan border-b-2 border-accent-cyan' 
                    : `${textMuted} hover:${textMain}`
                }`}
              >
                Nickname Symbols
              </button>
            </div>

            {activeTab === 'stylish' && (
              <div className="space-y-8 animate-in fade-in duration-300 mb-12">
                <div className={`${bgCard} border ${borderCard} rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow relative`}>
                  <div className="flex justify-between items-center mb-3">
                    <label htmlFor="text-input" className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${textMuted}`}>
                      <Type className="w-4 h-4 text-accent-cyan" />
                      Your Text
                    </label>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-medium ${inputText.length >= MAX_INPUT_LENGTH ? 'text-red-500' : textMuted}`}>
                        {inputText.length} / {MAX_INPUT_LENGTH}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      id="text-input"
                      value={inputText}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="Type something cool here..."
                      maxLength={MAX_INPUT_LENGTH}
                      aria-label="Text input for styling"
                      className={`w-full min-h-[120px] sm:min-h-[150px] ${bgInput} border ${borderCard} rounded-xl p-4 text-lg sm:text-xl focus:ring-2 focus:ring-accent-cyan focus:border-transparent transition-all resize-y custom-scrollbar`}
                    />
                    {inputText && (
                      <button
                        onClick={() => setInputText('')}
                        className={`absolute bottom-4 right-4 ${isDarkMode ? 'bg-dark-700 hover:bg-dark-600 text-dark-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'} p-2 rounded-lg transition-colors active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center`}
                        aria-label="Clear text"
                        title="Clear text (Ctrl+X)"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button onClick={copyAllStyles} variant="outline" className={`border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10 min-h-[44px]`} aria-label="Copy all styles">
                      <Copy className="w-4 h-4 mr-2" /> Copy All
                    </Button>
                    <Button onClick={handleDownloadFile} variant="outline" className={`${borderCard} ${textMuted} hover:${textMain} min-h-[44px]`} aria-label="Download as TXT">
                      <Download className="w-4 h-4 mr-2" /> TXT
                    </Button>
                    <Button onClick={handleExportJSON} variant="outline" className={`${borderCard} ${textMuted} hover:${textMain} min-h-[44px]`} aria-label="Export as JSON">
                      <FileJson className="w-4 h-4 mr-2" /> JSON
                    </Button>
                    <Button onClick={handleExportCSV} variant="outline" className={`${borderCard} ${textMuted} hover:${textMain} min-h-[44px]`} aria-label="Export as CSV">
                      <FileSpreadsheet className="w-4 h-4 mr-2" /> CSV
                    </Button>
                    <Button onClick={shareOnSocial} variant="outline" className={`${borderCard} ${textMuted} hover:${textMain} min-h-[44px]`} aria-label="Share on Twitter">
                      <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`${bgCard} border ${borderCard} rounded-xl p-4`}>
                    <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${textMuted}`}>
                      <Zap className="w-4 h-4 text-accent-purple" /> Presets
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {PRESETS.map(preset => (
                        <button 
                          key={preset} 
                          onClick={() => applyPreset(preset)}
                          className={`px-3 py-1.5 text-sm rounded-lg ${bgInput} hover:bg-accent-purple/20 hover:text-accent-purple transition-colors min-h-[44px]`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className={`${bgCard} border ${borderCard} rounded-xl p-4`}>
                    <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${textMuted}`}>
                      <History className="w-4 h-4 text-accent-pink" /> Recent History
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {history.length === 0 ? (
                        <span className={`text-sm ${textMuted}`}>No history yet</span>
                      ) : (
                        history.map((item, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => setInputText(item)}
                            className={`px-3 py-1.5 text-sm rounded-lg ${bgInput} hover:bg-accent-pink/20 hover:text-accent-pink transition-colors truncate max-w-[150px] min-h-[44px]`}
                            title={item}
                          >
                            {item}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="relative w-full sm:w-64">
                      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textMuted}`} />
                      <input 
                        type="text" 
                        placeholder="Search styles..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search styles"
                        className={`w-full pl-9 pr-4 py-2 rounded-lg ${bgInput} border ${borderCard} focus:ring-2 focus:ring-accent-cyan outline-none transition-all min-h-[44px]`}
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <X className={`w-4 h-4 ${textMuted} hover:${textMain}`} />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <span className={`px-2 py-1 rounded ${bgInput} ${textMuted}`} title="Total Styles">Total: {stats.total}</span>
                      <span className={`px-2 py-1 rounded bg-green-500/10 text-green-500`} title="Successful">✓ {stats.success}</span>
                      {stats.warnings > 0 && <span className={`px-2 py-1 rounded bg-yellow-500/10 text-yellow-500`} title="Warnings">⚠ {stats.warnings}</span>}
                      {stats.errors > 0 && <span className={`px-2 py-1 rounded bg-red-500/10 text-red-500`} title="Errors">✕ {stats.errors}</span>}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2" aria-label="Category filters">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        aria-pressed={selectedCategory === cat}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 min-h-[44px] ${
                          selectedCategory === cat 
                            ? 'bg-accent-cyan text-dark-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                            : `${bgCard} ${textMuted} hover:${bgInput} hover:${textMain} border ${borderCard}`
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="region" aria-label="Generated text styles">
                  {searchFilteredStyles.map((style) => {
                    const isCopied = copiedId === style.id;
                    
                    return (
                      <div 
                        key={style.id}
                        className={`${bgCard} border ${borderCard} rounded-xl p-4 flex flex-col gap-3 group hover:border-accent-cyan/50 hover:shadow-lg transition-all relative overflow-hidden`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>{style.name}</span>
                          <span className={`text-[10px] ${bgInput} ${textMuted} px-2 py-1 rounded-md border ${borderCard}`}>{style.category}</span>
                        </div>
                        
                        <div className="text-lg sm:text-xl break-all pr-10 min-h-[3rem] flex items-center">
                          {!style.success ? (
                            <span className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4"/> {style.error}</span>
                          ) : (
                            <span className={style.hasWarning ? 'text-yellow-500' : ''}>{style.text}</span>
                          )}
                        </div>

                        {style.success && (
                          <button
                            onClick={() => handleCopy(style.text, style.id)}
                            className={`absolute bottom-4 right-4 p-2.5 rounded-lg transition-all active:scale-90 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                              isCopied 
                                ? 'bg-green-500/20 text-green-500 border border-green-500/50' 
                                : `${isDarkMode ? 'bg-dark-700 text-dark-300' : 'bg-gray-100 text-gray-600'} hover:bg-accent-cyan hover:text-dark-950 border ${borderCard} hover:border-accent-cyan`
                            }`}
                            aria-label={`Copy ${style.name} style to clipboard`}
                            title="Copy to clipboard"
                          >
                            {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                          </button>
                        )}
                        
                        <div className={`absolute inset-0 bg-green-500/10 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 pointer-events-none ${isCopied ? 'opacity-100' : 'opacity-0'}`}>
                          <span className="bg-green-500 text-dark-950 font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                            <Check className="w-4 h-4" /> Copied!
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {searchFilteredStyles.length === 0 && (
                  <div className={`text-center py-16 ${bgCard} rounded-xl border ${borderCard}`}>
                    <p className={textMuted}>No styles found matching your criteria.</p>
                    <Button onClick={() => {setSearchQuery(''); setSelectedCategory('All');}} variant="link" className="mt-2 text-accent-cyan min-h-[44px]">
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'symbols' && (
              <div className="space-y-8 animate-in fade-in duration-300 mb-12">
                <div className={`${bgCard} border ${borderCard} rounded-2xl p-6 shadow-lg`}>
                  <label className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${textMuted} mb-3`}>
                    <Type className="w-4 h-4 text-accent-cyan" />
                    Enter Nickname
                  </label>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input
                        type="text"
                        value={nicknameInput}
                        onChange={(e) => setNicknameInput(e.target.value.slice(0, 30))}
                        placeholder="e.g. ShadowNinja"
                        className={`flex-grow ${bgInput} border ${borderCard} rounded-xl p-4 text-lg focus:ring-2 focus:ring-accent-cyan outline-none transition-all min-h-[56px]`}
                      />
                      <GenerateButton 
                        onClick={handleGenerateSymbols}
                        disabled={!nicknameInput.trim()}
                        label="Apply symbols"
                        className="bg-accent-cyan text-dark-950 hover:bg-accent-cyan/90"
                      />
                    </div>

                    <div className="mt-2">
                      <button 
                        onClick={() => setIsCustomizationOpen(!isCustomizationOpen)}
                        className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${textMuted} hover:text-accent-cyan transition-colors min-h-[44px]`}
                      >
                        <Settings className="w-4 h-4" />
                        Customization Options
                        {isCustomizationOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {isCustomizationOpen && (
                      <div className={`mt-4 p-6 rounded-xl ${bgInput} border ${borderCard} space-y-6 animate-in slide-in-from-top-2 duration-200`}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-3">
                            <label className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Symbol Position</label>
                            <div className="flex bg-dark-900 rounded-lg p-1 border border-dark-700">
                              {['before', 'both', 'after'].map(pos => (
                                <button
                                  key={pos}
                                  onClick={() => setSymPosition(pos)}
                                  className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all min-h-[44px] ${
                                    symPosition === pos 
                                      ? 'bg-accent-cyan text-dark-950 shadow-sm' 
                                      : 'text-dark-300 hover:text-white hover:bg-dark-800'
                                  }`}
                                >
                                  {pos}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <label className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Symbol Count</label>
                              <span className="text-xs font-bold text-accent-cyan">{symCount}</span>
                            </div>
                            <input 
                              type="range" 
                              min="1" 
                              max="5" 
                              value={symCount} 
                              onChange={(e) => setSymCount(parseInt(e.target.value))}
                              className="w-full accent-accent-cyan h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <label className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Spacing</label>
                              <span className="text-xs font-bold text-accent-cyan">{symSpacing}</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="5" 
                              value={symSpacing} 
                              onChange={(e) => setSymSpacing(parseInt(e.target.value))}
                              className="w-full accent-accent-cyan h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-dark-700">
                          <div className="flex justify-between items-center">
                            <label className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Symbol Categories</label>
                            <button 
                              onClick={() => setSelectedSymCategories([])}
                              className="text-xs text-accent-cyan hover:underline min-h-[44px]"
                            >
                              Clear All (Uses All)
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {availableSymCategories.map(cat => {
                              const isSelected = selectedSymCategories.includes(cat.id);
                              return (
                                <button
                                  key={cat.id}
                                  onClick={() => toggleSymCategory(cat.id)}
                                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all border min-h-[44px] ${
                                    isSelected 
                                      ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan' 
                                      : 'bg-dark-900 border-dark-700 text-dark-300 hover:border-dark-500 hover:text-white'
                                  }`}
                                >
                                  {cat.name} <span className="opacity-50 ml-1">({cat.count})</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {generatedSymbols.length > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">Symbol layouts</h3>
                      <Button onClick={handleGenerateSymbols} variant="outline" className={`border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10 min-h-[44px]`}>
                        <Sparkles className="w-4 h-4 mr-2" /> Refresh layouts
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generatedSymbols.map(sym => {
                        const isCopied = copiedId === sym.id;
                        return (
                          <div key={sym.id} className={`${bgCard} border ${borderCard} rounded-xl p-4 flex flex-col gap-3 group hover:border-accent-cyan/50 hover:shadow-lg transition-all relative overflow-hidden`}>
                            <div className="text-lg sm:text-xl break-all pr-12 min-h-[3rem] flex items-center font-medium">
                              {sym.result}
                            </div>
                            <button
                              onClick={() => handleCopy(sym.result, sym.id)}
                              className={`absolute top-1/2 -translate-y-1/2 right-4 p-2.5 rounded-lg transition-all active:scale-90 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                                isCopied 
                                  ? 'bg-green-500/20 text-green-500 border border-green-500/50' 
                                  : `${isDarkMode ? 'bg-dark-700 text-dark-300' : 'bg-gray-100 text-gray-600'} hover:bg-accent-cyan hover:text-dark-950 border ${borderCard} hover:border-accent-cyan`
                              }`}
                              title="Copy to clipboard"
                            >
                              {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                            
                            <div className={`absolute inset-0 bg-green-500/10 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 pointer-events-none ${isCopied ? 'opacity-100' : 'opacity-0'}`}>
                              <span className="bg-green-500 text-dark-950 font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                <Check className="w-4 h-4" /> Copied!
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

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

export default StylishTextGeneratorPage;