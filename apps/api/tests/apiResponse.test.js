import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fail, ok } from '../src/shared/apiResponse.js';

describe('apiResponse helpers', () => {
  it('builds success responses without mutating payloads', () => {
    const payload = { id: 'sample', count: 2 };
    assert.deepEqual(ok(payload), { ok: true, id: 'sample', count: 2 });
    assert.deepEqual(payload, { id: 'sample', count: 2 });
  });

  it('builds failure responses with details', () => {
    assert.deepEqual(fail('bad_request', { field: 'name' }), {
      ok: false,
      error: 'bad_request',
      field: 'name',
    });
  });
});
