import React from 'react';
import { ImageResponse } from '@vercel/og';

const W = 1200;
const H = 630;

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Inline SVG only — no external URLs, images, or redirects.
 */
export function renderExportSvgString(name) {
  const safe = escapeXml(name);
  return `<?xml version="1.0" encoding="UTF-8"?>`
    + `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" `
    + `viewBox="0 0 ${W} ${H}" role="img">`
    + `<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">`
    + `<stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/>`
    + `</linearGradient></defs>`
    + `<rect width="100%" height="100%" fill="url(#bg)"/>`
    + `<text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" `
    + `fill="rgba(255,255,255,0.96)" font-size="56" font-weight="700" `
    + `font-family="system-ui,Segoe UI,sans-serif">${safe}</text>`
    + `</svg>`;
}

/**
 * PNG via @vercel/og (Satori + Resvg) — no Chromium.
 */
export async function renderExportPngBuffer(name) {
  const response = new ImageResponse(
    React.createElement(
      'div',
      {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: 'white',
          fontSize: 56,
          fontWeight: 700,
          fontFamily: 'system-ui, Segoe UI, sans-serif',
          padding: 48,
          textAlign: 'center',
        },
      },
      name,
    ),
    { width: W, height: H },
  );
  const ab = await response.arrayBuffer();
  return Buffer.from(ab);
}
