import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export const Dropdown = ({ label, icon, items, className = '' }) => {
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

  return (
    <div 
      className={`relative group ${className}`} 
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        aria-expanded={isOpen}
      >
        {icon && <span>{icon}</span>}
        <span>{label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div 
        className={`absolute top-full left-0 w-64 pt-2 transition-all duration-200 origin-top-left z-50 ${isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
      >
        <div className="bg-popover border border-border rounded-xl shadow-lg overflow-hidden p-2 flex flex-col gap-1">
          {items.map((item, idx) => (
            <Link 
              key={idx} 
              to={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent transition-colors group/item"
            >
              {item.icon && (
                <div className="text-xl transform group-hover/item:scale-110 transition-transform duration-200">
                  {item.icon}
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-foreground">{item.label}</div>
                {item.description && (
                  <div className="text-xs text-muted-foreground mt-0.5 leading-snug">
                    {item.description}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};