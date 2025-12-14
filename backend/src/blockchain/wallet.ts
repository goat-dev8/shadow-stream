import { ethers } from 'ethers';
import { walletConfig } from '../config.js';
import { polygonProvider } from './provider.js';

// Executor wallet - used as trustedExecutor for PolicyVaults
export const executorSigner = walletConfig.deployerPrivateKey
    ? new ethers.Wallet(walletConfig.deployerPrivateKey, polygonProvider)
    : null;

export function getExecutorAddress(): string {
    if (!executorSigner) {
        throw new Error('Executor wallet not configured. Set DEPLOYER_PRIVATE_KEY.');
    }
    return executorSigner.address;
}

export default executorSigner;
