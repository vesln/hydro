/**
 * Test results.
 *
 * @param {Array} tests
 * @constructor
 */

function Result(tests) {
  this.tests = tests || [];
  this.failed = [];
  this.passed = [];
  this.skipped = [];
  this.time = 0;

  this.tests.forEach(function(test) {
    this.time += test.time;
    if (test.skipped) return this.skipped.push(test);
    this[test.failed ? 'failed' : 'passed'].push(test);
  }, this);
}

/**
 * Merge with another `Result`.
 *
 * @param {Result} result
 * @returns {Result} self
 * @api public
 */

Result.prototype.merge = function(result) {
  this.time += result.time;
  this.tests = this.tests.concat(result.tests);
  this.failed = this.failed.concat(result.failed);
  this.passed = this.passed.concat(result.passed);
  this.skipped = this.skipped.concat(result.skipped);
  return this;
};

/**
 * Primary export.
 */

module.exports = Result;
