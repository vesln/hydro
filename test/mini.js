/**
 * Core dependencies.
 */

var join = require('path').join;

/**
 * External dependencies.
 */

var chai = require('chai');
var nixt = require('nixt');

/**
 * Path to bin.
 */

var bin = join(__dirname, '..', 'bin');

/**
 * Register `should`.
 */

global.should = chai.should();

/**
 * Include stack traces.
 */

chai.Assertion.includeStack = true;

/**
 * Nixt template.
 *
 * @returns {Runner}
 * @api public
 */

global.cli = function() {
  return nixt({ newlines: false }).cwd(bin).base('./mini ');
};

/**
 * Expose `mini`.
 */

global.test = require('..');
