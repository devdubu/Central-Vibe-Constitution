# Central Vibe Constitution

**[English](#english)** | **[한국어](#한국어)**

---

<a name="english"></a>

# English

> Sync your AI coding constitution (`CLAUDE.md`) from a remote source — globally or per project.

**Central Vibe Constitution (CVC)** is a CLI tool that fetches a centralized `CLAUDE.md` from a Git repository and applies it to your [Claude Code](https://claude.ai/code) environment. Instead of each developer manually maintaining their own AI behavior rules, everyone stays in sync with the latest version from a single source of truth.

## Table of Contents

- [How It Works](#how-it-works)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Commands](#cli-commands)
- [Scope System](#scope-system)
- [Customization](#customization)
- [Team Setup](#team-setup)
- [Authentication](#authentication)

---

## How It Works

```
Remote Git Repository (GitHub / GitLab / Any HTTPS URL)
        ↓  cvc sync
   Fetches CLAUDE.md
        ↓
  Scope auto-detected
  ├─ .cvcrc found → project scope → ./.claude/CLAUDE.md
  └─ no .cvcrc   → global scope  → ~/.claude/CLAUDE.md
```

CVC uses a **scope system** to decide where to write the constitution:

- **Global scope** — applies to all Claude Code sessions on your machine
- **Project scope** — applies only to the current project (team-shared via `.cvcrc`)

Scope is **auto-detected** by searching for a `.cvcrc` file from your current directory upward (same strategy as git). No flags needed.

---

## Installation

### Global (recommended for individual developers)

```bash
npm install -g @devdubu/central-vibe-constitution
```

### Project (for teams)

```bash
npm install --save-dev @devdubu/central-vibe-constitution
```

> **Note:** Requires Node.js >= 18

---

## Quick Start

### Individual Developer

```bash
# 1. Install globally
npm install -g @devdubu/central-vibe-constitution

# 2. Run interactive setup
cvc init

# 3. Done — your ~/.claude/CLAUDE.md is now synced
```

### Team Project

```bash
# 1. Install as devDependency
npm install --save-dev @devdubu/central-vibe-constitution

# 2. Initialize project config (.cvcrc)
cvc init

# 3. Commit .cvcrc to git
git add .cvcrc
git commit -m "chore: add cvc project config"

# 4. Teammates get auto-synced on npm install (via postinstall)
```

---

## CLI Commands

### `cvc init`

Interactive setup wizard. Prompts for remote URL and auth token, then saves config and optionally syncs immediately.

```bash
cvc init
```

```
Welcome to Central Vibe Constitution setup!

Scope: global
Config: /Users/you/.central-vibe-constitution/config.json

Remote constitution URL (current: https://raw.githubusercontent.com/...):
  → Detected source: github

Auth token (press Enter to skip):

✓ Config saved to ~/.central-vibe-constitution/config.json

Sync constitution to ~/.claude/CLAUDE.md now? (Y/n): y

Syncing...
✓ Constitution written to ~/.claude/CLAUDE.md
```

---

### `cvc sync`

Fetch the latest constitution from remote and write to the scope-resolved path. Scope is auto-detected — no flags needed.

```bash
cvc sync
```

```
Scope:  global
From:   https://raw.githubusercontent.com/devdubu/AI-Vibe-Rule-Set/master/claude/constitution-rule.md
To:     /Users/you/.claude/CLAUDE.md

✓ Constitution synced.
```

---

### `cvc status`

Show current scope, configuration, and last sync info.

```bash
cvc status
```

```
Central Vibe Constitution — Status

Scope:        global
Config:       /Users/you/.central-vibe-constitution/config.json
Output:       /Users/you/.claude/CLAUDE.md
Source type:  github
Remote URL:   https://raw.githubusercontent.com/...
Auth token:   (none)
Last synced:  2026-03-04T09:00:00.000Z
Content hash: sha256:abc123...
```

---

### `cvc show`

Print the currently applied constitution content.

```bash
cvc show
```

---

### `cvc config get`

Show the current configuration for the detected scope.

```bash
cvc config get
```

---

### `cvc config set`

Update configuration values without the interactive wizard.

```bash
# Set remote URL
cvc config set --url https://raw.githubusercontent.com/your-org/your-repo/main/CLAUDE.md

# Set auth token (global scope only)
cvc config set --token ghp_yourtoken

# Reference an environment variable instead of storing the token directly
cvc config set --token env:GITHUB_TOKEN
```

---

## Scope System

CVC automatically determines whether to operate in **global** or **project** scope by searching for a `.cvcrc` file from your current directory upward — the same way git finds `.git`.

| | Global Scope | Project Scope |
|---|---|---|
| **Trigger** | No `.cvcrc` found | `.cvcrc` found in current or parent directory |
| **Config file** | `~/.central-vibe-constitution/config.json` | `.cvcrc` in project root |
| **Output** | `~/.claude/CLAUDE.md` | `./.claude/CLAUDE.md` |
| **Auth token** | Stored in config or via `CVC_TOKEN` env var | `CVC_TOKEN` env var only |
| **Intended for** | Individual developers | Teams |

### Why separate scopes?

- **No config conflicts** — config files are completely separate
- **No accidental overwrites** — running `cvc sync` in a team project never touches your global `~/.claude/CLAUDE.md`
- **Team-controlled** — `.cvcrc` is committed to git, so the entire team shares the same source URL

---

## Customization

### Use your own constitution URL

You can point CVC to any publicly accessible raw markdown file:

```bash
# GitHub (blob URLs are auto-converted to raw URLs)
cvc config set --url https://github.com/your-org/your-repo/blob/main/CLAUDE.md

# GitLab self-hosted
cvc config set --url https://gitlab.internal.com/ai/rules/raw/main/CLAUDE.md

# Any HTTPS URL returning plain markdown
cvc config set --url https://your-server.com/claude-rules.md
```

> **Tip:** GitHub blob URLs (`github.com/.../blob/...`) are automatically converted to raw URLs (`raw.githubusercontent.com/...`). You can paste either format.

### Use the default constitution

If no URL is configured, CVC falls back to the built-in default:

```
https://raw.githubusercontent.com/devdubu/AI-Vibe-Rule-Set/master/claude/constitution-rule.md
```

You can always reset to default by running `cvc init` and pressing Enter without typing a URL.

### Token via environment variable

Instead of storing a token in your config file, you can reference an environment variable:

```bash
# Store a reference (not the actual token)
cvc config set --token env:MY_GITHUB_TOKEN

# Then set the actual token in your shell
export MY_GITHUB_TOKEN=ghp_yourtoken

# Or use the default env var name
export CVC_TOKEN=ghp_yourtoken
```

---

## Team Setup

Add CVC to your project so teammates automatically get the latest constitution on `npm install`.

### 1. Install and initialize

```bash
npm install --save-dev @devdubu/central-vibe-constitution
cvc init
```

### 2. Add postinstall hook to `package.json`

```json
{
  "scripts": {
    "postinstall": "cvc sync"
  }
}
```

### 3. Commit `.cvcrc` to git

```json
// .cvcrc (commit this)
{
  "remote": "https://raw.githubusercontent.com/your-org/your-repo/main/CLAUDE.md"
}
```

```bash
git add .cvcrc package.json
git commit -m "chore: add shared AI constitution via cvc"
```

From now on, every `npm install` automatically syncs the team constitution to `.claude/CLAUDE.md`.

---

## Authentication

### Public repositories

No token needed. CVC fetches public URLs without authentication.

### Private repositories

Set your token via environment variable (recommended) or store it in global config:

```bash
# Option 1: Environment variable (works for both global and project scope)
export CVC_TOKEN=ghp_yourtoken

# Option 2: Store in global config (global scope only)
cvc config set --token ghp_yourtoken

# Option 3: Reference an env var in config
cvc config set --token env:GITHUB_TOKEN
```

> **Security note:** Never put a token in `.cvcrc`. It is committed to git. CVC enforces this — tokens are always stripped from `.cvcrc` writes.

### Token permissions required

| Provider | Token type | Required scope |
|----------|------------|----------------|
| GitHub | Personal Access Token (classic) | `repo` (private) or none (public) |
| GitLab | Personal Access Token | `read_api` |

---

## License

MIT

---
---

<a name="한국어"></a>

# 한국어

> AI 코딩 헌법(`CLAUDE.md`)을 원격 저장소에서 가져와 글로벌 또는 프로젝트 단위로 동기화합니다.

**Central Vibe Constitution (CVC)** 는 Git 저장소에서 중앙화된 `CLAUDE.md`를 가져와 [Claude Code](https://claude.ai/code) 환경에 적용하는 CLI 도구입니다. 각 개발자가 AI 행동 규칙을 직접 관리하는 대신, 모든 팀원이 하나의 원격 소스에서 항상 최신 버전을 유지할 수 있습니다.

## 목차

- [동작 방식](#동작-방식)
- [설치](#설치)
- [빠른 시작](#빠른-시작)
- [CLI 명령어](#cli-명령어)
- [Scope 시스템](#scope-시스템)
- [커스터마이징](#커스터마이징)
- [팀 셋업](#팀-셋업)
- [인증](#인증)

---

## 동작 방식

```
원격 Git 저장소 (GitHub / GitLab / HTTPS URL)
        ↓  cvc sync
   CLAUDE.md 가져오기
        ↓
  Scope 자동 감지
  ├─ .cvcrc 발견 → project scope → ./.claude/CLAUDE.md
  └─ .cvcrc 없음 → global scope  → ~/.claude/CLAUDE.md
```

CVC는 **scope 시스템**으로 어디에 헌법을 쓸지 결정합니다:

- **Global scope** — 머신 전체의 모든 Claude Code 세션에 적용
- **Project scope** — 현재 프로젝트에만 적용 (`.cvcrc`로 팀 공유)

Scope는 현재 디렉토리부터 상위로 `.cvcrc` 파일을 탐색해 **자동 감지**됩니다 (git이 `.git`을 찾는 방식과 동일). 별도 플래그 불필요.

---

## 설치

### 글로벌 설치 (개인 개발자 권장)

```bash
npm install -g @devdubu/central-vibe-constitution
```

### 프로젝트 설치 (팀용)

```bash
npm install --save-dev @devdubu/central-vibe-constitution
```

> **요구사항:** Node.js >= 18

---

## 빠른 시작

### 개인 개발자

```bash
# 1. 글로벌 설치
npm install -g @devdubu/central-vibe-constitution

# 2. 대화형 초기 설정
cvc init

# 3. 완료 — ~/.claude/CLAUDE.md가 동기화됩니다
```

### 팀 프로젝트

```bash
# 1. devDependency로 설치
npm install --save-dev @devdubu/central-vibe-constitution

# 2. 프로젝트 설정 초기화 (.cvcrc 생성)
cvc init

# 3. .cvcrc를 git에 커밋
git add .cvcrc
git commit -m "chore: add cvc project config"

# 4. 이후 팀원이 npm install 하면 자동으로 동기화 (postinstall)
```

---

## CLI 명령어

### `cvc init`

대화형 초기 설정 마법사. 원격 URL과 인증 토큰을 입력받고 설정을 저장한 뒤 즉시 동기화 여부를 선택할 수 있습니다.

```bash
cvc init
```

```
Welcome to Central Vibe Constitution setup!

Scope: global
Config: /Users/you/.central-vibe-constitution/config.json

Remote constitution URL (current: https://raw.githubusercontent.com/...):
  → Detected source: github

Auth token (press Enter to skip):

✓ Config saved to ~/.central-vibe-constitution/config.json

Sync constitution to ~/.claude/CLAUDE.md now? (Y/n): y

Syncing...
✓ Constitution written to ~/.claude/CLAUDE.md
```

---

### `cvc sync`

원격에서 최신 헌법을 가져와 scope에 맞는 경로에 씁니다. Scope는 자동 감지 — 플래그 불필요.

```bash
cvc sync
```

```
Scope:  global
From:   https://raw.githubusercontent.com/devdubu/AI-Vibe-Rule-Set/master/claude/constitution-rule.md
To:     /Users/you/.claude/CLAUDE.md

✓ Constitution synced.
```

---

### `cvc status`

현재 scope, 설정, 마지막 동기화 정보를 표시합니다.

```bash
cvc status
```

```
Central Vibe Constitution — Status

Scope:        global
Config:       /Users/you/.central-vibe-constitution/config.json
Output:       /Users/you/.claude/CLAUDE.md
Source type:  github
Remote URL:   https://raw.githubusercontent.com/...
Auth token:   (none)
Last synced:  2026-03-04T09:00:00.000Z
Content hash: sha256:abc123...
```

---

### `cvc show`

현재 적용된 헌법 내용을 출력합니다.

```bash
cvc show
```

---

### `cvc config get`

감지된 scope의 현재 설정을 표시합니다.

```bash
cvc config get
```

---

### `cvc config set`

대화형 마법사 없이 설정값을 직접 변경합니다.

```bash
# 원격 URL 설정
cvc config set --url https://raw.githubusercontent.com/your-org/your-repo/main/CLAUDE.md

# 인증 토큰 설정 (global scope 전용)
cvc config set --token ghp_yourtoken

# 토큰 값 대신 환경변수 참조
cvc config set --token env:GITHUB_TOKEN
```

---

## Scope 시스템

CVC는 현재 디렉토리부터 상위로 `.cvcrc` 파일을 탐색해 **global** 또는 **project** scope를 자동으로 결정합니다 — git이 `.git`을 찾는 방식과 동일합니다.

| | Global Scope | Project Scope |
|---|---|---|
| **감지 조건** | `.cvcrc` 없음 | 현재 또는 상위 디렉토리에 `.cvcrc` 존재 |
| **설정 파일** | `~/.central-vibe-constitution/config.json` | 프로젝트 루트의 `.cvcrc` |
| **출력 경로** | `~/.claude/CLAUDE.md` | `./.claude/CLAUDE.md` |
| **인증 토큰** | 설정 파일 저장 또는 `CVC_TOKEN` 환경변수 | `CVC_TOKEN` 환경변수만 사용 |
| **대상** | 개인 개발자 | 팀 |

### Scope를 분리하는 이유

- **설정 충돌 없음** — 설정 파일이 완전히 분리되어 있음
- **실수로 덮어쓰기 방지** — 팀 프로젝트에서 `cvc sync` 실행해도 `~/.claude/CLAUDE.md`에 영향 없음
- **팀 통제** — `.cvcrc`가 git에 커밋되므로 팀 전체가 동일한 소스 URL 공유

---

## 커스터마이징

### 나만의 헌법 URL 사용하기

공개적으로 접근 가능한 마크다운 파일 URL이라면 무엇이든 사용 가능합니다:

```bash
# GitHub (blob URL은 raw URL로 자동 변환)
cvc config set --url https://github.com/your-org/your-repo/blob/main/CLAUDE.md

# GitLab 자체 호스팅
cvc config set --url https://gitlab.internal.com/ai/rules/raw/main/CLAUDE.md

# 마크다운을 반환하는 HTTPS URL이면 무엇이든
cvc config set --url https://your-server.com/claude-rules.md
```

> **팁:** GitHub 브라우저 URL(`github.com/.../blob/...`)을 붙여넣으면 raw URL(`raw.githubusercontent.com/...`)로 자동 변환됩니다. 어떤 형식이든 입력 가능합니다.

### 기본 헌법 사용하기

URL이 설정되어 있지 않으면 기본값으로 자동 폴백됩니다:

```
https://raw.githubusercontent.com/devdubu/AI-Vibe-Rule-Set/master/claude/constitution-rule.md
```

`cvc init` 실행 후 URL 입력 없이 Enter를 누르면 언제든지 기본값으로 초기화됩니다.

### 환경변수로 토큰 관리하기

설정 파일에 토큰을 직접 저장하는 대신 환경변수를 참조할 수 있습니다:

```bash
# 실제 토큰 대신 참조값 저장
cvc config set --token env:MY_GITHUB_TOKEN

# 실제 토큰은 쉘에서 설정
export MY_GITHUB_TOKEN=ghp_yourtoken

# 또는 기본 환경변수명 사용
export CVC_TOKEN=ghp_yourtoken
```

---

## 팀 셋업

프로젝트에 CVC를 추가하면 팀원이 `npm install` 할 때마다 최신 헌법이 자동으로 동기화됩니다.

### 1. 설치 및 초기화

```bash
npm install --save-dev @devdubu/central-vibe-constitution
cvc init
```

### 2. `package.json`에 postinstall 훅 추가

```json
{
  "scripts": {
    "postinstall": "cvc sync"
  }
}
```

### 3. `.cvcrc`를 git에 커밋

```json
// .cvcrc (git에 커밋)
{
  "remote": "https://raw.githubusercontent.com/your-org/your-repo/main/CLAUDE.md"
}
```

```bash
git add .cvcrc package.json
git commit -m "chore: add shared AI constitution via cvc"
```

이후 `npm install`을 실행할 때마다 `.claude/CLAUDE.md`가 자동으로 최신화됩니다.

---

## 인증

### 공개 저장소

토큰 불필요. CVC가 인증 없이 공개 URL을 가져옵니다.

### 비공개 저장소

환경변수(권장) 또는 글로벌 설정에 토큰을 설정합니다:

```bash
# 방법 1: 환경변수 (global/project scope 모두 동작)
export CVC_TOKEN=ghp_yourtoken

# 방법 2: 글로벌 설정에 저장 (global scope 전용)
cvc config set --token ghp_yourtoken

# 방법 3: 설정에 환경변수 참조 저장
cvc config set --token env:GITHUB_TOKEN
```

> **보안 주의:** `.cvcrc`에는 절대 토큰을 넣지 마세요. `.cvcrc`는 git에 커밋됩니다. CVC가 이를 강제합니다 — `.cvcrc` 저장 시 토큰은 항상 제거됩니다.

### 필요한 토큰 권한

| 제공자 | 토큰 종류 | 필요 권한 |
|--------|-----------|-----------|
| GitHub | Personal Access Token (classic) | `repo` (비공개) 또는 불필요 (공개) |
| GitLab | Personal Access Token | `read_api` |

---

## 라이선스

MIT
