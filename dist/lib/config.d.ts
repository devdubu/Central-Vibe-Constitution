export interface Config {
    remote?: string;
    token?: string;
    lastSynced?: string;
    contentHash?: string;
}
export declare const CONFIG_DIR: string;
export declare const CONFIG_PATH: string;
export declare function readConfig(): Promise<Config>;
export declare function writeConfig(config: Config): Promise<void>;
export declare function updateConfig(updates: Partial<Config>): Promise<void>;
/** Resolve "env:VAR_NAME" references to actual env var values */
export declare function resolveToken(token: string | undefined): string | undefined;
//# sourceMappingURL=config.d.ts.map