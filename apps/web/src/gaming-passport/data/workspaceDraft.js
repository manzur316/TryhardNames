import { mapPassportToPresentationForm, validatePresentationInput } from './passportRepository.js';

export const WORKSPACE_DRAFT_KEY = 'tryhardnames:passport-presentation:v1';
const LEGACY_KIT_KEY = 'tryhardnames:identity-kit:v1';

export function removeLegacyPresentationParams(search) {
  const params = new URLSearchParams(search);
  for (const key of ['primary', 'bio', 'styled', 'label']) params.delete(key);
  return params;
}

export function readWorkspaceDraft(storage, search = '') {
  let form = mapPassportToPresentationForm(null);
  let imported = false;
  try {
    const saved = storage?.getItem(WORKSPACE_DRAFT_KEY);
    if (saved) {
      const candidate = validatePresentationInput(JSON.parse(saved));
      if (candidate.ok) form = candidate.value;
    } else {
      const legacy = JSON.parse(storage?.getItem(LEGACY_KIT_KEY) || 'null');
      if (legacy && typeof legacy === 'object') {
        form = mapPassportToPresentationForm({
          alias: String(legacy.primaryAlias || '').slice(0, 64),
          bioShort: String(legacy.bioLine || '').slice(0, 200),
        });
        imported = Boolean(form.alias || form.bioShort);
      }
    }
  } catch {
    // Corrupt or unavailable browser storage must not break the public editor.
  }
  const params = new URLSearchParams(search);
  if (params.has('primary')) form.alias = params.get('primary').slice(0, 64);
  if (params.has('bio')) form.bioShort = params.get('bio').slice(0, 200);
  return { form, imported };
}

export function saveWorkspaceDraft(storage, input) {
  const result = validatePresentationInput(input);
  if (!result.ok) throw new Error('Invalid presentation.');
  if (!storage) throw new Error('Browser storage unavailable.');
  storage.setItem(WORKSPACE_DRAFT_KEY, JSON.stringify(result.value));
  return result.value;
}

export function getBrowserDraftStorage() {
  try { return window.localStorage; } catch { return null; }
}
