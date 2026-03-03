# central-vibe-constitution

## Project Overview
A CLI tool that enables individuals and teams to manage a centralized AI coding constitution (CLAUDE.md) and sync it to local Claude Code environments. The core idea: instead of each developer manually maintaining their `~/.claude/CLAUDE.md`, this tool fetches the latest constitution from a remote source (GitHub or self-hosted GitLab) on demand — ensuring everyone always works with the most up-to-date AI behavior rules.

## Core Philosophy
- **Pull over Push**: Constitution content is always fetched live from remote. Never bundled or cached as stale npm package content.
- **Tool via npm, Content via remote**: npm distributes the CLI binary only. The actual constitution lives in a Git repository and is fetched at runtime.
- **URL-agnostic**: Any HTTPS-accessible raw file URL is valid. GitHub and GitLab (self-hosted) are first-class citizens.
- **Zero friction**: A single command syncs the global Claude Code context. No complex setup, no config files required for basic use.
- **Individual and team friendly**: Works for solo developers with personal constitutions and for organizations enforcing shared AI governance rules.

## What This Tool Does
1. Fetches a remote CLAUDE.md (or equivalent markdown file) from a configured URL
2. Writes the fetched content into `~/.claude/CLAUDE.md` (global Claude Code context)
3. Optionally writes into `./CLAUDE.md` (project-level context)
4. Supports authentication tokens for private repositories (GitHub PAT, GitLab private token)
5. Shows sync status: last synced time, remote source, content hash

## Target Users
- Individual developers who want a personal AI constitution across all projects
- Engineering teams / organizations who want to enforce centralized AI coding standards
- OSS contributors who want to share reusable AI constitutions publicly

## Supported Remote Sources
- **GitHub**: Raw content URLs (`raw.githubusercontent.com`)
- **GitLab self-hosted**: Raw API URLs (`https://your-gitlab.com/api/v4/projects/.../repository/files/.../raw`)
- **Generic HTTPS**: Any direct HTTPS URL returning plain markdown text

## Tech Stack
- **Runtime**: Node.js (>=18)
- **Language**: JavaScript (ESM) or TypeScript — prefer TypeScript for public OSS credibility
- **CLI Framework**: `commander` or `yargs`
- **HTTP Client**: Native `fetch` (Node 18+), no axios
- **Config Storage**: `~/.central-vibe-constitution/config.json`
- **Package Manager**: npm (published to npmjs.com as `central-vibe-constitution`)

## Project Structure
```
central-vibe-constitution/
├── src/
│   ├── commands/
│   │   ├── sync.ts       # Core: fetch remote → write ~/.claude/CLAUDE.md
│   │   ├── config.ts     # Set/get remote URL and auth token
│   │   └── status.ts     # Show last sync info, current source
│   ├── lib/
│   │   ├── fetcher.ts    # HTTP fetch logic, auth header injection
│   │   ├── writer.ts     # File write to ~/.claude/CLAUDE.md and ./CLAUDE.md
│   │   └── resolver.ts   # Detect source type (GitHub / GitLab / generic) from URL
│   └── index.ts          # CLI entry point
├── CLAUDE.md             # This file — project constitution for contributors
├── README.md
├── package.json
└── tsconfig.json
```

## CLI Commands
```bash
# Initial setup: set remote constitution URL
cvc config set --url https://raw.githubusercontent.com/org/repo/main/CLAUDE.md
cvc config set --url https://gitlab.internal.com/ai/constitution/raw/main/CLAUDE.md
cvc config set --token <PRIVATE_TOKEN>   # for private repos

# Sync: fetch latest and apply to ~/.claude/CLAUDE.md
cvc sync

# Sync to project level as well
cvc sync --project

# Check current status
cvc status

# View current active constitution
cvc show
```

## Key Implementation Details

### URL Resolution (resolver.ts)
Detect source type from URL and apply correct auth header:
```typescript
// GitHub → Authorization: token <PAT>
// GitLab → PRIVATE-TOKEN: <token>
// Generic → Authorization: Bearer <token> (fallback)
```

### Write Target (writer.ts)
```typescript
// Global: always ~/.claude/CLAUDE.md
// Project: ./CLAUDE.md (only with --project flag, warn if already exists)
// Never overwrite without confirmation if content differs significantly
```

### Config File (~/.central-vibe-constitution/config.json)
```json
{
  "remote": "https://...",
  "token": "env:CVC_TOKEN",   // support env var references for security
  "lastSynced": "2026-01-01T00:00:00Z",
  "contentHash": "sha256:..."
}
```

## Coding Conventions
- TypeScript strict mode (`"strict": true`)
- ESM modules (`"type": "module"` in package.json)
- Named exports only, no default exports
- Error messages must be human-readable and actionable (not raw stack traces)
- All file I/O must handle missing directories gracefully (auto-create with `mkdirp`)
- No external dependencies beyond CLI framework and basic utilities — keep it lean

## What NOT to Do
- Do NOT bundle constitution content inside the npm package
- Do NOT cache remote content beyond writing to `~/.claude/CLAUDE.md`
- Do NOT require Docker, servers, or daemons — this is a pure CLI tool
- Do NOT break existing `~/.claude/CLAUDE.md` content without explicit user confirmation
- Do NOT support only one Git provider — always keep URL-agnostic design

## Development Commands
```bash
npm install
npm run build       # tsc
npm run dev         # ts-node src/index.ts
npm run lint        # eslint
npm test            # vitest
npm run release     # bumps version + git tag
```

## Future Considerations (do not implement now, just be aware)
- `cvc sync --watch` mode: poll remote every N minutes and auto-sync
- Team config: share config URL via `.cvcrc` in project root (committed to git)
- Multi-source merge: combine global org constitution + project-specific additions
- VSCode extension wrapper using same core fetch logic
