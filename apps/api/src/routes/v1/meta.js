import { Router } from 'express';
import { API_LAYER, API_VERSION } from '../../core/index.js';
import { ok } from '../../shared/apiResponse.js';

const r = Router();

r.get('/', (req, res) => {
  res.json(ok({
    name: 'tryhardnames-api',
    layer: API_LAYER,
    version: API_VERSION,
    capabilities: ['export_contracts', 'integration_readiness', 'n8n_compatibility'],
    posture: 'modular_identity_infrastructure',
  }));
});

export default r;
