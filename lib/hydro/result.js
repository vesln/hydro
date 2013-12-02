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
  this.skipped = [];

  tests.forEach(function(test) {
    this.time += test.time;
    if (test.skipped) return this.skipped.push(test);
    this[test.failed ? 'failed' : 'passed'].push(test);
  }, this);
}

/**
 * Primary export.
 */

module.exports = Result;
