/**
 * External dependencies.
 */

var extend = require('super').extend;

/**
 * Store `Date` locally since modules like `Timekeeper`
 * can modify it.
 */

var D = Date;

/**
 * Base Test.
 *
 * @param {String} title
 * @param {Function} fn
 * @param {Array} meta
 * @constructor
 */

function Base(title, fn, meta) {
  this.title = title;
  this.meta = meta || [];
  this.fn = fn;
  this.failed = false;
  this.error = null;
  this.time = null;
  this.skipped = false;
  this.context = {};
  this.events = {
    pre: 'pre:test',
    post: 'post:test',
  };
  if (!fn) this.skip();
  if (!Array.isArray(this.meta)) {
    this.meta = [this.meta];
  }
}

/**
 * Extend.
 */

Base.extend = extend;

/**
 * Configure test timeout.
 *
 * @param {Number} ms
 * @api public
 */

Base.prototype.timeout = function(ms) {
  this._timeout = ms;
  return this;
};

/**
 * Mark the test as skipped.
 *
 * @api public
 */

Base.prototype.skip = function(condition) {
  if (arguments.length && !condition) return;
  this.skipped = true;
  this.time = 0;
};

/**
 * Run the test.
 *
 * @param {Object} emitter
 * @param {Function} done
 * @api public
 */

Base.prototype.run = function(emitter, done) {
  var self = this;
  var events = this.events;

  emitter.emit(events.pre, this, function() {
    if (self.skipped) return emitter.emit(events.post, self, done);
    var start = (new D).getTime();
    self.exec(function(err) {
      self.time = (new D).getTime() - start;
      if (err) self.fail(err);
      emitter.emit(events.post, self, done);
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
 * Primary export.
 */

module.exports = Base;
