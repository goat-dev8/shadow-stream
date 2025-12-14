import { Router } from 'express';
import { payAndCall } from '../controllers/payAndCallController.js';

const router = Router();

// POST /api/pay-and-call - Execute payment and call merchant API
router.post('/', payAndCall);

export default router;
