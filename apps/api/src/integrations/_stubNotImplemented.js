import { Router } from 'express';
import { INTEGRATION_STATUS } from '../core/index.js';
import { fail } from '../shared/apiResponse.js';

/**
 * Reserved integration router. Keeps future modules visible without fake behavior.
 */
export function createNotImplementedRouter(name) {
  const r = Router();
  r.use((req, res) => {
    res.status(501).json(fail('Integration reserved but not implemented', {
      integration: name,
      status: INTEGRATION_STATUS.RESERVED,
      path: req.originalUrl,
      hint: 'Reserved for a future identity infrastructure consumer module',
    }));
  });
  return r;
}
