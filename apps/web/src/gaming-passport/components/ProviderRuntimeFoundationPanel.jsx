import React from 'react';
import { Lock, RadioTower, ShieldCheck } from 'lucide-react';

const FOUNDATION_ITEMS = Object.freeze([
  'Provider connection intent contracts',
  'Callback state and replay guard contracts',
  'Owner-scoped audit event model',
  'Provider sync job scaffold with no external calls',
]);

const FUTURE_PROVIDERS = Object.freeze([
  {
    name: 'osu!',
    status: 'Server-gated foundation',
    detail: 'Disabled by default. Requires server-side API config before any owner-only connection flow can be tested.',
  },
  {
    name: 'Discord',
    status: 'Future linked provider',
    detail: 'Not live. No account connection button or redirect is exposed.',
  },
  {
    name: 'Riot',
    status: 'Gated by approval',
    detail: 'Requires Riot approval before any runtime or provider-specific work.',
  },
]);

export default function ProviderRuntimeFoundationPanel() {
  return (
    <section className="rounded-lg border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-200">
            Provider Runtime Foundation
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">Linked providers are not live yet</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-200">
            This account can show the provider-neutral foundation status. It does not expose provider connection buttons, redirects, provider API calls, or token usage.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          Not live
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.85fr)]">
        <div className="rounded-lg border border-slate-200 bg-white/85 p-4 dark:border-white/10 dark:bg-black/20">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-violet-700 dark:text-violet-200" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Foundation contracts</h3>
          </div>
          <ul className="mt-3 space-y-2">
            {FOUNDATION_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500 dark:bg-violet-200" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            Provider linking comes in a later PR. This panel is intentionally read-only.
          </p>
        </div>

        <div className="space-y-3">
          {FUTURE_PROVIDERS.map((provider) => (
            <article key={provider.name} className="rounded-lg border border-slate-200 bg-white/85 p-4 dark:border-white/10 dark:bg-black/20">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">{provider.name}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    {provider.status}
                  </p>
                </div>
                <RadioTower className="h-4 w-4 text-slate-500 dark:text-slate-300" aria-hidden="true" />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">{provider.detail}</p>
            </article>
          ))}
          <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
            Google remains Parent Auth only. Discord and Riot remain future linked providers, not login methods for this account.
          </p>
        </div>
      </div>
    </section>
  );
}
