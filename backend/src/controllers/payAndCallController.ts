import { Request, Response } from 'express';
import { ethers } from 'ethers';
import axios from 'axios';
import { getPolicyVault, getMerchantRegistry, executorSigner } from '../blockchain/index.js';
import { prisma } from '../db/index.js';

interface PayAndCallBody {
    agentKey: string;
    vaultAddress: string;
    merchantApiId: number;
    requestPath: string;
    payload?: Record<string, any>;
}

export async function payAndCall(req: Request, res: Response) {
    try {
        const { agentKey, vaultAddress, merchantApiId, requestPath, payload } = req.body as PayAndCallBody;

        if (!agentKey || !vaultAddress || !merchantApiId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 1. Validate agent key and vault access
        const agent = await prisma.agent.findUnique({
            where: { agentKey },
        });

        if (!agent) {
            return res.status(401).json({ error: 'Invalid agent key' });
        }

        const allowedVaults: string[] = JSON.parse(agent.allowedVaultAddresses);
        if (!allowedVaults.includes(vaultAddress.toLowerCase()) &&
            !allowedVaults.includes(vaultAddress)) {
            return res.status(403).json({ error: 'Vault not authorized for this agent' });
        }

        // 2. Look up merchant API
        const merchantApi = await prisma.merchantApi.findUnique({
            where: { id: merchantApiId },
        });

        if (!merchantApi) {
            return res.status(404).json({ error: 'Merchant API not found' });
        }

        if (merchantApi.chainId !== 137) {
            return res.status(400).json({ error: 'Only Polygon mainnet is supported' });
        }

        // 3. Get merchant payout address from on-chain registry
        const registry = getMerchantRegistry();
        const [, payoutAddress, isActive] = await registry.merchants(merchantApi.merchantId);

        if (!isActive) {
            return res.status(400).json({ error: 'Merchant is not active' });
        }

        // 4. Parse price and check vault rules
        const vault = getPolicyVault(vaultAddress);
        const priceWei = ethers.parseUnits(merchantApi.pricePerCall, 6);

        const [maxPerTx, dailyLimit, spentToday] = await Promise.all([
            vault.maxPerTx(),
            vault.dailyLimit(),
            vault.spentToday(),
        ]);

        if (priceWei > maxPerTx) {
            return res.status(400).json({
                error: 'Payment exceeds max per transaction limit',
                maxPerTx: ethers.formatUnits(maxPerTx, 6),
                requested: merchantApi.pricePerCall,
            });
        }

        if (spentToday + priceWei > dailyLimit) {
            return res.status(400).json({
                error: 'Payment would exceed daily limit',
                dailyLimit: ethers.formatUnits(dailyLimit, 6),
                spentToday: ethers.formatUnits(spentToday, 6),
                requested: merchantApi.pricePerCall,
            });
        }

        // 5. Execute payment on-chain
        if (!executorSigner) {
            return res.status(500).json({ error: 'Executor signer not configured' });
        }

        console.log(`Executing payment: ${merchantApi.pricePerCall} to ${payoutAddress}`);

        // Create pending activity record
        const activity = await prisma.vaultActivity.create({
            data: {
                vaultAddress,
                merchantId: merchantApi.merchantId,
                amount: merchantApi.pricePerCall,
                tokenAddress: merchantApi.tokenAddress,
                txHash: '',
                requestUrl: `${merchantApi.baseUrl}${requestPath}`,
                status: 'pending',
            },
        });

        try {
            const tx = await vault.executePayment(payoutAddress, priceWei);
            const receipt = await tx.wait();

            // Update activity with tx hash
            await prisma.vaultActivity.update({
                where: { id: activity.id },
                data: { txHash: receipt.hash, status: 'success' },
            });

            // 6. Call the merchant API
            let apiResponse;
            try {
                const apiUrl = `${merchantApi.baseUrl}${requestPath}`;
                const response = await axios.post(apiUrl, payload || {}, {
                    headers: {
                        'x-shadowstream-paid': receipt.hash,
                        'Content-Type': 'application/json',
                    },
                    timeout: 30000,
                });
                apiResponse = response.data;
            } catch (apiError: any) {
                apiResponse = {
                    error: 'API call failed',
                    message: apiError.message,
                };
            }

            return res.json({
                success: true,
                txHash: receipt.hash,
                amount: merchantApi.pricePerCall,
                merchantApiId,
                apiResponse,
            });
        } catch (txError: any) {
            // Update activity as failed
            await prisma.vaultActivity.update({
                where: { id: activity.id },
                data: { status: 'failed' },
            });

            throw txError;
        }
    } catch (error: any) {
        console.error('Error in pay-and-call:', error);
        return res.status(500).json({ error: error.message });
    }
}
