import { Router } from 'express';
import {
  getExportContractMetadata,
  normalizeExportPayload,
  parseExportRenderQuery,
} from '../../services/export/exportPayload.js';
import { buildExportArtifact } from '../../services/export/exportArtifact.js';
import {
  renderExportPngBuffer,
  renderExportSvgString,
} from '../../services/export/deterministicRender.js';
import {
  buildTrustedExportRenderUrl,
  pickImageRenderFormat,
} from '../../services/export/exportTrustedUrl.js';
import { fail, ok } from '../../shared/apiResponse.js';

const r = Router();

const RENDER_CACHE_CONTROL = 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800';

function setRenderHeaders(res, contentType) {
  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', RENDER_CACHE_CONTROL);
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

/**
 * Export contract discovery for n8n and render consumers.
 */
r.get('/', (req, res) => {
  res.json(ok({
    layer: 'export-contracts',
    renderer: 'deterministic',
    contract: getExportContractMetadata(),
  }));
});

/**
 * Deterministic image bytes for Pinterest / public fetch (no Chromium).
 */
r.get('/render', async (req, res) => {
  const parsed = parseExportRenderQuery(req.query);
  if (!parsed.ok) {
    return res.status(400).json(fail(parsed.error));
  }

  const { value: normalized } = parsed;
  try {
    if (normalized.format === 'svg') {
      const svg = renderExportSvgString(normalized.payload.name);
      setRenderHeaders(res, 'image/svg+xml; charset=utf-8');
      return res.status(200).send(svg);
    }

    const png = await renderExportPngBuffer(normalized.payload.name);
    setRenderHeaders(res, 'image/png');
    return res.status(200).send(png);
  } catch (err) {
    return res.status(500).json(fail('render_failed', { detail: String(err?.message || err) }));
  }
});

/**
 * Preview: normalized payload + artifact + trusted imageUrl (render endpoint).
 */
r.post('/preview', (req, res) => {
  const parsed = normalizeExportPayload(req.body);
  if (!parsed.ok) {
    return res.status(400).json(fail(parsed.error));
  }

  const imageRenderFormat = pickImageRenderFormat(parsed.value);
  const imageUrl = buildTrustedExportRenderUrl(req, parsed.value, imageRenderFormat);
  const artifact = buildExportArtifact({
    normalized: parsed.value,
    imageUrl,
    imageRenderFormat,
  });

  res.json(ok({
    artifact,
    imageUrl,
    normalized: parsed.value,
    hasArtifact: true,
    hasImageUrl: true,
    ignoredClientImageUrl: parsed.ignoredClientImageUrl,
    publishReadiness: { ready: true },
    stoppedBeforePublish: false,
  }));
});

export default r;
