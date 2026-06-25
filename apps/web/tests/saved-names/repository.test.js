import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildSavedNamePayload,
  normalizeSavedNameKey,
  validateSavedNameInput,
} from '../../src/saved-names/data/savedNamesRepository.js';

describe('saved names repository contract', () => {
  it('validates and trims saved name input', () => {
    const result = validateSavedNameInput({
      name: '  Clutch Star  ',
      sourcePath: '  /valorant/sweaty  ',
      sourceLabel: '  Valorant Sweaty  ',
      category: ' valorant ',
      keyword: ' sweaty ',
    });

    assert.equal(result.ok, true);
    assert.equal(result.value.name, 'Clutch Star');
    assert.equal(result.value.nameKey, 'clutch star');
    assert.equal(result.value.sourcePath, '/valorant/sweaty');
    assert.equal(result.value.sourceLabel, 'Valorant Sweaty');
    assert.equal(result.value.category, 'valorant');
    assert.equal(result.value.keyword, 'sweaty');
  });

  it('rejects blank, oversized, and negative inputs', () => {
    assert.equal(validateSavedNameInput({ name: '   ' }).ok, false);
    assert.equal(validateSavedNameInput({ name: 'A'.repeat(81) }).ok, false);
    assert.equal(validateSavedNameInput({ name: 'Valid', nameKey: 'k'.repeat(97) }).ok, false);
    assert.equal(validateSavedNameInput({ name: 'Valid', copyCount: -1 }).ok, false);
  });

  it('normalizes name_key for owner uniqueness without changing the copied name', () => {
    assert.equal(normalizeSavedNameKey('  Clutch   Star  '), 'clutch star');
    const payload = buildSavedNamePayload('owner-1', { name: '  Clutch   Star  ' });

    assert.equal(payload.owner_id, 'owner-1');
    assert.equal(payload.name, 'Clutch   Star');
    assert.equal(payload.name_key, 'clutch star');
  });

  it('builds only the safe saved_names payload fields', () => {
    const payload = buildSavedNamePayload('owner-1', {
      name: 'NoScope',
      sourcePath: '/cod/sweaty',
      sourceLabel: 'COD Sweaty',
      category: 'cod',
      keyword: 'sweaty',
      rawPayload: { token: 'nope' },
      provider: 'riot',
      discordAccessToken: 'secret',
    });

    assert.deepEqual(Object.keys(payload).sort(), [
      'category',
      'copy_count',
      'keyword',
      'last_used_at',
      'name',
      'name_key',
      'owner_id',
      'source_label',
      'source_path',
    ]);
    assert.equal(JSON.stringify(payload).includes('secret'), false);
    assert.equal(JSON.stringify(payload).includes('rawPayload'), false);
    assert.equal(JSON.stringify(payload).includes('riot'), false);
  });
});
