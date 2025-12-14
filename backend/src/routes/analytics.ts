import { Router } from 'express';
import {
    getUserAnalytics,
    getMerchantAnalytics,
} from '../controllers/analyticsController.js';

const router = Router();

// GET /api/analytics/user - Get user analytics
router.get('/user', getUserAnalytics);

// GET /api/analytics/merchant - Get merchant analytics
router.get('/merchant', getMerchantAnalytics);

export default router;
