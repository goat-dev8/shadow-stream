import { ethers } from 'ethers';
import { chainConfig } from '../config.js';

// Polygon mainnet provider
export const polygonProvider = new ethers.JsonRpcProvider(
    chainConfig.polygon.rpcUrl,
    {
        name: chainConfig.polygon.name,
        chainId: chainConfig.polygon.chainId,
    }
);

export default polygonProvider;
