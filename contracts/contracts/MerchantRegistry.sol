// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title MerchantRegistry
 * @notice Registry for x402-enabled merchant APIs on Polygon.
 * @dev Stores merchant admins and their payout addresses.
 */
contract MerchantRegistry {
    struct Merchant {
        address admin;
        address payoutAddress;
        bool active;
    }

    // State
    uint256 public nextMerchantId = 1;
    mapping(uint256 => Merchant) public merchants;
    mapping(address => uint256) public merchantIdByAdmin;

    // Events
    event MerchantRegistered(
        uint256 indexed merchantId,
        address indexed admin,
        address payoutAddress
    );
    event MerchantUpdated(uint256 indexed merchantId, address payoutAddress);
    event MerchantStatusUpdated(uint256 indexed merchantId, bool active);

    /**
     * @notice Register a new merchant
     * @param payoutAddress Address to receive payments
     * @return merchantId The ID of the new merchant
     */
    function registerMerchant(address payoutAddress) external returns (uint256 merchantId) {
        require(payoutAddress != address(0), "Registry: payout is zero");
        require(merchantIdByAdmin[msg.sender] == 0, "Registry: already registered");

        merchantId = nextMerchantId++;

        merchants[merchantId] = Merchant({
            admin: msg.sender,
            payoutAddress: payoutAddress,
            active: true
        });

        merchantIdByAdmin[msg.sender] = merchantId;

        emit MerchantRegistered(merchantId, msg.sender, payoutAddress);
    }

    /**
     * @notice Update payout address (admin only)
     * @param merchantId Merchant ID
     * @param newPayout New payout address
     */
    function updatePayoutAddress(uint256 merchantId, address newPayout) external {
        require(newPayout != address(0), "Registry: payout is zero");
        Merchant storage merchant = merchants[merchantId];
        require(merchant.admin == msg.sender, "Registry: not admin");

        merchant.payoutAddress = newPayout;

        emit MerchantUpdated(merchantId, newPayout);
    }

    /**
     * @notice Set merchant active status (admin only)
     * @param merchantId Merchant ID
     * @param active New active status
     */
    function setActive(uint256 merchantId, bool active) external {
        Merchant storage merchant = merchants[merchantId];
        require(merchant.admin == msg.sender, "Registry: not admin");

        merchant.active = active;

        emit MerchantStatusUpdated(merchantId, active);
    }

    /**
     * @notice Get merchant details
     * @param merchantId Merchant ID
     */
    function getMerchant(uint256 merchantId) external view returns (
        address admin,
        address payoutAddress,
        bool active
    ) {
        Merchant storage merchant = merchants[merchantId];
        return (merchant.admin, merchant.payoutAddress, merchant.active);
    }
}
