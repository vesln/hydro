/**
 * External dependencies.
 */

var EventEmitter = require('evts');
var globalo = require('globalo');
var loader = require('fload');
var merge = require('super').merge;
var loa = require('loa');

/**
 * Internal dependencies.
 */

var RootSuite = require('./hydro/suite/root');
var Interface = require('./hydro/interface');
var Suite = require('./hydro/suite');
var Test = require('./hydro/test');
var util = require('./hydro/util');

/**
 * Hydro - the main class that external parties
 * interact with.
 *
 * @constructor
 */

function Hydro() {
  if (!(this instanceof Hydro)) return new Hydro();
  this.loader = loader;
  this.plugins = [];
  this.options = {
    plugins: [],
    aliases: {},
    globals: {},
    tests: []
  };
  this.root = new RootSuite;
  this.emitter = new EventEmitter;
  this.interface = new Interface(this);
}

/**
 * Set option `key` to `val`.
 *
 * @param {Object|String} key
 * @param {Mixed} val
 * @api public
 */

Hydro.prototype.set = function(key, val) {
  if (Object(key) === key) {
    this.options = merge([this.options, key]);
  } else if (arguments.length === 3) {
    if (typeof this.options[key] === 'undefined') {
      this.options[key] = {};
    }
    this.options[key][val] = arguments[2];
  } else {
    this.options[key] = val;
  }
};

/**
 * Push a value to `key`.
 *
 * @param {String} key
 * @param {Mixed} val
 * @api public
 */

Hydro.prototype.push = function(key, val) {
  if (typeof this.options[key] === 'undefined') {
    this.options[key] = [];
  }
  this.options[key].push(val);
};

/**
 * Return option `key`.
 *
 * @returns {Mixed}
 * @api public
 */

Hydro.prototype.get = function(key) {
  return this.options[key];
};

/**
 * Register event handler.
 *
 * @param {String} event name
 * @param {Function} handler
 * @api public
 */

Hydro.prototype.on = function(evt, fn) {
  this.emitter.on(evt, fn);
};

/**
 * Return all test suites.
 *
 * @returns {Array}
 * @api public
 */

Hydro.prototype.suites = function() {
  var suites = [];
  this.traverse({
    enterSuite: function(suite) {
      suites.push(suite);
    }
  });
  return suites;
};

/**
 * Return all tests.
 *
 * @returns {Array}
 * @api public
 */

Hydro.prototype.tests = function() {
  var tests = [];
  this.traverse({
    test: function(test) {
      tests.push(test);
    }
  });
  return tests;
};

/**
 * Traverse.
 *
 * @param {Object} handlers
 * @api public
 */

Hydro.prototype.traverse = function(handlers) {
  handlers.test = handlers.test || util.noop;
  handlers.enterSuite = handlers.enterSuite || util.noop;
  handlers.leaveSuite = handlers.leaveSuite || util.noop;

  (function next(suite) {
    handlers.enterSuite(suite);
    util.forEach(suite.runnables, function(runnable){
      if (runnable instanceof Suite) next(runnable);
      else handlers.test(runnable);
    });
    handlers.leaveSuite(suite);
  })(this.root);
};

/**
 * Setup plugins, globals, proxies, formatters
 * and root test suite.
 *
 * @api public
 */

Hydro.prototype.setup = function() {
  var emitter = this.emitter;
  var suite = null;
  var stackLimit = null;
  var self = this;

  this.loadPlugins();
  this.attachGlobals();
  this.attachProxies();
  this.loadFormatter();

  if (suite = this.get('suite')) {
    this.interface.pushSuite(suite);
  }

  if (stackLimit = this.get('stackLimit')) {
    Error.stackTraceLimit = stackLimit;
  }

  this._init = true;
};

/**
 * Load tests if any are specified and then run them.
 *
 * @param {Function} fn
 * @api public
 */

Hydro.prototype.exec = function(fn) {
  var emitter = this.emitter;
  var self = this;
  var suite = this.get('suite');

  fn = fn || util.rethrow;

  this.loader(this.get('tests'), {
    pre: function(file, done) {
      emitter.emit('pre:file', file, done);
    },
    post: function(file, contents, done) {
      emitter.emit('post:file', file, done);
    },
    done: function() {
      if (suite) self.interface.popSuite();
      self.root.run(emitter, fn);
    }
  });
};

/**
 * Sugar for `setup` and `exec`.
 *
 * @param {Function} fn
 * @api public
 */

Hydro.prototype.run = function(fn) {
  if (!this._init) this.setup();
  this.exec(fn);
};

/**
 * Load all plugins.
 *
 * @api public
 */

Hydro.prototype.loadPlugins = function() {
  util.forEach(this.get('plugins'), function(plugin) {
    plugin = loa(plugin);
    plugin(this, util);
    this.plugins.push(plugin);
  }, this);
};

/**
 * Create a test.
 *
 * @param {String} title
 * @param {Mixed} meta1 (optional)
 * @param {Mixed} meta2 (optional)
 * @param {Function} test (optional)
 * @api public
 */

Hydro.prototype.createTest = function() {
  var test = Test.create(util.slice(arguments));
  var timeout = this.get('timeout');
  if (timeout) test.timeout(timeout);
  return test;
};

/**
 * Create a test suite.
 *
 * @param {String} title
 * @api public
 */

Hydro.prototype.createSuite = function(title) {
  return new Suite(title);
};

/**
 * proxy to interface
 *
 * TODO: consider refactoring
 */

util.forEach(['addTest', 'addSuite'], function(method) {
  Hydro.prototype[method] = function(){
    return this.interface[method].apply(this.interface, arguments);
  };
});

/**
 * Attach global methods and properties.
 *
 * @api private
 */

Hydro.prototype.attachGlobals = function() {
  var target = this.global();
  util.eachKey(this.get('globals'), function(key, val) {
    target[key] = val;
  });
};

/**
 * Attach the specified proxies.
 *
 * @api private
 */

Hydro.prototype.attachProxies = function() {
  var proxies = this.get('proxies');
  var target = this.global();
  var self = this;

  util.eachKey(proxies, function(key, val) {
    target[key] = function() {
      return self.interface[val].apply(self.interface, arguments);
    };
  });
};

/**
 * Return the attach target or the top-level
 * object of the current platform.
 *
 * @returns {Object}
 * @api private
 */

Hydro.prototype.global = function() {
  return this.get('attach') || globalo();
};

/**
 * Load the specified formatter if any.
 *
 * @api private
 */

Hydro.prototype.loadFormatter = function() {
  var name = this.get('formatter');
  var formatter = null;
  if (!name) return;
  formatter = loa(name);
  if (util.isFunction(formatter)) formatter = new formatter;
  formatter.use(this);
};

/**
 * Primary exports.
 */

module.exports = Hydro;
module.exports.util = util;
module.exports.Test = Test;
module.exports.Suite = Suite;
