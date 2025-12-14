import 'dotenv/config';

export const appConfig = {
    port: parseInt(process.env.BACKEND_PORT || '4000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
};

export const chainConfig = {
    polygon: {
        chainId: 137,
        rpcUrl: process.env.POLYGON_MAINNET_RPC_URL || '',
        name: 'Polygon Mainnet',
    },
};

export const contractAddresses = {
    policyVaultFactory: process.env.POLICY_VAULT_FACTORY_ADDRESS || '',
    merchantRegistry: process.env.MERCHANT_REGISTRY_ADDRESS || '',
};

export const tokenAddresses = {
    usdc: process.env.USDC_ADDRESS || '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
    usdt: process.env.USDT_ADDRESS || '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
};

export const x402Config = {
    facilitatorUrl: process.env.X402_FACILITATOR_URL || '',
    clientId: process.env.X402_CLIENT_ID || '',
    clientSecret: process.env.X402_CLIENT_SECRET || '',
};

export const dbConfig = {
    databaseUrl: process.env.DATABASE_URL || '',
};

export const walletConfig = {
    deployerPrivateKey: process.env.DEPLOYER_PRIVATE_KEY || '',
};

// Validation for production
function validateConfig() {
    if (appConfig.isProduction) {
        const required = [
            ['POLYGON_MAINNET_RPC_URL', chainConfig.polygon.rpcUrl],
            ['DATABASE_URL', dbConfig.databaseUrl],
            ['DEPLOYER_PRIVATE_KEY', walletConfig.deployerPrivateKey],
        ] as const;

        for (const [name, value] of required) {
            if (!value) {
                throw new Error(`Missing required environment variable: ${name}`);
            }
        }
    }
}

validateConfig();

export default {
    app: appConfig,
    chain: chainConfig,
    contracts: contractAddresses,
    tokens: tokenAddresses,
    x402: x402Config,
    db: dbConfig,
    wallet: walletConfig,
};
