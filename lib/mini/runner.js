/**
 * Test runner.
 *
 * @param {Formatter} formatter
 * @constructor
 */

function Runner(formatter) {
  this.tests = [];
  this.formatter = formatter;
}

/**
 * Register test `fn` with `title`.
 *
 * @param {String} title
 * @param {Function} fn
 * @api public
 */

Runner.prototype.test = function(title, fn) {
  this.tests.push({
    async: fn.length === 1,
    title: title,
    fn: fn
  });
};

/**
 * Run the tests.
 *
 * @api public
 */

Runner.prototype.run = function(fn) {
  var tests = this.tests.slice(0);
  var formatter = this.formatter;
  var failures = [];
  var ready = false;
  var test = null;

  function error(err) {
    failures.push(test);
    formatter.afterTest(err);
    next();
  }

  function end() {
    process.removeListener('uncaughtException', error);
    formatter.afterAll(failures);
    fn(failures);
  }

  function done(err) {
    if (ready) return;
    if (err) failures.push(test);
    ready = true;
    formatter.afterTest(err);
    next();
  }

  function next() {
    var err = null;
    ready = false;
    test = tests.shift();

    if (!test) return end();
    formatter.beforeTest(test);
    try { test.fn(done); }
    catch (e) { err = e; }
    if (!test.async || err) done(err);
  }

  process.on('uncaughtException', error);
  formatter.beforeAll(this.tests);
  next();
};

/**
 * Primary export.
 */

module.exports = Runner;
