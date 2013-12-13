/**
 * External dependencies.
 */

var EventEmitter = require('evts');
var instance = require('instance');
var loader = require('fload');
var merge = require('super').merge;

/**
 * Internal dependencies.
 */

var RootSuite = require('./hydro/suite/root');
var Suite = require('./hydro/suite');
var Test = require('./hydro/test');
var util = require('./hydro/util');

/**
 * Noop.
 */

function noop(){}

/**
 * Hydro - the main class that external parties
 * interact with.
 *
 * @constructor
 */

function Hydro() {
  if (!(this instanceof Hydro)) return new Hydro();
  this.loader = loader;
  this.emitter = new EventEmitter;
  this.plugins = [];
  this.stack = [new RootSuite];
  this.root = this.stack[0];
  this.options = {
    plugins: [],
    aliases: {},
    globals: {},
    tests: []
  };
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
 * Add a new test.
 *
 * @param {String} title
 * @param {Mixed} meta1 (optional)
 * @param {Mixed} meta2 (optional)
 * @param {Function} test (optional)
 * @api public
 */

Hydro.prototype.addTest = function() {
  var test = this.createTest.apply(this, arguments);
  this.stack[0].addTest(test);
  return test;
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
 * Add a test suite.
 *
 * @param {String} title
 * @param {Function} body
 * @api public
 */

Hydro.prototype.addSuite = function(title, fn) {
  var suite = this.createSuite(title);
  this.stack[0].addSuite(suite);
  this.stack.unshift(suite);
  fn();
  this.stack.shift();
  return suite;
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
  handlers.test = handlers.test || noop;
  handlers.enterSuite = handlers.enterSuite || noop;
  handlers.leaveSuite = handlers.leaveSuite || noop;

  (function next(suite) {
    handlers.enterSuite(suite);
    util.forEach(suite.suites, next);
    util.forEach(suite.tests, function(test) {
      handlers.test(test);
    });
    handlers.leaveSuite(suite);
  })(this.root);
};

/**
 * Execute the tests.
 *
 * @param {Function} fn
 * @api public
 */

Hydro.prototype.run = function(fn) {
  var emitter = this.emitter;
  var suite = null;
  var self = this;

  fn = fn || function(){};

  this.loadPlugins();
  this.attachGlobals();
  this.attachProxies();
  this.loadFormatter();

  if (suite = this.get('suite')) {
    suite = this.createSuite(suite);
    this.root.addSuite(suite);
    this.stack.unshift(suite);
  }

  this.loader(this.get('tests'), {
    pre: function(file, done) {
      emitter.emit('pre:file', file, done);
    },
    post: function(file, contents, done) {
      emitter.emit('post:file', file, done);
    },
    done: function() {
      if (suite) self.stack.shift();
      self.root.run(emitter, fn);
    }
  });
};

/**
 * Load all plugins.
 *
 * @api public
 */

Hydro.prototype.loadPlugins = function() {
  var plugins = this.get('plugins');
  var plugin = null;

  for (var i = 0, len = plugins.length; i < len; i++) {
    plugin = util.isString(plugins[i])
      ? require(plugins[i])
      : plugins[i];

    plugin(this);
    this.plugins.push(plugin);
  }
};

/**
 * Attach global methods and properties.
 *
 * @api private
 */

Hydro.prototype.attachGlobals = function() {
  var target = this.get('attach');
  var globals = this.get('globals');

  util.eachKey(globals, function(key, val) {
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
  var target = this.get('attach');
  var self = this;

  util.eachKey(proxies, function(key, val) {
    target[key] = function() {
      return self[val].apply(self, arguments);
    };
  });
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
  formatter = instance(name);
  formatter.use(this);
};

/**
 * Primary exports.
 */

module.exports = Hydro;
module.exports.util = util;
