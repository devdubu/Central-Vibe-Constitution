#!/usr/bin/env node
import { Command } from 'commander';
import { runInit } from './commands/init.js';
import { runSync } from './commands/sync.js';
import { runConfigSet, runConfigGet } from './commands/config.js';
import { runStatus } from './commands/status.js';
import { runShow } from './commands/show.js';
const program = new Command();
program
    .name('cvc')
    .description('Manage and sync centralized AI coding constitutions (CLAUDE.md)')
    .version('0.1.0');
program
    .command('init')
    .description('Interactive setup: configure remote URL and auth token')
    .action(runInit);
program
    .command('sync')
    .description('Fetch latest constitution and apply to ~/.claude/CLAUDE.md')
    .option('--project', 'Also write to ./CLAUDE.md in the current directory')
    .action((options) => runSync(options));
const configCmd = program
    .command('config')
    .description('Manage configuration');
configCmd
    .command('set')
    .description('Set remote URL and/or auth token')
    .option('--url <url>', 'Remote constitution URL')
    .option('--token <token>', 'Auth token (use env:VAR_NAME to reference an env variable)')
    .action((options) => runConfigSet(options));
configCmd
    .command('get')
    .description('Show current configuration')
    .action(runConfigGet);
program
    .command('status')
    .description('Show sync status and configuration summary')
    .action(runStatus);
program
    .command('show')
    .description('Print the current active constitution from ~/.claude/CLAUDE.md')
    .action(runShow);
program.parse();
//# sourceMappingURL=index.js.map