/**
 * Stdout.
 */

var out = process.stdout;

/**
 * List.
 *
 * @constructor
 */

function List() {
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

List.prototype.beforeAll = function(tests) {
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

List.prototype.beforeTest = function(test) {
  out.write('- ' + test.title + Array(this.len + 4 - test.title.length).join('.'));
};

/**
 * After test.
 *
 * @param {Object} error
 * @api public
 */

List.prototype.afterTest = function(err) {
  console.log(err ? 'ERROR' : 'OK');
};

/**
 * After all tests.
 *
 * @param {Number} failures
 * @api public
 */

List.prototype.afterAll = function(failures) {
  console.log('');
  console.log('%d tests', this.tests);
  console.log('%d failures', failures.length);
  console.log('');
};

/**
 * Primary export.
 */

module.exports = List;
