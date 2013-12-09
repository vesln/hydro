/**
 * External dependencies.
 */

var chai = require('chai');

/**
 * Internal dependencies.
 */

var Hydro = require('./');

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
  hydro.addMethod('Hydro', Hydro);

  hydro.addMethod('t', function() {
    return hydro.addTest.apply(hydro, arguments);
  });

  hydro.addMethod('s', function() {
    return hydro.addSuite.apply(hydro, arguments);
  });

  hydro.addMethod('should', chai.should());
};
