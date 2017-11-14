#!/usr/bin/env node
const commander = require('commander');
const appInfo = require('../package.json');

let projectName = '';

commander.version(appInfo.version);

commander
  .command('new <projectName>')
  .description('generator a project with project name')
  .action(name => {
    projectName = name;
  });

commander.parse(process.argv);

require('./generator')(projectName);
