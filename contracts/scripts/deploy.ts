import { ethers, network } from "hardhat";
import "dotenv/config";

async function main() {
    const networkName = network.name;
    console.log(`\n🚀 Deploying ShadowStream contracts to ${networkName}...\n`);

    // Get signer
    const [deployer] = await ethers.getSigners();
    console.log("Deployer address:", deployer.address);
    console.log("Deployer balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MATIC\n");

    // Token addresses
    let usdcAddress: string;
    let usdtAddress: string;

    if (networkName === "polygon") {
        // Polygon mainnet token addresses
        usdcAddress = process.env.USDC_ADDRESS || "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359";
        usdtAddress = process.env.USDT_ADDRESS || "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
        console.log("Using Polygon mainnet token addresses:");
        console.log("  USDC:", usdcAddress);
        console.log("  USDT:", usdtAddress);
    } else {
        // Deploy mock tokens for testing
        console.log("Deploying mock tokens for testing...");
        const MockERC20 = await ethers.getContractFactory("MockERC20");

        const usdc = await MockERC20.deploy("USD Coin", "USDC", 6);
        await usdc.waitForDeployment();
        usdcAddress = await usdc.getAddress();
        console.log("  Mock USDC deployed to:", usdcAddress);

        const usdt = await MockERC20.deploy("Tether USD", "USDT", 6);
        await usdt.waitForDeployment();
        usdtAddress = await usdt.getAddress();
        console.log("  Mock USDT deployed to:", usdtAddress);
    }

    console.log("\n");

    // Deploy MerchantRegistry
    console.log("Deploying MerchantRegistry...");
    const MerchantRegistry = await ethers.getContractFactory("MerchantRegistry");
    const registry = await MerchantRegistry.deploy();
    await registry.waitForDeployment();
    const registryAddress = await registry.getAddress();
    console.log("✅ MerchantRegistry deployed to:", registryAddress);

    // Deploy PolicyVaultFactory
    console.log("\nDeploying PolicyVaultFactory...");
    const PolicyVaultFactory = await ethers.getContractFactory("PolicyVaultFactory");
    const factory = await PolicyVaultFactory.deploy(usdcAddress, usdtAddress);
    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();
    console.log("✅ PolicyVaultFactory deployed to:", factoryAddress);

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📋 DEPLOYMENT SUMMARY");
    console.log("=".repeat(60));
    console.log(`Network: ${networkName}`);
    console.log(`\nContract Addresses:`);
    console.log(`  MERCHANT_REGISTRY_ADDRESS=${registryAddress}`);
    console.log(`  POLICY_VAULT_FACTORY_ADDRESS=${factoryAddress}`);
    console.log(`\nToken Addresses:`);
    console.log(`  USDC_ADDRESS=${usdcAddress}`);
    console.log(`  USDT_ADDRESS=${usdtAddress}`);
    console.log("=".repeat(60));
    console.log("\n💡 Add these to your .env file!\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
