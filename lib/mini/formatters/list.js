/**
 * External dependencies.
 */

var ms = require('ms');

/**
 * Internal dependencies.
 */

var color = require('../color');

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
  process.stdout.write('- ' + test.title + Array(this.len + 4 - test.title.length).join('.'));
};

/**
 * After each test.
 *
 * @param {Object} test
 * @api public
 */

List.prototype.afterTest = function(test) {
  var status = test.failed
    ? color('red',   'ERROR')
    : color('green', 'OK   ');

  console.log(' ' + status + '  ' + ms(test.time));
};

/**
 * After all tests.
 *
 * @param {Array} tests
 * @api public
 */

List.prototype.afterAll = function(tests) {
  var failures = tests.filter(function(test) {
    return test.failed === true;
  });
  var failed = failures.length;
  var passed = tests.length - failed;

  console.log('');
  console.log(color('red', '  ' + failed + ' failed', failed === 0));
  console.log(color('green', '  ' + passed + ' passed'));
  console.log('');
};

/**
 * Primary export.
 */

module.exports = List;
