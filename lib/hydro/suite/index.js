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
  this.tests = [];
  this.suites = [];
  this.events = {
    pre: 'pre:suite',
    post: 'post:suite'
  };
}

/**
 * Register test `fn` with `title`.
 *
 * @param {Test} test
 * @api public
 */

Suite.prototype.addTest = function(test) {
  test.suite = this;
  this.tests.push(test);
};

/**
 * Add a child `suite`.
 *
 * @param {Suite} suite
 * @api public
 */

Suite.prototype.addSuite = function(suite) {
  suite.parent = this;
  this.suites.push(suite);
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
  var runnable = this.tests.slice(0).concat(this.suites.slice(0));
  var current = null;
  var events = this.events;

  function next() {
    if (current = runnable.shift()) {
      return current.run(emitter, next);
    }

    emitter.emit(events.post, self, function() {
      fn(self);
    });
  }

  emitter.emit(events.pre, this, next);
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
 * Primary export.
 */

module.exports = Suite;
