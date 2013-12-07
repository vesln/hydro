/**
 * External dependencies.
 */

var BaseTest = require('./base');

/**
 * Sync test.
 *
 * @constructor
 */
var SyncTest = BaseTest.extend();

/**
 * Execute the test.
 *
 * @param {Object} events
 * @param {Function} done
 * @api private
 */

SyncTest.prototype.exec = function(events, done) {
  var err = null;

  try {
    this.fn.call(this.context);
  } catch (e) {
    err = e;
  }

  done(err);
};

/**
 * Primary export.
 */

module.exports = SyncTest;
