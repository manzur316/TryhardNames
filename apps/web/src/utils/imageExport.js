import { toPng } from 'html-to-image';

export async function exportNodeToPng(node, opts = {}) {
  if (!node) throw new Error('Missing node');
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#070A12',
    ...opts,
  });
  return dataUrl;
}

export function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename || 'identity-card.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** UTF-8 SVG download — vector artifact for archives and design tools */
export function downloadSvgString(svgString, filename) {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'identity-kit.svg';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function copyPngToClipboard(dataUrl) {
  if (!navigator.clipboard || typeof window.ClipboardItem === 'undefined') return false;
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const item = new ClipboardItem({ [blob.type]: blob });
  await navigator.clipboard.write([item]);
  return true;
}

