/**
 * External dependencies.
 */

var BaseTest = require('./base');

/**
 * SyncTest.
 *
 * @constructor
 */
var SyncTest = BaseTest.extend();

SyncTest.prototype._run = function(events, done) {
  var err = null;

  try {
    this.fn();
  } catch (e) {
    err = e;
  }

  done(err);
};

/**
 * Primary export.
 */

module.exports = SyncTest;
