import { promptText, promptPassword, promptConfirm } from '../lib/prompt.js';
import { detectScope } from '../lib/scope.js';
import {
  readConfig,
  writeGlobalConfig,
  writeProjectConfig,
  DEFAULT_REMOTE_URL,
  CONFIG_PATH,
} from '../lib/config.js';
import { resolveSource } from '../lib/resolver.js';
import { fetchConstitution, normalizeGitHubUrl } from '../lib/fetcher.js';
import { writeConstitution, hashContent, getOutputPath } from '../lib/writer.js';

export async function runInit(): Promise<void> {
  console.log('Welcome to Central Vibe Constitution setup!\n');

  const scopeResult = detectScope();
  const existing = await readConfig(scopeResult);

  console.log(`Scope: ${scopeResult.scope}`);
  if (scopeResult.scope === 'project') {
    console.log(`Config: ${scopeResult.cvcrcPath}`);
  } else {
    console.log(`Config: ${CONFIG_PATH}`);
  }
  console.log();

  // --- URL ---
  const currentUrl = existing.remote ?? DEFAULT_REMOTE_URL;
  const urlInput = await promptText(`Remote constitution URL (current: ${currentUrl}): `);
  let finalUrl = urlInput.trim() || currentUrl;

  // Auto-convert GitHub blob URL → raw URL
  const { url: normalizedUrl, converted } = normalizeGitHubUrl(finalUrl);
  if (converted) {
    console.log(`  → Converted to raw URL: ${normalizedUrl}`);
    finalUrl = normalizedUrl;
  }

  try {
    new URL(finalUrl);
  } catch {
    console.error(`Error: Invalid URL: ${finalUrl}`);
    process.exit(1);
  }

  const source = resolveSource(finalUrl);
  console.log(`  → Detected source: ${source.type}\n`);

  // --- Token (global scope only; project scope uses CVC_TOKEN env var) ---
  let finalToken: string | undefined = existing.token;

  if (scopeResult.scope === 'global') {
    const tokenHint = existing.token
      ? ' (press Enter to keep existing)'
      : ' (press Enter to skip)';
    const tokenInput = await promptPassword(`Auth token${tokenHint}: `);
    finalToken = tokenInput || existing.token;
  } else {
    console.log('Auth token: (project scope — set via CVC_TOKEN env var)\n');
  }

  // --- Save config ---
  if (scopeResult.scope === 'project' && scopeResult.cvcrcPath) {
    await writeProjectConfig(scopeResult.cvcrcPath, {
      ...existing,
      remote: finalUrl,
    });
    console.log(`\n✓ Config saved to ${scopeResult.cvcrcPath}`);
  } else {
    await writeGlobalConfig({
      ...existing,
      remote: finalUrl,
      token: finalToken || undefined,
    });
    console.log(`\n✓ Config saved to ${CONFIG_PATH}`);
  }

  // --- Offer immediate sync ---
  const outputPath = getOutputPath(scopeResult);
  const syncNow = await promptConfirm(
    `\nSync constitution to ${outputPath} now?`,
    true,
  );

  if (syncNow) {
    console.log('\nSyncing...');
    try {
      const content = await fetchConstitution(finalUrl, finalToken);
      const written = await writeConstitution(content, scopeResult, (msg) =>
        promptConfirm(msg),
      );
      if (written) {
        await (scopeResult.scope === 'project' && scopeResult.cvcrcPath
          ? writeProjectConfig(scopeResult.cvcrcPath, {
              remote: finalUrl,
              lastSynced: new Date().toISOString(),
              contentHash: hashContent(content),
            })
          : writeGlobalConfig({
              remote: finalUrl,
              token: finalToken || undefined,
              lastSynced: new Date().toISOString(),
              contentHash: hashContent(content),
            }));
        console.log(`✓ Constitution written to ${outputPath}`);
      }
    } catch (err) {
      console.error(`\nSync failed: ${(err as Error).message}`);
      console.log('You can retry later with: cvc sync');
    }
  } else {
    console.log("\nRun `cvc sync` whenever you're ready to apply your constitution.");
  }
}
