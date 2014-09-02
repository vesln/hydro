/**
 * Dependencies
 */

var TopLevelSuite = require('./suite/top-level');
var Suite = require('./suite');
var _ = require('./util');

/**
 * Runner.
 *
 * @constructor
 */

function Runner() {
  this.topLevel = new TopLevelSuite;
}

/**
 * Return all test suites.
 *
 * @returns {Array}
 * @api public
 */

Runner.prototype.suites = function() {
  var suites = [];
  this.traverse({
    enterSuite: function(suite) {
      suites.push(suite);
    }
  });
  return suites;
};

/**
 * Return all tests.
 *
 * @returns {Array}
 * @api public
 */

Runner.prototype.tests = function() {
  var tests = [];
  this.traverse({
    test: function(test) {
      tests.push(test);
    }
  });
  return tests;
};

/**
 * Traverse.
 *
 * @param {Object} handlers
 * @api public
 */

Runner.prototype.traverse = function(handlers) {
  handlers.test = handlers.test || _.noop;
  handlers.enterSuite = handlers.enterSuite || _.noop;
  handlers.leaveSuite = handlers.leaveSuite || _.noop;

  (function next(suite) {
    handlers.enterSuite(suite);
    suite.runnables.forEach(function(runnable){
      if (runnable instanceof Suite) {
        next(runnable);
      } else {
        handlers.test(runnable);
      }
    });
    handlers.leaveSuite(suite);
  })(this.topLevel);
};

/**
 * Primary export.
 */

module.exports = Runner;
