/**
 * Internal dependencies.
 */

var Result = require('./result');

/**
 * Test suite.
 *
 * @param {String} title
 * @constructor
 */

function Suite(title) {
  this.title = title;
  this.result = null;
  this.tests = [];
}

/**
 * Register test `fn` with `title`.
 *
 * @param {Test} test
 * @api public
 */

Suite.prototype.test = function(test) {
  this.tests.push(test);
};

/**
 * Run the test suite.
 *
 * @param {Object} events
 * @param {Function} fn
 * @api public
 */

Suite.prototype.run = function(events, fn) {
  var self = this;
  var tests = this.tests;
  var i = 0;

  function next() {
    var test = tests[i];
    i++;
    if (test) return test.run(events, next);
    self.result = new Result(tests);
    events.emit('post:suite', self, fn);
  }

  events.emit('pre:suite', this, next);
};

/**
 * Primary export.
 */

module.exports = Suite;
