import type { ScopeResult } from './scope.js';
export declare function hashContent(content: string): string;
/** Resolve the output CLAUDE.md path based on detected scope. */
export declare function getOutputPath(scopeResult: ScopeResult): string;
/**
 * Write constitution content to the scope-resolved target path.
 * If the file already exists and content differs, prompts the user for confirmation.
 */
export declare function writeConstitution(content: string, scopeResult: ScopeResult, confirm: (msg: string) => Promise<boolean>): Promise<boolean>;
//# sourceMappingURL=writer.d.ts.map