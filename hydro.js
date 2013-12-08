;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("vesln-evts/lib/evts.js", function(exports, require, module){
/**
 * slice.
 */

var slice = Array.prototype.slice;

/**
 * Event Emitter.
 *
 * @constructor
 */

function EventEmitter() {
  this.events = {};
}

/**
 * Subscribe to event.
 *
 * @param {String} event
 * @param {Function} handler
 * @api public
 */

EventEmitter.prototype.on = function(evt, fn) {
  this.events[evt] = this.events[evt] || [];
  this.events[evt].push(fn);
};

/**
 * Emit `evt` with `arg1`, `args2`.. and call `fn` when done.
 *
 * @param {String} event name
 * @param {Mixed} arg1 (optional)
 * @param {Mixed} arg2 (optional)
 * @param {Mixed} ...
 * @param {Function} fn
 * @api public
 */

EventEmitter.prototype.emit = function(evt, /* arg1, arg2 */ fn) {
  var listeners = this.events[evt];
  var i = 0;
  var args = slice.call(arguments, 1);
  var done = args.pop();
  if (!listeners) return done();

  (function next() {
    var handler = listeners[i];
    if (!handler) return done();
    i++;
    if (handler.length > args.length) return handler.apply(null, args.concat(next));
    handler.apply(null, args);
    next();
  })();
};

/**
 * Primary export.
 */

module.exports = EventEmitter;

});
require.register("hydro/lib/hydro.js", function(exports, require, module){
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

});
require.register("hydro/lib/hydro/test/async.js", function(exports, require, module){
/**
 * Core dependencies.
 */

var domain = require('domain');

/**
 * Internal dependencies.
 */

var BaseTest = require('./base');

/**
 * Async test.
 *
 * @constructor
 */

var AsyncTest = BaseTest.extend();

/**
 * Default timeout.
 */

AsyncTest.prototype.timeout = 1000 * 2;

/**
 * Execute the test.
 *
 * @param {Object} events
 * @param {Function} done
 * @api private
 */

AsyncTest.prototype.exec = function(events, done) {
  var timeout = null;
  var ended = false;
  var operation = domain.create();
  var fn = this.fn;
  var context = this.context;

  function end(err) {
    if (ended) return;
    ended = true;
    clearTimeout(timeout);
    done(err);
  }

  operation.on('error', end);

  timeout = setTimeout(function() {
    end(new Error('Test timed out'));
  }, this.timeout);

  operation.run(function() {
    fn.call(context, end);
  });
};

/**
 * Primary export.
 */

module.exports = AsyncTest;

});
require.register("hydro/lib/hydro/test/base.js", function(exports, require, module){
/**
 * External dependencies.
 */

var extend = require('super').extend;

/**
 * Base Test.
 *
 * @param {String} title
 * @param {Function} fn
 * @param {Array} meta
 * @param {Suite} test suite
 * @constructor
 */

function Base(title, fn, meta, suite) {
  this.title = title;
  this.meta = meta || [];
  this.fn = fn;
  this.suite = suite;
  this.failed = false;
  this.error = null;
  this.time = null;
  this.skipped = false;
  this.context = {};
  if (!fn) this.skip();
  if (!Array.isArray(this.meta)) {
    this.meta = [this.meta];
  }
}

/**
 * Extend.
 */

Base.extend = extend;

/**
 * Run the test.
 *
 * @param {Object} events
 * @param {Function} done
 * @api public
 */

Base.prototype.run = function(events, done) {
  var self = this;

  events.emit('pre:test', this, function() {
    if (self.skipped) return events.emit('post:test', self, done);
    var start = (new Date).getTime();
    self.exec(events, function(err) {
      self.time = (new Date).getTime() - start;
      if (err) self.fail(err);
      events.emit('post:test', self, done);
    });
  });
};

/**
 * Mark the test as skipped.
 *
 * @api public
 */

Base.prototype.skip = function(condition) {
  if (arguments.length && !condition) return;
  this.skipped = true;
  this.time = 0;
};

/**
 * Mark the test as failed.
 *
 * @param {Object} error
 * @api private
 */

Base.prototype.fail = function(err) {
  this.failed = true;
  this.error = err;
};

/**
 * Primary export.
 */

module.exports = Base;

});
require.register("hydro/lib/hydro/test/index.js", function(exports, require, module){
/**
 * Internal dependencies.
 */

var SyncTest = require('./sync');
var AsyncTest = require('./async');

/**
 * Test factory.
 *
 * @param {Suite} test suite
 * @param {Array} [title, meta, fn]
 * @returns {Base} test
 * @api public
 */

exports.create = function(suite, params) {
  var title = params.shift();
  var fn = null;

  if (typeof params[params.length - 1] === 'function') {
    fn = params.pop();
  }

  var klass = (fn && fn.length) ? AsyncTest : SyncTest;
  return new klass(title, fn, params, suite);
};

});
require.register("hydro/lib/hydro/test/sync.js", function(exports, require, module){
/**
 * External dependencies.
 */

var BaseTest = require('./base');

/**
 * Sync test.
 *
 * @constructor
 */
var SyncTest = BaseTest.extend();

/**
 * Execute the test.
 *
 * @param {Object} events
 * @param {Function} done
 * @api private
 */

SyncTest.prototype.exec = function(events, done) {
  var err = null;

  try {
    this.fn.call(this.context);
  } catch (e) {
    err = e;
  }

  done(err);
};

/**
 * Primary export.
 */

module.exports = SyncTest;

});
require.register("hydro/lib/hydro/runner.js", function(exports, require, module){
/**
 * Core dependencies.
 */

var path = require('path');

/**
 * Internal dependencies.
 */

var Test = require('./test');
var Suite = require('./suite');

/**
 * Slice.
 */

var slice = Array.prototype.slice;

/**
 * Runner.
 *
 * @constructor
 */

function Runner() {
  this.suites = [];
  this.currentSuite = null;
}

/**
 * Register a new test.
 *
 * @param {String} title
 * @param {Mixed} meta1 (optional)
 * @param {Mixed} meta2 (optional)
 * @param {Function} test (optional)
 * @api public
 */

Runner.prototype.addTest = function(/* title, meta1, meta2, fn */) {
  var suite = this.currentSuite;
  if (!suite) throw new Error('Please register a test suite');
  var test = Test.create(suite, slice.call(arguments, 0));
  suite.addTest(test);
  return test;
};

/**
 * Setup a new suite.
 *
 * @param {String} title
 * @param {Function} body (optional)
 * @api public
 */

Runner.prototype.addSuite = function(title, fn) {
  var parent = this.currentSuite;
  var suite = new Suite(title, parent);
  this.currentSuite = suite;

  if (!parent) {
    this.suites.push(suite);
  } else {
    parent.addSuite(suite);
  }

  if (fn) {
    fn();
    this.currentSuite = parent;
  }

  return suite;
};

/**
 * Run the test suites.
 *
 * @param {Function} fn
 * @api public
 */

Runner.prototype.run = function(events, fn) {
  var self = this;
  var suites = this.suites.slice(0);
  var suite = null;

  function next() {
    if (suite = suites.shift()) return suite.run(events, next);
    events.emit('post:all', self, function() { fn(self); });
  }

  events.emit('pre:all', this, next);
};

/**
 * Primary export.
 */

module.exports = Runner;

});
require.register("hydro/lib/hydro/suite.js", function(exports, require, module){
/**
 * Test suite.
 *
 * @param {String} title
 * @constructor
 */

function Suite(title) {
  this.title = title;
  this.tests = [];
  this.suites = [];
}

/**
 * Register test `fn` with `title`.
 *
 * @param {Test} test
 * @api public
 */

Suite.prototype.addTest = function(test) {
  this.tests.push(test);
};

/**
 * Add a child `suite`.
 *
 * @param {Suite} suite
 * @api public
 */

Suite.prototype.addSuite = function(suite) {
  this.suites.push(suite);
};

/**
 * Run the test suite.
 *
 * @param {Object} events
 * @param {Function} fn
 * @api public
 */

Suite.prototype.run = function(events, fn) {
  var self = this;
  var runnable = this.tests.slice(0).concat(this.suites.slice(0));
  var current = null;

  function next() {
    if (current = runnable.shift()) return current.run(events, next);
    events.emit('post:suite', self, function() { fn(self); });
  }

  events.emit('pre:suite', this, next);
};

/**
 * Primary export.
 */

module.exports = Suite;

});
require.alias("vesln-evts/lib/evts.js", "hydro/deps/evts/lib/evts.js");
require.alias("vesln-evts/lib/evts.js", "hydro/deps/evts/index.js");
require.alias("vesln-evts/lib/evts.js", "evts/index.js");
require.alias("vesln-evts/lib/evts.js", "vesln-evts/index.js");
require.alias("hydro/lib/hydro.js", "hydro/index.js");if (typeof exports == "object") {
  module.exports = require("hydro");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("hydro"); });
} else {
  this["hydro"] = require("hydro");
}})();