import { config } from './config';

/**
 * API client for ShadowStream backend
 */

const API_BASE = config.backendUrl;

interface ApiOptions {
    userAddress?: string;
    merchantAdminAddress?: string;
    orgAddress?: string;
}

async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {},
    headers: ApiOptions = {}
): Promise<T> {
    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (headers.userAddress) {
        requestHeaders['x-user-address'] = headers.userAddress;
    }
    if (headers.merchantAdminAddress) {
        requestHeaders['x-merchant-admin-address'] = headers.merchantAdminAddress;
    }
    if (headers.orgAddress) {
        requestHeaders['x-org-address'] = headers.orgAddress;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: requestHeaders,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `API error: ${response.status}`);
    }

    return response.json();
}

// ============ User Vaults ============

export interface VaultSummary {
    address: string;
    owner: string;
    tokenAddress: string;
    tokenSymbol: string;
    trustedExecutor: string;
    maxPerTx: string;
    dailyLimit: string;
    spentToday: string;
    balance: string;
    lastReset: number;
}

export interface CreateVaultInput {
    userAddress: string;
    tokenAddress: string;
    maxPerTx: string;
    dailyLimit: string;
}

export interface CreateVaultResponse {
    success: boolean;
    vaultAddress: string;
    txHash: string;
}

export async function getUserVaults(userAddress: string): Promise<{ vaults: VaultSummary[] }> {
    return apiFetch('/api/user/vaults', { method: 'GET' }, { userAddress });
}

export async function createPolicyVault(input: CreateVaultInput): Promise<CreateVaultResponse> {
    return apiFetch('/api/user/vaults', {
        method: 'POST',
        body: JSON.stringify(input),
    });
}

export interface VaultActivity {
    id: string;
    vaultAddress: string;
    merchantId: number;
    amount: string;
    tokenAddress: string;
    txHash: string;
    requestUrl: string | null;
    status: 'pending' | 'success' | 'failed';
    createdAt: string;
}

export async function getVaultActivity(vaultAddress: string): Promise<{ activities: VaultActivity[] }> {
    return apiFetch(`/api/user/vaults/${vaultAddress}/activity`);
}

// ============ Merchants ============

export interface MerchantApi {
    id: number;
    merchantId: number;
    adminAddress: string;
    apiName: string;
    baseUrl: string;
    pricePerCall: string;
    chainId: number;
    tokenAddress: string;
    createdAt: string;
}

export interface CreateMerchantApiInput {
    adminAddress: string;
    payoutAddress: string;
    apiName: string;
    baseUrl: string;
    pricePerCall: string;
    chainId: number;
    tokenAddress: string;
}

export async function getMerchantApis(adminAddress: string): Promise<{ apis: MerchantApi[] }> {
    return apiFetch('/api/merchant/apis', { method: 'GET' }, { merchantAdminAddress: adminAddress });
}

export async function createMerchantApi(input: CreateMerchantApiInput): Promise<{ success: boolean; merchantApi: MerchantApi; merchantId: number }> {
    return apiFetch('/api/merchant/apis', {
        method: 'POST',
        body: JSON.stringify(input),
    });
}

// ============ Agents ============

export interface Agent {
    id: number;
    name: string;
    description: string | null;
    orgAddress: string;
    agentKey: string;
    allowedVaultAddresses: string[];
    createdAt: string;
}

export interface CreateAgentInput {
    orgAddress: string;
    name: string;
    description?: string;
    allowedVaults: string[];
}

export interface CreateAgentResponse {
    success: boolean;
    agentKey: string;
    agent: {
        id: number;
        name: string;
        description: string | null;
        orgAddress: string;
        createdAt: string;
    };
}

export async function getAgents(orgAddress: string): Promise<{ agents: Agent[] }> {
    return apiFetch('/api/agents', { method: 'GET' }, { orgAddress });
}

export async function createAgent(input: CreateAgentInput): Promise<CreateAgentResponse> {
    return apiFetch('/api/agents', {
        method: 'POST',
        body: JSON.stringify(input),
    });
}

// ============ Analytics ============

export interface UserAnalytics {
    totalSpend30d: number;
    activeVaults: number;
    avgSpendPerDay: number;
    dailySeries: { date: string; spend: number }[];
    topMerchants: {
        id: number;
        name: string;
        category: string;
        spend: number;
        calls: number;
    }[];
    recentTransactions: {
        id: string;
        merchantName: string;
        agentName: string;
        vaultAddress: string;
        amount: string;
        status: 'pending' | 'success' | 'failed';
        createdAt: string;
    }[];
}

export interface MerchantAnalytics {
    totalRevenue30d: string;
    callsPerDay: { date: string; calls: number }[];
    topOrgs: { address: string; revenue: number }[];
}

export async function getUserAnalytics(userAddress: string): Promise<UserAnalytics> {
    return apiFetch('/api/analytics/user', { method: 'GET' }, { userAddress });
}

export async function getMerchantAnalytics(adminAddress: string): Promise<MerchantAnalytics> {
    return apiFetch('/api/analytics/merchant', { method: 'GET' }, { merchantAdminAddress: adminAddress });
}

// ============ Pay and Call ============

export interface PayAndCallInput {
    agentKey: string;
    vaultAddress: string;
    merchantApiId: number;
    requestPath: string;
    payload?: Record<string, any>;
}

export interface PayAndCallResponse {
    success: boolean;
    txHash: string;
    amount: string;
    merchantApiId: number;
    apiResponse: any;
}

export async function payAndCall(input: PayAndCallInput): Promise<PayAndCallResponse> {
    return apiFetch('/api/pay-and-call', {
        method: 'POST',
        body: JSON.stringify(input),
    });
}
