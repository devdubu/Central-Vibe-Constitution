import { readConfig, updateConfig } from '../lib/config.js';
import { fetchConstitution } from '../lib/fetcher.js';
import { writeGlobal, writeProject, hashContent } from '../lib/writer.js';
import { promptConfirm } from '../lib/prompt.js';
import { runInit } from './init.js';

interface SyncOptions {
  project?: boolean;
}

export async function runSync(options: SyncOptions): Promise<void> {
  const config = await readConfig();

  if (!config.remote) {
    console.log('No configuration found. Starting setup...\n');
    await runInit();
    return;
  }

  console.log(`Fetching from: ${config.remote}`);

  let content: string;
  try {
    content = await fetchConstitution(config.remote, config.token);
  } catch (err) {
    console.error(`\nError: ${(err as Error).message}`);
    process.exit(1);
  }

  const hash = hashContent(content);

  if (hash === config.contentHash) {
    console.log('✓ Already up to date.');
  } else {
    await writeGlobal(content);
    console.log('✓ Constitution synced to ~/.claude/CLAUDE.md');
  }

  if (options.project) {
    const written = await writeProject(content, (msg) => promptConfirm(msg));
    if (written) {
      console.log('✓ Constitution synced to ./CLAUDE.md');
    } else {
      console.log('  Skipped project-level sync.');
    }
  }

  await updateConfig({
    lastSynced: new Date().toISOString(),
    contentHash: hash,
  });
}
