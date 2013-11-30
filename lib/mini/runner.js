/**
 * Internal dependencies.
 */

var Test = require('./test');

/**
 * Test runner.
 *
 * @param {Formatter} formatter
 * @constructor
 */

function Runner(formatter) {
  this.tests = [];
}

/**
 * Register test `fn` with `title`.
 *
 * @param {String} title
 * @param {Function} fn
 * @api public
 */

Runner.prototype.test = function(title, fn) {
  this.tests.push(new Test(title, fn));
};

/**
 * Run the tests.
 *
 * @api public
 */

Runner.prototype.run = function(formatter, fn) {
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
    process.removeListener('uncaughtException', done);
    formatter.afterAll(tests);
    fn(tests);
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

  formatter.beforeAll(tests);
  process.on('uncaughtException', done);
  next();
};

/**
 * Primary export.
 */

module.exports = Runner;
