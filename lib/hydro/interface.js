/**
 * Internal dependencies.
 */

var Suite = require('.//suite');
var Test = require('./test');
var util = require('./util');

/**
 * Public interface for proxy methods.
 *
 * @param {Hydro} hydro
 * @constructor
 */

function Interface(hydro) {
  this.hydro = hydro;
}

/**
 * Add a new test.
 *
 * @param {String} title
 * @param {Mixed} meta1 (optional)
 * @param {Mixed} meta2 (optional)
 * @param {Function} test (optional)
 * @api public
 */

Interface.prototype.addTest = function() {
  var test = this.createTest.apply(this, arguments);
  this.hydro.stack[0].addTest(test);
  return test;
};

/**
 * Create a test.
 *
 * @param {String} title
 * @param {Mixed} meta1 (optional)
 * @param {Mixed} meta2 (optional)
 * @param {Function} test (optional)
 * @api public
 */

Interface.prototype.createTest = function() {
  var test = Test.create(util.slice(arguments));
  var timeout = this.hydro.get('timeout');
  if (timeout) test.timeout(timeout);
  return test;
};

/**
 * Add a test suite.
 *
 * @param {String} title
 * @param {Function} body
 * @api public
 */

Interface.prototype.addSuite = function(title, fn) {
  var suite = this.createSuite(title);
  this.hydro.stack[0].addSuite(suite);

  if (fn) {
    this.hydro.stack.unshift(suite);
    fn();
    this.hydro.stack.shift();
  }

  return suite;
};

/**
 * Create a test suite.
 *
 * @param {String} title
 * @api public
 */

Interface.prototype.createSuite = function(title) {
  return new Suite(title);
};

/**
 * Primary export.
 */

module.exports = Interface;
