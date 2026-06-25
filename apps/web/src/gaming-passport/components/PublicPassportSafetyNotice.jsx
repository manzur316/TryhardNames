import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function PublicPassportSafetyNotice() {
  return (
    <section className="border-y border-slate-200 bg-slate-50/80 py-6 dark:border-white/10 dark:bg-black/20">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">
              Public safety boundary
            </h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              This Passport is an identity surface, not a tracker, OP.GG clone, match-history dump, custom MMR/ELO product, live-game advice tool, hidden-player surface, or alternate ranking system.
            </p>
          </div>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          Provider data is limited to public verified proof cards. Private account data, owner details, raw metadata, and tokens are not part of this page.
        </p>
      </div>
    </section>
  );
}
