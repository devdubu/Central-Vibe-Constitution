import { createInterface } from 'readline';

export async function promptText(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export async function promptPassword(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });

    // Suppress echoing of typed characters
    (rl as any)._writeToOutput = (_str: string) => { /* noop */ };

    process.stdout.write(question);
    rl.question('', (answer) => {
      process.stdout.write('\n');
      rl.close();
      resolve(answer.trim());
    });
  });
}

export async function promptConfirm(
  question: string,
  defaultYes = false,
): Promise<boolean> {
  const hint = defaultYes ? '(Y/n)' : '(y/N)';
  const answer = await promptText(`${question} ${hint}: `);
  if (answer === '') return defaultYes;
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}
