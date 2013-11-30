/**
 * Internal dependencies.
 */

var Runner = require('./mini/runner');

/**
 * Runner.
 */

var runner = new Runner;

/**
 * Register a new test.
 *
 * @param {String} title
 * @param {Function} test
 * @api public
 */

module.exports = function test(title, fn) {
  runner.test(title, fn);
};

/**
 * Run the tests.
 *
 * @param {Object} formatter
 * @param {Function} fn
 * @api public
 */

module.exports.run = function(formatter, fn) {
  runner.run(formatter, fn);
};
