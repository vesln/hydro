var inherits = require('util').inherits;
var BaseTest = require('./base-test');

/**
 * SyncTest.
 *
 * @constructor
 */

function SyncTest() {
  BaseTest.apply(this, arguments);
}

inherits(SyncTest, BaseTest);

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
