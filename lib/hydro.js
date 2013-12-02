/**
 * External dependencies.
 */

var callsite = require('callsite');

/**
 * Internal dependencies.
 */

var Runner = require('./hydro/runner');
var Test = require('./hydro/test');
var Suite = require('./hydro/suite');
var Formatter = require('./hydro/formatter');

/**
 * Runner.
 */

var runner = new Runner;

/**
 * Current suite.
 */

var suite = null;

/**
 * Test factory.
 *
 * @param {String} title
 * @param {Function} test
 * @returns {Test}
 * @api private
 */

function createTest(title, fn) {
  var stack = callsite();
  var file = stack[2].getFileName();
  var line = stack[2].getLineNumber();
  return new Test(title, fn, file, line, suite);
}

/**
 * Register a new test.
 *
 * @param {String} title
 * @param {Function} test
 * @api public
 */

module.exports = function test(title, fn) {
  runner.test(createTest(title, fn));
};

/**
 * Register a new skipped test.
 *
 * @param {String} title
 * @param {Function} test
 * @api public
 */

module.exports.skip = function skip(title, fn) {
  var test = createTest(title, fn);
  test.skip();
  runner.test(test);
};

/**
 * Run the tests.
 *
 * @param {Object} formatter
 * @param {Function} fn
 * @api public
 */

module.exports.run = function run(formatter, fn) {
  runner.run(formatter, fn);
};

/**
 * Change the name of the current test suite.
 *
 * @param {String} title
 * @param {Fucntion} body (optional)
 * @api public
 */

module.exports.suite = function(title, fn) {
  suite = new Suite(title);
  if (fn) fn();
};

/**
 * Export `Formatter`.
 */

module.exports.Formatter = Formatter;
