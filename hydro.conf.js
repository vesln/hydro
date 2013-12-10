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
    attach: global,
    aliases: {
      t: 'addTest'
    },
    tests: [
      'test/*.js',
      'test/integration/',
    ]
  });

  hydro.addMethod('assert', assert);
  hydro.addMethod('Hydro', Hydro);
  hydro.addMethod('t', function() {
    return hydro.addTest.apply(hydro, arguments);
  });
};
