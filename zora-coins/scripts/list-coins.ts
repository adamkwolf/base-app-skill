import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = join(__dirname, "..", "coins-registry.json");

interface CoinEntry {
  address: string;
  name: string;
  symbol: string;
  txHash: string;
  createdAt: string;
  metadataUri: string;
  explorerUrl: string;
}

interface Registry {
  coins: CoinEntry[];
}

function loadRegistry(): Registry {
  if (!existsSync(REGISTRY_PATH)) {
    return { coins: [] };
  }
  return JSON.parse(readFileSync(REGISTRY_PATH, "utf-8"));
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function main() {
  const registry = loadRegistry();

  if (registry.coins.length === 0) {
    console.log("\n📭 No coins created yet.\n");
    console.log("Create your first coin with:");
    console.log('  npm run create -- --name "My Post" --image "/path/to/image.jpg"\n');
    return;
  }

  console.log(`\n🪙 Created Coins (${registry.coins.length} total)\n`);
  console.log("─".repeat(60));

  for (const coin of registry.coins) {
    console.log(`\n  ${coin.name} ($${coin.symbol})`);
    console.log(`  Created: ${formatDate(coin.createdAt)}`);
    if (coin.address) {
      console.log(`  Address: ${coin.address}`);
      console.log(`  Zora: https://zora.co/coin/base:${coin.address}`);
    }
    console.log(`  Explorer: ${coin.explorerUrl}`);
    console.log("─".repeat(60));
  }

  console.log();
}

main();
