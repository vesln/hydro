/**
 * Core dependencies.
 */

var path = require('path');

/**
 * External dependencies.
 */

var Emitter = require('async-cancelable-events');
var refractory = require('refractory');

/**
 * Formatter loader.
 */

var load = refractory(module, '../../test/helpers');

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
  this.events = new Emitter;
  this.runner = new Runner;
  this._suite = null;
  this.file = null;
  this.nextSuite = null;
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
  this.createTest(title, tags, fn);
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
 * Register a new pending test.
 *
 * @param {String} title
 * @param {Function} test
 * @api public
 */

Dispatcher.prototype.skip = function(title, tags, fn) {
  if (!fn && 'function' === typeof tags) {
    fn = tags;
    tags = null;
  }
  fn = null;
  this.createTest(title, tags, fn);
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
  var Formatter = load(this.options.formatter);
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
  this.nextSuite = file;
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
  if (!this._suite) this.suite(this.nextSuite);
  var test = Test.create(title, tags, fn, this.file);
  this._suite.test(test);
  return test;
};

/**
 * Primary export.
 */

module.exports = Dispatcher;
