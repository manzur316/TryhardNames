import React from 'react';
import { Link } from 'react-router-dom';
import { Type, Shapes, Gamepad2, Heart } from 'lucide-react';

const ITEMS = [
  {
    to: '/stylish-text-generator',
    label: 'Stylish text',
    sub: 'Unicode styles for bios and tags',
    icon: Type,
  },
  {
    to: '/nickname-symbols',
    label: 'Nickname symbols',
    sub: 'Characters, separators, frames',
    icon: Shapes,
  },
  {
    to: '/roblox-names',
    label: 'Roblox names',
    sub: 'Hubs by style lane',
    icon: Gamepad2,
  },
  {
    to: '/favorites',
    label: 'Saved picks',
    sub: 'Stored locally in your browser',
    icon: Heart,
  },
];

/**
 * Calm discovery rail — replaces synthetic “live feeds”.
 * Same philosophy as Stylish / Symbols: exploration-first, copy-ready utility.
 */
export default function HomeExploreAside() {
  return (
    <aside className="bg-white dark:bg-dark-800 border border-slate-200/95 dark:border-dark-700/90 rounded-2xl p-5 sm:p-6 shadow-[0_18px_48px_-28px_rgba(15,23,42,0.14)] dark:shadow-[0_24px_56px_-32px_rgba(0,0,0,0.55)] ring-1 ring-slate-900/[0.04] dark:ring-white/[0.05] h-full flex flex-col">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-50 mb-1">
        Explore tools
      </h3>
      <p className="text-sm text-slate-600 dark:text-dark-400 mb-5 leading-relaxed">
        Open a lane, copy what fits—no staged loading.
      </p>
      <ul className="space-y-2 flex-1">
        {ITEMS.map(({ to, label, sub, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              className="flex gap-3 rounded-xl border border-slate-200/95 dark:border-dark-700/85 bg-slate-50/90 dark:bg-dark-900/85 p-3.5 hover:border-slate-300 dark:hover:border-cyan-400/22 hover:-translate-y-px hover:shadow-md dark:hover:shadow-[0_14px_36px_-20px_rgba(0,0,0,0.5)] transition-all duration-200"
            >
              <Icon className="w-5 h-5 text-slate-500 dark:text-dark-400 shrink-0 mt-0.5" aria-hidden />
              <span>
                <span className="font-semibold text-slate-900 dark:text-dark-50 block">{label}</span>
                <span className="text-xs text-slate-600 dark:text-dark-400">{sub}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
