/**
 * External dependencies.
 */

var assert = require('assert');

/**
 * Internal dependencies.
 */

var Hydro = require('./');

/**
 * Setup `hydro`.
 *
 * @param {Hydro} hydro
 * @api public
 */

module.exports = function(hydro) {
  hydro.set({
    formatter: 'hydro-simple',
    plugins: [
      'hydro-file-suite',
      'hydro-minimal'
    ],
    globals: {
      assert: assert,
      Hydro: Hydro
    },
    tests: [
      'test/*.js',
      'test/integration/',
    ]
  });
};
