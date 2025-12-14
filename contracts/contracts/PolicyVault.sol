// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PolicyVault
 * @notice A vault holding ERC20 stablecoins with enforced spending rules.
 * @dev Used by ShadowStream for x402 agent micropayments on Polygon.
 */
contract PolicyVault is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // State
    address public owner;
    IERC20 public token;
    address public trustedExecutor;
    uint256 public maxPerTx;
    uint256 public dailyLimit;
    uint256 public spentToday;
    uint256 public lastReset;

    // Events
    event Deposited(address indexed from, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);
    event RulesUpdated(uint256 maxPerTx, uint256 dailyLimit);
    event TrustedExecutorUpdated(address executor);
    event PaymentExecuted(address indexed merchant, uint256 amount);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "PolicyVault: caller is not owner");
        _;
    }

    modifier onlyTrustedExecutor() {
        require(msg.sender == trustedExecutor, "PolicyVault: caller is not trusted executor");
        _;
    }

    /**
     * @notice Initialize the vault
     * @param _owner Owner of the vault
     * @param _token ERC20 token to hold (USDC/USDT)
     * @param _trustedExecutor Address allowed to execute payments
     * @param _maxPerTx Maximum amount per transaction
     * @param _dailyLimit Maximum amount per day
     */
    constructor(
        address _owner,
        address _token,
        address _trustedExecutor,
        uint256 _maxPerTx,
        uint256 _dailyLimit
    ) {
        require(_owner != address(0), "PolicyVault: owner is zero");
        require(_token != address(0), "PolicyVault: token is zero");
        require(_trustedExecutor != address(0), "PolicyVault: executor is zero");
        require(_maxPerTx > 0, "PolicyVault: maxPerTx is zero");
        require(_dailyLimit >= _maxPerTx, "PolicyVault: dailyLimit < maxPerTx");

        owner = _owner;
        token = IERC20(_token);
        trustedExecutor = _trustedExecutor;
        maxPerTx = _maxPerTx;
        dailyLimit = _dailyLimit;
        lastReset = block.timestamp;
    }

    /**
     * @notice Reset daily spending if a new day has started
     */
    function _resetIfNewDay() internal {
        if (block.timestamp >= lastReset + 1 days) {
            spentToday = 0;
            lastReset = block.timestamp;
        }
    }

    /**
     * @notice Deposit tokens into the vault
     * @param amount Amount to deposit
     */
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "PolicyVault: amount is zero");
        token.safeTransferFrom(msg.sender, address(this), amount);
        emit Deposited(msg.sender, amount);
    }

    /**
     * @notice Withdraw tokens from the vault (owner only)
     * @param amount Amount to withdraw
     */
    function withdraw(uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "PolicyVault: amount is zero");
        require(token.balanceOf(address(this)) >= amount, "PolicyVault: insufficient balance");
        token.safeTransfer(owner, amount);
        emit Withdrawn(owner, amount);
    }

    /**
     * @notice Update spending rules (owner only)
     * @param _maxPerTx New max per transaction
     * @param _dailyLimit New daily limit
     */
    function setRules(uint256 _maxPerTx, uint256 _dailyLimit) external onlyOwner {
        require(_maxPerTx > 0, "PolicyVault: maxPerTx is zero");
        require(_dailyLimit >= _maxPerTx, "PolicyVault: dailyLimit < maxPerTx");
        maxPerTx = _maxPerTx;
        dailyLimit = _dailyLimit;
        emit RulesUpdated(_maxPerTx, _dailyLimit);
    }

    /**
     * @notice Update trusted executor (owner only)
     * @param _executor New executor address
     */
    function setTrustedExecutor(address _executor) external onlyOwner {
        require(_executor != address(0), "PolicyVault: executor is zero");
        trustedExecutor = _executor;
        emit TrustedExecutorUpdated(_executor);
    }

    /**
     * @notice Execute a payment to a merchant (trusted executor only)
     * @param merchant Recipient address
     * @param amount Amount to pay
     */
    function executePayment(address merchant, uint256 amount) external onlyTrustedExecutor nonReentrant {
        require(merchant != address(0), "PolicyVault: merchant is zero");
        require(amount > 0, "PolicyVault: amount is zero");
        require(amount <= maxPerTx, "PolicyVault: exceeds max per tx");

        _resetIfNewDay();

        require(spentToday + amount <= dailyLimit, "PolicyVault: exceeds daily limit");
        require(token.balanceOf(address(this)) >= amount, "PolicyVault: insufficient balance");

        spentToday += amount;
        token.safeTransfer(merchant, amount);

        emit PaymentExecuted(merchant, amount);
    }

    /**
     * @notice Get current vault balance
     */
    function balance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    /**
     * @notice Get remaining daily allowance
     */
    function remainingDailyAllowance() external view returns (uint256) {
        if (block.timestamp >= lastReset + 1 days) {
            return dailyLimit;
        }
        return dailyLimit > spentToday ? dailyLimit - spentToday : 0;
    }
}
