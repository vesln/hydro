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
 * @param {Function} fn
 * @api public
 */

Suite.prototype.run = function(events, fn) {
  var self = this;
  var tests = this.tests;
  var ended = false;
  var test = null;
  var i = 0;

  function done(err) {
    if (ended) return;
    ended = true;
    if (err) test.fail(err);
    events.emit('post:test', test, next);
  }

  function end() {
    self.result = new Result(tests);
    process.removeListener('uncaughtException', done);
    events.emit('post:suite', self, fn);
  }

  function next() {
    ended = false;
    test = tests[i];
    i++;
    if (!test) return end();
    events.emit('pre:test', test, function() {
      test.run(done);
    });
  }

  events.emit('pre:suite', this, function() {
    process.on('uncaughtException', done);
    next();
  });
};

/**
 * Primary export.
 */

module.exports = Suite;
