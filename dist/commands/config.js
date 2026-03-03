import { readConfig, updateConfig, CONFIG_PATH } from '../lib/config.js';
export async function runConfigSet(options) {
    if (!options.url && !options.token) {
        console.error('Error: Provide --url and/or --token.');
        process.exit(1);
    }
    const updates = {};
    if (options.url)
        updates['remote'] = options.url;
    if (options.token)
        updates['token'] = options.token;
    await updateConfig(updates);
    console.log('✓ Config updated.');
    if (options.url)
        console.log(`  remote: ${options.url}`);
    if (options.token)
        console.log(`  token:  [set]`);
}
export async function runConfigGet() {
    const config = await readConfig();
    if (Object.keys(config).length === 0) {
        console.log('No configuration found. Run `cvc init` to set up.');
        return;
    }
    console.log(`Config: ${CONFIG_PATH}\n`);
    console.log(`remote:      ${config.remote ?? '(not set)'}`);
    console.log(`token:       ${config.token ? '[set]' : '(not set)'}`);
    console.log(`lastSynced:  ${config.lastSynced ?? '(never)'}`);
    console.log(`contentHash: ${config.contentHash ?? '(none)'}`);
}
//# sourceMappingURL=config.js.map