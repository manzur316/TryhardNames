import React, { useMemo, useState } from 'react';
import { clearAnalytics, getAnalyticsSnapshot } from '@/utils/analytics.js';

const StatRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 py-1">
    <span className="text-xs font-bold tracking-widest uppercase text-dark-400">{label}</span>
    <span className="text-xs font-black text-dark-50">{value}</span>
  </div>
);

export default function AnalyticsDebugPanel() {
  const [open, setOpen] = useState(false);
  const snapshot = useMemo(() => getAnalyticsSnapshot(), [open]);

  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed right-3 bottom-24 z-[60] pointer-events-none">
      <div className="pointer-events-auto">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="px-4 py-2 rounded-full bg-dark-900/90 backdrop-blur border border-dark-700 text-xs font-black tracking-widest uppercase text-dark-200 hover:text-accent-cyan hover:border-accent-cyan/50 transition-colors shadow-refined"
        >
          Analytics {open ? 'Hide' : 'Show'}
        </button>

        {open && (
          <div className="mt-3 w-[320px] max-h-[60vh] overflow-auto bg-dark-900/95 backdrop-blur border border-dark-700 rounded-2xl shadow-refined p-4">
            {!snapshot ? (
              <p className="text-sm text-dark-300">No data yet.</p>
            ) : (
              <>
                <div className="mb-3">
                  <p className="text-xs font-black tracking-widest uppercase text-dark-200">Top copied</p>
                  <div className="mt-2 space-y-1">
                    {snapshot.topCopiedNames.map((x) => (
                      <StatRow key={x.key} label={x.key} value={x.count} />
                    ))}
                    {snapshot.topCopiedNames.length === 0 && <p className="text-sm text-dark-300">—</p>}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-black tracking-widest uppercase text-dark-200">Top quick modes</p>
                  <div className="mt-2 space-y-1">
                    {snapshot.topQuickModes.map((x) => (
                      <StatRow key={x.key} label={x.key} value={x.count} />
                    ))}
                    {snapshot.topQuickModes.length === 0 && <p className="text-sm text-dark-300">—</p>}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-black tracking-widest uppercase text-dark-200">Top pages</p>
                  <div className="mt-2 space-y-1">
                    {snapshot.topPages.map((x) => (
                      <StatRow key={x.key} label={x.key} value={x.count} />
                    ))}
                    {snapshot.topPages.length === 0 && <p className="text-sm text-dark-300">—</p>}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-black tracking-widest uppercase text-dark-200">Recent events</p>
                  <div className="mt-2 space-y-2">
                    {snapshot.recentEvents.slice(0, 12).map((e, idx) => (
                      <div key={idx} className="bg-dark-800 border border-dark-700 rounded-xl p-2">
                        <p className="text-xs font-black text-dark-50">{e.type}</p>
                        <p className="text-[11px] text-dark-300 mt-1 break-all">
                          {e.pageSlug || e.slug || '—'} {e.mode ? `• mode=${e.mode}` : ''}{' '}
                          {e.name ? `• ${e.name}` : ''}
                        </p>
                        <p className="text-[10px] text-dark-400 mt-1">{e.ts}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    clearAnalytics();
                    setOpen(false);
                  }}
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-xs font-black tracking-widest uppercase text-dark-200 hover:text-red-200 hover:border-red-400/40 transition-colors"
                >
                  Clear analytics
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

