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
 * @param {Array} tags
 * @param {Function} test
 * @api public
 */

Runner.prototype.addTest = function(title, tags, fn) {
  var suite = this.currentSuite;
  if (!suite) throw new Error('Please register a test suite');
  var test = Test.create(title, tags, fn, suite);
  suite.test(test);
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

  if (!parent) {
    this.suites.push(suite);
  } else {
    parent.suite(suite);
  }

  if (fn) {
    this.currentSuite = suite;
    fn();
    this.currentSuite = parent;
  } else {
    this.currentSuite = suite;
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
