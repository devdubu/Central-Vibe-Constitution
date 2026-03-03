import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { createHash } from 'crypto';
import type { ScopeResult } from './scope.js';

export function hashContent(content: string): string {
  return 'sha256:' + createHash('sha256').update(content).digest('hex');
}

/** Resolve the output CLAUDE.md path based on detected scope. */
export function getOutputPath(scopeResult: ScopeResult): string {
  if (scopeResult.scope === 'project' && scopeResult.projectRoot) {
    return join(scopeResult.projectRoot, '.claude', 'CLAUDE.md');
  }
  return join(homedir(), '.claude', 'CLAUDE.md');
}

/**
 * Write constitution content to the scope-resolved target path.
 * If the file already exists and content differs, prompts the user for confirmation.
 */
export async function writeConstitution(
  content: string,
  scopeResult: ScopeResult,
  confirm: (msg: string) => Promise<boolean>,
): Promise<boolean> {
  const outputPath = getOutputPath(scopeResult);

  if (existsSync(outputPath)) {
    const existing = await readFile(outputPath, 'utf-8');
    if (existing !== content) {
      const ok = await confirm(
        `${outputPath} already exists and differs from remote. Overwrite?`,
      );
      if (!ok) return false;
    } else {
      return true; // already identical
    }
  }

  await mkdir(join(outputPath, '..'), { recursive: true });
  await writeFile(outputPath, content, 'utf-8');
  return true;
}
