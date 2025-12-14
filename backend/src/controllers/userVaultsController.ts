import { Request, Response } from 'express';
import { ethers } from 'ethers';
import {
    getPolicyVaultFactory,
    getPolicyVault,
    getERC20Token,
    getExecutorAddress,
} from '../blockchain/index.js';
import { prisma } from '../db/index.js';

interface CreateVaultBody {
    userAddress: string;
    tokenAddress: string;
    maxPerTx: string;
    dailyLimit: string;
}

export async function createVault(req: Request, res: Response) {
    try {
        const { userAddress, tokenAddress, maxPerTx, dailyLimit } = req.body as CreateVaultBody;

        if (!userAddress || !tokenAddress || !maxPerTx || !dailyLimit) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const factory = getPolicyVaultFactory();
        const executorAddress = getExecutorAddress();

        // Parse amounts to wei (assuming 6 decimals for USDC/USDT)
        const maxPerTxWei = ethers.parseUnits(maxPerTx, 6);
        const dailyLimitWei = ethers.parseUnits(dailyLimit, 6);

        console.log(`Creating vault for ${userAddress} with token ${tokenAddress}`);
        console.log(`Max per tx: ${maxPerTx}, Daily limit: ${dailyLimit}`);

        const tx = await factory.createPolicyVault(
            tokenAddress,
            maxPerTxWei,
            dailyLimitWei,
            executorAddress
        );

        const receipt = await tx.wait();

        // Parse the PolicyVaultCreated event
        const event = receipt.logs
            .map((log: any) => {
                try {
                    return factory.interface.parseLog(log);
                } catch {
                    return null;
                }
            })
            .find((e: any) => e?.name === 'PolicyVaultCreated');

        if (!event) {
            throw new Error('PolicyVaultCreated event not found');
        }

        const vaultAddress = event.args.vault;

        return res.json({
            success: true,
            vaultAddress,
            txHash: receipt.hash,
        });
    } catch (error: any) {
        console.error('Error creating vault:', error);
        return res.status(500).json({ error: error.message });
    }
}

export async function getUserVaults(req: Request, res: Response) {
    try {
        const userAddress = req.headers['x-user-address'] as string || req.query.userAddress as string;

        if (!userAddress) {
            return res.status(400).json({ error: 'Missing x-user-address header' });
        }

        const factory = getPolicyVaultFactory();
        const vaultAddresses: string[] = await factory.getUserVaults(userAddress);

        const vaults = await Promise.all(
            vaultAddresses.map(async (address) => {
                const vault = getPolicyVault(address);
                const tokenAddress = await vault.token();
                const token = getERC20Token(tokenAddress);

                const [
                    owner,
                    trustedExecutor,
                    maxPerTx,
                    dailyLimit,
                    spentToday,
                    lastReset,
                    balance,
                    symbol,
                    decimals,
                ] = await Promise.all([
                    vault.owner(),
                    vault.trustedExecutor(),
                    vault.maxPerTx(),
                    vault.dailyLimit(),
                    vault.spentToday(),
                    vault.lastReset(),
                    token.balanceOf(address),
                    token.symbol(),
                    token.decimals(),
                ]);

                return {
                    address,
                    owner,
                    tokenAddress,
                    tokenSymbol: symbol,
                    trustedExecutor,
                    maxPerTx: ethers.formatUnits(maxPerTx, decimals),
                    dailyLimit: ethers.formatUnits(dailyLimit, decimals),
                    spentToday: ethers.formatUnits(spentToday, decimals),
                    balance: ethers.formatUnits(balance, decimals),
                    lastReset: Number(lastReset),
                };
            })
        );

        return res.json({ vaults });
    } catch (error: any) {
        console.error('Error getting user vaults:', error);
        return res.status(500).json({ error: error.message });
    }
}

export async function getVaultActivity(req: Request, res: Response) {
    try {
        const { vaultAddress } = req.params;

        if (!vaultAddress) {
            return res.status(400).json({ error: 'Missing vaultAddress' });
        }

        const activities = await prisma.vaultActivity.findMany({
            where: { vaultAddress },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });

        return res.json({ activities });
    } catch (error: any) {
        console.error('Error getting vault activity:', error);
        return res.status(500).json({ error: error.message });
    }
}
