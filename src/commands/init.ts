import { promptText, promptPassword, promptConfirm } from '../lib/prompt.js';
import { readConfig, writeConfig } from '../lib/config.js';
import { resolveSource } from '../lib/resolver.js';
import { fetchConstitution } from '../lib/fetcher.js';
import { writeGlobal, hashContent } from '../lib/writer.js';

export async function runInit(): Promise<void> {
  console.log('Welcome to Central Vibe Constitution setup!\n');

  const existing = await readConfig();

  // --- URL ---
  const urlHint = existing.remote ? ` (current: ${existing.remote})` : '';
  const urlInput = await promptText(`Remote constitution URL${urlHint}: `);
  const finalUrl = urlInput || existing.remote;

  if (!finalUrl) {
    console.error('Error: A remote URL is required.');
    process.exit(1);
  }

  try {
    new URL(finalUrl);
  } catch {
    console.error(`Error: Invalid URL: ${finalUrl}`);
    process.exit(1);
  }

  const source = resolveSource(finalUrl);
  console.log(`  → Detected source: ${source.type}\n`);

  // --- Token ---
  const tokenHint = existing.token
    ? ' (press Enter to keep existing)'
    : ' (press Enter to skip)';
  const tokenInput = await promptPassword(`Auth token${tokenHint}: `);
  const finalToken = tokenInput || existing.token;

  // --- Save config ---
  await writeConfig({
    ...existing,
    remote: finalUrl,
    token: finalToken || undefined,
  });

  console.log('\n✓ Config saved to ~/.central-vibe-constitution/config.json');

  // --- Offer immediate sync ---
  const syncNow = await promptConfirm('\nSync constitution now?', true);

  if (syncNow) {
    console.log('\nSyncing...');
    try {
      const content = await fetchConstitution(finalUrl, finalToken);
      await writeGlobal(content);
      await writeConfig({
        remote: finalUrl,
        token: finalToken || undefined,
        lastSynced: new Date().toISOString(),
        contentHash: hashContent(content),
      });
      console.log('✓ Constitution written to ~/.claude/CLAUDE.md');
    } catch (err) {
      console.error(`\nSync failed: ${(err as Error).message}`);
      console.log('You can retry later with: cvc sync');
    }
  } else {
    console.log('\nRun `cvc sync` whenever you\'re ready to apply your constitution.');
  }
}
