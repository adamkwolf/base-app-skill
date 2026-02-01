# Zora Coin Metadata Format

This document describes the metadata schema used for Zora coins on Base App.

## JSON Schema

```json
{
  "name": "Post Title",
  "description": "Description of the post",
  "image": "ipfs://...",
  "content": {
    "mime": "image/jpeg",
    "uri": "ipfs://..."
  },
  "attributes": [
    {
      "trait_type": "Category",
      "value": "social"
    }
  ]
}
```

## Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Display name of the coin/post |
| `description` | string | Yes | Text description (can be same as name) |
| `image` | string | Yes | IPFS URI of the image (for thumbnails) |
| `content.mime` | string | Yes | MIME type of the media |
| `content.uri` | string | Yes | IPFS URI of the full media content |
| `attributes` | array | No | Array of trait objects |

## Categories

The `Category` attribute determines how the post appears on Base App:

| Category | Description |
|----------|-------------|
| `social` | Standard social post (default for this skill) |
| `art` | Artwork or creative piece |
| `music` | Audio content |
| `video` | Video content |
| `photography` | Photography |

## Supported Image Formats

| Format | MIME Type | Extension |
|--------|-----------|-----------|
| JPEG | `image/jpeg` | `.jpg`, `.jpeg` |
| PNG | `image/png` | `.png` |
| GIF | `image/gif` | `.gif` |
| WebP | `image/webp` | `.webp` |

## IPFS URIs

All media is stored on IPFS via Zora's storage API. URIs follow this format:

```
ipfs://bafkreixxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

The IPFS hash (CID) is generated when uploading through the Zora API.

## Example Metadata

### Simple Social Post

```json
{
  "name": "GM everyone",
  "description": "Good morning to the Base community!",
  "image": "ipfs://bafkreiexample123...",
  "content": {
    "mime": "image/png",
    "uri": "ipfs://bafkreiexample123..."
  },
  "attributes": [
    {
      "trait_type": "Category",
      "value": "social"
    }
  ]
}
```

### Art Post

```json
{
  "name": "Sunset Collection #1",
  "description": "A beautiful sunset captured in the mountains",
  "image": "ipfs://bafkreiexample456...",
  "content": {
    "mime": "image/jpeg",
    "uri": "ipfs://bafkreiexample456..."
  },
  "attributes": [
    {
      "trait_type": "Category",
      "value": "art"
    },
    {
      "trait_type": "Collection",
      "value": "Sunset Series"
    }
  ]
}
```

## Validation

Before uploading, the skill validates:

1. Image file exists and is readable
2. File extension matches supported formats
3. Name is non-empty
4. API key is valid

The Zora API performs additional validation on upload.
