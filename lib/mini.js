/**
 * External dependencies.
 */

var callsite = require('callsite');

/**
 * Internal dependencies.
 */

var Runner = require('./mini/runner');
var Test = require('./mini/test');
var color = require('./mini/color');
var Formatter = require('./mini/formatter');

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
  var stack = callsite();
  var file = stack[1].getFileName();
  var line = stack[1].getLineNumber();
  runner.test(new Test(title, fn, file, line));
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
 * Export `color`.
 */

module.exports.color = color;

/**
 * Export `Formatter`.
 */

module.exports.Formatter = Formatter;
