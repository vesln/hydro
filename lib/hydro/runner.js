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

Runner.prototype.test = function(title, tags, fn) {
  return this.createTest(title, tags, fn);
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
 * @param {Fucntion} body (optional)
 * @api public
 */

Runner.prototype.suite = function(title, fn) {
  this._suite = new Suite(title);
  if (fn) fn();
  this.root.suite(this._suite);
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

Runner.prototype.run = function(fn) {
  this.root.run(this.events, fn);
};

/**
 * Reset the current suite and
 * set a default name for the next one.
 *
 * @param {String} title
 * @api private
 */

Runner.prototype.resetSuite = function(file) {
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

Runner.prototype.createTest = function(title, tags, fn) {
  if (!this._suite) this.suite(this.file);
  var test = Test.create(title, tags, fn, this.file);
  this._suite.test(test);
  return test;
};

/**
 * Primary export.
 */

module.exports = Runner;
