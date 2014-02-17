/**
 * External dependencies.
 */

var inherits = require('super');
var Emitter = require('evts');

/**
 * Internal dependencies.
 */

var util = require('../util');

/**
 * Test suite.
 *
 * @param {String} title
 * @constructor
 */

function Suite(title) {
  this.title = util.isFunction(title) ? util.fnName(title) : title;
  this.parent = null;
  this.runnables = [];
  this.events = {
    pre: 'pre:suite',
    post: 'post:suite'
  };
}

/**
 * inherit from Emitter
 */

inherits(Suite, Emitter)

/**
 * Register test `fn` with `title`.
 *
 * @param {Test} test
 * @api public
 */

Suite.prototype.addTest = function(test) {
  test.suite = this;
  this.runnables.push(test);
};

/**
 * Add a child `suite`.
 *
 * @param {Suite} suite
 * @api public
 */

Suite.prototype.addSuite = function(suite) {
  suite.parent = this;
  this.runnables.push(suite);
};

/**
 * Run the test suite.
 *
 * @param {Object} emitter
 * @param {Function} fn
 * @api public
 */

Suite.prototype.run = function(emitter, fn) {
  var self = this;
  var runnable = this.runnables.slice();
  var current = null;
  var events = this.events;

  function next(err) {
    if (err) return fn(err);
    if (current = runnable.shift()) {
      return current.run(emitter, next);
    }

    self.emit('after', function(err){
      if (err) return fn(err);
      emitter.emit(events.post, self, fn);
    })
  }

  emitter.emit(events.pre, this, function(err){
    if (err) return fn(err);
    self.emit('before', next);
  });
};

/**
 * Return all parent suites.
 *
 * @returns {Array}
 * @api public
 */

Suite.prototype.parents = function() {
  return this.parent.parents().concat(this.parent);
};

/**
 * Return the suites full title
 *
 * @return {String}
 * @api public
 */

Suite.prototype.fullTitle = function() {
  var base = this.parent.fullTitle();
  if (base) base += ' ';
  return base + this.title;
};

/**
 * Primary export.
 */

module.exports = Suite;
