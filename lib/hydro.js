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

/**
 * toString.
 */

var tostr = Object.prototype.toString;

/**
 * Slice.
 */

var slice = Array.prototype.slice;

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
  this.suites = [];
  this.tests = [];
  this.stack = [new RootSuite];
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
  this.tests.push(test);
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
  var test = Test.create(slice.call(arguments));
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

  if (fn) {
    fn();
    this.stack.shift();
  }

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
    this.suites.push(suite);
    this.stack[0].addSuite(suite);
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
      self.stack[0].run(emitter, fn);
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
    plugin = plugins[i];

    if (tostr.call(plugin) === '[object String]') {
      plugin = require(plugin);
    }

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

  for (var prop in globals) {
    if (!globals.hasOwnProperty(prop)) continue;
    target[prop] = globals[prop];
  }
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

  for (var proxy in proxies) {
    if (!proxies.hasOwnProperty(proxy)) continue;
    (function(proxy) {
      target[proxy] = function() {
        return self[proxies[proxy]].apply(self, arguments);
      };
    })(proxy);
  }
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
module.exports.Test = Test;
module.exports.Suite = Suite;
module.exports.RootSuite = RootSuite;
