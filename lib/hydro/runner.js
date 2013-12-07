/**
 * Core dependencies.
 */

var path = require('path');

/**
 * External dependencies.
 */

var EventEmitter = require('evts');

/**
 * Internal dependencies.
 */

var Root = require('./root');
var Test = require('./test');
var Suite = require('./suite');

/**
 * Runner.
 *
 * @constructor
 */

function Runner() {
  this.events = new EventEmitter;
  this.root = new Root;
  this.file = null;
  this.stack = [];
}

/**
 * Register a new test.
 *
 * @param {String} title
 * @param {Array} tags
 * @param {Function} test
 * @api public
 */

Runner.prototype.test = function(title, tags, fn) {
  var suite = this.currentSuite();
  if (!suite) throw new Error('Please register a test suite');
  var test = Test.create(title, tags, fn, this.file);
  suite.test(test);
  return test;
};

/**
 * Register event handler.
 *
 * @param {String} event name
 * @param {Function} handler
 * @api public
 */

Runner.prototype.on = function(evt, fn) {
  this.events.on(evt, fn);
};

/**
 * Setup a new suite.
 *
 * @param {String} title
 * @param {Function} body (optional)
 * @api public
 */

Runner.prototype.suite = function(title, fn) {
  var suite = new Suite(title);
  this.stack.push(suite);
  if (fn) {
    fn();
    this.stack.pop();
  }
  this.root.suite(suite);
  return suite;
};

/**
 * Set options.
 *
 * @param {Object} options
 * @param {Function} fn
 * @api public
 */

Runner.prototype.configure = function(options, fn) {
  this.options = options || {};
  this.options.tests = this.options.tests || [];
  this.events.emit('options', options, fn);
};

/**
 * Load the given formatter.
 *
 * @api public
 */

Runner.prototype.loadFormatter = function() {
  if (!this.options.formatter) return;
  var Formatter = require(this.options.formatter);
  var formatter = new Formatter;
  formatter.setup(this.events);
};

/**
 * Load the tests.
 *
 * @api public
 */

Runner.prototype.loadTests = function() {
  (this.options.tests || []).forEach(function(file) {
    this.file = file;
    require(file);
  }, this);
};

/**
 * Run the test suites.
 *
 * @param {Function} fn
 * @api public
 */

Runner.prototype.run = function(fn) {
  this.root.run(this.events, fn);
};

/**
 * Return the current test suite.
 *
 * @returns {Suite}
 * @api private
 */

Runner.prototype.currentSuite = function() {
  return this.stack[this.stack.length - 1];
};

/**
 * Primary export.
 */

module.exports = Runner;
