# base-app-skill

A collection of AI agent skills for interacting with the Base blockchain ecosystem. These skills enable conversational creation of on-chain assets without requiring users to understand blockchain mechanics directly.

## Overview

This repository contains skills designed for AI agents (such as Claude Code) that allow natural language interaction with Base blockchain protocols. Each skill is self-contained with its own documentation, scripts, and dependencies.

## Available Skills

| Skill | Description | Status |
|-------|-------------|--------|
| [zora-coins](./zora-coins/) | Create tokenized social posts on Base via Zora Protocol | In Development |

## Repository Structure

```
base-app-skill/
├── README.md           # This file
├── .claude/            # Claude Code configuration
└── <skill-name>/       # Individual skill directories
    ├── README.md       # Setup and usage
    ├── SKILL.md        # Interface specification for AI agents
    ├── package.json    # Dependencies
    ├── scripts/        # Executable scripts
    └── references/     # Additional documentation
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/base-app-skill.git
   cd base-app-skill
   ```

2. Navigate to the skill you want to use:
   ```bash
   cd zora-coins
   ```

3. Follow the skill-specific README for setup instructions.

## Adding New Skills

Each skill should include:

- **README.md** - Human-readable setup and usage guide
- **SKILL.md** - Interface specification defining when/how AI agents should use the skill
- **package.json** - Node.js dependencies and scripts
- **scripts/** - Executable TypeScript/JavaScript files
- **references/** - Additional documentation (metadata formats, troubleshooting, etc.)

## Requirements

- Node.js 18+
- npm or yarn
- A Base-compatible wallet with funds (for on-chain operations)

## License

MIT
