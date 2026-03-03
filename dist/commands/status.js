import { readConfig } from '../lib/config.js';
import { resolveSource } from '../lib/resolver.js';
export async function runStatus() {
    const config = await readConfig();
    if (!config.remote) {
        console.log('Not configured. Run `cvc init` to set up.');
        return;
    }
    const source = resolveSource(config.remote);
    console.log('Central Vibe Constitution — Status\n');
    console.log(`Source type:  ${source.type}`);
    console.log(`Remote URL:   ${config.remote}`);
    console.log(`Auth token:   ${config.token ? '[set]' : '(none)'}`);
    console.log(`Last synced:  ${config.lastSynced ?? 'Never'}`);
    console.log(`Content hash: ${config.contentHash ?? '(none)'}`);
}
//# sourceMappingURL=status.js.map