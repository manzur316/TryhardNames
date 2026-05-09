let lastCopyAtMs = 0;

function nowMs() {
  return Date.now();
}

function canCopy(preventRepeatMs) {
  const t = nowMs();
  if (t - lastCopyAtMs < preventRepeatMs) return false;
  lastCopyAtMs = t;
  return true;
}

function fallbackCopy(text) {
  const value = String(text ?? '');
  const ta = document.createElement('textarea');
  ta.value = value;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  ta.style.top = '0';
  document.body.appendChild(ta);
  ta.select();
  ta.setSelectionRange(0, ta.value.length);
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}

/**
 * Copy text to clipboard with lightweight fallback + anti-spam.
 * Returns { ok, method } where method is 'clipboard' | 'execCommand' | 'denied'
 */
export async function copyTextToClipboard(text, opts = {}) {
  const value = String(text ?? '');
  const preventRepeatMs = typeof opts.preventRepeatMs === 'number' ? opts.preventRepeatMs : 450;
  const vibrateMs = typeof opts.vibrateMs === 'number' ? opts.vibrateMs : 12;

  if (typeof window === 'undefined') return { ok: false, method: 'denied' };
  if (!value.trim()) return { ok: false, method: 'denied' };
  if (!canCopy(preventRepeatMs)) return { ok: false, method: 'denied' };

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      if (vibrateMs > 0 && navigator?.vibrate) navigator.vibrate(vibrateMs);
      return { ok: true, method: 'clipboard' };
    }
  } catch {
    // fall through
  }

  try {
    const ok = fallbackCopy(value);
    if (ok && vibrateMs > 0 && navigator?.vibrate) navigator.vibrate(vibrateMs);
    return { ok, method: ok ? 'execCommand' : 'denied' };
  } catch {
    return { ok: false, method: 'denied' };
  }
}

