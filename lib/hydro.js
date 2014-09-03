/**
 * Dependencies
 */

var EventEmitter = require('evts');
var loader = require('fload');
var merge = require('super').merge;
var loa = require('loa');
var Interface = require('./interface');
var Frame = require('./frame');
var Runner = require('./runner');
var Suite = require('./suite');
var Config = require('./config');
var cli = require('./cli');
var _ = require('./util');

/**
 * Hydro - the main class that external parties
 * interact with.
 *
 * TODO(vesln): use `delegates`?
 *
 * @constructor
 */

function Hydro() {
  if (!(this instanceof Hydro)) {
    return new Hydro();
  }

  this.loader = loader;
  this.plugins = [];
  this.emitter = new EventEmitter;
  this.runner = new Runner;
  this.frame = new Frame(this.runner.topLevel);
  this.interface = new Interface(this, this.frame);
  this.config = new Config;

  // TODO(vesln): temp
  _.delegate(this, this.interface, [
    'addTest',
    'addSuite'
  ]);

  // TODO(vesln): temp
  _.delegate(this, this.runner, [
    'suites',
    'traverse',
    'tests'
  ]);

  // TODO(vesln): temp
  _.delegate(this, this.config, [
    'get',
    'set',
    'push'
  ]);
}

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
 * Run the cli.
 *
 * @param {Object} argv
 * @api public
 */

Hydro.prototype.cli = function(argv) {
  cli(this, argv).run();
};

/**
 * Setup plugins, globals, proxies, formatters
 * and top-level test suite.
 *
 * @api public
 */

Hydro.prototype.setup = function() {
  this.loadFormatter();
  this.loadPlugins();
  this.attach();
  this.setSuite();
  this.setStackLimit();
};

/**
 * Load tests if any are specified and then run them.
 *
 * TODO(vesln): why is popSuite needed
 *
 * @param {Function} fn
 * @api public
 */

Hydro.prototype.run = function(fn) {
  var self = this;
  var emitter = this.emitter;
  var suite = null;

  this.setup();

  suite = this.get('suite');
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
      self.runner.run(emitter, fn);
    }
  });
};

/**
 * Load all plugins.
 *
 * @api public
 */

Hydro.prototype.loadPlugins = function() {
  this.get('plugins').forEach(function(name) {
    var plugin = loa(name);
    plugin(this);
    this.plugins.push(plugin);
  }, this);
};

/**
 * Attach the specified proxies.
 *
 * @api private
 */

Hydro.prototype.attach = function() {
  var proxies = this.get('proxies');
  var target = this.get('global');
  var self = this;

  _.eachKey(this.get('globals'), function(key, val) {
    target[key] = val;
  });

  _.eachKey(proxies, function(key, val) {
    target[key] = function() {
      return self.interface[val].apply(self.interface, arguments);
    };
  });
};

/**
 * Load the formatter if any. The formatter is nothing different than a plugin
 * so we treat it that way.
 *
 * @api private
 */

Hydro.prototype.loadFormatter = function() {
  var formatter = this.get('formatter');
  if (formatter) this.push('plugins', loa(formatter));
};

/**
 * Set the top-level test suite if any has been specified.
 *
 * @api private
 */

Hydro.prototype.setSuite = function() {
  var suite = this.get('suite');
  if (suite) this.interface.pushSuite(suite);
};

/**
 * Set the error stack limit.
 *
 * @api private
 */

Hydro.prototype.setStackLimit = function() {
  Error.stackTraceLimit = this.get('stackLimit');
};

/**
 * Primary export
 */

module.exports = Hydro;
