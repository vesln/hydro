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
  this.methods = {};
  this.options = {
    plugins: [],
    aliases: {},
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
  if (Object(key) !== key) {
    this.options[key] = val;
  } else {
    this.options = merge([this.options, key]);
  }

  return this;
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
 * Add a DSL method.
 *
 * @param {String} name
 * @param {Function} fn
 * @api public
 */

Hydro.prototype.addMethod = function(name, fn) {
  this.methods[name] = fn;
};

/**
 * Runner#test proxy.
 *
 * @api public
 */

Hydro.prototype.addTest = function() {
  return this.runner.addTest.apply(this.runner, arguments);
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
  this.attachMethods();
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

  for (var i = 0, len = plugins.length; i < len; i++) {
    plugins[i](this);
  }
};

/**
 * Attach global methods.
 *
 * @api private
 */

Hydro.prototype.attachMethods = function() {
  var target = this.get('attach');

  for (var method in this.methods) {
    if (!this.methods.hasOwnProperty(method)) continue;
    target[method] = this.methods[method];
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
    target[proxy] = function() {
      return self[proxies[proxy]].apply(self, arguments);
    };
  }
};

/**
 * Load the specified formatter if any.
 *
 * @api private
 */

Hydro.prototype.loadFormatter = function() {
  var formatter = this.get('formatter');
  if (!formatter) return;
  (new (require(formatter))).use(this);
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
