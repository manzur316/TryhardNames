import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ADSENSE_ENABLED, isProgrammaticSeoPath } from '@/config/adsPhase1.js';

/**
 * Hueco reservado para AdSense Fase 1 (after-content en páginas programáticas).
 * Con `ADSENSE_ENABLED === false` no renderiza anuncios ni carga scripts.
 */
export default function AdSlot({ variant = 'after-content' }) {
  const { pathname } = useLocation();
  const allowed = useMemo(() => isProgrammaticSeoPath(pathname), [pathname]);

  if (!ADSENSE_ENABLED || !allowed) {
    return null;
  }

  return (
    <aside
      className="mx-auto w-full max-w-4xl min-h-[250px] px-4 md:min-h-[280px]"
      data-ad-slot={variant}
      aria-hidden="true"
    >
      {/* Tras aprobación: ins.adsbygoogle + push según política AdSense */}
    </aside>
  );
}
