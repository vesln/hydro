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
 * Sync.
 */

SyncTest.prototype.sync = true;

/**
 * Execute the test.
 *
 * @param {Function} done
 * @api private
 */

SyncTest.prototype.exec = function(done) {
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
