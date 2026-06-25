import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { DEFAULT_SCENE_CONFIG } from '@/gaming-passport/data/passportRepository.js';

export default function PrivatePassportPreview({ form, isLoading }) {
  const scene = form.sceneConfig || DEFAULT_SCENE_CONFIG;
  const featuredSavedNames = Array.isArray(scene.featuredSavedNames) ? scene.featuredSavedNames : [];
  const accentClasses = {
    cyan: 'border-cyan-300 bg-cyan-50/80 dark:border-cyan-300/40 dark:bg-cyan-300/10',
    violet: 'border-violet-300 bg-violet-50/80 dark:border-violet-300/40 dark:bg-violet-300/10',
    emerald: 'border-emerald-300 bg-emerald-50/80 dark:border-emerald-300/40 dark:bg-emerald-300/10',
    amber: 'border-amber-300 bg-amber-50/80 dark:border-amber-300/40 dark:bg-amber-300/10',
  };
  const densityClass = scene.density === 'dense' ? 'gap-3 p-5' : 'gap-5 p-6';
  const layoutClass = scene.layout === 'compact' ? 'flex items-center gap-4' : 'space-y-4';

  return (
    <section className={`flex flex-col rounded-lg border ${accentClasses[scene.accent] || accentClasses.cyan} ${densityClass}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white dark:bg-white/10">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          Private preview
        </span>
        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 dark:bg-black/20 dark:text-slate-200">
          Not published
        </span>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-600 dark:text-slate-300">Preparing draft preview...</p>
      ) : (
        <>
          <div className={layoutClass}>
            <AvatarPreview avatarUrl={form.avatarUrl} alias={form.alias} />
            <div>
              <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">{form.alias || 'Unnamed player'}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                {form.bioShort || 'Add a short private bio to preview your future Gaming Passport.'}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-black/20">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Private Saved Names highlights
            </p>
            {featuredSavedNames.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {featuredSavedNames.map((name) => (
                  <span
                    key={name}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-800 dark:border-white/15 dark:bg-white/10 dark:text-slate-100"
                    title={name}
                  >
                    {name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Choose saved names to preview private identity highlights.
              </p>
            )}
          </div>

          <div className="grid gap-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
            <p className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
              This draft is private, has no public link, and does not publish automatically.
            </p>
            <p>Not a ranking, tracker, match-history view, MMR/ELO product, or live-game advice surface.</p>
            <p>No provider data is used here. Riot and Discord remain future linked providers, not active integrations.</p>
          </div>
        </>
      )}
    </section>
  );
}

function AvatarPreview({ avatarUrl, alias }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={alias ? `${alias} avatar` : 'Draft avatar'}
        className="h-20 w-20 rounded-lg border border-slate-300 object-cover dark:border-white/15"
      />
    );
  }

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-slate-300 bg-white text-2xl font-semibold text-cyan-700 dark:border-white/15 dark:bg-black/30 dark:text-cyan-200">
      {(alias || '?').trim().slice(0, 1).toUpperCase() || '?'}
    </div>
  );
}
