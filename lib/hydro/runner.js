/**
 * Core dependencies.
 */

var path = require('path');

/**
 * Internal dependencies.
 */

var Test = require('./test');
var Suite = require('./suite');

/**
 * Slice.
 */

var slice = Array.prototype.slice;

/**
 * Runner.
 *
 * @constructor
 */

function Runner() {
  this.suites = [];
  this.currentSuite = null;
}

/**
 * Register a new test.
 *
 * @param {String} title
 * @param {Mixed} meta1 (optional)
 * @param {Mixed} meta2 (optional)
 * @param {Function} test (optional)
 * @api public
 */

Runner.prototype.addTest = function(/* title, meta1, meta2, fn */) {
  var suite = this.currentSuite;
  if (!suite) throw new Error('Please register a test suite');
  var test = Test.create(suite, slice.call(arguments, 0));
  suite.addTest(test);
  return test;
};

/**
 * Setup a new suite.
 *
 * @param {String} title
 * @param {Function} body (optional)
 * @api public
 */

Runner.prototype.addSuite = function(title, fn) {
  var parent = this.currentSuite;
  var suite = new Suite(title, parent);
  this.currentSuite = suite;

  if (!parent) {
    this.suites.push(suite);
  } else {
    parent.addSuite(suite);
  }

  if (fn) {
    fn();
    this.currentSuite = parent;
  }

  return suite;
};

/**
 * Run the test suites.
 *
 * @param {Function} fn
 * @api public
 */

Runner.prototype.run = function(events, fn) {
  var self = this;
  var suites = this.suites.slice(0);
  var suite = null;

  function next() {
    if (suite = suites.shift()) return suite.run(events, next);
    events.emit('post:all', self, function() { fn(self); });
  }

  events.emit('pre:all', this, next);
};

/**
 * Primary export.
 */

module.exports = Runner;
