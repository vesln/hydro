/**
 * External dependencies.
 */

var chai = require('chai');

/**
 * Internal dependencies.
 */

var Hydro = require('./');

/**
 * Register `should`.
 */

global.should = chai.should();

/**
 * Include stack traces.
 */

chai.Assertion.includeStack = true;

/**
 * Setup `hydro`.
 *
 * @param {Hydro} hydro
 * @api public
 */

module.exports = function(hydro) {
  hydro.addSuite('Hydro');
  hydro.addMethod('Hydro', Hydro);
  hydro.addMethod('test', function() {
    return hydro.addTest.apply(hydro, arguments);
  });
};
