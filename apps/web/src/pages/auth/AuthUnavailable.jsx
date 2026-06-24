import React from 'react';

export default function AuthUnavailable() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Parent Auth</p>
      <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Auth not configured</h1>
      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
        Public generators still work without an account. To test Parent Auth locally, start Supabase and set
        the public URL and anon key in your local environment.
      </p>
    </div>
  );
}
