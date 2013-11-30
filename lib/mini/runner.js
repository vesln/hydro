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

Runner.prototype.run = function() {
  var tests = this.tests.slice(0);
  var formatter = this.formatter;
  var test = null;
  var ready = false;

  function error(err) {
    formatter.afterTest(err);
    next();
  }

  function end() {
    process.removeListener('uncaughtException', error);
    formatter.afterAll();
  }

  function done(err) {
    if (ready) return;
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
