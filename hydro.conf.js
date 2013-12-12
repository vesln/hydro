/**
 * External dependencies.
 */

var assert = require('simple-assert');

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
    suite: 'Hydro',
    plugins: ['hydro-file-suite', 'hydro-minimal'],
    attach: global,
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
