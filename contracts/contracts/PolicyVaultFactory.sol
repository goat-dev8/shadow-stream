// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./PolicyVault.sol";

/**
 * @title PolicyVaultFactory
 * @notice Factory contract to deploy PolicyVaults and track user vaults.
 * @dev Used by ShadowStream on Polygon mainnet.
 */
contract PolicyVaultFactory {
    // Allowed tokens (USDC, USDT on Polygon)
    address public immutable usdc;
    address public immutable usdt;

    // User vaults mapping
    mapping(address => address[]) public userVaults;

    // Events
    event PolicyVaultCreated(
        address indexed owner,
        address vault,
        address token,
        uint256 maxPerTx,
        uint256 dailyLimit
    );

    /**
     * @notice Initialize factory with allowed token addresses
     * @param _usdc USDC token address on Polygon
     * @param _usdt USDT token address on Polygon
     */
    constructor(address _usdc, address _usdt) {
        require(_usdc != address(0), "Factory: USDC is zero");
        require(_usdt != address(0), "Factory: USDT is zero");
        usdc = _usdc;
        usdt = _usdt;
    }

    /**
     * @notice Check if a token is allowed
     * @param token Token address to check
     */
    function isAllowedToken(address token) public view returns (bool) {
        return token == usdc || token == usdt;
    }

    /**
     * @notice Create a new PolicyVault
     * @param token Token address (must be USDC or USDT)
     * @param maxPerTx Maximum amount per transaction
     * @param dailyLimit Maximum amount per day
     * @param trustedExecutor Address allowed to execute payments
     * @return vault Address of the newly created vault
     */
    function createPolicyVault(
        address token,
        uint256 maxPerTx,
        uint256 dailyLimit,
        address trustedExecutor
    ) external returns (address vault) {
        require(isAllowedToken(token), "Factory: token not allowed");

        PolicyVault newVault = new PolicyVault(
            msg.sender,
            token,
            trustedExecutor,
            maxPerTx,
            dailyLimit
        );

        vault = address(newVault);
        userVaults[msg.sender].push(vault);

        emit PolicyVaultCreated(msg.sender, vault, token, maxPerTx, dailyLimit);
    }

    /**
     * @notice Get all vaults for a user
     * @param user User address
     * @return Array of vault addresses
     */
    function getUserVaults(address user) external view returns (address[] memory) {
        return userVaults[user];
    }

    /**
     * @notice Get vault count for a user
     * @param user User address
     */
    function getUserVaultCount(address user) external view returns (uint256) {
        return userVaults[user].length;
    }
}
