import React from 'react';
import { Activity, BadgeCheck } from 'lucide-react';

export default function PublicProofCard({ proof }) {
  if (proof.source === 'osu' && proof.type === 'profile_linked') {
    return <PublicOsuProofCard proof={proof} />;
  }

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-700 dark:text-violet-200">
            {toLabel(proof.provider)}{proof.game ? ` / ${toLabel(proof.game)}` : ''}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{proof.title}</h3>
        </div>
        {proof.status === 'stale' ? (
          <Activity className="h-5 w-5 text-amber-600 dark:text-amber-200" aria-hidden="true" />
        ) : (
          <BadgeCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
        )}
      </div>
      <p className="mt-3 text-2xl font-black text-slate-950 dark:text-white">{proof.displayValue}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-white/10 dark:text-slate-200">
          {toLabel(proof.mode)}
        </span>
        {proof.season && (
          <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200">
            {proof.season}
          </span>
        )}
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
          {toLabel(proof.status)}
        </span>
      </div>
      {proof.verifiedAt && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Verified {formatDate(proof.verifiedAt)}
        </p>
      )}
    </article>
  );
}

function PublicOsuProofCard({ proof }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-700 dark:text-violet-200">
            osu! / Ownership
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
            {proof.label || 'Linked osu! account'}
          </h3>
        </div>
        <BadgeCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        TryhardNames verified account ownership through osu! OAuth.
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-white/10 dark:text-slate-200">
          Profile linked
        </span>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
          Public
        </span>
      </div>
      {proof.observedAt && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Observed {formatDate(proof.observedAt)}
        </p>
      )}
    </article>
  );
}

function toLabel(value) {
  return String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
  } catch {
    return value;
  }
}
