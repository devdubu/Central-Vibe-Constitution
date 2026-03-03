import { detectScope } from '../lib/scope.js';
import { readConfig, DEFAULT_REMOTE_URL, CONFIG_PATH } from '../lib/config.js';
import { resolveSource } from '../lib/resolver.js';
import { getOutputPath } from '../lib/writer.js';

export async function runStatus(): Promise<void> {
  const scopeResult = detectScope();
  const config = await readConfig(scopeResult);

  const configLocation =
    scopeResult.scope === 'project'
      ? scopeResult.cvcrcPath!
      : CONFIG_PATH;

  const remote = config.remote ?? DEFAULT_REMOTE_URL;
  const source = resolveSource(remote);

  console.log('Central Vibe Constitution — Status\n');
  console.log(`Scope:        ${scopeResult.scope}`);
  console.log(`Config:       ${configLocation}`);
  console.log(`Output:       ${getOutputPath(scopeResult)}`);
  console.log(`Source type:  ${source.type}`);
  console.log(`Remote URL:   ${remote}${config.remote ? '' : '  (default)'}`);
  if (scopeResult.scope === 'global') {
    console.log(`Auth token:   ${config.token ? '[set]' : '(none)'}`);
  } else {
    console.log(`Auth token:   (env: CVC_TOKEN)`);
  }
  console.log(`Last synced:  ${config.lastSynced ?? 'Never'}`);
  console.log(`Content hash: ${config.contentHash ?? '(none)'}`);
}
