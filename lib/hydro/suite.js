/**
 * Test suite.
 *
 * @param {String} title
 * @constructor
 */

function Suite(title) {
  this.title = title;
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
  var tests = this.tests.slice(0);
  var test = null;

  function next() {
    if (test = tests.shift()) return test.run(events, next);
    events.emit('post:suite', self, function() { fn(self); });
  }

  events.emit('pre:suite', this, next);
};

/**
 * Primary export.
 */

module.exports = Suite;
