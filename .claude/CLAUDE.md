# central-vibe-constitution

## Project Overview
A CLI tool that enables individuals and teams to manage a centralized AI coding constitution (CLAUDE.md) and sync it to local Claude Code environments. The core idea: instead of each developer manually maintaining their `~/.claude/CLAUDE.md`, this tool fetches the latest constitution from a remote source (GitHub or self-hosted GitLab) on demand — ensuring everyone always works with the most up-to-date AI behavior rules.

## Core Philosophy
- **Pull over Push**: Constitution content is always fetched live from remote. Never bundled or cached as stale npm package content.
- **Tool via npm, Content via remote**: npm distributes the CLI binary only. The actual constitution lives in a Git repository and is fetched at runtime.
- **URL-agnostic**: Any HTTPS-accessible raw file URL is valid. GitHub and GitLab (self-hosted) are first-class citizens.
- **Zero friction**: A single command syncs the global Claude Code context. No complex setup, no config files required for basic use.
- **Individual and team friendly**: Works for solo developers with personal constitutions and for organizations enforcing shared AI governance rules.
- **Scope-aware**: Clearly separates global (developer machine) and project (team repository) concerns with no config overlap.

## What This Tool Does
1. Fetches a remote markdown file from a configured URL (single file, MVP)
2. Writes the fetched content into `~/.claude/CLAUDE.md` (global scope) or `./.claude/CLAUDE.md` (project scope)
3. Auto-detects scope by searching for `.cvcrc` upward from the current directory (like git)
4. Falls back to global scope when no `.cvcrc` is found
5. Uses a built-in default URL when no configuration exists at all
6. Supports optional authentication tokens for private repositories (GitHub PAT, GitLab private token)
7. Shows sync status: last synced time, remote source, content hash

## Target Users
- Individual developers who want a personal AI constitution across all projects
- Engineering teams / organizations who want to enforce centralized AI coding standards
- OSS contributors who want to share reusable AI constitutions publicly

## Supported Remote Sources
- **GitHub**: Raw content URLs (`raw.githubusercontent.com`). Browser blob URLs (`github.com/.../blob/...`) are automatically converted to raw URLs.
- **GitLab self-hosted**: Raw API URLs (`https://your-gitlab.com/api/v4/projects/.../repository/files/.../raw`)
- **Generic HTTPS**: Any direct HTTPS URL returning plain markdown text

## Scope System

### Auto-detection (no flag needed)
```
cvc sync 실행
  └─ 현재 디렉토리부터 상위로 .cvcrc 탐색 (git과 동일한 방식)
       ├─ .cvcrc 발견 → project scope (./.claude/CLAUDE.md에 쓰기)
       └─ 미발견     → global scope  (~/.claude/CLAUDE.md에 쓰기)
```

### Global Scope
- **설치**: `npm install -g central-vibe-constitution`
- **설정 저장**: `~/.central-vibe-constitution/config.json` (머신 로컬, git 외부)
- **출력 대상**: `~/.claude/CLAUDE.md`
- **기본 URL**: `https://raw.githubusercontent.com/devdubu/AI-Vibe-Rule-Set/master/claude/constitution-rule.md`
- **URL 변경**: `cvc init` 또는 `cvc config set --url <URL>` 로 자유롭게 변경 가능

### Project Scope
- **설치**: `npm install --save-dev central-vibe-constitution`
- **설정 저장**: `.cvcrc` (프로젝트 루트, git 커밋 대상)
- **출력 대상**: `./.claude/CLAUDE.md`
- **Token**: `.cvcrc`는 git에 커밋되므로 token은 환경변수(`CVC_TOKEN`)로만 처리
- **자동 sync**: `package.json`의 `postinstall` 훅으로 `npm install` 시 자동 실행

### 중복 설치 시 충돌 방지
- 설정 파일이 완전히 분리되어 있어 config 충돌 없음
- npm scripts 안에서는 로컬 바이너리(`node_modules/.bin/cvc`) 우선 사용
- `.cvcrc` 유무로 scope가 자동 분기되어 실수로 global을 덮어쓰는 사고 방지

## Config Files

### Global config (`~/.central-vibe-constitution/config.json`)
```json
{
  "remote": "https://raw.githubusercontent.com/devdubu/AI-Vibe-Rule-Set/master/claude/constitution-rule.md",
  "token": "env:CVC_TOKEN",
  "lastSynced": "2026-01-01T00:00:00Z",
  "contentHash": "sha256:..."
}
```

### Project config (`.cvcrc`, committed to git)
```json
{
  "remote": "https://raw.githubusercontent.com/myorg/ai-rules/main/CLAUDE.md",
  "branch": "main",
  "lastSynced": "2026-01-01T00:00:00Z",
  "contentHash": "sha256:..."
}
```
> Token은 `.cvcrc`에 절대 포함하지 않음. 환경변수 `CVC_TOKEN`으로만 전달.

## Tech Stack
- **Runtime**: Node.js (>=18)
- **Language**: TypeScript (strict mode, ESM)
- **CLI Framework**: `commander`
- **HTTP Client**: Native `fetch` (Node 18+), no axios
- **Package Manager**: npm (published to npmjs.com as `central-vibe-constitution`)

## Project Structure
```
central-vibe-constitution/
├── src/
│   ├── commands/
│   │   ├── init.ts       # Interactive setup: prompt URL + token → save config
│   │   ├── sync.ts       # Core: auto-detect scope → fetch remote → write CLAUDE.md
│   │   ├── config.ts     # Set/get config values (global or project scope)
│   │   ├── status.ts     # Show last sync info, current source, scope
│   │   └── show.ts       # Print current active constitution content
│   ├── lib/
│   │   ├── fetcher.ts    # HTTP fetch logic, auth header injection, blob→raw URL conversion
│   │   ├── writer.ts     # File write to scope-resolved CLAUDE.md path
│   │   ├── resolver.ts   # Detect source type (GitHub / GitLab / generic) from URL
│   │   ├── config.ts     # Read/write config.json and .cvcrc
│   │   ├── scope.ts      # Auto-detect scope by walking up directories for .cvcrc
│   │   └── prompt.ts     # readline-based interactive prompts (text / password / confirm)
│   └── index.ts          # CLI entry point
├── .claude/
│   └── CLAUDE.md         # This file — project constitution for contributors
├── README.md
├── package.json
└── tsconfig.json
```

## CLI Commands
```bash
# 대화형 초기 설정 (URL, token 입력 → config 저장 → 즉시 sync 여부 선택)
cvc init

# Sync: scope 자동 감지 후 fetch → 해당 CLAUDE.md에 쓰기
cvc sync

# Config 조회 / 변경
cvc config get
cvc config set --url <URL>
cvc config set --token <TOKEN>      # 또는 env:CVC_TOKEN 형식

# 현재 상태 확인 (scope, URL, 마지막 sync 시각, hash)
cvc status

# 현재 적용된 constitution 내용 출력
cvc show
```

### Project scope 팀 자동화 예시
```json
// .cvcrc (git 커밋)
{
  "remote": "https://raw.githubusercontent.com/myorg/ai-rules/main/CLAUDE.md"
}

// package.json
{
  "scripts": {
    "postinstall": "cvc sync"
  },
  "devDependencies": {
    "central-vibe-constitution": "^1.0.0"
  }
}
```
팀원이 `npm install` 하는 순간 `.claude/CLAUDE.md`가 자동으로 최신화됨.

## Key Implementation Details

### URL Resolution (resolver.ts + fetcher.ts)
```typescript
// GitHub blob URL → raw URL 자동 변환
// github.com/{owner}/{repo}/blob/{branch}/{path}
// → raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}

// 인증 헤더 분기
// GitHub  → Authorization: token <PAT>
// GitLab  → PRIVATE-TOKEN: <token>
// Generic → Authorization: Bearer <token>

// token 값이 "env:VAR_NAME" 형식이면 환경변수에서 resolve
```

### Scope Detection (scope.ts)
```typescript
// 현재 디렉토리부터 루트까지 .cvcrc 탐색
// 발견 시 → project scope, .cvcrc 경로 반환
// 미발견 시 → global scope, ~/.central-vibe-constitution/config.json 사용
```

### Write Target (writer.ts)
```typescript
// Global:  ~/.claude/CLAUDE.md
// Project: {.cvcrc가 있는 디렉토리}/.claude/CLAUDE.md
// 디렉토리 없으면 자동 생성 (mkdir -p)
// 내용이 다를 경우 덮어쓰기 전 확인 프롬프트
```

### Interactive Setup (init.ts)
```
1. 현재 설정된 URL 표시 (있으면) → 새 URL 입력
2. GitHub blob URL이면 raw URL로 자동 변환 안내
3. token 입력 (에코 숨김, Enter 시 기존 유지 또는 스킵)
4. config 저장
5. 즉시 sync 여부 확인 → Y면 fetch + write 실행
```

## Coding Conventions
- TypeScript strict mode (`"strict": true`)
- ESM modules (`"type": "module"` in package.json)
- Named exports only, no default exports
- Error messages must be human-readable and actionable (not raw stack traces)
- All file I/O must handle missing directories gracefully (auto-create)
- No external dependencies beyond CLI framework and basic utilities — keep it lean
- Import paths use `.js` extension (NodeNext module resolution)

## What NOT to Do
- Do NOT bundle constitution content inside the npm package
- Do NOT cache remote content beyond writing to the target CLAUDE.md
- Do NOT require Docker, servers, or daemons — this is a pure CLI tool
- Do NOT break existing CLAUDE.md content without explicit user confirmation
- Do NOT support only one Git provider — always keep URL-agnostic design
- Do NOT store token in `.cvcrc` — it is committed to git

## Development Commands
```bash
npm install
npm run build       # tsc
npm run dev         # tsx src/index.ts
npm run lint        # eslint
npm test            # vitest
npm run release     # bumps version + git tag
```

## Future Considerations (do not implement now, just be aware)
- `cvc sync --watch` mode: poll remote every N minutes and auto-sync
- Directory fetching: pull all `.md` files from a remote directory and merge into one CLAUDE.md
- Multi-source merge: combine global org constitution + project-specific additions
- VSCode extension wrapper using same core fetch logic
