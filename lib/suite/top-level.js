/**
 * Dependencies.
 */

var inherits = require('super');
var Suite = require('./index');

/**
 * TopLevel suite.
 *
 * @constructor
 */

function TopLevelSuite() {
  Suite.call(this);

  this.events = {
    pre: 'pre:all',
    post: 'post:all'
  };
}

/**
 * Inherit `Suite`.
 */

inherits(TopLevelSuite, Suite);

/**
 * The root suite doesn't have any parent suites.
 *
 * @returns {Array}
 * @api public
 */

TopLevelSuite.prototype.parents = function() {
  return [];
};

/**
 * The root suite has an empty title
 *
 * @returns {String}
 * @api public
 */

TopLevelSuite.prototype.fullTitle = function() {
  return '';
};

/**
 * Primary export.
 */

module.exports = TopLevelSuite;
