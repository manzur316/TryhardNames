import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SeoHead from '@/seo/SeoHead.jsx';
import { faqPageSchema } from '@/seo/schema.js';
import {
  LOL_HUB_PATH,
  LOL_IDENTITY_LANES,
  LOL_HUB_SECTIONS,
  LOL_HUB_FAQS,
} from '@/seo/leagueOfLegends/lolIdentityHub.js';

const jsonLd = [faqPageSchema(LOL_HUB_FAQS.map((f) => ({ question: f.question, answer: f.answer })))];

export default function LeagueOfLegendsHubPage() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <SeoHead
        title="League of Legends Summoner Names — Identity Hub | TryhardNames"
        description="Explore LoL-native summoner name lanes: pro minimal, sweaty ranked, clean and Korean-inspired handles, aesthetic and funny—curated identity, not generic generator spam."
        path={LOL_HUB_PATH}
        ogType="article"
        jsonLd={jsonLd}
      />

      <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-dark-300 transition-colors duration-300">
        <div className="relative border-b border-slate-200/90 dark:border-dark-800">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(200,155,60,0.07),transparent_55%)] dark:bg-[radial-gradient(ellipse_75%_48%_at_50%_-18%,rgba(200,155,60,0.06),transparent_55%)]"
            aria-hidden
          />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-16 md:py-20 text-center space-y-6">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-600 dark:text-dark-400">
              Identity universe
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.035em] leading-tight text-slate-950 dark:text-dark-50 text-balance">
              League of Legends summoner identity
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-dark-300 max-w-2xl mx-auto leading-relaxed font-medium text-balance">
              Pick a lane that matches how you want to be read in client, lobby, and op.gg—then explore patterns,
              examples, and a generator grounded in that lane.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                to="/league-of-legends/pro"
                className="inline-flex items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 px-6 py-3 text-sm font-bold shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 transition-all duration-200"
              >
                Start with pro minimal
              </Link>
              <Link
                to="/nickname-symbols"
                className="inline-flex items-center justify-center rounded-xl border-2 border-slate-300 dark:border-dark-600 bg-white/90 dark:bg-dark-900/90 px-6 py-3 text-sm font-semibold hover:border-slate-400 dark:hover:border-dark-500 transition-colors"
              >
                Symbols for tags
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-12">
          {LOL_HUB_SECTIONS.map((sec) => (
            <section
              key={sec.title}
              className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-2xl p-6 md:p-8 shadow-refined"
            >
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-dark-50 mb-4">{sec.title}</h2>
              <ul className="space-y-3 list-disc pl-5 text-slate-700 dark:text-dark-300 leading-relaxed">
                {sec.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </section>
          ))}

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-dark-50 mb-6 text-center md:text-left">
              Identity lanes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {LOL_IDENTITY_LANES.map((lane) => (
                <Link
                  key={lane.slug}
                  to={`${LOL_HUB_PATH}/${lane.slug}`}
                  className="group rounded-2xl border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-800 p-5 md:p-6 hover:border-slate-300 dark:hover:border-dark-600 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                >
                  <h3 className="text-lg font-bold text-slate-900 dark:text-dark-50 group-hover:text-slate-700 dark:group-hover:text-dark-100">
                    {lane.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-dark-400 leading-relaxed">{lane.blurb}</p>
                  <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-dark-500">
                    Explore lane →
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section className="border-t border-slate-200 dark:border-dark-800 pt-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-dark-50 mb-6 text-center">
              Frequently asked questions
            </h2>
            <div className="space-y-3 max-w-3xl mx-auto">
              {LOL_HUB_FAQS.map((faq) => (
                <details
                  key={faq.question}
                  className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-xl p-5"
                >
                  <summary className="cursor-pointer font-semibold text-slate-900 dark:text-dark-50">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-slate-700 dark:text-dark-300 text-sm leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="text-center pb-8">
            <p className="text-sm text-slate-600 dark:text-dark-400 mb-4">
              Cross-game competitive context
            </p>
            <Link
              to="/competitive-gamer-names"
              className="text-sm font-semibold text-slate-900 dark:text-dark-100 underline-offset-4 hover:underline"
            >
              Competitive gamer names hub
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
