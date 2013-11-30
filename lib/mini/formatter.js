/**
 * Stdout.
 */

var out = process.stdout;

/**
 * Formatter.
 *
 * @constructor
 */

function Formatter() {
  this.failures = [];
  this.tests = 0;
  this.len = 0;
}

/**
 * Before all tests.
 *
 * @param {Array} tests
 * @api public
 */

Formatter.prototype.beforeAll = function(tests) {
  this.tests = tests.length;
  tests.forEach(function(test) {
    this.len = Math.max(test.title.length, this.len);
  }, this);
};

/**
 * Before each test.
 *
 * @param {Object} test
 * @api public
 */

Formatter.prototype.beforeTest = function(test) {
  out.write('- ' + test.title + Array(this.len + 4 - test.title.length).join('.'));
};

/**
 * After test.
 *
 * @param {Object} error
 * @api public
 */

Formatter.prototype.afterTest = function(err) {
  if (err) {
    console.log('ERROR');
  } else {
    console.log('OK');
  }
};

/**
 * After all tests.
 *
 * @param {Number} failures
 * @api public
 */

Formatter.prototype.afterAll = function(failures) {
  console.log('');
  console.log('%d tests', this.tests);
  console.log('%d failures', failures.length);
  console.log('');
};

/**
 * Primary export.
 */

module.exports = Formatter;
