import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  EyeOff,
  Lock,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react';
import SeoHead from '@/seo/SeoHead.jsx';

const plannedProofs = [
  'Riot account ownership',
  'Riot ID display',
  'Ranked Solo/Duo standing',
  'Ranked Flex standing',
  'Sync timestamp and source',
];

const noGoCards = [
  'No custom MMR or ELO',
  'No live-game advantage',
  'No in-game recommendations',
  'No OP.GG alternative',
  'No match-history dumping',
  'No hidden-player de-anonymization',
  'No selling Riot data',
  'No public profile without consent',
];

const reviewPoints = [
  'Public generators remain free and usable without an account.',
  'Gaming Passport accounts are only for private drafts and future verified proofs.',
  'Riot data will be used only after approval and explicit user authorization.',
  'Riot-owned data and assets are not monetized directly.',
  'Future monetization is limited to TryhardNames-owned cosmetics, themes, borders, and animations.',
];

const GamingPassportPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SeoHead
        title="Gaming Passport - Visual, verifiable player resume | TryhardNames"
        description="TryhardNames Gaming Passport is a private-first, visual gaming resume for verified player identity, planned Riot account ownership, and user-controlled public proofs."
        path="/gaming-passport"
      />

      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,rgba(34,211,238,0.16),transparent_58%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:py-24">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-cyan-300/80">
              TryhardNames identity layer
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
              Gaming Passport
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              A visual, verifiable, shareable gaming resume for players who want to show who they are without
              exposing accounts by default.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/sign-in"
                className="inline-flex items-center justify-center rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_18px_45px_-22px_rgba(34,211,238,0.9)] transition hover:bg-cyan-200"
              >
                Create your private draft
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.08]"
              >
                See how it works
              </a>
            </div>
            <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                <Lock className="mb-3 h-5 w-5 text-emerald-300" aria-hidden="true" />
                Private draft first
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                <ShieldCheck className="mb-3 h-5 w-5 text-cyan-300" aria-hidden="true" />
                Verified proofs only
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                <EyeOff className="mb-3 h-5 w-5 text-violet-300" aria-hidden="true" />
                User-controlled visibility
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/12 bg-slate-900/85 p-5 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.9)] ring-1 ring-cyan-200/10">
            <div className="rounded-xl border border-white/10 bg-slate-950 p-5">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
                    Passport scene
                  </p>
                  <p className="mt-2 text-xl font-bold text-white">Private draft preview</p>
                </div>
                <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-200">
                  Not published
                </span>
              </div>
              <div className="grid gap-4 py-5">
                <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Parent Auth</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Google or email signs you into TryhardNames. It is never a badge, proof, or public account field.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Future linked providers</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Riot and Discord will be linked accounts after sign-in, not Parent Auth login methods.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Game adapter model</p>
                  <p className="mt-2 text-sm text-slate-300">
                    League of Legends lives inside RiotProvider as LeagueOfLegendsAdapter, not as a separate provider.
                  </p>
                </div>
              </div>
              <p className="text-xs leading-5 text-slate-500">
                This preview uses no live Riot data, no fake ranks, and no connected provider placeholders.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-14 px-4 py-14 sm:px-6 md:py-20">
        <section id="how-it-works" className="grid scroll-mt-24 gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300/75">What it is</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">A resume, not a tracker.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              'Create a TryhardNames account to manage a private Gaming Passport draft.',
              'That account is Parent Auth and never appears as a proof or public badge.',
              'Future provider accounts can be linked after sign-in with explicit authorization.',
              'Each proof is shown only when it is verified and the player chooses to publish it.',
            ].map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-white/[0.035] p-5 text-sm leading-6 text-slate-300">
                <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-300" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-cyan-200/15 bg-cyan-300/[0.035] p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300/75">
                Planned Riot / League of Legends integration
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">Pending Riot approval.</h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Riot integration is pending Riot approval. After approval, players will explicitly link their Riot
                account through Riot Sign On. TryhardNames does not claim Riot OAuth is live today, does not claim a
                production Riot key, and does not show real Riot data in production yet.
              </p>
            </div>
            <div className="grid gap-3">
              {plannedProofs.map((proof) => (
                <div key={proof} className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/65 p-4">
                  <Trophy className="h-5 w-5 shrink-0 text-cyan-300" aria-hidden="true" />
                  <span className="text-sm font-medium text-slate-200">{proof}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 grid gap-3 text-sm text-slate-300 md:grid-cols-2 lg:grid-cols-4">
            <p>No custom MMR.</p>
            <p>No ELO calculator.</p>
            <p>No alternative ranking system.</p>
            <p>No hidden player data.</p>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-300/75">
              Privacy and control
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">Private by default.</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
              <li>Publishing is explicit; nothing becomes public just because a user signs in.</li>
              <li>Provider and proof visibility are controlled by the player.</li>
              <li>Unlink and revoke flows are planned before provider launch.</li>
              <li>Provider tokens stay server-side when providers are implemented.</li>
              <li>Public pages use an allowlist and show only approved fields and proofs.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-300/75">
              What we do not do
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">No competitive shadow systems.</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {noGoCards.map((card) => (
                <div key={card} className="rounded-xl border border-white/10 bg-slate-950/70 p-4 text-sm font-semibold text-slate-200">
                  {card}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300/75">
                For Riot review
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">Scope and monetization boundaries.</h2>
            </div>
            <div className="grid gap-3">
              {reviewPoints.map((point) => (
                <div key={point} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-slate-300">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
                  {point}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-amber-200/20 bg-amber-200/[0.045] p-6 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200/80">Legal</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">Riot Games notice</h2>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300">
            TryhardNames Gaming Passport is not endorsed by Riot Games and does not reflect the views or opinions of
            Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all
            associated properties are trademarks or registered trademarks of Riot Games, Inc.
          </p>
        </section>
      </main>
    </div>
  );
};

export default GamingPassportPage;
