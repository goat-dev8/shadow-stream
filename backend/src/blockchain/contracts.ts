import { ethers } from 'ethers';
import { contractAddresses } from '../config.js';
import { polygonProvider } from './provider.js';
import { executorSigner } from './wallet.js';

// ABIs - these are minimal ABIs for the functions we need
// Full ABIs will be copied from compiled contracts

export const PolicyVaultFactoryABI = [
    'function createPolicyVault(address token, uint256 maxPerTx, uint256 dailyLimit, address trustedExecutor) external returns (address)',
    'function getUserVaults(address user) external view returns (address[])',
    'event PolicyVaultCreated(address indexed owner, address vault, address token, uint256 maxPerTx, uint256 dailyLimit)',
];

export const PolicyVaultABI = [
    'function owner() external view returns (address)',
    'function token() external view returns (address)',
    'function trustedExecutor() external view returns (address)',
    'function maxPerTx() external view returns (uint256)',
    'function dailyLimit() external view returns (uint256)',
    'function spentToday() external view returns (uint256)',
    'function lastReset() external view returns (uint256)',
    'function deposit(uint256 amount) external',
    'function withdraw(uint256 amount) external',
    'function setRules(uint256 _maxPerTx, uint256 _dailyLimit) external',
    'function setTrustedExecutor(address _executor) external',
    'function executePayment(address merchant, uint256 amount) external',
    'event Deposited(address indexed from, uint256 amount)',
    'event Withdrawn(address indexed to, uint256 amount)',
    'event RulesUpdated(uint256 maxPerTx, uint256 dailyLimit)',
    'event TrustedExecutorUpdated(address executor)',
    'event PaymentExecuted(address indexed merchant, uint256 amount)',
];

export const MerchantRegistryABI = [
    'function registerMerchant(address payoutAddress) external returns (uint256)',
    'function updatePayoutAddress(uint256 merchantId, address newPayout) external',
    'function setActive(uint256 merchantId, bool active) external',
    'function merchants(uint256 merchantId) external view returns (address admin, address payoutAddress, bool active)',
    'function merchantIdByAdmin(address admin) external view returns (uint256)',
    'function nextMerchantId() external view returns (uint256)',
    'event MerchantRegistered(uint256 indexed merchantId, address indexed admin, address payoutAddress)',
    'event MerchantUpdated(uint256 indexed merchantId, address payoutAddress)',
    'event MerchantStatusUpdated(uint256 indexed merchantId, bool active)',
];

export const IERC20ABI = [
    'function balanceOf(address account) external view returns (uint256)',
    'function decimals() external view returns (uint8)',
    'function symbol() external view returns (string)',
    'function transfer(address to, uint256 amount) external returns (bool)',
    'function approve(address spender, uint256 amount) external returns (bool)',
];

// Contract factories
export function getPolicyVaultFactory() {
    if (!contractAddresses.policyVaultFactory) {
        throw new Error('PolicyVaultFactory address not configured');
    }
    return new ethers.Contract(
        contractAddresses.policyVaultFactory,
        PolicyVaultFactoryABI,
        executorSigner || polygonProvider
    );
}

export function getMerchantRegistry() {
    if (!contractAddresses.merchantRegistry) {
        throw new Error('MerchantRegistry address not configured');
    }
    return new ethers.Contract(
        contractAddresses.merchantRegistry,
        MerchantRegistryABI,
        executorSigner || polygonProvider
    );
}

export function getPolicyVault(vaultAddress: string) {
    return new ethers.Contract(
        vaultAddress,
        PolicyVaultABI,
        executorSigner || polygonProvider
    );
}

export function getERC20Token(tokenAddress: string) {
    return new ethers.Contract(
        tokenAddress,
        IERC20ABI,
        polygonProvider
    );
}
