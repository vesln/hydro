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
    post: 'post:all'
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
  throw new Error('Please add a test suite');
};

/**
 * The root suite doesn't have any parent suites.
 *
 * @returns {Array}
 * @api public
 */

RootSuite.prototype.parents = function() {
  return [];
};

/**
 * The root suite has an empty title
 *
 * @returns {String}
 * @api public
 */

RootSuite.prototype.fullTitle = function() {
  return '';
};

/**
 * Primary export.
 */

module.exports = RootSuite;
