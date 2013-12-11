/**
 * External dependencies.
 */

var EventEmitter = require('evts');
var loader = require('fload');
var merge = require('super').merge;

/**
 * Internal dependencies.
 */

var Runner = require('./hydro/runner');
var Suite = require('./hydro/suite');
var Test = require('./hydro/test');

/**
 * toString.
 */

var tostr = Object.prototype.toString;

/**
 * Hydro - the main class that external parties
 * interact with.
 *
 * @param {Function} file loader (optional)
 * @param {Runner} runner (optional)
 * @constructor
 */

function Hydro(runner) {
  if (!(this instanceof Hydro)) return new Hydro(runner);
  this.runner = runner || new Runner;
  this.loader = loader;
  this.events = new EventEmitter;
  this.plugins = [];
  this.options = {
    cli: [],
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
 * Runner#test proxy.
 *
 * @api public
 */

Hydro.prototype.addTest = function() {
  var test = this.runner.addTest.apply(this.runner, arguments);
  var timeout = this.get('timeout');
  if (timeout) test.timeout(timeout);
  return test;
};

/**
 * Runner#suite proxy.
 *
 * @api public
 */

Hydro.prototype.addSuite = function() {
  return this.runner.addSuite.apply(this.runner, arguments);
};

/**
 * Register event handler.
 *
 * @param {String} event name
 * @param {Function} handler
 * @api public
 */

Hydro.prototype.on = function(evt, fn) {
  this.events.on(evt, fn);
};

/**
 * Execute the tests.
 *
 * @param {Function} fn
 * @api public
 */

Hydro.prototype.run = function(fn) {
  var events = this.events;
  var patterns = null;
  var suite = null;
  var self = this;

  fn = fn || function(){};

  this.loadPlugins();
  this.attachGlobals();
  this.attachProxies();
  this.loadFormatter();

  if (suite = this.get('suite')) {
    this.addSuite(suite);
  }

  patterns = this.get('tests');

  this.loader(patterns, {
    pre: function(file, done) {
      events.emit('pre:file', file, done);
    },
    post: function(file, contents, done) {
      events.emit('post:file', file, done);
    },
    done: function() {
      self.runner.run(events, fn);
    }
  });
};

/**
 * Load all plugins.
 *
 * @api private
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

  if (!name) {
    return;
  } else if (tostr.call(name) === '[object String]') {
    formatter = new (require(name));
  } else if (typeof name === 'function') {
    formatter = new name;
  } else {
    formatter = name;
  }

  formatter.use(this);
};

/**
 * Primary export.
 */

module.exports = Hydro;

/**
 * Export `Runner`.
 */

module.exports.Runner = Runner;

/**
 * Export `Suite`.
 */

module.exports.Suite = Suite;

/**
 * Export `Test`.
 */

module.exports.Test = Test;
