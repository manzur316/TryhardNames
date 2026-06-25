import React from 'react';
import { CheckCircle2, Circle, Lock } from 'lucide-react';
import { DEFAULT_SCENE_CONFIG } from '@/gaming-passport/data/passportRepository.js';

export default function PassportCompletionChecklist({ form, validation, isDirty, isSaving, isDraftLoading }) {
  const scene = form.sceneConfig || DEFAULT_SCENE_CONFIG;
  const featuredSavedNames = Array.isArray(scene.featuredSavedNames) ? scene.featuredSavedNames : [];
  const hasCustomStyle = scene.layout !== DEFAULT_SCENE_CONFIG.layout
    || scene.accent !== DEFAULT_SCENE_CONFIG.accent
    || scene.density !== DEFAULT_SCENE_CONFIG.density;
  const items = [
    { label: 'Alias added', done: Boolean(form.alias?.trim()) },
    { label: 'Short bio added', done: Boolean(form.bioShort?.trim()) },
    { label: 'Visual style selected', done: hasCustomStyle },
    { label: 'Saved Names highlights selected', done: featuredSavedNames.length > 0 },
    { label: 'Draft saved', done: !isDraftLoading && !isSaving && !isDirty && validation.ok },
    { label: 'Public profile remains locked for a later PR', done: false, locked: true },
  ];
  const completed = items.filter((item) => item.done).length;

  return (
    <section className="rounded-lg border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-black/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
            Private completion checklist
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">{completed} of 5 private setup checks</h3>
        </div>
        <span className="rounded-full border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-white/15 dark:text-slate-300">
          Draft only
        </span>
      </div>
      <ul className="mt-4 space-y-2">
        {items.map((item) => {
          const Icon = item.locked ? Lock : item.done ? CheckCircle2 : Circle;
          return (
            <li key={item.label} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <Icon className={`h-4 w-4 ${item.done ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-400'}`} aria-hidden="true" />
              <span>{item.label}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
