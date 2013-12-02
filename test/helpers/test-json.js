/**
 * External dependencies.
 */

var Formatter = require('hydro-formatter');

/**
 * Json formatter.
 *
 * @constructor
 */

var Json = Formatter.extend();

/**
 * Before all.
 */

Json.prototype.beforeAll = function() {
  this.tests = [];
};

/**
 * Before each suite.
 *
 * @param {Suite} suite
 * @api public
 */

Json.prototype.beforeSuite = function(suite) {
  this.suite = suite;
};

/**
 * Before each test.
 *
 * @param {Test} test
 * @api public
 */

Json.prototype.beforeTest = function(test) {
  test.suite = this.suite.title;
  this.tests.push(test);
};

/**
 * After all tests.
 *
 * @api public
 */

Json.prototype.afterAll = function() {
  console.log(JSON.stringify(this.tests));
};

/**
 * Primary export.
 */

module.exports = Json;
