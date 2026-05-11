import { Router } from 'express';
import meta from './meta.js';
import integrations from './integrations/index.js';
import exportsRouter from './exports.js';
import pinterestContent from './pinterestContent.js';

const r = Router();

// Specific routes first; meta describes the /api/v1 root.
r.use('/integrations', integrations);
r.use('/exports', exportsRouter);
r.use('/pinterest', pinterestContent);
r.use('/', meta);

export default r;
