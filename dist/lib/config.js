import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
export const CONFIG_DIR = join(homedir(), '.central-vibe-constitution');
export const CONFIG_PATH = join(CONFIG_DIR, 'config.json');
export async function readConfig() {
    if (!existsSync(CONFIG_PATH))
        return {};
    const raw = await readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(raw);
}
export async function writeConfig(config) {
    await mkdir(CONFIG_DIR, { recursive: true });
    await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}
export async function updateConfig(updates) {
    const current = await readConfig();
    await writeConfig({ ...current, ...updates });
}
/** Resolve "env:VAR_NAME" references to actual env var values */
export function resolveToken(token) {
    if (!token)
        return undefined;
    if (token.startsWith('env:')) {
        return process.env[token.slice(4)];
    }
    return token;
}
//# sourceMappingURL=config.js.map