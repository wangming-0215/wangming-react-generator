const devDependencies = require('./dependencies.json').devDependencies;
const dependencies = require('./dependencies.json').dependencies;

module.exports = function() {
  return {
    devDependencies,
    dependencies
  };
};
