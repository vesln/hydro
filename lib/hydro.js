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
  this.global = null;
  this.plugins = [];
  this.methods = {};
  this.target = global;
  this.options = {};
}

/**
 * Set option `key` to `val`.
 *
 * @param {Object|String} key
 * @param {Mixed} val
 * @api public
 */

Hydro.prototype.set = function(key, val) {
  if (Object(key) !== key) return this.options[key] = val;
  this.options = merge([this.options, key]);
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
  var self = this;
  var events = this.events;
  var args = arguments.length;
  var formatter = null;
  var patterns = null;
  var suite = null;
  var plugins = this.get('plugins') || [];
  var target = this.get('attach');

  for (var i = 0, len = plugins.length; i < len; i++) {
    plugins[i](this);
  }

  for (var method in this.methods) {
    if (!this.methods.hasOwnProperty(method)) continue;
    target[method] = this.methods[method];
  }

  if (formatter = this.get('formatter')) {
    (new (require(formatter))).use(this);
  }

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
