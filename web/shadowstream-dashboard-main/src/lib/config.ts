/**
 * Frontend configuration from environment variables
 */

interface AppConfig {
    backendUrl: string;
    chainId: number;
    policyVaultFactoryAddress: string;
    merchantRegistryAddress: string;
}

export const config: AppConfig = {
    backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000',
    chainId: parseInt(import.meta.env.VITE_CHAIN_ID || '137', 10),
    policyVaultFactoryAddress: import.meta.env.VITE_POLICY_VAULT_FACTORY_ADDRESS || '',
    merchantRegistryAddress: import.meta.env.VITE_MERCHANT_REGISTRY_ADDRESS || '',
};

// Polygon mainnet token addresses
export const TOKEN_ADDRESSES = {
    USDC: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
} as const;

export const CHAIN_CONFIG = {
    chainId: 137,
    chainIdHex: '0x89',
    name: 'Polygon Mainnet',
    rpcUrls: ['https://polygon-rpc.com'],
    nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
    },
    blockExplorerUrls: ['https://polygonscan.com'],
};

export default config;
