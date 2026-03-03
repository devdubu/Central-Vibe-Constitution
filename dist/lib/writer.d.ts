export declare const GLOBAL_CLAUDE_PATH: string;
export declare function hashContent(content: string): string;
export declare function writeGlobal(content: string): Promise<void>;
export declare function writeProject(content: string, confirm: (msg: string) => Promise<boolean>): Promise<boolean>;
//# sourceMappingURL=writer.d.ts.map