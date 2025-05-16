#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const { addFiles } = require('../src/add.js');

program
  .command('add <filePath>')
  .option('--ext <ext>', 'Default extension (e.g., tsx)')
  .option('--template <template>', 'Template to use (e.g., react-component)')
  .option('--named', 'Use named export')
  .option('--dry', 'Dry run (no files written)')
  .description('Add a new component or utility file')
  .action((filePath, options) => {
    addFiles(filePath, options); // ✅ Pass options here
  });

program.parse(process.argv);

