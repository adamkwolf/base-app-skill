# Zora Coins Skill

An OpenClaw skill for creating Zora coins (Base App social posts) through natural conversation.

## What It Does

This skill lets you create tokenized social posts on Base mainnet via Zora. Simply describe what you want to post, provide an image, and the agent handles the rest—uploading to IPFS, creating metadata, and deploying the coin on-chain.

## Setup

1. **Install dependencies:**
   ```bash
   cd zora-coins && npm install
   ```

2. **Set environment variables:**
   ```bash
   export PRIVATE_KEY=0x...        # Your wallet private key (with 0x prefix)
   export PLATFORM_REFERRER=0x...  # Optional: referrer address for fee rewards
   ```

## Usage

Talk naturally to the agent:

- "Create a coin called 'Sunset Vibes' with this image sunset.jpg"
- "Make a social post about my cat, use photo.png"
- "Mint a coin named 'GM' with description 'good morning everyone'"

The agent will:
1. Extract the name, description, and image from your request
2. Choose an appropriate symbol for the coin
3. Upload the image and metadata to IPFS
4. Deploy the coin on Base mainnet
5. Return the coin address and explorer link

### Preview Mode

Ask for a preview to see the predicted address before signing:

- "Create a coin called 'Art Drop' with art.png, show me the preview first"

### List Created Coins

- "Show me the coins I've created"
- "List my zora coins"

## Scripts

| Command | Description |
|---------|-------------|
| `npm run create` | Create a new coin |
| `npm run upload` | Upload image/metadata only |
| `npm run list` | Show all created coins |

### Direct Script Usage

```bash
npm run create -- \
  --name "My Post" \
  --symbol "MYPOST" \
  --image "/path/to/image.jpg" \
  --description "Optional description" \
  --preview  # Optional
```

## Coin Parameters

| Parameter | Value |
|-----------|-------|
| Network | Base mainnet (8453) |
| Currency | ZORA token |
| Market cap | LOW |
| Category | social |

## Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

## Troubleshooting

See [references/troubleshooting.md](references/troubleshooting.md) for common errors and solutions.

## Created Coins Registry

All created coins are tracked in `coins-registry.json` with:
- Coin address
- Name and symbol
- Transaction hash
- Creation timestamp
- Metadata URI
- Explorer link
