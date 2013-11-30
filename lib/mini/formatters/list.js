/**
 * External dependencies.
 */

var ms = require('ms');

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
  this.len = 0;
}

/**
 * Before all tests.
 *
 * @param {Array} tests
 * @api public
 */

List.prototype.beforeAll = function(tests) {
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
 * After each test.
 *
 * @param {Object} test
 * @api public
 */

List.prototype.afterTest = function(test) {
  var status = test.failed
    ? 'ERROR'
    : 'OK   ';

  console.log(' ' + status + '  ' + ms(test.time));
};

/**
 * After all tests.
 *
 * @param {Array} tests
 * @api public
 */

List.prototype.afterAll = function(tests) {
  var failed = tests.filter(function(test) {
    return test.failed === true;
  });

  console.log('');
  console.log('  %d tests', tests.length);
  console.log('  %d failures', failed.length);
  console.log('');
};

/**
 * Primary export.
 */

module.exports = List;
