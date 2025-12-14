import { Router } from 'express';
import {
    createVault,
    getUserVaults,
    getVaultActivity,
} from '../controllers/userVaultsController.js';

const router = Router();

// POST /api/user/vaults - Create a new policy vault
router.post('/', createVault);

// GET /api/user/vaults - Get all vaults for a user
router.get('/', getUserVaults);

// GET /api/user/vaults/:vaultAddress/activity - Get activity for a vault
router.get('/:vaultAddress/activity', getVaultActivity);

export default router;
