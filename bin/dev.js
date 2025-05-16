#!/usr/bin/env node

const { program } = require('commander');
const { addFiles } = require('../src/add');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .command('add <filePath>')
  .description('Add a new file and update the folder\'s index.js')
  .action((filePath) => {
    addFiles(filePath);
  });

program.parse(process.argv);

