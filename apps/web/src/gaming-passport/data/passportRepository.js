export const PASSPORT_SELECT_COLUMNS = [
  'id',
  'owner_id',
  'slug',
  'status',
  'alias',
  'avatar_url',
  'bio_short',
  'publication_consent',
  'scene_config',
  'created_at',
  'updated_at',
  'published_at',
  'unpublished_at',
  'suspended_at',
].join(',');

export const DEFAULT_SCENE_CONFIG = Object.freeze({
  layout: 'classic',
  accent: 'cyan',
  density: 'comfortable',
  featuredSavedNames: Object.freeze([]),
});

export const SCENE_CONFIG_OPTIONS = Object.freeze({
  layout: Object.freeze(['classic', 'compact']),
  accent: Object.freeze(['cyan', 'violet', 'emerald', 'amber']),
  density: Object.freeze(['comfortable', 'dense']),
});

export const MAX_FEATURED_SAVED_NAMES = 5;
export const MAX_FEATURED_SAVED_NAME_LENGTH = 80;

export function mapPassportRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    ownerId: row.owner_id,
    slug: row.slug,
    status: row.status,
    alias: row.alias || '',
    avatarUrl: row.avatar_url || '',
    bioShort: row.bio_short || '',
    publicationConsent: Boolean(row.publication_consent),
    sceneConfig: sanitizeSceneConfig(row.scene_config),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
    unpublishedAt: row.unpublished_at,
    suspendedAt: row.suspended_at,
  };
}

export function mapPassportToPresentationForm(passport) {
  return {
    alias: passport?.alias || '',
    avatarUrl: passport?.avatarUrl || '',
    bioShort: passport?.bioShort || '',
    sceneConfig: sanitizeSceneConfig(passport?.sceneConfig),
  };
}

export function shouldLoadDraftForOwner({ isConfigured, ownerId, loadedOwnerId, isDirty = false }) {
  if (!isConfigured || !ownerId) return false;
  if (isDirty && ownerId === loadedOwnerId) return false;
  return ownerId !== loadedOwnerId;
}

export async function getOwnedPassport(client, session) {
  const ownerId = getSessionOwnerId(session);
  const { data, error } = await client
    .from('gaming_passports')
    .select(PASSPORT_SELECT_COLUMNS)
    .eq('owner_id', ownerId)
    .maybeSingle();

  if (error) throw error;
  return mapPassportRow(data);
}

export async function createPrivateDraft(client, session, input = {}) {
  const ownerId = getSessionOwnerId(session);
  const payload = buildCreateDraftPayload(ownerId, input);
  const { data, error } = await client
    .from('gaming_passports')
    .insert(payload)
    .select(PASSPORT_SELECT_COLUMNS)
    .maybeSingle();

  if (error) throw error;
  const passport = mapPassportRow(data);
  if (!passport) throw new Error('Passport creation did not return a row.');
  return passport;
}

export async function getOrCreatePrivateDraft(client, session, input = {}) {
  const existing = await getOwnedPassport(client, session);
  if (existing) return existing;

  try {
    return await createPrivateDraft(client, session, input);
  } catch (error) {
    if (!isUniqueOwnerConflict(error)) throw error;
    const recovered = await getOwnedPassport(client, session);
    if (recovered) return recovered;
    throw error;
  }
}

export async function updatePassportPresentation(client, session, passportId, input) {
  const ownerId = getSessionOwnerId(session);
  const payload = buildPresentationPayload(input);
  const { data, error } = await client
    .from('gaming_passports')
    .update(payload)
    .eq('id', passportId)
    .eq('owner_id', ownerId)
    .select(PASSPORT_SELECT_COLUMNS)
    .maybeSingle();

  if (error) throw error;
  const passport = mapPassportRow(data);
  if (!passport) throw new Error('Passport update did not return a row.');
  return passport;
}

export function buildCreateDraftPayload(ownerId, input = {}) {
  return {
    owner_id: ownerId,
    ...buildPresentationPayload(input),
  };
}

export function buildPresentationPayload(input = {}) {
  const presentation = validatePresentationInput(input);
  if (!presentation.ok) {
    const error = new Error('Invalid Passport presentation fields.');
    error.validationErrors = presentation.errors;
    throw error;
  }

  return {
    alias: presentation.value.alias || null,
    avatar_url: presentation.value.avatarUrl || null,
    bio_short: presentation.value.bioShort || null,
    scene_config: presentation.value.sceneConfig,
  };
}

export function validatePresentationInput(input = {}) {
  const errors = {};
  const alias = cleanString(input.alias);
  const avatarUrl = cleanString(input.avatarUrl);
  const bioShort = cleanString(input.bioShort);
  const sceneConfig = sanitizeSceneConfig(input.sceneConfig);

  if (alias.length > 64) errors.alias = 'Alias must be 64 characters or fewer.';
  if (avatarUrl.length > 500) errors.avatarUrl = 'Avatar URL must be 500 characters or fewer.';
  if (avatarUrl && !isHttpUrl(avatarUrl)) errors.avatarUrl = 'Avatar URL must start with http or https.';
  if (bioShort.length > 200) errors.bioShort = 'Bio must be 200 characters or fewer.';

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    value: {
      alias,
      avatarUrl,
      bioShort,
      sceneConfig,
    },
  };
}

export function sanitizeSceneConfig(sceneConfig = {}) {
  const source = sceneConfig && typeof sceneConfig === 'object' && !Array.isArray(sceneConfig)
    ? sceneConfig
    : {};

  return {
    layout: pickOption(source.layout, SCENE_CONFIG_OPTIONS.layout, DEFAULT_SCENE_CONFIG.layout),
    accent: pickOption(source.accent, SCENE_CONFIG_OPTIONS.accent, DEFAULT_SCENE_CONFIG.accent),
    density: pickOption(source.density, SCENE_CONFIG_OPTIONS.density, DEFAULT_SCENE_CONFIG.density),
    featuredSavedNames: sanitizeFeaturedSavedNames(source.featuredSavedNames),
  };
}

export function sanitizeFeaturedSavedNames(value = []) {
  if (!Array.isArray(value)) return [];

  const byKey = new Map();
  for (const item of value) {
    const name = cleanFeaturedSavedName(item);
    const key = name.toLowerCase();
    if (name && key && !byKey.has(key)) byKey.set(key, name);
    if (byKey.size >= MAX_FEATURED_SAVED_NAMES) break;
  }

  return [...byKey.values()];
}

function getSessionOwnerId(session) {
  const ownerId = session?.user?.id;
  if (!ownerId) {
    throw new Error('A signed-in Parent Auth session is required.');
  }
  return ownerId;
}

function isUniqueOwnerConflict(error) {
  return error?.code === '23505' || /duplicate key/i.test(String(error?.message || ''));
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function cleanFeaturedSavedName(value) {
  if (typeof value !== 'string') return '';
  const clean = value.trim().replace(/\s+/g, ' ');
  if (clean.length > MAX_FEATURED_SAVED_NAME_LENGTH) return '';
  return clean;
}

function isHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function pickOption(value, options, fallback) {
  return options.includes(value) ? value : fallback;
}
