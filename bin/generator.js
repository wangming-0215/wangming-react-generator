const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const getDependencies = require('../util/getDependencies');

const CURR_DIR = process.cwd();

function generator(projectName) {
  fs.mkdirSync(path.join(CURR_DIR, projectName));
  const templatePath = path.resolve(__dirname, '../template');
  createDirectoryContent(templatePath, projectName);
  initialProject(projectName);
}

function initialProject(projectName) {
  console.log('generator package.json ...');
  generatorPackageJson(projectName);
  console.log(
    chalk.green('Installing dependencies from npm, please be patient ...')
  );
  Promise.all([install(projectName, 'dev'), install(projectName)])
    .then(() => {
      console.log(chalk.cyan('Install dependencies completed!'));
      console.log(chalk.green(`Generator ${projectName} completed!`));
    })
    .catch(reason => {
      const nodeModulesPath = path.join(CURR_DIR, 'node_modules');
      spawn('rm', ['-rf', nodeModulesPath]);
      console.log();
      console.log('Aborting installation.');
      if (reason.command) {
        console.log(`  ${chalk.red(reason.command)} has failed.`);
      } else {
        console.log(chalk.cyan('Unexpected error. Please report it as a bug:'));
        console.log(reason);
      }
    });
}

function generatorPackageJson(projectName) {
  const packageJson = {
    name: projectName,
    version: '1.0.0',
    scripts: {
      build:
        'webpack --env production --progress --config webpack/webpack.config.js',
      dev:
        'webpack-dev-server --env development --hot --progress --config webpack/webpack.config.js'
    }
  };
  const packageJsonPath = path.join(CURR_DIR, projectName, 'package.json');
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    'utf-8'
  );
}

function install(projectName, mode) {
  const projectPath = path.join(CURR_DIR, projectName);
  const options = {
    cwd: projectPath,
    stdio: 'ignore'
  };
  let dependencies = [];
  const command = 'npm';
  const args = [];
  if (mode === 'dev') {
    dependencies = getDependencies().devDependencies;
    args.push('install', '--save-dev');
  } else {
    dependencies = getDependencies().dependencies;
    args.push('install', '--save');
  }
  return new Promise((resolve, reject) => {
    const child = spawn(command, args.concat(dependencies), options);
    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`
        });
        return;
      }
      resolve();
    });
  });
}

function createDirectoryContent(templatePath, projectName) {
  const files = fs.readdirSync(templatePath);
  files.forEach(file => {
    const originFilePath = path.join(templatePath, file);
    const stat = fs.statSync(originFilePath);
    if (stat.isFile()) {
      const contents = fs.readFileSync(originFilePath, 'utf-8');
      const writePath = path.join(CURR_DIR, projectName, file);
      fs.writeFileSync(writePath, contents, 'utf-8');
      console.log(`Generator ${file} ...`);
    } else if (stat.isDirectory()) {
      const mkdirPath = path.join(CURR_DIR, projectName, file);
      fs.mkdirSync(mkdirPath);
      const dir = path.join(templatePath, file);
      const filename = `${projectName}/${file}`;
      createDirectoryContent(dir, filename);
    }
  });
}

module.exports = generator;
