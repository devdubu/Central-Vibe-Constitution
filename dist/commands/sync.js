import { detectScope } from '../lib/scope.js';
import { readConfig, updateConfig, DEFAULT_REMOTE_URL, } from '../lib/config.js';
import { fetchConstitution } from '../lib/fetcher.js';
import { writeConstitution, hashContent, getOutputPath } from '../lib/writer.js';
import { promptConfirm } from '../lib/prompt.js';
import { runInit } from './init.js';
export async function runSync() {
    const scopeResult = detectScope();
    const config = await readConfig(scopeResult);
    // No remote configured at all → run interactive init
    if (!config.remote && scopeResult.scope === 'global') {
        const hasNoGlobalConfig = Object.keys(config).length === 0;
        if (hasNoGlobalConfig) {
            console.log('No configuration found. Starting setup...\n');
            await runInit();
            return;
        }
    }
    const remote = config.remote ?? DEFAULT_REMOTE_URL;
    const outputPath = getOutputPath(scopeResult);
    console.log(`Scope:  ${scopeResult.scope}`);
    console.log(`From:   ${remote}`);
    console.log(`To:     ${outputPath}\n`);
    let content;
    try {
        content = await fetchConstitution(remote, config.token);
    }
    catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
    const hash = hashContent(content);
    if (hash === config.contentHash) {
        console.log('✓ Already up to date.');
    }
    else {
        const written = await writeConstitution(content, scopeResult, (msg) => promptConfirm(msg));
        if (!written) {
            console.log('  Sync cancelled.');
            return;
        }
        console.log('✓ Constitution synced.');
    }
    await updateConfig(scopeResult, {
        lastSynced: new Date().toISOString(),
        contentHash: hash,
    });
}
//# sourceMappingURL=sync.js.map