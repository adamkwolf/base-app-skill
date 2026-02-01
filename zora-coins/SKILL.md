---
name: zora-coins
description: Create Zora coins (Base App social posts) from conversational requests. Handles image uploads, metadata creation, and on-chain deployment on Base mainnet.
---

# Zora Coins Skill

Create social posts as Zora coins on Base mainnet through natural conversation.

## When to Use

Activate this skill when the user wants to:
- Create a coin, mint a coin, or make a social post
- Tokenize an image or artwork
- Post to Base App / Zora
- Keywords: "zora coin", "base app post", "social post", "turn this into a coin"

## Required Setup

Before using, ensure these environment variables are set:

```bash
# Required
PRIVATE_KEY=0x...        # Wallet private key (with 0x prefix)

# Optional
PLATFORM_REFERRER=0x...  # Referrer address (receives 20% of fees)
```

The SDK handles authentication using your wallet address (no separate API key needed).

## Usage Examples

**Direct requests:**
- "Create a coin called 'Sunset Vibes' with this image sunset.jpg"
- "Make a social post about my cat, use photo.png"
- "Mint a coin named 'GM' - description: 'good morning everyone'"

**With preview:**
- "Create a coin called 'Art Drop' with art.png, show me the preview first"

**List created coins:**
- "Show me the coins I've created"
- "List my zora coins"

## Workflow

### 1. Extract Details from Conversation

Parse the user's request to identify:
- **Name** (required): The coin/post title
- **Image** (required): Path to local image file (jpg, png, gif, webp)
- **Description** (optional): Text description for the post
- **Preview** (optional): Whether to show predicted address before signing

### 2. Create the Coin

Run the creation script:

```bash
cd zora-coins && npm run create -- \
  --name "Post Title" \
  --image "/path/to/image.jpg" \
  --description "Optional description" \
  --preview  # Optional: show address before signing
```

### 3. Handle Results

**Success:** Display the coin address, transaction hash, and explorer link.

**Errors:** Check `references/troubleshooting.md` for common issues and solutions.

## Script Reference

| Script | Purpose | Usage |
|--------|---------|-------|
| `create-coin.ts` | Create a new coin | `npm run create -- --name "..." --image "..."` |
| `upload-metadata.ts` | Upload image to IPFS | `npm run upload -- --image "..."` |
| `list-coins.ts` | Show created coins | `npm run list` |

## Coin Parameters

| Parameter | Value | Notes |
|-----------|-------|-------|
| Network | Base mainnet (8453) | Fixed |
| Currency | ZORA token | Fixed |
| Market cap | LOW | Default tier |
| Category | "social" | Base App standard |
| Symbol | Auto-generated | From first letters of name |
| Owners | Creator wallet | From PRIVATE_KEY |

## References

- [Metadata Format](references/metadata-format.md) - Detailed metadata schema
- [Troubleshooting](references/troubleshooting.md) - Common errors and fixes
