import { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { prisma } from '../db/index.js';

interface CreateAgentBody {
    orgAddress: string;
    name: string;
    description?: string;
    allowedVaults: string[];
}

export async function createAgent(req: Request, res: Response) {
    try {
        const { orgAddress, name, description, allowedVaults } = req.body as CreateAgentBody;

        if (!orgAddress || !name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Generate secure agent key
        const agentKey = `ss_agent_${randomBytes(32).toString('hex')}`;

        const agent = await prisma.agent.create({
            data: {
                orgAddress,
                name,
                description: description || null,
                agentKey,
                allowedVaultAddresses: JSON.stringify(allowedVaults || []),
            },
        });

        // Return the agent key only once - never again
        return res.json({
            success: true,
            agentKey,
            agent: {
                id: agent.id,
                name: agent.name,
                description: agent.description,
                orgAddress: agent.orgAddress,
                createdAt: agent.createdAt,
            },
        });
    } catch (error: any) {
        console.error('Error creating agent:', error);
        return res.status(500).json({ error: error.message });
    }
}

export async function getAgents(req: Request, res: Response) {
    try {
        const orgAddress = req.headers['x-org-address'] as string;

        if (!orgAddress) {
            return res.status(400).json({ error: 'Missing x-org-address header' });
        }

        const agents = await prisma.agent.findMany({
            where: { orgAddress },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                description: true,
                orgAddress: true,
                allowedVaultAddresses: true,
                createdAt: true,
                // Mask the agentKey - only show first/last 8 chars
                agentKey: true,
            },
        });

        // Mask agent keys
        const maskedAgents = agents.map((agent) => ({
            ...agent,
            agentKey: `${agent.agentKey.slice(0, 12)}...${agent.agentKey.slice(-8)}`,
            allowedVaultAddresses: JSON.parse(agent.allowedVaultAddresses),
        }));

        return res.json({ agents: maskedAgents });
    } catch (error: any) {
        console.error('Error getting agents:', error);
        return res.status(500).json({ error: error.message });
    }
}
