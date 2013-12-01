/**
 * Test results.
 *
 * @param {Array} tests
 * @constructor
 */

function Result(tests) {
  this.tests = tests;
  this.failed = [];
  this.passed = [];

  tests.forEach(function(test) {
    this[test.failed ? 'failed' : 'passed'].push(test);
  }, this);
}

/**
 * Primary export.
 */

module.exports = Result;
