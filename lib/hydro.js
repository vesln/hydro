/**
 * External dependencies.
 */

var EventEmitter = require('evts');

/**
 * Internal dependencies.
 */

var Runner = require('./hydro/runner');

/**
 * Hydro - the main class that external parties
 * interact with.
 *
 * @param {Runner} runner (optional)
 * @constructor
 */

function Hydro(runner) {
  if (!(this instanceof Hydro)) return new Hydro(runner);
  this.runner = runner || new Runner;
  this.events = new EventEmitter;
  this.global = null;
  this.plugins = [];
  this.methods = Object.create(null);
  this.target = global;
}

/**
 * Register a new plugin.
 *
 * @param {Function} plugin
 * @api public
 */

Hydro.prototype.use = function(plugin) {
  this.plugins.push(plugin);
};

/**
 * Set the object where the DSL methods will be attached.
 *
 * @param {Object}
 * @api public
 */

Hydro.prototype.attach = function(obj) {
  this.target = obj;
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
 * @param {Object} options
 * @param {Function} fn
 * @api public
 */

Hydro.prototype.run = function(options, fn) {
  var runner = this.runner;
  var events = this.events;

  for (var method in this.methods) {
    this.target[method] = this.methods[method];
  }

  events.emit('options', options, function() {
    if (options.formatter){
      var Formatter = require(options.formatter);
      var formatter = new Formatter;
      formatter.setup(events);
    }

    (options.tests || []).forEach(function(file) {
      require(file);
    });

    runner.run(events, fn);
  });
};

/**
 * Primary export.
 */

module.exports = Hydro;
