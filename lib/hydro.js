/**
 * Internal dependencies.
 */

var Runner = require('./hydro/runner');

/**
 * Test runner.
 */

var runner = new Runner;

/**
 * Primary export.
 */

module.exports = function() {
  return runner.test.apply(runner, arguments);
};

/**
 * Export `runner`.
 */

module.exports.runner = runner;

/**
 * Export DSL methods.
 */

['suite', 'on'].forEach(function(method) {
  module.exports[method] = function() {
    runner[method].apply(runner, arguments);
  };
});
