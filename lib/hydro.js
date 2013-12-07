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
  var self = this;
  var runner = this.runner;
  var events = this.events;
  var plugins = this.plugins;
  var args = arguments.length;

  if (args === 0) {
    options = {};
    fn = function() {};
  } else if (arguments.length === 1) {
    fn = options;
    options = {};
  }

  plugins.forEach(function(plugin) {
    plugin(this);
  }, this);

  for (var method in this.methods) {
    this.target[method] = this.methods[method];
  }

  events.emit('options', options, function() {
    if (options.formatter) {
      var formatter = new (require(options.formatter));
      formatter.use(self);
    }

    loadFiles(options.tests, events, function() {
      runner.run(events, fn);
    });
  });
};

/**
 * Load `files` and emit pre and post events.
 *
 * @param {Object} files
 * @param {Object} events
 * @param {Function} done
 * @api private
 */

function loadFiles(files, events, fn) {
  var file = null;
  files = (files || []).slice(0);

  (function next() {
    file = files.shift();
    if (!file) return fn();
    events.emit('pre:file', file, function() {
      var exprts = require(file);
      events.emit('post:file', file, exprts, next);
    });
  })();
}

/**
 * Primary export.
 */

module.exports = Hydro;
