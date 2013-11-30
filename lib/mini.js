/**
 * Internal dependencies.
 */

var Runner = require('./mini/runner');
var Formatter = require('./mini/formatters/list');

/**
 * Runner.
 */

var runner = new Runner(new Formatter);

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
 * @param {Function} fn
 * @api public
 */

module.exports.run = function(fn) {
  runner.run(fn);
};
