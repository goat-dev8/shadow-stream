import { Router } from 'express';
import { createAgent, getAgents } from '../controllers/agentsController.js';

const router = Router();

// POST /api/agents - Create an agent credential
router.post('/', createAgent);

// GET /api/agents - Get all agents for an org
router.get('/', getAgents);

export default router;
