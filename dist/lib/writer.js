import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { createHash } from 'crypto';
export const GLOBAL_CLAUDE_PATH = join(homedir(), '.claude', 'CLAUDE.md');
export function hashContent(content) {
    return 'sha256:' + createHash('sha256').update(content).digest('hex');
}
export async function writeGlobal(content) {
    await mkdir(join(homedir(), '.claude'), { recursive: true });
    await writeFile(GLOBAL_CLAUDE_PATH, content, 'utf-8');
}
export async function writeProject(content, confirm) {
    const projectPath = join(process.cwd(), 'CLAUDE.md');
    if (existsSync(projectPath)) {
        const existing = await readFile(projectPath, 'utf-8');
        if (existing !== content) {
            const ok = await confirm('./CLAUDE.md already exists and differs from remote. Overwrite?');
            if (!ok)
                return false;
        }
    }
    await writeFile(projectPath, content, 'utf-8');
    return true;
}
//# sourceMappingURL=writer.js.map