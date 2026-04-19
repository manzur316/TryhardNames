import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const styles = [
  { id: 'Tryhard', label: 'Tryhard', desc: 'Aggressive, competitive', color: 'text-primary' },
  { id: 'Aesthetic', label: 'Aesthetic', desc: 'Stylish, artistic', color: 'text-purple-400' },
  { id: 'Dark', label: 'Dark', desc: 'Mysterious, edgy', color: 'text-gray-400' },
  { id: 'Funny', label: 'Funny', desc: 'Humorous, playful', color: 'text-yellow-400' },
  { id: 'Competitive', label: 'Competitive', desc: 'Esports-focused', color: 'text-blue-400' },
  { id: 'Minimal', label: 'Minimal', desc: 'Clean, simple', color: 'text-white' }
];

const BioStyleSelector = ({ selectedStyle, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = styles.find(s => s.id === selectedStyle) || styles[0];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="text-sm font-semibold text-foreground/80 mb-2 block">Bio Style</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-background border-2 border-border hover:border-primary/50 rounded-xl px-4 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <div>
          <span className={`block font-bold ${selected.color}`}>{selected.label}</span>
          <span className="block text-xs text-foreground/50">{selected.desc}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-foreground/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
          >
            {styles.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => {
                  onSelect(style.id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-background transition-colors border-b border-border/50 last:border-0"
              >
                <div className="text-left">
                  <span className={`block font-bold ${style.color}`}>{style.label}</span>
                  <span className="block text-xs text-foreground/50">{style.desc}</span>
                </div>
                {selectedStyle === style.id && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BioStyleSelector;