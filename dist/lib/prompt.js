import { createInterface } from 'readline';
export async function promptText(question) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}
export async function promptPassword(question) {
    return new Promise((resolve) => {
        const rl = createInterface({ input: process.stdin, output: process.stdout });
        // Suppress echoing of typed characters
        rl._writeToOutput = (_str) => { };
        process.stdout.write(question);
        rl.question('', (answer) => {
            process.stdout.write('\n');
            rl.close();
            resolve(answer.trim());
        });
    });
}
export async function promptConfirm(question, defaultYes = false) {
    const hint = defaultYes ? '(Y/n)' : '(y/N)';
    const answer = await promptText(`${question} ${hint}: `);
    if (answer === '')
        return defaultYes;
    return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}
//# sourceMappingURL=prompt.js.map