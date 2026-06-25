export const SAVED_NAMES_SELECT_COLUMNS = [
  'id',
  'owner_id',
  'name',
  'name_key',
  'source_path',
  'source_label',
  'category',
  'keyword',
  'created_at',
  'updated_at',
  'last_used_at',
  'copy_count',
].join(',');

export function mapSavedNameRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    nameKey: row.name_key,
    sourcePath: row.source_path || '',
    sourceLabel: row.source_label || '',
    category: row.category || '',
    keyword: row.keyword || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastUsedAt: row.last_used_at,
    copyCount: Number(row.copy_count || 0),
  };
}

export function buildSavedNamePayload(ownerId, input = {}) {
  const validation = validateSavedNameInput(input);
  if (!validation.ok) {
    const error = new Error('Invalid saved name input.');
    error.validationErrors = validation.errors;
    throw error;
  }

  return {
    owner_id: ownerId,
    name: validation.value.name,
    name_key: validation.value.nameKey,
    source_path: validation.value.sourcePath || null,
    source_label: validation.value.sourceLabel || null,
    category: validation.value.category || null,
    keyword: validation.value.keyword || null,
    last_used_at: validation.value.lastUsedAt || null,
    copy_count: validation.value.copyCount,
  };
}

export function validateSavedNameInput(input = {}) {
  const errors = {};
  const name = cleanString(input.name);
  const nameKey = normalizeSavedNameKey(input.nameKey || name);
  const sourcePath = cleanString(input.sourcePath || input.source_path);
  const sourceLabel = cleanString(input.sourceLabel || input.source_label);
  const category = cleanString(input.category);
  const keyword = cleanString(input.keyword);
  const lastUsedAt = cleanString(input.lastUsedAt || input.last_used_at);
  const copyCount = normalizeCopyCount(input.copyCount ?? input.copy_count);

  if (name.length < 1 || name.length > 80) errors.name = 'Saved name must be 1-80 characters.';
  if (nameKey.length < 1 || nameKey.length > 96) errors.nameKey = 'Saved name key must be 1-96 characters.';
  if (sourcePath.length > 256) errors.sourcePath = 'Source path must be 256 characters or fewer.';
  if (sourceLabel.length > 120) errors.sourceLabel = 'Source label must be 120 characters or fewer.';
  if (category.length > 80) errors.category = 'Category must be 80 characters or fewer.';
  if (keyword.length > 120) errors.keyword = 'Keyword must be 120 characters or fewer.';
  if (copyCount < 0) errors.copyCount = 'Copy count cannot be negative.';
  if (lastUsedAt && Number.isNaN(Date.parse(lastUsedAt))) errors.lastUsedAt = 'Last-used timestamp is invalid.';

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    value: {
      name,
      nameKey,
      sourcePath,
      sourceLabel,
      category,
      keyword,
      lastUsedAt,
      copyCount,
    },
  };
}

export async function listSavedNames(client, session) {
  const ownerId = getSessionOwnerId(session);
  const { data, error } = await client
    .from('saved_names')
    .select(SAVED_NAMES_SELECT_COLUMNS)
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapSavedNameRow).filter(Boolean);
}

export async function upsertSavedName(client, session, input) {
  const ownerId = getSessionOwnerId(session);
  const payload = buildSavedNamePayload(ownerId, input);

  const inserted = await insertSavedName(client, payload);
  if (inserted) return inserted;

  const updatePayload = {
    name: payload.name,
    source_path: payload.source_path,
    source_label: payload.source_label,
    category: payload.category,
    keyword: payload.keyword,
    last_used_at: payload.last_used_at,
    copy_count: payload.copy_count,
  };

  const { data, error } = await client
    .from('saved_names')
    .update(updatePayload)
    .eq('owner_id', ownerId)
    .eq('name_key', payload.name_key)
    .select(SAVED_NAMES_SELECT_COLUMNS)
    .maybeSingle();

  if (error) throw error;
  const row = mapSavedNameRow(data);
  if (!row) throw new Error('Saved name upsert did not return a row.');
  return row;
}

export async function deleteSavedName(client, session, savedNameId) {
  const ownerId = getSessionOwnerId(session);
  const id = cleanString(savedNameId);
  if (!id) return false;

  const { error } = await client
    .from('saved_names')
    .delete()
    .eq('owner_id', ownerId)
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function deleteSavedNameByName(client, session, name) {
  const ownerId = getSessionOwnerId(session);
  const nameKey = normalizeSavedNameKey(name);
  if (!nameKey) return false;

  const { error } = await client
    .from('saved_names')
    .delete()
    .eq('owner_id', ownerId)
    .eq('name_key', nameKey);

  if (error) throw error;
  return true;
}

export async function syncLocalFavoriteNamesToAccount(client, session, names = []) {
  const uniqueNames = uniqNames(names);
  for (const name of uniqueNames) {
    await upsertSavedName(client, session, { name });
  }
  return listSavedNames(client, session);
}

export function normalizeSavedNameKey(value) {
  return cleanString(value).replace(/\s+/g, ' ').toLowerCase();
}

async function insertSavedName(client, payload) {
  const { data, error } = await client
    .from('saved_names')
    .insert(payload)
    .select(SAVED_NAMES_SELECT_COLUMNS)
    .maybeSingle();

  if (!error) {
    const row = mapSavedNameRow(data);
    if (!row) throw new Error('Saved name insert did not return a row.');
    return row;
  }

  if (isUniqueNameConflict(error)) return null;
  throw error;
}

function getSessionOwnerId(session) {
  const ownerId = session?.user?.id;
  if (!ownerId) {
    throw new Error('A signed-in Parent Auth session is required.');
  }
  return ownerId;
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeCopyCount(value) {
  const count = Number(value || 0);
  if (!Number.isFinite(count)) return -1;
  return Math.trunc(count);
}

function uniqNames(names) {
  const byKey = new Map();
  for (const name of names || []) {
    const clean = cleanString(name);
    const key = normalizeSavedNameKey(clean);
    if (clean && key && !byKey.has(key)) byKey.set(key, clean);
  }
  return [...byKey.values()];
}

function isUniqueNameConflict(error) {
  return error?.code === '23505' || /duplicate key/i.test(String(error?.message || ''));
}
