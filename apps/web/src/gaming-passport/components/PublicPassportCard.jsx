import React from 'react';
import { BadgeCheck, CalendarDays, Shield } from 'lucide-react';
import { getCosmeticPresentationTokens } from '@/gaming-passport/cosmetics/index.js';

export default function PublicPassportCard({ passport }) {
  const displayName = passport.alias || passport.slug;
  const initial = displayName.slice(0, 1).toUpperCase();
  const cosmeticTokens = getCosmeticPresentationTokens(passport.scene);

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-100">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Gaming Passport
          </span>
          {passport.linkedProviders.length > 0 && (
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100">
              Verified identity surface
            </span>
          )}
        </div>

        <div className={`${cosmeticTokens.shellClassName} mt-6 flex flex-col gap-5 p-5 sm:flex-row sm:items-center`}>
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 text-4xl font-black text-slate-500 dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
            {passport.avatarUrl ? (
              <img src={passport.avatarUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <span aria-hidden="true">{initial}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-semibold ${cosmeticTokens.bodyClassName}`}>tryhardnames.com/id/{passport.slug}</p>
            <div className={`mt-2 inline-flex ${cosmeticTokens.nameplateClassName}`}>
              <h1 className={`break-words text-4xl font-black tracking-normal sm:text-5xl ${cosmeticTokens.headingClassName}`}>
                {displayName}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <aside className="rounded-lg border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-700 dark:text-slate-200">
              Public projection
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              This page shows only allowlisted public Passport fields after owner consent and policy checks.
            </p>
          </div>
        </div>
        <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
          {passport.publishedAt && (
            <p className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Published {formatDate(passport.publishedAt)}
            </p>
          )}
          {passport.updatedAt && (
            <p className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Updated {formatDate(passport.updatedAt)}
            </p>
          )}
        </div>
      </aside>
    </section>
  );
}

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
  } catch {
    return value;
  }
}
