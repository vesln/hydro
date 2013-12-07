/**
 * External dependencies.
 */

var extend = require('super').extend;

/**
 * Test.
 *
 * @param {String} title
 * @param {Function} fn
 * @param {Array} tags
 * @param {String} file
 * @constructor
 */

function Test(title, fn, tags, file) {
  this.title = title;
  this.tags = tags || [];
  this.fn = fn;
  this.file = file;
  this.failed = false;
  this.error = null;
  this.time = null;
  this.skipped = false;
  if (!fn) this.skip();
}

Test.extend = extend;

Test.prototype.fail = function(err) {
  this.failed = true;
  this.error = err;
};

Test.prototype.skip = function() {
  this.skipped = true;
  this.time = 0;
};

Test.prototype.run = function(events, done) {
  var self = this;
  if (this.skipped) return done();
  events.emit('pre:test', this, function() {
    var start = (new Date).getTime();
    self.exec(events, function(err) {
      self.time = (new Date).getTime() - start;
      if (err) self.fail(err);
      events.emit('post:test', self, done);
    });
  });
};

/**
 * Primary export.
 */

module.exports = Test;
