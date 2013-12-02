/**
 * External dependencies.
 */

var hydro = require('../..');
var Formatter = hydro.Formatter;

/**
 * Simple formatter.
 *
 * @constructor
 */

var Simple = Formatter.extend();

/**
 * After all tests.
 *
 * @param {Result} test result
 * @api public
 */

Simple.prototype.afterAll = function(result) {
  this.displayResult(result);
  this.displayFailed(result);
};

/**
 * Primary export.
 */

module.exports = Simple;
