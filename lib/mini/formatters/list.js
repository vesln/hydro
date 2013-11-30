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

  console.log();
};

/**
 * Before each test.
 *
 * @param {Object} test
 * @api public
 */

List.prototype.beforeTest = function(test) {
  var padding = Array(this.len + 1 - test.title.length).join(' ');
  process.stdout.write('  - ' + test.title + padding);
};

/**
 * After each test.
 *
 * @param {Object} test
 * @api public
 */

List.prototype.afterTest = function(test) {
  var time = color('gray', ms(test.time));
  var status = test.failed
    ? color('red',   'ERROR')
    : color('green', 'OK');

  console.log(' ' + status + ' ' + time);
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

  failures.forEach(function(test, i) {
    console.log((i + 1) + '. ' + test.signature());
    console.log(color('gray', '   ' + test.error.stack));
    console.log();
  });
};

/**
 * Primary export.
 */

module.exports = List;
