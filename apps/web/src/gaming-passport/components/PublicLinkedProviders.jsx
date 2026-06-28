import React from 'react';
import { BadgeCheck, ExternalLink } from 'lucide-react';

export default function PublicLinkedProviders({ providers = [] }) {
  if (!providers.length) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Linked providers</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          No public linked provider cards are visible on this Passport.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Linked providers</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {providers.map((provider) => (
          <PublicLinkedProviderCard
            key={`${getProviderId(provider)}-${provider.verifiedAt || provider.displayName || provider.externalUsername || 'provider'}`}
            provider={provider}
          />
        ))}
      </div>
    </section>
  );
}

function PublicLinkedProviderCard({ provider }) {
  const isOsu = provider.providerId === 'osu';
  const providerLabel = isOsu ? 'osu!' : provider.provider;
  const title = isOsu
    ? provider.externalUsername || 'Linked osu! account'
    : provider.displayName || 'Verified account';

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-200">
            {providerLabel}
          </p>
          <h3 className="mt-1 text-base font-semibold text-slate-950 dark:text-white">
            {title}
          </h3>
        </div>
        <BadgeCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
      </div>
      {isOsu && (
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          TryhardNames verified account ownership through osu! OAuth.
        </p>
      )}
      {isOsu && provider.profileUrl && (
        <a
          href={provider.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-700 hover:text-cyan-900 dark:text-cyan-200 dark:hover:text-cyan-100"
        >
          View osu! profile
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      )}
      {provider.verifiedAt && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Verified {formatDate(provider.verifiedAt)}
        </p>
      )}
    </article>
  );
}

function getProviderId(provider) {
  return provider.providerId || provider.provider || 'provider';
}

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
  } catch {
    return value;
  }
}
