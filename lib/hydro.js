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
 * Default suite title.
 */

var defaultSuite = null;

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
  return new Test(title, fn, file, line);
}

/**
 * Register a new test.
 *
 * @param {String} title
 * @param {Function} test
 * @api public
 */

module.exports = function(title, fn) {
  if (!suite) module.exports.suite(defaultSuite);
  var test = createTest(title, fn);
  suite.test(test);
  return test;
};

/**
 * Register a new skipped test.
 *
 * @param {String} title
 * @param {Function} test
 * @api public
 */

module.exports.skip = function(title, fn) {
  module.exports(title, fn).skip();
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
  runner.suite(suite);
};

/**
 * Reset the current suite and
 * set a default name for the next one.
 *
 * @param {String} title
 * @api private
 */

module.exports.resetSuite = function(title) {
  suite = null;
  defaultSuite = title;
};

/**
 * Export `Formatter`.
 */

module.exports.Formatter = Formatter;
