import React, { useState } from 'react';
import { Flag, Loader2, X } from 'lucide-react';
import { submitPublicProfileReport } from '@/gaming-passport/data/trustSafetyRepository.js';
import {
  PUBLIC_PROFILE_REPORT_CATEGORIES,
  REPORT_DETAILS_MAX_LENGTH,
  buildDefaultPublicProfileReportForm,
  getPublicProfileReportFormState,
  getReportCategoryLabel,
} from '@/gaming-passport/trust-safety/index.js';
import { getSupabaseRuntime } from '@/lib/supabase/client.js';

export default function PublicProfileReportDialog({ slug }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(buildDefaultPublicProfileReportForm);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const formState = getPublicProfileReportFormState({ slug, ...form });
  const isSubmitting = status === 'submitting';

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    if (!formState.ok) {
      setStatus('error');
      setMessage('Choose a report category and keep details under the limit.');
      return;
    }

    setStatus('submitting');
    try {
      const { client } = await getSupabaseRuntime();
      const result = await submitPublicProfileReport(client, { slug, ...form });
      if (result.ok) {
        setStatus('success');
        setMessage('Thanks. The report was received for review.');
        setForm(buildDefaultPublicProfileReportForm());
        return;
      }
      setStatus('error');
      setMessage('Report could not be submitted.');
    } catch {
      setStatus('error');
      setMessage('Report could not be submitted.');
    }
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-start gap-3">
        <Flag className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-200" aria-hidden="true" />
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-700 dark:text-slate-200">
            Trust and safety
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Report impersonation, offensive content, fake proof/rank claims, privacy requests, or cosmetic abuse.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setStatus('idle');
          setMessage('');
        }}
        className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/15 dark:bg-black/30 dark:text-white dark:hover:bg-white/10"
      >
        <Flag className="h-4 w-4" aria-hidden="true" />
        Report profile
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="public-profile-report-title"
            className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-slate-950"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-200">
                  Public profile report
                </p>
                <h3 id="public-profile-report-title" className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">
                  Report profile
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-slate-600 transition hover:bg-slate-100 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
                aria-label="Close report dialog"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <label htmlFor="public-profile-report-category" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Category
                <select
                  id="public-profile-report-category"
                  value={form.category}
                  disabled={isSubmitting}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-amber-400/40 focus:ring-2 dark:border-white/10 dark:bg-black/30 dark:text-white"
                >
                  {PUBLIC_PROFILE_REPORT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{getReportCategoryLabel(category)}</option>
                  ))}
                </select>
              </label>

              <label htmlFor="public-profile-report-details" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Details
                <textarea
                  id="public-profile-report-details"
                  value={form.details}
                  maxLength={REPORT_DETAILS_MAX_LENGTH}
                  disabled={isSubmitting}
                  onChange={(event) => setForm((current) => ({ ...current, details: event.target.value }))}
                  className="mt-2 min-h-32 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-amber-400/40 placeholder:text-slate-400 focus:ring-2 dark:border-white/10 dark:bg-black/30 dark:text-white dark:placeholder:text-slate-500"
                  placeholder="Describe the issue without including private contact details."
                />
              </label>

              <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
                Do not include passwords, payment info, private contact details, tokens, or external account IDs.
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formState.detailsRemaining} characters remaining. Reports are reviewed privately and do not expose moderation status publicly.
              </p>

              {message && (
                <p
                  role={status === 'success' ? 'status' : 'alert'}
                  className={`rounded-md border px-3 py-2 text-sm ${
                    status === 'success'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-100'
                      : 'border-red-300 bg-red-50 text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-100'
                  }`}
                >
                  {message}
                </p>
              )}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formState.ok}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  Submit report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
