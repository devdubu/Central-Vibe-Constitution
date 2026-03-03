import type { ScopeResult } from './scope.js';
export interface Config {
    remote?: string;
    token?: string;
    lastSynced?: string;
    contentHash?: string;
}
export declare const DEFAULT_REMOTE_URL = "https://raw.githubusercontent.com/devdubu/AI-Vibe-Rule-Set/master/claude/constitution-rule.md";
export declare const CONFIG_DIR: string;
export declare const CONFIG_PATH: string;
export declare function readGlobalConfig(): Promise<Config>;
export declare function writeGlobalConfig(config: Config): Promise<void>;
export declare function updateGlobalConfig(updates: Partial<Config>): Promise<void>;
export declare function readProjectConfig(cvcrcPath: string): Promise<Config>;
export declare function writeProjectConfig(cvcrcPath: string, config: Config): Promise<void>;
export declare function updateProjectConfig(cvcrcPath: string, updates: Partial<Config>): Promise<void>;
export declare function readConfig(scopeResult: ScopeResult): Promise<Config>;
export declare function updateConfig(scopeResult: ScopeResult, updates: Partial<Config>): Promise<void>;
/**
 * Resolve token for HTTP requests.
 * - "env:VAR" → read from env var
 * - undefined  → fallback to CVC_TOKEN env var
 * - plain str  → use as-is (global scope stored value)
 */
export declare function resolveToken(rawToken: string | undefined): string | undefined;
//# sourceMappingURL=config.d.ts.map