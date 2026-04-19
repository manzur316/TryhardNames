import { Router } from 'express';
import contactController from '../controllers/contactController.js';

const router = Router();

router.post('/', (req, res) => contactController.submitContact(req, res));

export default router;