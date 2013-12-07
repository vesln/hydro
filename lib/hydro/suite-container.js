/**
 * Internal dependencies.
 */

var Result = require('./result');

/**
 * Test runner.
 *
 * @constructor
 */

function SuiteContainer() {
  this.suites = [];
}

/**
 * Register test suite.
 *
 * @param {Suite} suite
 * @api public
 */

SuiteContainer.prototype.suite = function(suite) {
  this.suites.push(suite);
};

/**
 * Run the tests.
 *
 * @api public
 */

SuiteContainer.prototype.run = function(events, fn) {
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
 * Primary export.
 */

module.exports = SuiteContainer;
