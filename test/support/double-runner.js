/**
 * Double test runner.
 *
 * @constructor
 */

function DoubleRunner() {
  this.tests = [];
  this.suites = [];
}

/**
 * Configure mock.
 *
 * @param {Object} options
 * @param {Function} fn
 * @api public
 */

DoubleRunner.prototype.configure = function(options, fn) {
  this.options = options;
  fn();
};

/**
 * Run mock.
 *
 * @param {Object} events
 * @param {Function} fn
 * @api public
 */

DoubleRunner.prototype.run = function(events, fn) {
  this.events = events;
  this.ran = fn;
};

/**
 * Add test mock.
 *
 * @api public
 */

DoubleRunner.prototype.addTest = function() {
  this.tests.push([].slice.call(arguments));
};

/**
 * Add suite mock.
 *
 * @api public
 */

DoubleRunner.prototype.addSuite = function() {
  this.suites.push([].slice.call(arguments));
};

/**
 * Primary export.
 */

module.exports = DoubleRunner;
