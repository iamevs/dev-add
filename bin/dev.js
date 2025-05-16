#!/usr/bin/env node

import { Command } from 'commander';
import { addFiles } from '../src/add.js';

const program = new Command();

program
  .command('add <filePath>')
  .option('--ext <ext>', 'Default extension (e.g., tsx)')
  .option('--template <template>', 'Template to use (e.g., react-component)')
  .option('--named', 'Use named export')
  .option('--dry', 'Dry run (no files written)')
  .option('--verbose', 'Verbose logging')
  .option('--nocomp', 'Do not create or update index.js')
  .description('Add a new component or utility file')
  .action((filePath, options) => {
    addFiles(filePath, options);
  });

program.parse(process.argv);

