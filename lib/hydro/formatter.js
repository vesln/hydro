/**
 * Core dependencies.
 */

var path = require('path');
var basename = path.basename;
var extname = path.extname;

/**
 * External dependencies.
 */

var extend = require('super').extend;
var ms = require('ms');

/**
 * Noop.
 */

var noop = function(){};

/**
 * Internal dependencies.
 */

var color = require('./color');

/**
 * Base formatter.
 *
 * @param {Stream} out stream
 * @constructor
 */

function Formatter(out) {
  this.out = out || process.stdout;
  this.padding = new Array(4).join(' ');
  this.setup();
}

/**
 * Inheritance.
 *
 * @api public
 */

Formatter.extend = extend;

/**
 * Setup.
 */

Formatter.prototype.setup = noop;

/**
 * Before all tests.
 *
 * @api public
 */

Formatter.prototype.beforeAll = noop;

/**
 * Before each tests.
 *
 * @api public
 */

Formatter.prototype.beforeTest = noop;

/**
 * After test.
 *
 * @api public
 */

Formatter.prototype.afterTest = noop;

/**
 * After all tests.
 *
 * @api public
 */

Formatter.prototype.afterAll = noop;

/**
 * Attach `ms` for inheriting formatters.
 */

Formatter.prototype.ms = ms;

/**
 * Attach `color` for inheriting formatters.
 */

Formatter.prototype.color = color;

/**
 * Display test group (test file).
 *
 * @param {String} file
 * @api private
 */

Formatter.prototype.displayGroup = function(file) {
  this.currentFile = file;
  this.println();
  this.println(color('gray', basename(file, extname(file))));
};

/**
 * Print `msg`.
 *
 * @param {String} msg
 * @api private
 */

Formatter.prototype.print = function(msg) {
  msg = msg || '';
  this.out.write(msg);
};

/**
 * Print `msg` + \n.
 *
 * @param {String} msg
 * @api private
 */

Formatter.prototype.println = function(msg) {
  msg = msg || '';
  msg = this.padding + msg;
  this.print(msg + '\n');
};

/**
 * Display failed tests.
 *
 * @param {Result} result
 * @api private
 */

Formatter.prototype.displayFailed = function(result) {
  result.failed.forEach(function(test, i) {
    var signature = test.title + ' (' + test.file + ':' + test.line + ')';
    this.println((i + 1) + '. ' + signature);
    this.println(color('gray', test.error.stack));
    this.println();
  }, this);
};

/**
 * Display test results.
 *
 * @param {Result} result
 * @api private
 */

Formatter.prototype.displayResult = function(result) {
  var total = result.tests.length;
  var failures = result.failed.length;
  var skipped = result.skipped.length;
  var c = failures === 0 ? 'green' : 'red';
  var time = this.ms(result.time, { long: true });

  this.println();
  this.println('Finished in ' + time);
  this.println(color(c, total + ' tests, ' + failures + ' failures, ' + skipped + ' skipped'));
  this.println();
};

/**
 * Primary export.
 */

module.exports = Formatter;
