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
  this.failures = 0;
}

/**
 * Before all tests.
 *
 * @param {Array} tests
 * @api public
 */

Formatter.prototype.beforeAll = function(tests) {
  console.log('Running %d tests...', tests.length);
  console.log('');
};

/**
 * After all tests.
 *
 * @api public
 */

Formatter.prototype.afterAll = function() {
  console.log('');
  console.log('Failures: %d', this.failures);
};

/**
 * Before each test.
 *
 * @param {Object} test
 * @api public
 */

Formatter.prototype.beforeTest = function(test) {
  out.write(test.title + '.....');
};

/**
 * After test.
 *
 * @param {Object} error
 * @api public
 */

Formatter.prototype.afterTest = function(err) {
  console.log(err ? 'ERROR' : 'OK');

  if (err) {
    this.failures++;
    console.log(err.message);
    console.log(err.stack);
  }
};

/**
 * Primary export.
 */

module.exports = Formatter;
