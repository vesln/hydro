/**
 * External dependencies.
 */

var extend = require('super').extend;
var inherits = require('super');
var Emitter = require('evts');

/**
 * Internal dependencies.
 */

var util = require('../util');

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
  this.fn = fn;
  this.meta = util.toArray(meta || []);
  this.status = null;
  this.error = null;
  this.time = null;
  this.context = {};
  this.events = {
    pre: 'pre:test',
    post: 'post:test'
  };

  if (!this.fn) this.pending();
}

/**
 * Extend.
 */

Base.extend = extend;

/**
 * inherit from Emitter
 */

inherits(Base, Emitter);

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
  this.status = 'skipped';
  this.time = 0;
};

/**
 * Mark the test as pending.
 *
 * @returns {Base} self
 * @api public
 */

Base.prototype.pending = function() {
  this.status = 'pending';
  this.time = 0;
  return this;
};

/**
 * Return the titles of all parent suites +
 * the test title.
 *
 * @returns {String}
 * @api public
 */

Base.prototype.fullTitle = function() {
  return this.suite.fullTitle() + ' ' + this.title;
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

  emitter.emit(events.pre, this, function(err) {
    if (err) return done(err);
    var disabled = self.status === 'pending' || self.status === 'skipped';
    if (disabled) return emitter.emit(events.post, self, done);
    self.emit('before', function(err) {
      if (err) return done(err);
      var start = (new D).getTime();
      self.exec(function(err) {
        self.time = (new D).getTime() - start;
        if (err) self.fail(err);
        else self.pass();
        self.emit('after', function(err) {
          if (err) return done(err);
          emitter.emit(events.post, self, done);
        });
      });
    });
  });
};

/**
 * Return all parent suites.
 *
 * @returns {Array}
 * @api public
 */

Base.prototype.parents = function() {
  return this.suite.parents().concat(this.suite);
};

/**
 * Mark the test as failed.
 *
 * @param {Object} error
 * @returns {Base} self
 * @api private
 */

Base.prototype.fail = function(err) {
  this.status = 'failed';
  this.error = err;
  return this;
};

/**
 * Mark the test as passed.
 *
 * @returns {Base} self
 * @api private
 */

Base.prototype.pass = function() {
  this.status = 'passed';
  return this;
};

/**
 * Primary export.
 */

module.exports = Base;
