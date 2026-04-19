import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { 
  Copy, Check, AlertCircle, Zap, 
  Search, Download, FileJson, FileSpreadsheet, Share2, 
  History, X, Trash2, Loader2, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import Breadcrumb from '@/components/Breadcrumb.jsx';
import AdPlaceholderZone from '@/components/AdPlaceholderZone.jsx';
import { useTheme } from '@/core/context/ThemeContext.jsx';
import { TextInput } from '../components/TextInput.jsx';
import { StyleGrid } from '../components/StyleGrid.jsx';
import { useStylishText } from '../hooks/useStylishText.js';
import { 
  textStyles, 
  exportAsText, 
  exportAsJSON, 
  exportAsCSV
} from '../utils/textStyleConverter.js';

const CATEGORIES = ['All', 'Math', 'Width', 'Numbers', 'Decorative', 'Symbols', 'Spacing', 'Flip'];
const PRESETS = ['Gaming', 'Stylish', 'Cool', 'Gamer', 'Clan'];
const MAX_INPUT_LENGTH = 500;

const StylishTextGeneratorPage = () => {
  const { isDarkMode } = useTheme();
  const { 
    inputText, 
    setInputText, 
    selectedStyle, 
    setSelectedStyle, 
    savedTexts, 
    styles,
    isLoadingStyles,
    stylesError,
    saveText, 
    deleteText,
    generateStylishText
  } = useStylishText();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // Keyboard shortcuts
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
        if (searchFilteredStyles.length > 0 && searchFilteredStyles[0].success) {
          e.preventDefault();
          handleCopy(searchFilteredStyles[0].text, searchFilteredStyles[0].id);
        }
      }
      if (cmdOrCtrl && e.key === 'x' && document.activeElement.id !== 'text-input') {
        e.preventDefault();
        setInputText('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3000);
  };

  const handleInputChange = (val) => {
    if (val.length <= MAX_INPUT_LENGTH) {
      setInputText(val);
    } else {
      showToast(`Maximum length is ${MAX_INPUT_LENGTH} characters`, 'error');
    }
  };

  const applyPreset = (preset) => {
    setInputText(preset);
    saveText(preset, 'preset');
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    saveText(text, 'copied');
    showToast('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerate = () => {
    if (inputText && styles.length > 0) {
      const localStyle = textStyles[styles[0].id] || Object.values(textStyles)[0];
      generateStylishText(inputText, localStyle.transform);
      saveText(inputText, 'generated');
      showToast('Text generated and saved!');
    }
  };

  const searchFilteredStyles = useMemo(() => {
    if (!styles || styles.length === 0) return [];
    
    const textToTransform = inputText || 'Stylish Text';
    
    return styles.map(style => {
      const localStyle = textStyles[style.id] || textStyles[style.name?.toLowerCase()] || Object.values(textStyles)[0];
      const { success, text, hasWarning, error } = generateStylishText(textToTransform, localStyle.transform);
      return { ...style, success, text, hasWarning, error };
    }).filter(style => {
      const matchesCategory = selectedStyle === 'All' || style.category === selectedStyle;
      const matchesSearch = style.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            style.category?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [styles, inputText, selectedStyle, searchQuery, generateStylishText]);

  const stats = useMemo(() => {
    return searchFilteredStyles.reduce((acc, curr) => {
      acc.total++;
      if (curr.success && !curr.hasWarning) acc.success++;
      if (curr.hasWarning) acc.warnings++;
      if (!curr.success) acc.errors++;
      return acc;
    }, { total: 0, success: 0, warnings: 0, errors: 0 });
  }, [searchFilteredStyles]);

  const copyAllStyles = () => {
    const allText = searchFilteredStyles.filter(s => s.success).map(s => s.text).join('\n');
    navigator.clipboard.writeText(allText);
    showToast('All styles copied to clipboard!');
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
    const textToShare = searchFilteredStyles.length > 0 ? searchFilteredStyles[0].text : 'Check out this stylish text generator!';
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShare)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const examples = [
    '𝕾т𝖞𝖑𝖎ѕ𝖍', '𝒮𝓽𝓎𝓁𝒾𝓈𝒽', '𝕊𝕥𝕪𝕝𝕚𝕤𝕙', '🅂𝕥𝕪𝕝𝕚𝕤𝕙', 
    '🆂𝕥𝕪𝕝𝕚𝕤𝕙', '🅢𝕥𝕪𝕝𝕚𝕤𝕙', 'ꌗ𝕥𝕪𝕝𝕚𝕤𝕙', 'ꑄ𝕥𝕪𝕝𝕚𝕤𝕙'
  ];

  const faqs = [
    { q: 'Where can I use these stylish fonts?', a: 'You can use them almost anywhere that accepts text input! They work great on Instagram, Twitter, TikTok, Discord, WhatsApp, and most gaming platforms.' },
    { q: 'Why do some characters show up as boxes?', a: 'Some older devices or specific apps might not support all Unicode characters. If you see boxes, try a different style that uses more common symbols.' },
    { q: 'Is there a limit to how much text I can convert?', a: 'Our tool currently supports up to 500 characters at a time to ensure fast performance and prevent browser lag.' }
  ];

  return (
    <>
      <Helmet>
        <title>Stylish Text Generator – Convert Text to Cool Fonts & Symbols</title>
        <meta name="description" content="Generate 50+ stylish text fonts, cool symbols, and Unicode text instantly. Copy and paste bold, italic, cursive, and aesthetic fonts for social media and gaming." />
      </Helmet>

      <div className="bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-dark-50 flex-grow flex flex-col min-h-screen transition-colors duration-300">
        
        <section className="relative pt-12 pb-8 px-4 overflow-hidden flex flex-col items-center justify-center border-b border-slate-200 dark:border-dark-700">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-cyan/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
          
          <div className="container mx-auto max-w-5xl relative z-10 text-center space-y-6">
            <div className="flex justify-center mb-2">
              <Breadcrumb items={[{ name: 'Stylish Text Generator', path: '/stylish-text-generator' }]} />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
              Stylish Text Generator <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple">Convert Text to Cool Fonts</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-dark-400 max-w-2xl mx-auto font-medium">
              Type your text below to instantly generate 50+ Unicode styles. Copy and paste bold, italic, cursive, and aesthetic fonts anywhere.
            </p>
          </div>
        </section>

        <AdPlaceholderZone position="top" />

        <section className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
          <div className="max-w-5xl mx-auto space-y-8">
            
            <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow relative">
              <TextInput 
                value={inputText} 
                onChange={handleInputChange} 
                onClear={() => setInputText('')} 
                maxLength={MAX_INPUT_LENGTH}
                isDarkMode={isDarkMode}
              />

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button 
                  onClick={handleGenerate}
                  disabled={isLoadingStyles || styles.length === 0 || !inputText}
                  className="bg-accent-cyan text-dark-950 hover:bg-accent-cyan/90 font-semibold"
                >
                  <Zap className="w-4 h-4 mr-2" /> Generate
                </Button>
                <Button onClick={copyAllStyles} variant="outline" className="border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10" aria-label="Copy all styles">
                  <Copy className="w-4 h-4 mr-2" /> Copy All
                </Button>
                <Button onClick={handleDownloadFile} variant="outline" className="border-slate-200 dark:border-dark-700 text-slate-500 dark:text-dark-400 hover:text-slate-900 dark:hover:text-dark-50" aria-label="Download as TXT">
                  <Download className="w-4 h-4 mr-2" /> TXT
                </Button>
                <Button onClick={handleExportJSON} variant="outline" className="border-slate-200 dark:border-dark-700 text-slate-500 dark:text-dark-400 hover:text-slate-900 dark:hover:text-dark-50" aria-label="Export as JSON">
                  <FileJson className="w-4 h-4 mr-2" /> JSON
                </Button>
                <Button onClick={handleExportCSV} variant="outline" className="border-slate-200 dark:border-dark-700 text-slate-500 dark:text-dark-400 hover:text-slate-900 dark:hover:text-dark-50" aria-label="Export as CSV">
                  <FileSpreadsheet className="w-4 h-4 mr-2" /> CSV
                </Button>
                <Button onClick={shareOnSocial} variant="outline" className="border-slate-200 dark:border-dark-700 text-slate-500 dark:text-dark-400 hover:text-slate-900 dark:hover:text-dark-50" aria-label="Share on Twitter">
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl p-4">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-slate-500 dark:text-dark-400">
                  <Zap className="w-4 h-4 text-accent-purple" /> Presets
                </h3>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map(preset => (
                    <button 
                      key={preset} 
                      onClick={() => applyPreset(preset)}
                      className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-dark-800 hover:bg-accent-purple/20 hover:text-accent-purple transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl p-4">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-slate-500 dark:text-dark-400">
                  <History className="w-4 h-4 text-accent-pink" /> Recent History
                </h3>
                <div className="flex flex-wrap gap-2">
                  {savedTexts.length === 0 ? (
                    <span className="text-sm text-slate-500 dark:text-dark-400">No history yet</span>
                  ) : (
                    savedTexts.map((item) => (
                      <div key={item.id} className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-dark-800 hover:bg-accent-pink/10 transition-colors">
                        <button 
                          onClick={() => setInputText(item.text)}
                          className="hover:text-accent-pink truncate max-w-[120px]"
                          title={item.text}
                        >
                          {item.text}
                        </button>
                        <button onClick={() => deleteText(item.id)} className="text-red-400 hover:text-red-600 ml-1">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-dark-400" />
                  <input 
                    type="text" 
                    placeholder="Search styles..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search styles"
                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 focus:ring-2 focus:ring-accent-cyan outline-none transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X className="w-4 h-4 text-slate-500 dark:text-dark-400 hover:text-slate-900 dark:hover:text-dark-50" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <span className="px-2 py-1 rounded bg-slate-100 dark:bg-dark-800 text-slate-500 dark:text-dark-400" title="Total Styles">Total: {stats.total}</span>
                  <span className="px-2 py-1 rounded bg-green-500/10 text-green-500" title="Successful">✓ {stats.success}</span>
                  {stats.warnings > 0 && <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500" title="Warnings">⚠ {stats.warnings}</span>}
                  {stats.errors > 0 && <span className="px-2 py-1 rounded bg-red-500/10 text-red-500" title="Errors">✕ {stats.errors}</span>}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2" aria-label="Category filters">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedStyle(cat)}
                    aria-pressed={selectedStyle === cat}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${
                      selectedStyle === cat 
                        ? 'bg-accent-cyan text-dark-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                        : 'bg-white dark:bg-dark-900 text-slate-500 dark:text-dark-400 hover:bg-slate-100 dark:hover:bg-dark-800 hover:text-slate-900 dark:hover:text-dark-50 border border-slate-200 dark:border-dark-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {isLoadingStyles ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-accent-cyan" />
                <p className="text-slate-500 dark:text-dark-400">Loading styles from server...</p>
              </div>
            ) : stylesError ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4 text-red-500">
                <AlertCircle className="w-10 h-10" />
                <p>Failed to load styles: {stylesError.message}</p>
              </div>
            ) : styles.length > 0 ? (
              <StyleGrid 
                styles={searchFilteredStyles} 
                copiedId={copiedId} 
                onCopy={handleCopy} 
                isDarkMode={isDarkMode} 
              />
            ) : (
              <div className="text-center py-12 text-muted-foreground">No styles available.</div>
            )}

            {/* Standardized SEO Section */}
            <section className="mt-16 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-dark-50">
                Stylish Text Generator - Create Decorative Fonts & Symbols
              </h1>
              <p className="text-slate-700 dark:text-dark-300 mb-4 leading-relaxed">
                Transform your standard text into eye-catching, decorative fonts instantly. Our stylish text generator helps you stand out on social media, gaming profiles, and messaging apps. With dozens of unique styles, you can perfectly match your digital aesthetic.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50 mt-12">
                What are stylish text generators?
              </h2>
              <p className="text-slate-700 dark:text-dark-300 mb-4 leading-relaxed">
                Stylish text generators use Unicode characters to create text that looks like different fonts. Since they use standard characters, you can copy and paste them anywhere that supports text input, bypassing the need for custom font files.
              </p>
              <p className="text-slate-700 dark:text-dark-300 mb-4 leading-relaxed">
                These tools map regular letters to their visually similar counterparts in other Unicode blocks, such as mathematical alphanumeric symbols, enclosed alphanumerics, or fullwidth forms, allowing for incredible creativity in your digital presence.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50 mt-12">
                Popular Examples
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-12">
                {examples.map((ex, i) => (
                  <div key={i} className="p-3 bg-slate-100 dark:bg-dark-800 rounded text-center text-slate-900 dark:text-dark-50 font-medium">
                    {ex}
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50 mt-12">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4 mb-12">
                {faqs.map((faq, i) => (
                  <div key={i} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                    <h3 className="font-bold text-slate-900 dark:text-dark-50 mb-2">{faq.q}</h3>
                    <p className="text-slate-700 dark:text-dark-300 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
              
              {/* CTA Section */}
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-dark-800">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50">Explore More Tools</h2>
                <div className="flex flex-wrap gap-4">
                  <Link to="/roblox-names" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Roblox Names</Link>
                  <Link to="/gamer-names" className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">Gamer Names</Link>
                </div>
              </div>
            </section>

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