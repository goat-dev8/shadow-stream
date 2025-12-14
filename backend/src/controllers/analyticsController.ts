import { Request, Response } from 'express';
import { prisma } from '../db/index.js';
import { getPolicyVaultFactory } from '../blockchain/index.js';

export async function getUserAnalytics(req: Request, res: Response) {
    try {
        const userAddress = req.headers['x-user-address'] as string;

        if (!userAddress) {
            return res.status(400).json({ error: 'Missing x-user-address header' });
        }

        // Get user's vaults
        const factory = getPolicyVaultFactory();
        const vaultAddresses: string[] = await factory.getUserVaults(userAddress);

        const emptyResponse = {
            totalSpend30d: 0,
            activeVaults: vaultAddresses.length,
            avgSpendPerDay: 0,
            dailySeries: [],
            topMerchants: [],
            recentTransactions: [],
        };

        if (vaultAddresses.length === 0) {
            return res.json(emptyResponse);
        }

        // Get activities from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const activities = await prisma.vaultActivity.findMany({
            where: {
                vaultAddress: { in: vaultAddresses },
                createdAt: { gte: thirtyDaysAgo },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Filter for successful spends for totals
        const successfulActivities = activities.filter(a => a.status === 'success');

        // Calculate totals
        const totalSpend30d = successfulActivities.reduce((sum, a) => sum + parseFloat(a.amount), 0);
        const avgSpendPerDay = totalSpend30d / 30;

        // Group by date for daily series
        const dailyMap = new Map<string, number>();
        for (const activity of successfulActivities) {
            const date = activity.createdAt.toISOString().split('T')[0];
            dailyMap.set(date, (dailyMap.get(date) || 0) + parseFloat(activity.amount));
        }

        const dailySeries = Array.from(dailyMap.entries())
            .map(([date, spend]) => ({ date, spend }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // Group by merchant (and try to find a name)
        const merchantIds = [...new Set(activities.map(a => a.merchantId))];
        const merchantApis = await prisma.merchantApi.findMany({
            where: { merchantId: { in: merchantIds } },
            select: { merchantId: true, apiName: true },
        });
        const merchantNameMap = new Map(merchantApis.map(m => [m.merchantId, m.apiName]));

        const merchantMap = new Map<number, { spend: number, calls: number }>();
        for (const activity of successfulActivities) {
            const current = merchantMap.get(activity.merchantId) || { spend: 0, calls: 0 };
            current.spend += parseFloat(activity.amount);
            current.calls += 1;
            merchantMap.set(activity.merchantId, current);
        }

        const topMerchants = Array.from(merchantMap.entries())
            .map(([merchantId, stats]) => ({
                id: merchantId,
                name: merchantNameMap.get(merchantId) || `Merchant #${merchantId}`,
                category: 'API Service',
                spend: stats.spend,
                calls: stats.calls
            }))
            .sort((a, b) => b.spend - a.spend)
            .slice(0, 5);

        // Recent transactions
        // Note: activities is already sorted desc
        // We need to map merchant names here too
        const recentTransactions = activities.slice(0, 10).map(a => ({
            id: a.id,
            merchantName: merchantNameMap.get(a.merchantId) || `Merchant #${a.merchantId}`,
            agentName: 'Agent', // Placeholder in DB, could fetch Agent table if linked
            vaultAddress: a.vaultAddress,
            amount: a.amount,
            status: a.status,
            createdAt: a.createdAt,
        }));

        return res.json({
            totalSpend30d,
            activeVaults: vaultAddresses.length,
            avgSpendPerDay,
            dailySeries,
            topMerchants,
            recentTransactions,
        });
    } catch (error: any) {
        console.error('Error getting user analytics:', error);
        return res.status(500).json({ error: error.message });
    }
}

export async function getMerchantAnalytics(req: Request, res: Response) {
    try {
        const adminAddress = req.headers['x-merchant-admin-address'] as string;

        if (!adminAddress) {
            return res.status(400).json({ error: 'Missing x-merchant-admin-address header' });
        }

        // Get merchant's APIs
        const apis = await prisma.merchantApi.findMany({
            where: { adminAddress },
            select: { merchantId: true },
        });

        const merchantIds = [...new Set(apis.map((a) => a.merchantId))];

        if (merchantIds.length === 0) {
            return res.json({
                totalRevenue30d: '0',
                callsPerDay: [],
                topOrgs: [],
            });
        }

        // Get activities from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const activities = await prisma.vaultActivity.findMany({
            where: {
                merchantId: { in: merchantIds },
                status: 'success',
                createdAt: { gte: thirtyDaysAgo },
            },
        });

        // Calculate total revenue
        const totalRevenue30d = activities.reduce((sum, a) => sum + parseFloat(a.amount), 0);

        // Group by date for call counts
        const dailyMap = new Map<string, number>();
        for (const activity of activities) {
            const date = activity.createdAt.toISOString().split('T')[0];
            dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
        }

        const callsPerDay = Array.from(dailyMap.entries())
            .map(([date, calls]) => ({ date, calls }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // Top orgs by vault address (masked)
        const orgMap = new Map<string, number>();
        for (const activity of activities) {
            const masked = `${activity.vaultAddress.slice(0, 6)}...${activity.vaultAddress.slice(-4)}`;
            orgMap.set(masked, (orgMap.get(masked) || 0) + parseFloat(activity.amount));
        }

        const topOrgs = Array.from(orgMap.entries())
            .map(([address, revenue]) => ({ address, revenue }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        return res.json({
            totalRevenue30d: totalRevenue30d.toFixed(6),
            callsPerDay,
            topOrgs,
        });
    } catch (error: any) {
        console.error('Error getting merchant analytics:', error);
        return res.status(500).json({ error: error.message });
    }
}
