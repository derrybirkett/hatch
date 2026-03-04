#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init';

const packageJson = require('../package.json');

const program = new Command();

program
  .name('hatch')
  .description('Bootstrap production-ready SaaS applications from user stories')
  .version(packageJson.version);

program
  .command('init [project-name]')
  .description('Initialize a new SaaS project')
  .option('-s, --story <story>', 'User story describing the app')
  .option('-d, --description <description>', 'Project description')
  .option('-a, --author <author>', 'Author name')
  .option('--no-install', 'Skip installing dependencies')
  .option('--no-git', 'Skip git initialization')
  .action(initCommand);

program.parse();
