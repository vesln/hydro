var inherits = require('util').inherits;
var BaseTest = require('./base-test');

/**
 * SkippedTest.
 *
 * @constructor
 */

function SkippedTest(title, fn, tags, file, line) {
  BaseTest.apply(this, arguments);
  this.skipped = true;
  this.time = 0;
}

inherits(SkippedTest, BaseTest);

SkippedTest.prototype.run = function(events, done) {
  done();
};

/**
 * Primary export.
 */

module.exports = SkippedTest;
