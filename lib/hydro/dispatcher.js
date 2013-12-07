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

var Runner = require('./runner');
var Test = require('./test');
var Suite = require('./suite');

/**
 * Dispatcher.
 *
 * @constructor
 */

function Dispatcher() {
  this.events = new EventEmitter;
  this.runner = new Runner;
  this._suite = null;
  this.file = null;
}

/**
 * Register a new test.
 *
 * @param {String} title
 * @param {Array} tags
 * @param {Function} test
 * @api public
 */

Dispatcher.prototype.test = function(title, tags, fn) {
  return this.createTest(title, tags, fn);
};

/**
 * Register event handler.
 *
 * @param {String} event name
 * @param {Function} handler
 * @api public
 */

Dispatcher.prototype.on = function(evt, fn) {
  this.events.on(evt, fn);
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
 * Set options.
 *
 * @param {Object} options
 * @param {Function} fn
 * @api public
 */

Dispatcher.prototype.configure = function(opts, fn) {
  this.options = opts;
  this.events.emit('options', opts, fn);
};

/**
 * Load the given formatter.
 *
 * @api public
 */

Dispatcher.prototype.loadFormatter = function() {
  var Formatter = require(this.options.formatter);
  var formatter = new Formatter;
  formatter.setup(this.events);
};

/**
 * Load the tests.
 *
 * @api public
 */

Dispatcher.prototype.loadTests = function() {
  this.options.tests.forEach(function(file) {
    this.resetSuite(file);
    require(file);
  }, this);
};

/**
 * Run the test suites.
 *
 * @param {Function} fn
 * @api public
 */

Dispatcher.prototype.run = function(fn) {
  this.runner.run(this.events, fn);
};

/**
 * Reset the current suite and
 * set a default name for the next one.
 *
 * @param {String} title
 * @api private
 */

Dispatcher.prototype.resetSuite = function(file) {
  this.file = file;
  this._suite = null;
};

/**
 * Create a new test.
 *
 * @param {String} title
 * @param {Array} tags
 * @param {Function} test
 * @api private
 */

Dispatcher.prototype.createTest = function(title, tags, fn) {
  if (!this._suite) this.suite(this.file);
  var test = Test.create(title, tags, fn, this.file);
  this._suite.test(test);
  return test;
};

/**
 * Primary export.
 */

module.exports = Dispatcher;
