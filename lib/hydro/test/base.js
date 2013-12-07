/**
 * External dependencies.
 */

var extend = require('super').extend;

/**
 * Base Test.
 *
 * @param {String} title
 * @param {Function} fn
 * @param {Array} tags
 * @param {Suite} test suite
 * @constructor
 */

function Base(title, fn, tags, suite) {
  this.title = title;
  this.tags = tags || [];
  this.fn = fn;
  this.suite = suite;
  this.failed = false;
  this.error = null;
  this.time = null;
  this.skipped = false;
  if (!fn) this.skip();
}

/**
 * Extend.
 */

Base.extend = extend;

/**
 * Run the test.
 *
 * @param {Object} events
 * @param {Function} done
 * @api public
 */

Base.prototype.run = function(events, done) {
  var self = this;
  events.emit('pre:test', this, function() {
    if (self.skipped) return events.emit('post:test', self, done);
    var start = (new Date).getTime();
    self.exec(events, function(err) {
      self.time = (new Date).getTime() - start;
      if (err) self.fail(err);
      events.emit('post:test', self, done);
    });
  });
};

/**
 * Mark the test as failed.
 *
 * @param {Object} error
 * @api private
 */

Base.prototype.fail = function(err) {
  this.failed = true;
  this.error = err;
};

/**
 * Mark the test as skipped.
 *
 * @api private
 */

Base.prototype.skip = function() {
  this.skipped = true;
  this.time = 0;
};

/**
 * Primary export.
 */

module.exports = Base;
