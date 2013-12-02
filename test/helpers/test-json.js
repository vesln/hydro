/**
 * External dependencies.
 */

var hydro = require('../..');
var Formatter = hydro.Formatter;

/**
 * Json formatter.
 *
 * @constructor
 */

var Json = Formatter.extend();

/**
 * After all tests.
 *
 * @param {Result} test result
 * @api public
 */

Json.prototype.afterAll = function(result) {
  console.log(JSON.stringify(result.tests));
};

/**
 * Primary export.
 */

module.exports = Json;
