import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';

const easePremium = [0.22, 1, 0.36, 1];

export default function HeroIdentitySection({ trendingStyles = [] }) {
  return (
    <section className="th-atmosphere-hero relative overflow-hidden py-11 sm:py-16 md:py-24 lg:py-28 min-h-[440px] md:min-h-[520px] flex flex-col justify-center px-4">
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
        <img
          src="https://images.unsplash.com/photo-1589241062313-35890684416a?q=80&w=2070&auto=format&fit=crop"
          alt=""
          loading="lazy"
          className="w-full h-full object-cover opacity-[0.085] dark:opacity-[0.055]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/93 via-slate-50/90 to-slate-100/95 dark:from-dark-950 dark:via-dark-950/98 dark:to-[#050507] transition-colors duration-300" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-5%,rgba(6,182,212,0.09),transparent_58%)] dark:bg-[radial-gradient(ellipse_75%_48%_at_50%_-8%,rgba(34,211,238,0.085),transparent_58%)]" />
        {/* Controlled prestige bloom — cyan/violet mix; opacity drift only (see index.css) */}
        <div className="absolute -top-[38%] left-1/2 w-[135%] max-w-[1040px] -translate-x-1/2 h-[82%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.065)_0%,transparent_62%)] opacity-[0.78] dark:bg-[radial-gradient(ellipse_at_center,rgba(192,132,252,0.088)_0%,rgba(34,211,238,0.045)_42%,transparent_64%)] dark:opacity-95 th-atmo-breathe" />
        <div className="absolute top-[4%] right-[-6%] h-[min(58vw,420px)] w-[min(58vw,420px)] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.065)_0%,transparent_62%)] blur-3xl opacity-90 dark:opacity-100" />
        <div className="absolute bottom-[-18%] left-[-12%] h-[min(62vw,460px)] w-[min(62vw,460px)] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.055)_0%,transparent_62%)] blur-3xl opacity-85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_35%_at_50%_100%,rgba(15,23,42,0.06),transparent_55%)] dark:bg-[radial-gradient(ellipse_65%_38%_at_50%_108%,rgba(0,0,0,0.45),transparent_60%)]" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: easePremium }}
          className="text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: easePremium }}
            className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-dark-400 mb-5"
          >
            Online identity culture
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: easePremium }}
            className="text-[2.125rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[4.75rem] font-black tracking-[-0.035em] leading-[1.02] max-w-[min(100%,56rem)] mx-auto"
          >
            <span className="text-slate-950 dark:text-dark-50 dark:[text-shadow:0_2px_42px_rgba(0,0,0,0.55)]">
              Own the name
            </span>
            <span className="block mt-2 sm:mt-3 text-slate-700 dark:text-dark-200 font-semibold tracking-[-0.028em] px-1 dark:[text-shadow:0_1px_28px_rgba(0,0,0,0.45)]">
              before the lobby loads
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: easePremium }}
            className="mt-6 sm:mt-7 text-base sm:text-lg md:text-xl leading-relaxed text-slate-600 dark:text-dark-300 max-w-[34rem] mx-auto font-medium"
          >
            Curated lanes for how you read in lobbies and chats—copy-ready tags and Unicode tools when you want texture, without the noise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.26, ease: easePremium }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10"
          >
            <Button
              onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto rounded-xl text-base sm:text-lg py-6 sm:py-3.5 px-10 font-bold bg-slate-950 text-white shadow-lg shadow-slate-950/25 hover:bg-slate-900 hover:shadow-lg hover:shadow-slate-950/30 hover:shadow-cyan-500/10 active:scale-[0.99] transition-all duration-200 dark:bg-white dark:text-slate-950 dark:shadow-[0_12px_40px_-16px_rgba(255,255,255,0.28)] dark:hover:bg-slate-50 dark:hover:shadow-[0_16px_44px_-14px_rgba(34,211,238,0.22)]"
            >
              Explore samples
            </Button>
            <Link
              to="/roblox-names"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-300/95 dark:border-dark-600/90 bg-white/92 dark:bg-dark-950/70 backdrop-blur-md px-8 py-6 sm:py-3.5 font-medium text-slate-800 dark:text-dark-200 hover:border-slate-400 hover:bg-white hover:text-slate-950 dark:hover:border-violet-400/30 dark:hover:text-dark-50 dark:hover:shadow-[0_0_24px_-10px_rgba(167,139,250,0.22)] transition-all duration-200 active:scale-[0.99] shadow-sm"
            >
              Browse identity hubs
            </Link>
          </motion.div>

          <motion.nav
            aria-label="Trending styles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.34 }}
            className="pt-9 sm:pt-10"
          >
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {trendingStyles.map((s, i) => (
                <motion.span
                  key={s.to}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.38 + i * 0.04, ease: easePremium }}
                >
                  <Link to={s.to} className="th-chip-quiet text-sm">
                    {s.label}
                  </Link>
                </motion.span>
              ))}
            </div>
          </motion.nav>
        </motion.div>
      </div>
    </section>
  );
}
