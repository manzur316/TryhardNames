import crypto from 'crypto';

function deterministicArtifactId(normalized) {
  const h = crypto.createHash('sha256')
    .update(JSON.stringify(normalized))
    .digest('hex')
    .slice(0, 24);
  return `exp_${h}`;
}

/**
 * Minimal export artifact for orchestration (n8n / controlled publish).
 */
export function buildExportArtifact({
  normalized,
  imageUrl,
  imageRenderFormat,
}) {
  const createdAt = new Date().toISOString();
  return {
    id: deterministicArtifactId(normalized),
    type: 'export-artifact',
    format: normalized.format,
    variant: normalized.variant,
    source: normalized.source,
    name: normalized.payload.name,
    imageUrl,
    contentType: imageRenderFormat === 'png' ? 'image/png' : 'image/svg+xml',
    createdAt,
    metadata: {
      deterministic: true,
      pipeline: 'export-v1',
    },
  };
}
