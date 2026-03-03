import { detectScope } from '../lib/scope.js';
import { readConfig, updateConfig, CONFIG_PATH, } from '../lib/config.js';
import { normalizeGitHubUrl } from '../lib/fetcher.js';
export async function runConfigSet(options) {
    if (!options.url && !options.token) {
        console.error('Error: Provide --url and/or --token.');
        process.exit(1);
    }
    const scopeResult = detectScope();
    const updates = {};
    if (options.url) {
        const { url, converted } = normalizeGitHubUrl(options.url);
        if (converted) {
            console.log(`  → Converted to raw URL: ${url}`);
        }
        updates['remote'] = url;
    }
    if (options.token) {
        if (scopeResult.scope === 'project') {
            console.warn('Warning: token is not stored in .cvcrc (git-committed). Use the CVC_TOKEN env var instead.');
        }
        else {
            updates['token'] = options.token;
        }
    }
    await updateConfig(scopeResult, updates);
    console.log(`✓ Config updated (${scopeResult.scope} scope).`);
    if (options.url)
        console.log(`  remote: ${updates['remote']}`);
    if (options.token && scopeResult.scope === 'global')
        console.log(`  token:  [set]`);
}
export async function runConfigGet() {
    const scopeResult = detectScope();
    const config = await readConfig(scopeResult);
    const configLocation = scopeResult.scope === 'project'
        ? scopeResult.cvcrcPath
        : CONFIG_PATH;
    if (Object.keys(config).length === 0) {
        console.log(`No configuration found (${scopeResult.scope} scope).`);
        console.log('Run `cvc init` to set up.');
        return;
    }
    console.log(`Scope:       ${scopeResult.scope}`);
    console.log(`Config:      ${configLocation}\n`);
    console.log(`remote:      ${config.remote ?? '(not set)'}`);
    if (scopeResult.scope === 'global') {
        console.log(`token:       ${config.token ? '[set]' : '(not set)'}`);
    }
    else {
        console.log(`token:       (env: CVC_TOKEN)`);
    }
    console.log(`lastSynced:  ${config.lastSynced ?? '(never)'}`);
    console.log(`contentHash: ${config.contentHash ?? '(none)'}`);
}
//# sourceMappingURL=config.js.map