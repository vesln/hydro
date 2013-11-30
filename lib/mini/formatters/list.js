/**
 * Core dependencies.
 */

var basename = require('path').basename;

/**
 * External dependencies.
 */

var ms = require('ms');

/**
 * Internal dependencies.
 */

var color = require('../color');

/**
 * List formatter.
 *
 * @constructor
 */

function List() {
  this.len = 0;
  this.currentFile = null;
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
  if (this.currentFile !== test.file) this.displayGroup(test.file);
  var padding = Array(this.len + 1 - test.title.length).join(' ');
  process.stdout.write('    ' + test.title + padding);
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
    var signature = test.title + ' (' + test.file + ':' + test.line + ')';
    console.log((i + 1) + '. ' + signature);
    console.log(color('gray', '   ' + test.error.stack));
    console.log();
  });
};

/**
 * Display test group (test file).
 *
 * @param {String} file
 * @api private
 */

List.prototype.displayGroup = function(file) {
  this.currentFile = file;
  console.log();
  console.log(color('gray', '  ' + basename(file)));
};

/**
 * Primary export.
 */

module.exports = List;
