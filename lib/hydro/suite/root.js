/**
 * External dependencies.
 */

var inherits = require('super');

/**
 * Internal dependencies.
 */

var Suite = require('./index');

/**
 * Root suite.
 *
 * @constructor
 */

function RootSuite() {
  Suite.call(this);

  this.events = {
    pre: 'pre:all',
    post: 'post:all',
  };
}

/**
 * Inherit `Suite`.
 */

inherits(RootSuite, Suite);

/**
 * The root suite can't have any tests.
 *
 * @api public
 */

RootSuite.prototype.addTest = function() {
  throw new Error('Please register a test suite');
};

/**
 * Primary export.
 */

module.exports = RootSuite;