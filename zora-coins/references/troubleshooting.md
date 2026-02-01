# Troubleshooting Guide

Common errors and solutions when using the Zora Coins skill.

## Environment Errors

### "PRIVATE_KEY environment variable is required"

**Cause:** The wallet private key is not set.

**Solution:**
```bash
export PRIVATE_KEY=0x1234...  # Your 64-character hex key with 0x prefix
```

Or add to your `.env` file:
```
PRIVATE_KEY=0x1234...
```

### "PRIVATE_KEY must be a 64-character hex string with 0x prefix"

**Cause:** Invalid private key format.

**Solution:**
- Must start with `0x`
- Must be exactly 66 characters (0x + 64 hex chars)
- Example: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

## Wallet Errors

### "Insufficient ETH balance for gas fees"

**Cause:** Wallet doesn't have enough ETH for transaction gas.

**Solution:**
1. Check the displayed wallet address
2. Send at least 0.001 ETH to that address on Base mainnet
3. Bridge ETH from Ethereum mainnet using https://bridge.base.org

### "Transaction nonce error"

**Cause:** A previous transaction is pending or nonce mismatch.

**Solution:**
- Wait a few minutes for pending transactions to clear
- Retry the command

## Image Errors

### "Unsupported image format"

**Cause:** Image file has unsupported extension.

**Supported formats:**
- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`

**Solution:** Convert your image to a supported format.

### "Image file not found"

**Cause:** The specified image path doesn't exist.

**Solution:**
- Check the file path is correct
- Use absolute paths for reliability: `/Users/you/images/photo.jpg`
- Ensure file has correct permissions

## Upload Errors

### "Image upload failed: 401"

**Cause:** Authentication failed with Zora API.

**Solution:**
- The SDK uses your wallet address for authentication
- Ensure your PRIVATE_KEY is valid and correctly formatted
- Retry the command

### "Image upload failed: 413"

**Cause:** Image file is too large.

**Solution:**
- Reduce image file size (compress or resize)
- Recommended max: 10MB

### "Metadata upload failed"

**Cause:** Error uploading the JSON metadata.

**Solution:**
- Check internet connection
- Retry the command
- If persistent, check Zora API status

## Network Errors

### "Network error - check your internet connection"

**Cause:** Unable to reach Base RPC or Zora API.

**Solution:**
- Check internet connection
- Try again in a few minutes
- Base RPC may be experiencing issues

### Transaction Stuck/Pending

**Cause:** Gas price too low or network congestion.

**Solution:**
- Wait for the transaction to complete or fail
- Check status on https://basescan.org
- Future transactions will process after the pending one resolves

## Registry Errors

### "coins-registry.json" issues

**Cause:** Corrupted or invalid JSON in registry file.

**Solution:**
1. Back up the file: `cp coins-registry.json coins-registry.backup.json`
2. Fix JSON syntax or delete and let it regenerate
3. Valid format:
```json
{
  "coins": []
}
```

## Getting Help

If you encounter an error not listed here:

1. Check the full error message for details
2. Verify all environment variables are set correctly
3. Ensure you have sufficient ETH balance
4. Check Zora API status at https://status.zora.co
5. Check Base network status at https://status.base.org
