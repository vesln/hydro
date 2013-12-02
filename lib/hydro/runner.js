/**
 * Internal dependencies.
 */

var Result = require('./result');

/**
 * Test runner.
 *
 * @constructor
 */

function Runner() {
  this.suites = [];
}

/**
 * Register test suite.
 *
 * @param {Suite} suite
 * @api public
 */

Runner.prototype.suite = function(suite) {
  this.suites.push(suite);
};

/**
 * Run the tests.
 *
 * @api public
 */

Runner.prototype.run = function(formatter, fn) {
  var suites = this.suites;
  var i = 0;

  function runSuite() {
    var suite = suites[i];
    i++;
    if (suite) return suite.run(formatter, runSuite);

    var result = suites.map(function(suite) {
      return suite.result;
    }).reduce(function(a, b) {
      return a.merge(b);
    }, new Result);

    formatter.afterAll(result);
    return fn(result);
  }

  formatter.beforeAll(suites);
  runSuite();
};

/**
 * Primary export.
 */

module.exports = Runner;
