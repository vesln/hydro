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
  return this.runner.test.apply(this.runner, arguments);
};

/**
 * Runner#suite proxy.
 *
 * @api public
 */

Hydro.prototype.addSuite = function() {
  return this.runner.suite.apply(this.runner, arguments);
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

  for (var method in this.methods) {
    this.target[method] = this.methods[method];
  }

  runner.configure(options, function() {
    runner.loadFormatter();
    runner.loadTests();
    runner.run(fn);
  });
};

/**
 * Primary export.
 */

module.exports = Hydro;
