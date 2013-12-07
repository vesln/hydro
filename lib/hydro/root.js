/**
 * Internal dependencies.
 */

var Result = require('./result');

/**
 * Test runner.
 *
 * @constructor
 */

function Root() {
  this.suites = [];
}

/**
 * Register test suite.
 *
 * @param {Suite} suite
 * @api public
 */

Root.prototype.suite = function(suite) {
  this.suites.push(suite);
};

/**
 * Run the tests.
 *
 * @api public
 */

Root.prototype.run = function(events, fn) {
  var suites = this.suites;
  var i = 0;

  function runSuite() {
    var suite = suites[i];
    i++;
    if (suite) return suite.run(events, runSuite);

    var result = suites.map(function(suite) {
      return suite.result;
    }).reduce(function(a, b) {
      return a.merge(b);
    }, new Result);

    events.emit('post:all', result, function() {
      fn(result);
    });
  }

  events.emit('pre:all', suites, runSuite);
};

/**
 * Primary export.
 */

module.exports = Root;
