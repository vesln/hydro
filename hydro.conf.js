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
  hydro.set({
    formatter: 'hydro-simple',
    suite: 'Hydro',
    attach: global,
    tests: [
      'test/*.js',
      'test/integration/',
    ]
  });

  hydro.addMethod('should', chai.should());
  hydro.addMethod('Hydro', Hydro);
  hydro.addMethod('t', function() {
    return hydro.addTest.apply(hydro, arguments);
  });
};
