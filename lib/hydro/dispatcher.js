/**
 * External dependencies.
 */

var callsite = require('callsite');

/**
 * Internal dependencies.
 */

var Runner = require('./runner');
var Test = require('./test');
var Suite = require('./suite');

/**
 * Dispatcher.
 *
 * @constructor
 */

function Dispatcher() {
  this.runner = new Runner;
  this._suite = null;
  this.nextSuite = null;
}

/**
 * Register a new test.
 *
 * @param {String} title
 * @param {Function} test
 * @api public
 */

Dispatcher.prototype.test = function(title, fn) {
  this.createTest(title, fn);
};

/**
 * Register a new pending test.
 *
 * @param {String} title
 * @param {Function} test
 * @api public
 */

Dispatcher.prototype.skip = function(title, fn) {
  this.createTest(title, fn).skip();
};

/**
 * Setup a new suite.
 *
 * @param {String} title
 * @param {Fucntion} body (optional)
 * @api public
 */

Dispatcher.prototype.suite = function(title, fn) {
  this._suite = new Suite(title);
  if (fn) fn();
  this.runner.suite(this._suite);
};

/**
 * Reset the current suite and
 * set a default name for the next one.
 *
 * @param {String} title
 * @api private
 */

Dispatcher.prototype.resetSuite = function(title) {
  this._suite = null;
  this.nextSuite = title;
};

/**
 * Run the test suites.
 *
 * @param {Object} formatter
 * @param {Function} fn
 * @api public
 */

Dispatcher.prototype.run = function(formatter, fn) {
  this.runner.run(formatter, fn);
};

/**
 * Create a new test.
 *
 * TODO: getting the filename and the line number
 * is too fragile, and if `Dispatcher` is being
 * used directly, it will return wrong results.
 *
 * @param {String} title
 * @param {Function} test
 * @param {Number} stack index (optional)
 * @api private
 */

Dispatcher.prototype.createTest = function(title, fn, index) {
  if (!this._suite) this.suite(this.nextSuite);
  index = index || 3;
  var stack = callsite();
  var file = stack[index].getFileName();
  var line = stack[index].getLineNumber();
  var test = new Test(title, fn, file, line);
  this._suite.test(test);
  return test;
};

/**
 * Primary export.
 */

module.exports = Dispatcher;
