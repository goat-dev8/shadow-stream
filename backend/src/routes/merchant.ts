import { Router } from 'express';
import {
    createMerchantApi,
    getMerchantApis,
} from '../controllers/merchantController.js';

const router = Router();

// POST /api/merchant/apis - Register a merchant API
router.post('/apis', createMerchantApi);

// GET /api/merchant/apis - Get all APIs for a merchant
router.get('/apis', getMerchantApis);

export default router;
