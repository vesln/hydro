/**
 * Core dependencies.
 */

var path = require('path');

/**
 * Internal dependencies.
 */

var Test = require('./test');
var Suite = require('./suite');
var Result = require('./result');

/**
 * Runner.
 *
 * @constructor
 */

function Runner() {
  this.stack = [];
  this.suites = [];
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
  var suite = this.currentSuite();
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
  var suite = new Suite(title);
  this.stack.push(suite);
  if (fn) {
    fn();
    this.stack.pop();
  }
  this.suites.push(suite);
  return suite;
};

/**
 * Run the test suites.
 *
 * @param {Function} fn
 * @api public
 */

Runner.prototype.run = function(events, fn) {
  var suites = this.suites;
  var i = 0;
  var self = this;

  function runSuite() {
    var suite = suites[i];
    i++;
    if (suite) return suite.run(events, runSuite);

    self.result = suites.map(function(suite) {
      return suite.result;
    }).reduce(function(a, b) {
      return a.merge(b);
    }, new Result);

    events.emit('post:all', self, function() {
      fn(self);
    });
  }

  events.emit('pre:all', this, runSuite);
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
