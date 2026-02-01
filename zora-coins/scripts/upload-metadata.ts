import {
  createMetadataBuilder,
  createZoraUploaderForCreator,
  setApiKey,
} from "@zoralabs/coins-sdk";
import { readFileSync, existsSync } from "fs";
import { basename } from "path";
import type { Address } from "viem";

interface MetadataParams {
  name: string;
  symbol: string;
  description: string;
  imagePath: string;
  creatorAddress: Address;
  apiKey: string;
}

// Get MIME type from file extension
function getMimeType(filePath: string): string {
  const ext = filePath.toLowerCase().substring(filePath.lastIndexOf("."));
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

// Create a File object from a local file path
function fileFromPath(filePath: string): File {
  const data = readFileSync(filePath);
  const mimeType = getMimeType(filePath);
  const fileName = basename(filePath);
  return new File([data], fileName, { type: mimeType });
}

// Upload metadata using SDK's metadata builder
export async function uploadMetadata(params: MetadataParams): Promise<{
  metadataUri: string;
  createMetadataParameters: {
    name: string;
    symbol: string;
    metadata: { type: "RAW_URI"; uri: string };
  };
}> {
  const { name, symbol, description, imagePath, creatorAddress, apiKey } = params;

  // Validate image exists
  if (!existsSync(imagePath)) {
    throw new Error(`Image file not found: ${imagePath}`);
  }

  // Set API key for SDK
  setApiKey(apiKey);

  // Create uploader using SDK's Zora provider
  const uploader = createZoraUploaderForCreator(creatorAddress);

  // Build metadata using SDK's builder
  const imageFile = fileFromPath(imagePath);

  const builder = createMetadataBuilder()
    .withName(name)
    .withSymbol(symbol)
    .withDescription(description)
    .withImage(imageFile)
    .withProperties({ Category: "social" });

  // Validate and upload
  builder.validate();
  const result = await builder.upload(uploader);

  return {
    metadataUri: result.url,
    createMetadataParameters: result.createMetadataParameters,
  };
}

// CLI mode
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  let imagePath: string | undefined;
  let name = "Untitled";
  let symbol = "COIN";
  let description = "";
  let creatorAddress: Address | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--image" && args[i + 1]) {
      imagePath = args[++i];
    } else if (args[i] === "--name" && args[i + 1]) {
      name = args[++i];
    } else if (args[i] === "--symbol" && args[i + 1]) {
      symbol = args[++i];
    } else if (args[i] === "--description" && args[i + 1]) {
      description = args[++i];
    } else if (args[i] === "--creator" && args[i + 1]) {
      creatorAddress = args[++i] as Address;
    }
  }

  if (!imagePath) {
    console.error(
      'Usage: npm run upload -- --image "/path/to/image" --creator "0x..." [--name "..."] [--symbol "..."] [--description "..."]'
    );
    process.exit(1);
  }

  if (!creatorAddress) {
    console.error("Error: --creator address is required for authentication");
    process.exit(1);
  }

  uploadMetadata({
    name,
    symbol,
    description: description || name,
    imagePath,
    creatorAddress,
  })
    .then((result) => {
      console.log(`Metadata URI: ${result.metadataUri}`);
    })
    .catch((error) => {
      console.error("Upload failed:", error.message);
      process.exit(1);
    });
}
