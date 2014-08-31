/**
 * Dependencies
 */

var EventEmitter = require('evts');
var loader = require('fload');
var merge = require('super').merge;
var loa = require('loa');
var TopLevelSuite = require('./suite/top-level');
var Interface = require('./interface');
var Suite = require('./suite');
var Test = require('./test');
var _ = require('./util');

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
  this.topLevel = new TopLevelSuite;
  this.emitter = new EventEmitter;
  this.interface = new Interface(this);

  _.delegate(this, this.interface, [
    'addTest',
    'addSuite'
  ]);
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
  handlers.test = handlers.test || _.noop;
  handlers.enterSuite = handlers.enterSuite || _.noop;
  handlers.leaveSuite = handlers.leaveSuite || _.noop;

  (function next(suite) {
    handlers.enterSuite(suite);
    suite.runnables.forEach(function(runnable){
      if (runnable instanceof Suite) next(runnable);
      else handlers.test(runnable);
    });
    handlers.leaveSuite(suite);
  })(this.topLevel);
};

/**
 * Setup plugins, globals, proxies, formatters
 * and top-level test suite.
 *
 * @api public
 */

Hydro.prototype.setup = function() {
  var suite = null;
  var formatter = this.get('formatter');
  var stackLimit = null;

  if (formatter = this.get('formatter')) {
    this.push('plugins', loa(formatter));
  }

  this.loadPlugins();
  this.attachGlobals();
  this.attachProxies();

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
  var self = this;
  var emitter = this.emitter;
  var suite = this.get('suite');

  fn = fn || _.rethrow;

  this.loader(this.get('tests'), {
    pre: function(file, done) {
      emitter.emit('pre:file', file, done);
    },
    post: function(file, contents, done) {
      emitter.emit('post:file', file, done);
    },
    done: function() {
      if (suite) self.interface.popSuite();
      self.topLevel.run(emitter, fn);
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
  this.get('plugins').forEach(function(name) {
    var plugin = loa(name)(this);
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
  var test = Test.create(_.slice(arguments));
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
 * Attach global methods and properties.
 *
 * @api private
 */

Hydro.prototype.attachGlobals = function() {
  var target = this.global();

  _.eachKey(this.get('globals'), function(key, val) {
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

  _.eachKey(proxies, function(key, val) {
    target[key] = function() {
      return self.interface[val].apply(self.interface, arguments);
    };
  });
};

/**
 * Return the `attach` target or the top-level
 * object of the current platform.
 *
 * @returns {Object}
 * @api private
 */

Hydro.prototype.global = function() {
  return this.get('attach') || global;
};

/**
 * Primary export
 */

module.exports = Hydro;
