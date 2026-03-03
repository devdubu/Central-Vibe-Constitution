import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { GLOBAL_CLAUDE_PATH } from '../lib/writer.js';
export async function runShow() {
    if (!existsSync(GLOBAL_CLAUDE_PATH)) {
        console.log('No constitution found at ~/.claude/CLAUDE.md');
        console.log('Run `cvc sync` to fetch and apply your constitution.');
        return;
    }
    const content = await readFile(GLOBAL_CLAUDE_PATH, 'utf-8');
    console.log(content);
}
//# sourceMappingURL=show.js.map