# Recharts Restoration & Cleanup Documentation

## 📦 Dependency Restoration
- Restored `recharts` dependency in `apps/web/package.json`.
- Version added: `^2.10.0`.
- This ensures all chart components and statistics dashboards function correctly without module resolution errors.

## 🧹 Cleaned Components
The following components were thoroughly reviewed and cleaned to ensure **zero analytics references** (`trackEvent`, `useAnalytics`, etc.) while preserving full chart functionality:

1. `apps/web/src/components/FavoritesStats.jsx`
2. `apps/web/src/components/LeaderboardGamesChart.jsx`
3. `apps/web/src/components/LeaderboardNamesChart.jsx`
4. `apps/web/src/components/MetaStatsSection.jsx`
5. `apps/web/src/components/RobloxStatsSection.jsx`
6. `apps/web/src/components/WorldStatsSection.jsx`
7. `apps/web/src/components/ui/chart.jsx`
8. `apps/web/src/pages/TryhardMetrics.jsx`

## ✅ Verification Checklist
- [x] `recharts` added to `package.json` dependencies.
- [x] All analytics imports and calls removed from the 8 target components.
- [x] `BarChart`, `LineChart`, `AreaChart`, `PieChart` and their respective sub-components (`XAxis`, `YAxis`, `Tooltip`, `Legend`, `ResponsiveContainer`, etc.) are correctly imported from `recharts`.
- [x] `chart.jsx` (shadcn UI component) is fully functional and free of analytics tracking.
- [x] `TryhardMetrics.jsx` page logic remains intact and uses `apiServerClient` for data fetching without relying on removed analytics hooks.

**Status:** ✅ RECHARTS RESTORATION COMPLETE AND READY FOR PRODUCTION.