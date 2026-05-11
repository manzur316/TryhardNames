import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SeoHead from '@/seo/SeoHead.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import IdentityKitArtifact from '@/components/identity/IdentityKitArtifact.jsx';
import IdentityCultureNote from '@/components/identity/IdentityCultureNote.jsx';
import {
  defaultIdentityKit,
  normalizeIdentityKit,
  loadIdentityKitFromStorage,
  saveIdentityKitToStorage,
  buildIdentityKitBundle,
  IDENTITY_SURFACES,
  IDENTITY_MOODS,
  READABILITY_TIERS,
  ARTIFACT_LAYOUTS,
} from '@/utils/identityKitModel.js';
import { exportNodeToPng, downloadDataUrl, downloadSvgString } from '@/utils/imageExport.js';
import { buildIdentityKitSvgString } from '@/utils/identityKitSvgExport.js';
import { copyTextToClipboard } from '@/utils/clipboard.js';
import { useToast } from '@/hooks/use-toast.js';
import { Download, Copy, Trash2, ArrowRight } from 'lucide-react';

const IdentityKitPage = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const cardRef = useRef(null);
  const hydratedRef = useRef(false);

  const [kit, setKit] = useState(() => loadIdentityKitFromStorage());

  const applyKit = useCallback((partial) => {
    setKit((prev) => normalizeIdentityKit({ ...prev, ...partial }));
  }, []);

  /** Optional URL prefill (shareable draft): ?primary=&styled=&bio=&label= */
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const primary = searchParams.get('primary');
    const styled = searchParams.get('styled');
    const bio = searchParams.get('bio');
    const label = searchParams.get('label');
    if (primary || styled || bio || label) {
      setKit((prev) =>
        normalizeIdentityKit({
          ...prev,
          ...(primary != null ? { primaryAlias: primary } : {}),
          ...(styled != null ? { styledAlias: styled } : {}),
          ...(bio != null ? { bioLine: bio } : {}),
          ...(label != null ? { kitLabel: label } : {}),
        })
      );
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    saveIdentityKitToStorage(kit);
  }, [kit]);

  const bundleText = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.href : '';
    return buildIdentityKitBundle(kit, { origin });
  }, [kit]);

  const handleExportPng = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await exportNodeToPng(cardRef.current, {
        backgroundColor: '#070A12',
        pixelRatio: 3,
      });
      downloadDataUrl(dataUrl, 'tryhardnames-identity-kit.png');
      toast({ title: 'Card saved', description: 'PNG downloaded — share or archive it.' });
    } catch {
      toast({ title: 'Export failed', variant: 'destructive' });
    }
  };

  const handleExportSvg = () => {
    try {
      const svg = buildIdentityKitSvgString(kit);
      downloadSvgString(svg, 'tryhardnames-identity-kit.svg');
      toast({
        title: 'SVG saved',
        description: 'Vector artifact — edit in design tools or archive losslessly.',
      });
    } catch {
      toast({ title: 'SVG export failed', variant: 'destructive' });
    }
  };

  const handleCopyBundle = async () => {
    const res = await copyTextToClipboard(bundleText, { preventRepeatMs: 500, vibrateMs: 12 });
    toast(
      res.ok
        ? { title: 'Bundle copied', description: 'Paste into notes, Discord, or a doc.' }
        : { title: 'Copy blocked', variant: 'destructive' }
    );
  };

  const handleReset = () => {
    setKit(defaultIdentityKit());
    toast({ title: 'Kit cleared', description: 'Starting fresh.' });
  };

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-dark-100 flex-grow flex flex-col transition-colors th-atmosphere-kitwash">
      <SeoHead
        title="Identity Kit — Design how you read online | TryhardNames"
        description="Compose a context-aware identity bundle: alias reads, symbols, bio, surface, curated read notes, and export — typography-first, no gimmicks."
        path="/identity-kit"
      />

      <section className="container mx-auto max-w-4xl px-4 pt-12 pb-6 md:pt-16 md:pb-10">
        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-dark-400 mb-3">
          Expansion · V1
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-[2.35rem] font-bold tracking-tight text-slate-900 dark:text-dark-50 leading-[1.15] text-balance">
          Identity Kit
        </h1>
        <p className="mt-4 text-base md:text-lg text-slate-600 dark:text-dark-300 max-w-2xl leading-relaxed">
          One artifact: how your alias reads in context — not another random generator. Fill the lines, choose where it
          lives, export a card or a text bundle.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link
            to="/stylish-text-generator"
            className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline underline-offset-4"
          >
            Unicode styles <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="text-slate-300 dark:text-dark-600">·</span>
          <Link
            to="/nickname-symbols"
            className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline underline-offset-4"
          >
            Symbols <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="text-slate-300 dark:text-dark-600">·</span>
          <Link
            to="/gamer-bio-generator"
            className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline underline-offset-4"
          >
            Bio lines <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          <div className="space-y-6 order-2 lg:order-1">
            <div className="space-y-2">
              <Label htmlFor="kit-label">Kit label (optional)</Label>
              <Input
                id="kit-label"
                value={kit.kitLabel}
                onChange={(e) => applyKit({ kitLabel: e.target.value })}
                placeholder="e.g. Stream · main"
                className="bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary">Primary read</Label>
              <Input
                id="primary"
                value={kit.primaryAlias}
                onChange={(e) => applyKit({ primaryAlias: e.target.value })}
                placeholder="Plain spelling · how you say it"
                className="bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="styled">Styled display (optional)</Label>
              <Input
                id="styled"
                value={kit.styledAlias}
                onChange={(e) => applyKit({ styledAlias: e.target.value })}
                placeholder="Paste from Stylish Text — Unicode treatment"
                className="bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-700 font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="symbols">Symbol line (optional)</Label>
              <Input
                id="symbols"
                value={kit.symbolLine}
                onChange={(e) => applyKit({ symbolLine: e.target.value })}
                placeholder="Marks · separators · decoration"
                className="bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio line (optional)</Label>
              <Textarea
                id="bio"
                value={kit.bioLine}
                onChange={(e) => applyKit({ bioLine: e.target.value })}
                placeholder="One line for profile or status — calm beats noisy"
                rows={3}
                className="bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-700 resize-y min-h-[88px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Artifact layout</Label>
              <select
                value={kit.artifactLayout}
                onChange={(e) => applyKit({ artifactLayout: e.target.value })}
                className="w-full h-10 rounded-md border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 px-3 text-sm"
              >
                {ARTIFACT_LAYOUTS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 dark:text-dark-500 leading-snug">
                Two templates — vertical for profiles, banner for wide surfaces.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Surface</Label>
                <select
                  value={kit.surfaceId}
                  onChange={(e) => applyKit({ surfaceId: e.target.value })}
                  className="w-full h-10 rounded-md border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 px-3 text-sm"
                >
                  {IDENTITY_SURFACES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 dark:text-dark-500 leading-snug">
                  {IDENTITY_SURFACES.find((s) => s.id === kit.surfaceId)?.hint}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Mood</Label>
                <select
                  value={kit.moodId}
                  onChange={(e) => applyKit({ moodId: e.target.value })}
                  className="w-full h-10 rounded-md border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 px-3 text-sm"
                >
                  {IDENTITY_MOODS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Readability</Label>
                <select
                  value={kit.readabilityTier}
                  onChange={(e) => applyKit({ readabilityTier: e.target.value })}
                  className="w-full h-10 rounded-md border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 px-3 text-sm"
                >
                  {READABILITY_TIERS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="button" onClick={handleExportPng} className="gap-2">
                <Download className="w-4 h-4" />
                Download PNG
              </Button>
              <Button type="button" variant="secondary" onClick={handleExportSvg} className="gap-2">
                <Download className="w-4 h-4" />
                Download SVG
              </Button>
              <Button type="button" variant="outline" onClick={handleCopyBundle} className="gap-2">
                <Copy className="w-4 h-4" />
                Copy text bundle
              </Button>
              <Button type="button" variant="ghost" onClick={handleReset} className="gap-2 text-muted-foreground">
                <Trash2 className="w-4 h-4" />
                Reset
              </Button>
            </div>

            <details className="rounded-xl border border-slate-200 dark:border-dark-700 bg-white/80 dark:bg-dark-900/80 p-4 text-sm">
              <summary className="cursor-pointer font-medium text-slate-800 dark:text-dark-200">
                Preview bundle text
              </summary>
              <pre className="mt-3 whitespace-pre-wrap text-xs text-slate-600 dark:text-dark-400 leading-relaxed font-mono">
                {bundleText}
              </pre>
            </details>
          </div>

          <div className="order-1 lg:order-2 lg:sticky lg:top-24">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-dark-500 mb-4">
              Artifact preview
            </p>
            <div className="rounded-[1.15rem] p-3 sm:p-4 bg-slate-100/65 dark:bg-dark-900/25 ring-1 ring-slate-200/75 dark:ring-white/[0.06]">
              <IdentityKitArtifact ref={cardRef} kit={kit} />
            </div>
            <IdentityCultureNote kit={kit} />
            <p className="mt-4 text-xs text-slate-500 dark:text-dark-500 leading-relaxed max-w-[520px] mx-auto text-center">
              Saved only on this device. No accounts — export if you want a backup.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IdentityKitPage;
