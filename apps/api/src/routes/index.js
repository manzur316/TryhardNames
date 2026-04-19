import { Router } from 'express';
import logger from '../utils/logger.js';
import healthCheckRouter from './health-check.js';
import contactRouter from './contact.js';
import dataRouter from './data.js';

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

  // Log registered routes on startup
  logger.info('✅ Routes registered: /health, /contact, /data');

  return router;
}