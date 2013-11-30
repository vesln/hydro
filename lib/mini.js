/**
 * Internal dependencies.
 */

var Runner = require('./mini/runner');
var Formatter = require('./mini/formatter');

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
 * @api public
 */

module.exports.run = function() {
  runner.run();
};
