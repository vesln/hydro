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
 * Internal dependencies.
 */

var color = require('./color');

/**
 * Noop.
 */

var noop = function(){};

/**
 * Base formatter.
 *
 * @param {Stream} out stream
 * @constructor
 */

function Formatter(out) {
  this.out = out || process.stdout;
  this.padding = new Array(4).join(' ');
}

/**
 * Inheritance.
 *
 * @api public
 */

Formatter.extend = extend;

/**
 * Setup.
 *
 * @param {Object} events
 * @api public
 */

Formatter.prototype.setup = function(events) {
  events.on('pre:all', this.beforeAll.bind(this));
  events.on('pre:suite', this.beforeSuite.bind(this));
  events.on('pre:test', this.beforeTest.bind(this));
  events.on('post:test', this.afterTest.bind(this));
  events.on('post:suite', this.afterSuite.bind(this));
  events.on('post:all', this.afterAll.bind(this));
};

/**
 * Before all tests.
 *
 * @param {Array} suites
 * @api public
 */

Formatter.prototype.beforeAll = noop;

/**
 * Before test suite.
 *
 * @param {Suite} suite
 * @api public
 */

Formatter.prototype.beforeSuite = noop;

/**
 * Before each tests.
 *
 * @param {Test} test
 * @api public
 */

Formatter.prototype.beforeTest = noop;

/**
 * After test.
 *
 * @param {Test} test
 * @api public
 */

Formatter.prototype.afterTest = noop;

/**
 * After test suite.
 *
 * @param {Result} result
 * @api public
 */

Formatter.prototype.afterSuite = noop;

/**
 * After all tests.
 *
 * @param {Result} result
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
