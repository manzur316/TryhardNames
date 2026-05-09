import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import SeoHead from '@/seo/SeoHead.jsx';
import { faqPageSchema } from '@/seo/schema.js';
import { Link } from 'react-router-dom';
import { 
  Copy, Check, AlertCircle, 
  Search, Download, Share2, 
  X, Trash2, ChevronDown, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import AdPlaceholderZone from '@/components/AdPlaceholderZone.jsx';
import { useTheme } from '@/core/context/ThemeContext.jsx';
import { TextInput } from '../components/TextInput.jsx';
import { StyleGrid } from '../components/StyleGrid.jsx';
import { CuratedStyleRails } from '../components/CuratedStyleRails.jsx';
import { useStylishText } from '../hooks/useStylishText.js';
import { copyTextToClipboard } from '@/utils/clipboard.js';
import { textStyles, exportAsText } from '../utils/textStyleConverter.js';

const CATEGORIES = ['All', 'Competitive', 'Unicode', 'Decorative', 'Bio', 'Symbols', 'Identity'];
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
    saveText, 
    deleteText,
    generateStylishText
  } = useStylishText();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3000);
  }, []);

  const handleInputChange = useCallback((val) => {
    if (val.length <= MAX_INPUT_LENGTH) {
      setInputText(val);
    } else {
      showToast(`Maximum length is ${MAX_INPUT_LENGTH} characters`, 'error');
    }
  }, [setInputText, showToast]);

  const transformCacheRef = useRef(new Map());

  const categorySource = styles;

  const handleCopy = useCallback((text, id) => {
    copyTextToClipboard(text, { preventRepeatMs: 450, vibrateMs: 12 }).then((res) => {
      if (!res.ok) {
        showToast('Copy failed', 'error');
        return;
      }
      setCopiedId(id);
      saveText(text, 'copied');
      showToast('Copied to clipboard!');
      setTimeout(() => setCopiedId(null), 1200);
    });
  }, [saveText, showToast]);

  const searchFilteredStyles = useMemo(() => {
    if (!styles?.length) return [];

    const textToTransform = inputText || 'Stylish Text';
    const cache = transformCacheRef.current;
    const cacheKeyPrefix = `${textToTransform}\u0001`;

    return styles
      .map((style) => {
        const localStyle = textStyles[style.id] || textStyles[style.name?.toLowerCase()] || Object.values(textStyles)[0];
        const ck = cacheKeyPrefix + style.id;
        let computed = cache.get(ck);
        if (!computed) {
          computed = generateStylishText(textToTransform, localStyle.transform);
          cache.set(ck, computed);
          if (cache.size > 1200) cache.clear();
        }
        return { ...style, ...computed };
      })
      .filter((style) => {
        const matchesCategory = selectedStyle === 'All' || style.category === selectedStyle;
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          !q ||
          style.name?.toLowerCase().includes(q) ||
          style.category?.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
      });
  }, [styles, inputText, selectedStyle, searchQuery, generateStylishText]);

  const availableCategories = useMemo(() => {
    const fromData = new Set(categorySource.map((s) => s.category).filter(Boolean));
    if (fromData.size === 0) return ['All'];
    const list = CATEGORIES.filter((c) => c === 'All' || fromData.has(c));
    return list.length ? list : ['All'];
  }, [categorySource]);

  useEffect(() => {
    if (availableCategories.length && !availableCategories.includes(selectedStyle)) {
      setSelectedStyle('All');
    }
  }, [availableCategories, selectedStyle, setSelectedStyle]);

  // Keyboard shortcuts (single subscription; deps stable per interaction contract)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key === 'a' && document.activeElement?.id !== 'text-input') {
        e.preventDefault();
        const input = document.getElementById('text-input');
        if (input) {
          input.focus();
          input.select();
        }
      }
      if (cmdOrCtrl && e.key === 'c' && document.activeElement?.id !== 'text-input') {
        if (searchFilteredStyles.length > 0 && searchFilteredStyles[0].success) {
          e.preventDefault();
          handleCopy(searchFilteredStyles[0].text, searchFilteredStyles[0].id);
        }
      }
      if (cmdOrCtrl && e.key === 'x' && document.activeElement?.id !== 'text-input') {
        e.preventDefault();
        setInputText('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchFilteredStyles, handleCopy, setInputText]);

  const applyPreset = (preset) => {
    setInputText(preset);
    saveText(preset, 'preset');
  };

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

  const faqJsonLd = faqPageSchema(faqs.map((f) => ({ question: f.q, answer: f.a })));

  return (
    <>
      <SeoHead
        title="Stylish Text Generator – Unicode Fonts & Cool Symbols | TryhardNames"
        description="Create stylish Unicode text—bold, cursive, mirrored and decorative. Copy/paste for bios, Discord, TikTok and gaming tags."
        path="/stylish-text-generator"
        jsonLd={[faqJsonLd]}
      />

      <div className="bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-dark-50 flex-grow flex flex-col min-h-screen transition-colors duration-300">
        
        <section className="relative pt-10 pb-6 px-4 border-b border-slate-200/80 dark:border-dark-800">
          <div className="container mx-auto max-w-5xl text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-dark-50">
              Stylish Text Generator
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-dark-400 max-w-xl mx-auto leading-relaxed">
              Type once—every style updates live. Copy the row you want. Unicode fonts for Discord, bios, and tags.
            </p>
            <div className="flex justify-center pt-2">
              <Link
                to={`/identity-kit${inputText.trim() ? `?primary=${encodeURIComponent(inputText.trim())}` : ''}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-dark-700 bg-white/90 dark:bg-dark-900/90 px-4 py-2 text-sm font-medium text-slate-700 dark:text-dark-200 hover:border-accent-cyan/45 hover:text-accent-cyan transition-colors"
              >
                Compose an Identity Kit <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        <AdPlaceholderZone position="top" />

        <section className="container mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <div className="max-w-5xl mx-auto space-y-6">
            
            <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-2xl p-4 sm:p-6 shadow-sm">
              <TextInput 
                value={inputText} 
                onChange={handleInputChange} 
                onClear={() => setInputText('')} 
                maxLength={MAX_INPUT_LENGTH}
                isDarkMode={isDarkMode}
              />

              <div className="mt-5 pt-5 border-t border-slate-200 dark:border-dark-800 space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-dark-500 mb-2">
                    Quick fill
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-200 hover:bg-slate-200 dark:hover:bg-dark-700 border border-transparent hover:border-slate-300 dark:hover:border-dark-600 transition-colors min-h-[40px]"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {savedTexts.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-dark-500 mb-2">
                      Recent (tap to reuse)
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {savedTexts.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-0.5 pl-2 pr-1 py-1 rounded-lg bg-slate-100 dark:bg-dark-800 border border-slate-200/80 dark:border-dark-700 max-w-full min-h-[40px]"
                        >
                          <button
                            type="button"
                            onClick={() => setInputText(item.text)}
                            className="text-sm truncate max-w-[min(200px,55vw)] text-left text-slate-800 dark:text-dark-100 hover:text-accent-cyan"
                            title={item.text}
                          >
                            {item.text}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteText(item.id)}
                            className="p-2 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-500/10 shrink-0"
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

              <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-5 border-t border-slate-200 dark:border-dark-800">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    onClick={copyAllStyles}
                    disabled={searchFilteredStyles.filter((s) => s.success).length === 0}
                    variant="outline"
                    className="border-slate-200 dark:border-dark-700 min-h-[44px] font-medium"
                    aria-label="Copy all visible styles"
                  >
                    <Copy className="w-4 h-4 mr-2" /> Copy all rows
                  </Button>
                  <details className="relative group min-h-[44px] flex items-center">
                    <summary className="list-none cursor-pointer flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-dark-700 text-sm font-medium text-slate-600 dark:text-dark-300 hover:bg-slate-50 dark:hover:bg-dark-800 min-h-[44px] [&::-webkit-details-marker]:hidden">
                      More
                      <ChevronDown className="w-4 h-4 opacity-70" aria-hidden />
                    </summary>
                    <div className="absolute left-0 top-full z-20 mt-1 min-w-[200px] rounded-lg border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 py-1 shadow-lg">
                      <button
                        type="button"
                        onClick={handleDownloadFile}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-dark-800"
                      >
                        <Download className="w-4 h-4 shrink-0" aria-hidden />
                        Download .txt
                      </button>
                      <button
                        type="button"
                        onClick={shareOnSocial}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-dark-800"
                      >
                        <Share2 className="w-4 h-4 shrink-0" aria-hidden />
                        Share on X
                      </button>
                    </div>
                  </details>
                </div>
                <p className="text-xs text-slate-500 dark:text-dark-500 max-w-md sm:text-right leading-snug">
                  Outside the text field: Ctrl/Cmd+C copies the first visible style. Ctrl/Cmd+A focuses the field.
                </p>
              </div>
            </div>

            <CuratedStyleRails
              inputText={inputText}
              generateStylishText={generateStylishText}
              onCopy={handleCopy}
              copiedId={copiedId}
              isDarkMode={isDarkMode}
            />

            <div className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-dark-400 pointer-events-none" />
                  <input 
                    type="text" 
                    placeholder="Filter styles by name…" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Filter styles"
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-sm focus:ring-2 focus:ring-accent-cyan/40 focus:border-accent-cyan outline-none transition-all"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-200/80 dark:hover:bg-dark-700" aria-label="Clear filter">
                      <X className="w-4 h-4 text-slate-500 dark:text-dark-400" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-dark-400">
                  <span className="tabular-nums" title="Styles matching filters">
                    {stats.total} styles
                  </span>
                </div>
              </div>

              {availableCategories.length > 1 && (
                <div className="flex flex-wrap gap-2" aria-label="Category filters">
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedStyle(cat)}
                      aria-pressed={selectedStyle === cat}
                      className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors active:scale-[0.98] ${
                        selectedStyle === cat 
                          ? 'bg-accent-cyan text-dark-950 ring-1 ring-accent-cyan/40' 
                          : 'bg-white dark:bg-dark-900 text-slate-600 dark:text-dark-400 hover:bg-slate-100 dark:hover:bg-dark-800 border border-slate-200 dark:border-dark-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              {styles.length > 0 ? (
                <StyleGrid 
                  styles={searchFilteredStyles} 
                  copiedId={copiedId} 
                  onCopy={handleCopy} 
                  isDarkMode={isDarkMode} 
                />
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 dark:border-dark-700 py-14 px-4 text-center text-slate-500 dark:text-dark-400 text-sm">
                  No styles to display. Try again shortly.
                </div>
              )}
            </div>

            {/* Standardized SEO Section */}
            <section className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-dark-50">
                Stylish Text Generator - Create Decorative Fonts & Symbols
              </h2>
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
                  <div key={i} className="p-4 rounded-lg border border-slate-200 dark:border-dark-700 bg-slate-50/80 dark:bg-dark-900/50">
                    <h3 className="font-semibold text-slate-900 dark:text-dark-50 mb-2">{faq.q}</h3>
                    <p className="text-slate-700 dark:text-dark-300 leading-relaxed text-[15px]">{faq.a}</p>
                  </div>
                ))}
              </div>
              
              {/* CTA Section */}
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-dark-800">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-dark-50">Explore More Tools</h2>
                <div className="flex flex-wrap gap-3">
                  <Link to="/roblox-names" className="px-5 py-2.5 rounded-lg font-medium border border-slate-300 dark:border-dark-600 text-slate-800 dark:text-dark-100 hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors">
                    Roblox Names
                  </Link>
                  <Link to="/gamer-names" className="px-5 py-2.5 rounded-lg font-medium border border-slate-300 dark:border-dark-600 text-slate-800 dark:text-dark-100 hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors">
                    Gamer Names
                  </Link>
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