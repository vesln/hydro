/**
 * Dependencies
 */

var Suite = require('./suite');
var Test = require('./test');
var Frame = require('./frame');
var _ = require('./util');

/**
 * Public interface for proxy methods.
 *
 * @param {Hydro} hydro
 * @param {Frame} frame
 * @constructor
 */

function Interface(hydro, ctx) {
  this.hydro = hydro;
  this.ctx = ctx;
  this.stack = [this.ctx];
}

/**
 * Add a test suite.
 *
 * @param {String} title
 * @param {Function} body
 * @api public
 */

Interface.prototype.addSuite = function(title, fn) {
  var suite = this.pushSuite(title);
  if (fn) fn.call(suite);
  this.popSuite();
  return suite;
};

/**
 * Open a new suite.
 *
 * @param {Suite|String} title
 * @return {Suite}
 * @api public
 */

Interface.prototype.pushSuite = function(title) {
  var suite = !(title instanceof Suite)
    ? this.createSuite.apply(this, arguments)
    : title;

  this.ctx.suite.addSuite(suite);
  this.ctx = new Frame(suite);
  this.stack.push(this.ctx);
  return suite;
};

/**
 * Close the current suite.
 *
 * @return {Suite}
 * @api public
 */

Interface.prototype.popSuite = function() {
  this.ctx = this.stack[this.stack.length - 2];
  return this.stack.pop();
};

/**
 * Add a new test.
 *
 * @param {String} title
 * @param {Object} metadata (optional)
 * @param {Function} test (optional)
 * @api public
 */

Interface.prototype.addTest = function() {
  var test = this.createTest.apply(this, arguments)

  each('beforeEach', this, before);
  each('afterEach', this, after);

  this.ctx.beforeNext.forEach(before);
  this.ctx.beforeNext.length = 0;

  this.ctx.afterNext.forEach(after);
  this.ctx.afterNext.length = 0;

  this.ctx.suite.addTest(test);

  function before(fn){ test.on('before', fn); }
  function after(fn){ test.on('after', fn); }

  return test
};

/**
 * Create a test.
 *
 * TODO: timeout, meh
 *
 * @param {String} title
 * @param {Object} metadata (optional)
 * @param {Function} test (optional)
 * @api public
 */

Interface.prototype.createTest = function() {
  var test = Test.create(_.slice(arguments));
  var timeout = this.hydro.get('timeout');
  if (timeout) test.timeout(timeout);
  return test;
};

/**
 * Create a test suite.
 *
 * @param {String} title
 * @api public
 */

Interface.prototype.createSuite = function(title) {
  return new Suite(title);
};

/**
 * Before next.
 *
 * @param {Function} fn
 * @api public
 */

Interface.prototype.beforeNext = function(fn) {
  this.ctx.beforeNext.push(fn);
};

/**
 * After next.
 *
 * @param {Function} fn
 * @api public
 */

Interface.prototype.afterNext = function(fn) {
  this.ctx.afterNext.push(fn);
};

/**
 * Before each.
 *
 * @param {Function} fn
 * @api public
 */

Interface.prototype.before = function(fn) {
  this.ctx.beforeEach.push(fn);
};

/**
 * After each.
 *
 * @param {Function} fn
 * @api public
 */

Interface.prototype.after = function(fn) {
  this.ctx.afterEach.push(fn);
};

/**
 * Before all.
 *
 * @param {Function} fn
 * @api public
 */

Interface.prototype.beforeAll = function(fn) {
  this.ctx.suite.on('before', fn);
};

/**
 * After all.
 *
 * @param {Function} fn
 * @api public
 */

Interface.prototype.afterAll = function(fn) {
  this.ctx.suite.on('after', fn);
};

/**
 * Interate through all functions in the stack.
 *
 * @param {String} key
 * @param {Interface} interface
 * @param {Function} fn
 * @api private
 */

function each(key, interface, fn) {
  var stack = interface.stack;

  for (var i = 0, len = stack.length; i < len; i++) {
    stack[i][key].forEach(fn);
  }
}

/**
 * Primary export.
 */

module.exports = Interface;
