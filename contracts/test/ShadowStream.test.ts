import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("ShadowStream Contracts", function () {
    async function deployFixture() {
        const [owner, executor, merchant, user2] = await ethers.getSigners();

        // Deploy mock tokens
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        const usdc = await MockERC20.deploy("USD Coin", "USDC", 6);
        const usdt = await MockERC20.deploy("Tether USD", "USDT", 6);

        // Deploy factory
        const PolicyVaultFactory = await ethers.getContractFactory("PolicyVaultFactory");
        const factory = await PolicyVaultFactory.deploy(
            await usdc.getAddress(),
            await usdt.getAddress()
        );

        // Deploy merchant registry
        const MerchantRegistry = await ethers.getContractFactory("MerchantRegistry");
        const registry = await MerchantRegistry.deploy();

        return { owner, executor, merchant, user2, usdc, usdt, factory, registry };
    }

    describe("PolicyVaultFactory", function () {
        it("should deploy with correct token addresses", async function () {
            const { factory, usdc, usdt } = await loadFixture(deployFixture);
            expect(await factory.usdc()).to.equal(await usdc.getAddress());
            expect(await factory.usdt()).to.equal(await usdt.getAddress());
        });

        it("should create a policy vault", async function () {
            const { factory, usdc, executor, owner } = await loadFixture(deployFixture);

            const maxPerTx = ethers.parseUnits("10", 6);
            const dailyLimit = ethers.parseUnits("100", 6);

            await expect(
                factory.createPolicyVault(
                    await usdc.getAddress(),
                    maxPerTx,
                    dailyLimit,
                    executor.address
                )
            ).to.emit(factory, "PolicyVaultCreated");

            const vaults = await factory.getUserVaults(owner.address);
            expect(vaults.length).to.equal(1);
        });

        it("should reject non-whitelisted tokens", async function () {
            const { factory, executor } = await loadFixture(deployFixture);
            const fakeToken = "0x1234567890123456789012345678901234567890";

            await expect(
                factory.createPolicyVault(
                    fakeToken,
                    ethers.parseUnits("10", 6),
                    ethers.parseUnits("100", 6),
                    executor.address
                )
            ).to.be.revertedWith("Factory: token not allowed");
        });
    });

    describe("PolicyVault", function () {
        async function createVaultFixture() {
            const base = await loadFixture(deployFixture);
            const { factory, usdc, executor, owner } = base;

            const maxPerTx = ethers.parseUnits("10", 6);
            const dailyLimit = ethers.parseUnits("100", 6);

            const tx = await factory.createPolicyVault(
                await usdc.getAddress(),
                maxPerTx,
                dailyLimit,
                executor.address
            );
            const receipt = await tx.wait();

            const event = receipt!.logs
                .map((log) => {
                    try {
                        return factory.interface.parseLog({ topics: log.topics as string[], data: log.data });
                    } catch {
                        return null;
                    }
                })
                .find((e) => e?.name === "PolicyVaultCreated");

            const vaultAddress = event!.args.vault;
            const vault = await ethers.getContractAt("PolicyVault", vaultAddress);

            // Mint USDC to owner and approve vault
            await base.usdc.mint(owner.address, ethers.parseUnits("1000", 6));
            await base.usdc.approve(vaultAddress, ethers.parseUnits("1000", 6));

            return { ...base, vault, vaultAddress };
        }

        it("should allow deposits", async function () {
            const { vault, vaultAddress, usdc, owner } = await loadFixture(createVaultFixture);

            await expect(vault.deposit(ethers.parseUnits("100", 6)))
                .to.emit(vault, "Deposited")
                .withArgs(owner.address, ethers.parseUnits("100", 6));

            expect(await usdc.balanceOf(vaultAddress)).to.equal(ethers.parseUnits("100", 6));
        });

        it("should allow owner to withdraw", async function () {
            const { vault, usdc, owner } = await loadFixture(createVaultFixture);

            await vault.deposit(ethers.parseUnits("100", 6));
            await vault.withdraw(ethers.parseUnits("50", 6));

            expect(await usdc.balanceOf(owner.address)).to.equal(
                ethers.parseUnits("950", 6) // 1000 - 100 + 50
            );
        });

        it("should execute payments within limits", async function () {
            const { vault, executor, merchant, usdc } = await loadFixture(createVaultFixture);

            await vault.deposit(ethers.parseUnits("100", 6));

            await expect(
                vault.connect(executor).executePayment(merchant.address, ethers.parseUnits("5", 6))
            )
                .to.emit(vault, "PaymentExecuted")
                .withArgs(merchant.address, ethers.parseUnits("5", 6));

            expect(await usdc.balanceOf(merchant.address)).to.equal(ethers.parseUnits("5", 6));
        });

        it("should reject payments exceeding maxPerTx", async function () {
            const { vault, executor, merchant } = await loadFixture(createVaultFixture);

            await vault.deposit(ethers.parseUnits("100", 6));

            await expect(
                vault.connect(executor).executePayment(merchant.address, ethers.parseUnits("15", 6))
            ).to.be.revertedWith("PolicyVault: exceeds max per tx");
        });

        it("should reject payments exceeding daily limit", async function () {
            const { vault, executor, merchant } = await loadFixture(createVaultFixture);

            await vault.deposit(ethers.parseUnits("500", 6));

            // Make 10 payments of $10 each to hit daily limit
            for (let i = 0; i < 10; i++) {
                await vault.connect(executor).executePayment(merchant.address, ethers.parseUnits("10", 6));
            }

            // 11th payment should fail
            await expect(
                vault.connect(executor).executePayment(merchant.address, ethers.parseUnits("5", 6))
            ).to.be.revertedWith("PolicyVault: exceeds daily limit");
        });

        it("should reset daily limit after 24 hours", async function () {
            const { vault, executor, merchant } = await loadFixture(createVaultFixture);

            await vault.deposit(ethers.parseUnits("500", 6));

            // Spend to daily limit
            for (let i = 0; i < 10; i++) {
                await vault.connect(executor).executePayment(merchant.address, ethers.parseUnits("10", 6));
            }

            // Fast forward 24 hours
            await time.increase(86400);

            // Should work now
            await expect(
                vault.connect(executor).executePayment(merchant.address, ethers.parseUnits("10", 6))
            ).to.emit(vault, "PaymentExecuted");
        });

        it("should only allow owner to update rules", async function () {
            const { vault, executor } = await loadFixture(createVaultFixture);

            await expect(
                vault.connect(executor).setRules(
                    ethers.parseUnits("20", 6),
                    ethers.parseUnits("200", 6)
                )
            ).to.be.revertedWith("PolicyVault: caller is not owner");
        });
    });

    describe("MerchantRegistry", function () {
        it("should register a merchant", async function () {
            const { registry, merchant } = await loadFixture(deployFixture);
            const payoutAddress = "0x1111111111111111111111111111111111111111";

            await expect(registry.connect(merchant).registerMerchant(payoutAddress))
                .to.emit(registry, "MerchantRegistered");

            const merchantId = await registry.merchantIdByAdmin(merchant.address);
            expect(merchantId).to.equal(1);

            const [admin, payout, active] = await registry.getMerchant(merchantId);
            expect(admin).to.equal(merchant.address);
            expect(payout).to.equal(payoutAddress);
            expect(active).to.be.true;
        });

        it("should prevent double registration", async function () {
            const { registry, merchant } = await loadFixture(deployFixture);
            const payoutAddress = "0x1111111111111111111111111111111111111111";

            await registry.connect(merchant).registerMerchant(payoutAddress);

            await expect(
                registry.connect(merchant).registerMerchant(payoutAddress)
            ).to.be.revertedWith("Registry: already registered");
        });

        it("should allow admin to update payout", async function () {
            const { registry, merchant } = await loadFixture(deployFixture);
            const payoutAddress = "0x1111111111111111111111111111111111111111";
            const newPayout = "0x2222222222222222222222222222222222222222";

            await registry.connect(merchant).registerMerchant(payoutAddress);
            const merchantId = await registry.merchantIdByAdmin(merchant.address);

            await expect(registry.connect(merchant).updatePayoutAddress(merchantId, newPayout))
                .to.emit(registry, "MerchantUpdated");

            const [, payout,] = await registry.getMerchant(merchantId);
            expect(payout).to.equal(newPayout);
        });

        it("should allow admin to toggle active status", async function () {
            const { registry, merchant } = await loadFixture(deployFixture);
            const payoutAddress = "0x1111111111111111111111111111111111111111";

            await registry.connect(merchant).registerMerchant(payoutAddress);
            const merchantId = await registry.merchantIdByAdmin(merchant.address);

            await registry.connect(merchant).setActive(merchantId, false);
            const [, , active] = await registry.getMerchant(merchantId);
            expect(active).to.be.false;
        });
    });
});
