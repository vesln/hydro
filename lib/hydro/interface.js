/**
 * Internal dependencies.
 */

var Suite = require('./suite');
var util = require('./util');

/**
 * Public interface for proxy methods.
 *
 * @param {Hydro} hydro
 * @constructor
 */

function Interface(hydro) {
  this.hydro = hydro;
  this.ctx = new Frame(hydro.root);
  this.stack = [this.ctx];
}

/**
 * Delegate to Hydro.
 */

util.forEach(['createTest', 'createSuite'], function(method) {
  Interface.prototype[method] = function() {
    return this.hydro[method].apply(this.hydro, arguments);
  };
});

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
    ? this.hydro.createSuite.apply(this.hydro, arguments)
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
 * @param {Mixed} meta1 (optional)
 * @param {Mixed} meta2 (optional)
 * @param {Function} test (optional)
 * @api public
 */

Interface.prototype.addTest = function() {
  var test = this.hydro.createTest.apply(this.hydro, arguments)

  each('beforeEach', this, before);
  each('afterEach', this, after);

  util.forEach(this.ctx.beforeNext, before);
  this.ctx.beforeNext.length = 0;

  util.forEach(this.ctx.afterNext, after);
  this.ctx.afterNext.length = 0;

  this.ctx.suite.addTest(test);

  function before(fn){ test.on('before', fn); }
  function after(fn){ test.on('after', fn); }

  return test
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
 * Hook storage container.
 *
 * @param {Suite} suite
 * @api private
 */

function Frame(suite) {
  this.suite = suite;
  this.beforeNext = [];
  this.beforeEach = [];
  this.afterEach = [];
  this.afterNext = [];
}

/**
 * Interate through all functions in the stack.
 *
 * @param {String} key
 * @param {Interface} interface
 * @param {Function} fn
 * @api private
 */

function each(key, interface, fn){
  var stack = interface.stack;

  for (var i = 0, len = stack.length; i < len; i++) {
    util.forEach(stack[i][key], fn);
  }
}

/**
 * Primary export.
 */

module.exports = Interface;
