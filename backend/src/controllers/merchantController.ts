import { Request, Response } from 'express';
import { getMerchantRegistry, executorSigner } from '../blockchain/index.js';
import { prisma } from '../db/index.js';

interface CreateMerchantApiBody {
    adminAddress: string;
    payoutAddress: string;
    apiName: string;
    baseUrl: string;
    pricePerCall: string;
    chainId: number;
    tokenAddress: string;
}

export async function createMerchantApi(req: Request, res: Response) {
    try {
        const body = req.body as CreateMerchantApiBody;
        const {
            adminAddress,
            payoutAddress,
            apiName,
            baseUrl,
            pricePerCall,
            chainId,
            tokenAddress,
        } = body;

        if (!adminAddress || !payoutAddress || !apiName || !baseUrl || !pricePerCall) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Enforce Polygon mainnet only
        if (chainId !== 137) {
            return res.status(400).json({ error: 'Only Polygon mainnet (chainId 137) is supported' });
        }

        const registry = getMerchantRegistry();

        // Check if admin already has a merchant ID
        let merchantId = Number(await registry.merchantIdByAdmin(adminAddress));

        if (merchantId === 0) {
            // Register new merchant on-chain
            if (!executorSigner) {
                return res.status(500).json({ error: 'Executor signer not configured' });
            }

            console.log(`Registering merchant for admin ${adminAddress}`);
            const tx = await registry.registerMerchant(payoutAddress);
            const receipt = await tx.wait();

            // Parse MerchantRegistered event
            const event = receipt.logs
                .map((log: any) => {
                    try {
                        return registry.interface.parseLog(log);
                    } catch {
                        return null;
                    }
                })
                .find((e: any) => e?.name === 'MerchantRegistered');

            if (!event) {
                throw new Error('MerchantRegistered event not found');
            }

            merchantId = Number(event.args.merchantId);
        }

        // Store API info in database
        const merchantApi = await prisma.merchantApi.create({
            data: {
                merchantId,
                adminAddress,
                apiName,
                baseUrl,
                pricePerCall,
                chainId,
                tokenAddress,
            },
        });

        return res.json({
            success: true,
            merchantApi,
            merchantId,
        });
    } catch (error: any) {
        console.error('Error creating merchant API:', error);
        return res.status(500).json({ error: error.message });
    }
}

export async function getMerchantApis(req: Request, res: Response) {
    try {
        const adminAddress = req.headers['x-merchant-admin-address'] as string;

        if (!adminAddress) {
            return res.status(400).json({ error: 'Missing x-merchant-admin-address header' });
        }

        const apis = await prisma.merchantApi.findMany({
            where: { adminAddress },
            orderBy: { createdAt: 'desc' },
        });

        return res.json({ apis });
    } catch (error: any) {
        console.error('Error getting merchant APIs:', error);
        return res.status(500).json({ error: error.message });
    }
}
