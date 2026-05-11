import { Router } from 'express';
import logger from '../utils/logger.js';
import healthCheckRouter from './health-check.js';
import contactRouter from './contact.js';
import dataRouter from './data.js';
import v1 from './v1/index.js';
import { globalRateLimit } from '../middleware/global-rate-limit.js';

export default function routes() {
  const router = Router();

  // Logging middleware for all requests
  router.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
  });

  // Register routes
  router.use('/health', healthCheckRouter);
  router.use('/contact', contactRouter);
  router.use('/data', dataRouter);

  // Modular API core: identity infrastructure, export contracts, and n8n-compatible hooks.
  router.use('/api/v1', globalRateLimit, v1);

  // Log registered routes on startup
  logger.info(
    'Routes registered: /health, /contact, /data, /api/v1 (integrations, exports, pinterest)',
  );

  return router;
}
