import React from 'react';

export default function BannerAd({ position = 'default' }) {
  return (
    <div 
      className="w-full h-[250px] bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl flex items-center justify-center my-12 border border-slate-700/50 shadow-lg overflow-hidden relative"
      data-ad-zone="10667032"
      data-ad-type="banner"
      data-ad-position={position}
    >
      <div className="text-slate-500 text-sm font-medium tracking-widest uppercase z-10">
        Advertisement
      </div>
      {/* Subtle dot pattern overlay for aesthetics */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50"></div>
    </div>
  );
}