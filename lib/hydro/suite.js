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
 * @param {Formatter} formatter
 * @param {Function} fn
 * @api public
 */

Suite.prototype.run = function(formatter, fn) {
  var self = this;
  var tests = this.tests;
  var ended = false;
  var test = null;
  var err = null;
  var i = 0;

  function done(err) {
    if (ended) return;
    ended = true;
    test.captureTime();
    if (err) test.fail(err);
    formatter.afterTest(test);
    next();
  }

  function end() {
    self.result = new Result(tests);
    process.removeListener('uncaughtException', done);
    formatter.afterSuite(self.result);
    fn();
  }

  function next() {
    err = null;
    ended = false;
    test = tests[i];
    i++;
    if (!test) return end();
    formatter.beforeTest(test);
    test.run(done);
  }

  formatter.beforeSuite(this);
  process.on('uncaughtException', done);
  next();
};

/**
 * Primary export.
 */

module.exports = Suite;
