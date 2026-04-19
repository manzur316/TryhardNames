import { Router } from 'express';
import healthCheckController from '../controllers/healthCheckController.js';

const router = Router();

router.get('/', (req, res) => healthCheckController.getHealth(req, res));

export default router;