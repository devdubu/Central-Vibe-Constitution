import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { detectScope } from '../lib/scope.js';
import { getOutputPath } from '../lib/writer.js';

export async function runShow(): Promise<void> {
  const scopeResult = detectScope();
  const outputPath = getOutputPath(scopeResult);

  if (!existsSync(outputPath)) {
    console.log(`No constitution found at ${outputPath}`);
    console.log('Run `cvc sync` to fetch and apply your constitution.');
    return;
  }

  const content = await readFile(outputPath, 'utf-8');
  console.log(content);
}
