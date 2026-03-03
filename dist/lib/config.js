import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { homedir } from 'os';
import { join, dirname } from 'path';
export const DEFAULT_REMOTE_URL = 'https://raw.githubusercontent.com/devdubu/AI-Vibe-Rule-Set/master/claude/constitution-rule.md';
export const CONFIG_DIR = join(homedir(), '.central-vibe-constitution');
export const CONFIG_PATH = join(CONFIG_DIR, 'config.json');
// ---------------------------------------------------------------------------
// Global config (~/.central-vibe-constitution/config.json)
// ---------------------------------------------------------------------------
export async function readGlobalConfig() {
    if (!existsSync(CONFIG_PATH))
        return {};
    const raw = await readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(raw);
}
export async function writeGlobalConfig(config) {
    await mkdir(CONFIG_DIR, { recursive: true });
    await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}
export async function updateGlobalConfig(updates) {
    const current = await readGlobalConfig();
    await writeGlobalConfig({ ...current, ...updates });
}
// ---------------------------------------------------------------------------
// Project config (.cvcrc — committed to git, no token)
// ---------------------------------------------------------------------------
export async function readProjectConfig(cvcrcPath) {
    if (!existsSync(cvcrcPath))
        return {};
    const raw = await readFile(cvcrcPath, 'utf-8');
    return JSON.parse(raw);
}
export async function writeProjectConfig(cvcrcPath, config) {
    // Never persist token to .cvcrc
    const { token: _token, ...safe } = config;
    await mkdir(dirname(cvcrcPath), { recursive: true });
    await writeFile(cvcrcPath, JSON.stringify(safe, null, 2), 'utf-8');
}
export async function updateProjectConfig(cvcrcPath, updates) {
    const current = await readProjectConfig(cvcrcPath);
    await writeProjectConfig(cvcrcPath, { ...current, ...updates });
}
// ---------------------------------------------------------------------------
// Unified scope-aware helpers
// ---------------------------------------------------------------------------
export async function readConfig(scopeResult) {
    if (scopeResult.scope === 'project' && scopeResult.cvcrcPath) {
        return readProjectConfig(scopeResult.cvcrcPath);
    }
    return readGlobalConfig();
}
export async function updateConfig(scopeResult, updates) {
    if (scopeResult.scope === 'project' && scopeResult.cvcrcPath) {
        await updateProjectConfig(scopeResult.cvcrcPath, updates);
    }
    else {
        await updateGlobalConfig(updates);
    }
}
/**
 * Resolve token for HTTP requests.
 * - "env:VAR" → read from env var
 * - undefined  → fallback to CVC_TOKEN env var
 * - plain str  → use as-is (global scope stored value)
 */
export function resolveToken(rawToken) {
    if (rawToken?.startsWith('env:')) {
        return process.env[rawToken.slice(4)];
    }
    return rawToken ?? process.env['CVC_TOKEN'];
}
//# sourceMappingURL=config.js.map