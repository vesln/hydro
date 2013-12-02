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
  this.time = 0;

  tests.forEach(function(test) {
    this[test.failed ? 'failed' : 'passed'].push(test);
    this.time += test.time;
  }, this);
}

/**
 * Primary export.
 */

module.exports = Result;
