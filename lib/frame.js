/**
 * Hook storage container.
 *
 * @param {Suite} suite
 * @api private
 * @constructor
 */

function Frame(suite) {
  this.suite = suite;
  this.beforeNext = [];
  this.beforeEach = [];
  this.afterEach = [];
  this.afterNext = [];
}

/**
 * Primary export.
 */

module.exports = Frame;
