/**
 * Dependencies.
 */

var assert = require('assert');
var Hydro = require('.');
var fileSuite = require('./test/support/plugins/file-suite');
var interface = require('./test/support/plugins/interface');
var Formatter = require('./test/support/plugins/formatter');

/**
 * Setup `hydro`.
 *
 * @param {Hydro} hydro
 * @api public
 */

module.exports = function(hydro) {
  hydro.set({
    formatter: Formatter,
    plugins: [ fileSuite, interface ],
    globals: { assert: assert, Hydro: Hydro },
    tests: [
      'test/*.js',
      'test/integration/',
    ]
  });
};
