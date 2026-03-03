import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { homedir } from 'os';
import { join, dirname } from 'path';
import type { ScopeResult } from './scope.js';

export interface Config {
  remote?: string;
  token?: string;       // global scope only — never store in .cvcrc
  lastSynced?: string;
  contentHash?: string;
}

export const DEFAULT_REMOTE_URL =
  'https://raw.githubusercontent.com/devdubu/AI-Vibe-Rule-Set/master/claude/constitution-rule.md';

export const CONFIG_DIR = join(homedir(), '.central-vibe-constitution');
export const CONFIG_PATH = join(CONFIG_DIR, 'config.json');

// ---------------------------------------------------------------------------
// Global config (~/.central-vibe-constitution/config.json)
// ---------------------------------------------------------------------------

export async function readGlobalConfig(): Promise<Config> {
  if (!existsSync(CONFIG_PATH)) return {};
  const raw = await readFile(CONFIG_PATH, 'utf-8');
  return JSON.parse(raw) as Config;
}

export async function writeGlobalConfig(config: Config): Promise<void> {
  await mkdir(CONFIG_DIR, { recursive: true });
  await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

export async function updateGlobalConfig(updates: Partial<Config>): Promise<void> {
  const current = await readGlobalConfig();
  await writeGlobalConfig({ ...current, ...updates });
}

// ---------------------------------------------------------------------------
// Project config (.cvcrc — committed to git, no token)
// ---------------------------------------------------------------------------

export async function readProjectConfig(cvcrcPath: string): Promise<Config> {
  if (!existsSync(cvcrcPath)) return {};
  const raw = await readFile(cvcrcPath, 'utf-8');
  return JSON.parse(raw) as Config;
}

export async function writeProjectConfig(
  cvcrcPath: string,
  config: Config,
): Promise<void> {
  // Never persist token to .cvcrc
  const { token: _token, ...safe } = config;
  await mkdir(dirname(cvcrcPath), { recursive: true });
  await writeFile(cvcrcPath, JSON.stringify(safe, null, 2), 'utf-8');
}

export async function updateProjectConfig(
  cvcrcPath: string,
  updates: Partial<Config>,
): Promise<void> {
  const current = await readProjectConfig(cvcrcPath);
  await writeProjectConfig(cvcrcPath, { ...current, ...updates });
}

// ---------------------------------------------------------------------------
// Unified scope-aware helpers
// ---------------------------------------------------------------------------

export async function readConfig(scopeResult: ScopeResult): Promise<Config> {
  if (scopeResult.scope === 'project' && scopeResult.cvcrcPath) {
    return readProjectConfig(scopeResult.cvcrcPath);
  }
  return readGlobalConfig();
}

export async function updateConfig(
  scopeResult: ScopeResult,
  updates: Partial<Config>,
): Promise<void> {
  if (scopeResult.scope === 'project' && scopeResult.cvcrcPath) {
    await updateProjectConfig(scopeResult.cvcrcPath, updates);
  } else {
    await updateGlobalConfig(updates);
  }
}

/**
 * Resolve token for HTTP requests.
 * - "env:VAR" → read from env var
 * - undefined  → fallback to CVC_TOKEN env var
 * - plain str  → use as-is (global scope stored value)
 */
export function resolveToken(rawToken: string | undefined): string | undefined {
  if (rawToken?.startsWith('env:')) {
    return process.env[rawToken.slice(4)];
  }
  return rawToken ?? process.env['CVC_TOKEN'];
}
