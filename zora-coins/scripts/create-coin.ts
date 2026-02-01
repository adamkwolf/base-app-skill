import {
  createCoin,
  createCoinCall,
  CreateConstants,
} from "@zoralabs/coins-sdk";
import { createWalletClient, createPublicClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { uploadMetadata } from "./upload-metadata.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = join(__dirname, "..", "coins-registry.json");

// Parse command line arguments
function parseArgs(): {
  name: string;
  symbol: string;
  image: string;
  description?: string;
  preview?: boolean;
} {
  const args = process.argv.slice(2);
  const result: Record<string, string | boolean> = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--name" && args[i + 1]) {
      result.name = args[++i];
    } else if (args[i] === "--symbol" && args[i + 1]) {
      result.symbol = args[++i];
    } else if (args[i] === "--image" && args[i + 1]) {
      result.image = args[++i];
    } else if (args[i] === "--description" && args[i + 1]) {
      result.description = args[++i];
    } else if (args[i] === "--preview") {
      result.preview = true;
    }
  }

  if (!result.name || !result.symbol || !result.image) {
    console.error(
      'Usage: npm run create -- --name "Post Title" --symbol "SYMBOL" --image "/path/to/image" [--description "..."] [--preview]'
    );
    process.exit(1);
  }

  return result as {
    name: string;
    symbol: string;
    image: string;
    description?: string;
    preview?: boolean;
  };
}

// Load or initialize registry
function loadRegistry(): { coins: any[] } {
  if (existsSync(REGISTRY_PATH)) {
    return JSON.parse(readFileSync(REGISTRY_PATH, "utf-8"));
  }
  return { coins: [] };
}

// Save registry
function saveRegistry(registry: { coins: any[] }): void {
  writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
}

// Validate environment
function validateEnv(): {
  privateKey: `0x${string}`;
  apiKey: string;
  referrer?: `0x${string}`;
} {
  const privateKey = process.env.PRIVATE_KEY;
  const apiKey = process.env.ZORA_API_KEY;
  const referrer = process.env.PLATFORM_REFERRER;

  if (!privateKey) {
    console.error("Error: PRIVATE_KEY environment variable is required");
    console.error(
      "Set it in your .env file or export it: export PRIVATE_KEY=0x..."
    );
    process.exit(1);
  }

  if (!privateKey.startsWith("0x") || privateKey.length !== 66) {
    console.error(
      "Error: PRIVATE_KEY must be a 64-character hex string with 0x prefix"
    );
    console.error("Example: 0x1234567890abcdef...");
    process.exit(1);
  }

  if (!apiKey) {
    console.error("Error: ZORA_API_KEY environment variable is required");
    console.error("Get your API key at: https://zora.co/developers");
    process.exit(1);
  }

  return {
    privateKey: privateKey as `0x${string}`,
    apiKey,
    referrer: referrer as `0x${string}` | undefined,
  };
}

// Validate image file
function validateImage(imagePath: string): void {
  const supportedFormats = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const ext = imagePath.toLowerCase().substring(imagePath.lastIndexOf("."));

  if (!supportedFormats.includes(ext)) {
    console.error(`Error: Unsupported image format: ${ext}`);
    console.error(`Supported formats: ${supportedFormats.join(", ")}`);
    process.exit(1);
  }

  if (!existsSync(imagePath)) {
    console.error(`Error: Image file not found: ${imagePath}`);
    process.exit(1);
  }
}

async function main() {
  const args = parseArgs();
  const env = validateEnv();

  console.log(`\n🪙 Creating Zora Coin: "${args.name}"`);

  // Validate image
  validateImage(args.image);

  // Use provided symbol (uppercase, max 6 chars)
  const symbol = args.symbol.toUpperCase().substring(0, 6);
  console.log(`📝 Symbol: $${symbol}`);

  // Set up wallet
  const account = privateKeyToAccount(env.privateKey);
  console.log(`👛 Wallet: ${account.address}`);

  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http(),
  });

  // Check balance
  const balance = await publicClient.getBalance({ address: account.address });
  console.log(`💰 Balance: ${(Number(balance) / 1e18).toFixed(4)} ETH`);

  if (balance < parseEther("0.001")) {
    console.error("\nError: Insufficient ETH balance for gas fees");
    console.error("Please fund your wallet with at least 0.001 ETH on Base");
    console.error(`Wallet address: ${account.address}`);
    process.exit(1);
  }

  // Upload metadata using SDK's metadata builder
  console.log(`\n📤 Uploading image and metadata...`);
  const uploadResult = await uploadMetadata({
    name: args.name,
    symbol,
    description: args.description || args.name,
    imagePath: args.image,
    creatorAddress: account.address,
    apiKey: env.apiKey,
  });
  console.log(`✅ Metadata URI: ${uploadResult.metadataUri}`);

  // Prepare coin parameters using SDK types
  const coinParams = {
    creator: account.address,
    name: args.name,
    symbol,
    metadata: {
      type: "RAW_URI" as const,
      uri: uploadResult.metadataUri as `ipfs://${string}`,
    },
    currency: CreateConstants.ContentCoinCurrencies.ZORA,
    startingMarketCap: CreateConstants.StartingMarketCaps.LOW,
    platformReferrer: env.referrer,
    chainId: base.id,
  };

  // Preview mode - show predicted address
  if (args.preview) {
    console.log(`\n🔍 Preview Mode - Calculating predicted address...`);
    const callResult = await createCoinCall(coinParams);
    console.log(`\n📋 Coin Details:`);
    console.log(`   Name: ${args.name}`);
    console.log(`   Symbol: $${symbol}`);
    console.log(`   Metadata: ${uploadResult.metadataUri}`);
    console.log(`   Predicted Address: ${callResult.predictedCoinAddress}`);
    console.log(`   Creator: ${account.address}`);
    if (env.referrer) {
      console.log(`   Referrer: ${env.referrer}`);
    }
    console.log(`\n⚠️  Preview only - no transaction sent`);
    console.log(`   Run without --preview to create the coin`);
    return;
  }

  // Create the coin
  console.log(`\n🚀 Creating coin on Base mainnet...`);

  try {
    const result = await createCoin({
      call: coinParams,
      walletClient,
      publicClient,
    });

    console.log(`\n✅ Coin created successfully!`);
    console.log(`   Transaction: ${result.hash}`);
    console.log(`   Coin Address: ${result.address}`);
    console.log(`   Explorer: https://basescan.org/tx/${result.hash}`);
    if (result.address) {
      console.log(`   Zora: https://zora.co/coin/base:${result.address}`);
    }

    // Save to registry
    const registry = loadRegistry();
    registry.coins.push({
      address: result.address,
      name: args.name,
      symbol,
      txHash: result.hash,
      createdAt: new Date().toISOString(),
      metadataUri: uploadResult.metadataUri,
      explorerUrl: `https://basescan.org/tx/${result.hash}`,
    });
    saveRegistry(registry);
    console.log(`\n📁 Saved to coins-registry.json`);
  } catch (error: any) {
    console.error(`\n❌ Error creating coin:`);

    if (error.message?.includes("insufficient funds")) {
      console.error("   Insufficient ETH for gas fees");
      console.error(
        `   Current balance: ${(Number(balance) / 1e18).toFixed(4)} ETH`
      );
      console.error("   Please add more ETH to your wallet");
    } else if (error.message?.includes("nonce")) {
      console.error("   Transaction nonce error - try again");
    } else if (error.message?.includes("network")) {
      console.error("   Network error - check your internet connection");
      console.error("   You can retry the command");
    } else {
      console.error(`   ${error.message}`);
    }

    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
