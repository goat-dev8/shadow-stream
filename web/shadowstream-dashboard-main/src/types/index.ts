export interface PolicyVault {
  id: string;
  name: string;
  description?: string;
  token: 'USDC' | 'USDT' | 'DAI';
  balance: number;
  dailyLimit: number;
  maxPerTx: number;
  status: 'active' | 'paused';
  createdAt: string;
  todaySpend: number;
  totalCalls: number;
  allowedMerchantsOnly: boolean;
  allowedAgentsOnly: boolean;
}

export interface Agent {
  id: string;
  name: string;
  description?: string;
  apiKey: string;
  linkedVaults: string[];
  status: 'active' | 'revoked';
  createdAt: string;
}

export interface Transaction {
  id: string;
  vaultId: string;
  vaultName: string;
  merchantId: string;
  merchantName: string;
  merchantLogo?: string;
  agentId?: string;
  agentName?: string;
  amount: number;
  token: 'USDC' | 'USDT' | 'DAI';
  status: 'succeeded' | 'pending' | 'failed';
  timestamp: string;
  txHash?: string;
  x402PaymentId?: string;
  metadata?: Record<string, unknown>;
}

export interface Merchant {
  id: string;
  name: string;
  category: string;
  logo?: string;
  trusted: boolean;
  allowed: boolean;
}

export interface MerchantAPI {
  id: string;
  name: string;
  baseUrl: string;
  endpointPath: string;
  pricePerCall: number;
  token: 'USDC' | 'USDT' | 'DAI';
  chain: 'polygon';
  status: 'active' | 'inactive';
  totalCalls: number;
  totalRevenue: number;
}

export interface Payout {
  id: string;
  amount: number;
  token: 'USDC' | 'USDT' | 'DAI';
  txHash: string;
  status: 'completed' | 'pending';
  timestamp: string;
}

export interface UserStats {
  totalSpend30d: number;
  activePolicyVaults: number;
  avgSpendPerDay: number;
}

export interface MerchantStats {
  totalRevenue30d: number;
  totalCalls: number;
  activeAPIs: number;
}

export type UserRole = 'user' | 'merchant';
