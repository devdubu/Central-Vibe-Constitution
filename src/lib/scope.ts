import { existsSync } from 'fs';
import { join, dirname } from 'path';

export type Scope = 'global' | 'project';

export interface ScopeResult {
  scope: Scope;
  cvcrcPath?: string;   // absolute path to .cvcrc
  projectRoot?: string; // directory containing .cvcrc
}

/** Walk up from cwd to find .cvcrc, same strategy as git. */
export function detectScope(): ScopeResult {
  let dir = process.cwd();

  while (true) {
    const candidate = join(dir, '.cvcrc');
    if (existsSync(candidate)) {
      return { scope: 'project', cvcrcPath: candidate, projectRoot: dir };
    }
    const parent = dirname(dir);
    if (parent === dir) break; // reached filesystem root
    dir = parent;
  }

  return { scope: 'global' };
}
