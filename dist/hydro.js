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
require.register("hydrojs-loa/index.js", function(exports, require, module){
/**
 * global || window
 */

var root = typeof global !== 'undefined' ? global : window;

/**
 * toString.
 */

var toString = Object.prototype.toString;

/**
 * Check if `input` is String, Function or Object.
 *
 * @param {String} type
 * @param {Mixed} input
 * @returns {Boolean}
 * @api private
 */

function is(type, input) {
  if (type === 'Object') return Object(input) === input;
  return toString.call(input) === '[object ' + type + ']';
}

/**
 * Check if `input` is a string and if so, either
 * refer to the global scope or `require` it. Then
 * call `loa` again in case the exported object
 * is a function.
 *
 * @param {Mixed} input
 * @api private
 */

function str(input) {
  if (!is('String', input)) return;
  return root[input] || (root.require || require)(input);
}

/**
 * Check if `input` is an object and if so assume it
 * is already an loa of something and return it
 * back;
 *
 * @param {Mixed} input
 * @api private
 */

function handeled(input) {
  if (is('Object', input) || is('Function', input)) return input;
}

/**
 * Raise error.
 *
 * @param {Mixed} input
 * @api private
 */

function raise(input) {
  throw new TypeError("loa: Can't handle: " + input);
}

/**
 * input is String             - global[input] || require(input)
 * input is Object|Function    - return input
 * else                        - throw
 *
 * @param {Mixed} input
 * @returns {Object}
 * @api public
 */

function loa(input) {
  return handeled(input) || str(input) || raise(input);
};

/**
 * Primary export.
 */

module.exports = loa;

});
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

  (function next(err) {
    if (err) return done(err);
    var handler = listeners[i];
    if (!handler) return done();
    i++;
    if (handler.length > args.length) return handler.apply(null, args.concat(next));
    try {
      handler.apply(null, args);
    } catch(e) {
      return next(e);
    }
    next();
  })();
};

/**
 * Primary export.
 */

module.exports = EventEmitter;

});
require.register("vesln-tryc/lib/browser.js", function(exports, require, module){
/**
 * Exec `fn` and call `end` with errors if any.
 * When the execution is done, put back the old
 * `onerror` handler.
 *
 * @param {Function} fn
 * @param {Function} end
 * @api public
 */

module.exports = function(fn, end) {
  var prev = window.onerror;

  function handler(err) {
    window.onerror = prev;
    end(err);
  }

  window.onerror = function(msg, url, line) {
    handler(new Error(msg + ' at ' + url + ':' + line));
  };

  try {
    fn(handler)
  } catch (err) {
    handler(err);
  }
};

});
require.register("vesln-fload/lib/browser.js", function(exports, require, module){
/**
 * Load JavaScript `files`.
 *
 * @param {Array} files
 * @param {Object} callbacks - `pre`, `post`, `done`
 * @api public
 */

function load(files, callbacks) {
  var target = document.getElementsByTagName('script')[0];
  files = files.slice(0);

  (function next() {
    var file = files.shift();
    if (!file) return callbacks.done();

    callbacks.pre(file, function() {
      var script = document.createElement('script');
      script.src = file;

      script.onload =
      script.onreadystatechange = function(e) {
        if ((e && e.type === 'load') || (/loaded|complete/.test(script.readyState))) {
          script.onload = null;
          script.onreadystatechange = null;
          callbacks.post(file, null, next);
        }
      };

      target.parentNode.insertBefore(script, target);
    });
  })();
}

/**
 * Primary export.
 */

module.exports = load;

});
require.register("vesln-globalo/index.js", function(exports, require, module){
/**
 * Return the top-level object for the current
 * platform.
 *
 *  - Node.js: `global`
 *  - Browsers: `window`
 *  - Titanium + Alloy: `Alloy.Globals`
 *  - Titanium  `Ti.App`
 *
 * @returns {Object}
 * @api public
 */

module.exports = function() {
  if (typeof global !== 'undefined') {
    return global;
  } else if (typeof window !== 'undefined') {
    return window;
  } else if (typeof Alloy !== 'undefined' && typeof Alloy.Globals !== 'undefined') {
    return Alloy.Globals;
  } else if (typeof Ti !== 'undefined' && typeof Ti.App !== 'undefined') {
    return Ti.App;
  }
};

});
require.register("vesln-super/lib/super.js", function(exports, require, module){
/**
 * slice
 */

var slice = Array.prototype.slice;

/**
 * Primary export
 */

var exports = module.exports = super_;

/**
 * ### _super (dest, orig)
 *
 * Inherits the prototype methods or merges objects.
 * This is the primary export and it is recommended
 * that it be imported as `inherits` in node to match
 * the auto imported browser interface.
 *
 *     var inherits = require('super');
 *
 * @param {Object|Function} destination object
 * @param {Object|Function} source object
 * @name _super
 * @api public
 */

function super_() {
  var args = slice.call(arguments);
  if (!args.length) return;
  if (typeof args[0] !== 'function') return exports.merge(args);
  exports.inherits.apply(null, args);
};

/**
 * ### extend (proto[, klass])
 *
 * Provide `.extend` mechanism to allow extenion without
 * needing to use dependancy.
 *
 *     function Bar () {
 *       this._konstructed = true;
 *     }
 *
 *     Bar.extend = inherits.extend;
 *
 *     var Fu = Bar.extend({
 *       initialize: function () {
 *         this._initialized = true;
 *       }
 *     });
 *
 *     var fu = new Fu();
 *     fu.should.be.instanceof(Fu); // true
 *     fu.should.be.instanceof(Bar); // true
 *
 * @param {Object} properties/methods to add to new prototype
 * @param {Object} properties/methods to add to new class
 * @returns {Object} new constructor
 * @name extend
 * @api public
 */

exports.extend = function(proto, klass) {
  var self = this
    , child = function () { return self.apply(this, arguments); };
  exports.merge([ child, this ]);
  exports.inherits(child, this);
  if (proto) exports.merge([ child.prototype, proto ]);
  if (klass) exports.merge([ child, klass ]);
  child.extend = this.extend; // prevent overwrite
  return child;
};

/**
 * ### inherits (ctor, superCtor)
 *
 * Inherit the prototype methods from on contructor
 * to another.
 *
 * @param {Function} destination
 * @param {Function} source
 * @api private
 */

exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  if (Object.create) {
    ctor.prototype = Object.create(superCtor.prototype,
      { constructor: {
            value: ctor
          , enumerable: false
          , writable: true
          , configurable: true
        }
    });
  } else {
    ctor.prototype = new superCtor();
    ctor.prototype.constructor = ctor;
  }
}

/**
 * Extends multiple objects.
 *
 * @param {Array} array of objects
 * @api private
 */

exports.merge = function (arr) {
  var main = arr.length === 2 ? arr.shift() : {};
  var obj = null;

  for (var i = 0, len = arr.length; i < len; i++) {
    obj = arr[i];
    for (var p in obj) {
      if (!obj.hasOwnProperty(p)) continue;
      main[p] = obj[p];
    }
  }

  return main;
};

});
require.register("hydro/lib/hydro.js", function(exports, require, module){
/**
 * External dependencies.
 */

var EventEmitter = require('evts');
var globalo = require('globalo');
var loader = require('fload');
var merge = require('super').merge;
var loa = require('loa');

/**
 * Internal dependencies.
 */

var RootSuite = require('./hydro/suite/root');
var Interface = require('./hydro/interface');
var Suite = require('./hydro/suite');
var Test = require('./hydro/test');
var util = require('./hydro/util');

/**
 * Hydro - the main class that external parties
 * interact with.
 *
 * @constructor
 */

function Hydro() {
  if (!(this instanceof Hydro)) return new Hydro();
  this.loader = loader;
  this.plugins = [];
  this.options = {
    plugins: [],
    aliases: {},
    globals: {},
    tests: []
  };
  this.root = new RootSuite;
  this.emitter = new EventEmitter;
  this.interface = new Interface(this);
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
  handlers.test = handlers.test || util.noop;
  handlers.enterSuite = handlers.enterSuite || util.noop;
  handlers.leaveSuite = handlers.leaveSuite || util.noop;

  (function next(suite) {
    handlers.enterSuite(suite);
    util.forEach(suite.suites, next);
    util.forEach(suite.tests, handlers.test)
    handlers.leaveSuite(suite);
  })(this.root);
};

/**
 * Setup plugins, globals, proxies, formatters
 * and root test suite.
 *
 * @api public
 */

Hydro.prototype.setup = function() {
  var emitter = this.emitter;
  var suite = null;
  var stackLimit = null;
  var self = this;

  this.loadPlugins();
  this.attachGlobals();
  this.attachProxies();
  this.loadFormatter();

  if (suite = this.get('suite')) {
    this.interface.pushSuite(suite);
  }

  if (stackLimit = this.get('stackLimit')) {
    Error.stackTraceLimit = stackLimit;
  }

  this._init = true;
};

/**
 * Load tests if any are specified and then run them.
 *
 * @param {Function} fn
 * @api public
 */

Hydro.prototype.exec = function(fn) {
  var emitter = this.emitter;
  var self = this;
  var suite = this.get('suite');

  fn = fn || function(){};

  this.loader(this.get('tests'), {
    pre: function(file, done) {
      emitter.emit('pre:file', file, done);
    },
    post: function(file, contents, done) {
      emitter.emit('post:file', file, done);
    },
    done: function() {
      if (suite) self.interface.popSuite();
      self.root.run(emitter, fn);
    }
  });
};

/**
 * Sugar for `setup` and `exec`.
 *
 * @param {Function} fn
 * @api public
 */

Hydro.prototype.run = function(fn) {
  if (!this._init) this.setup();
  this.exec(fn);
};

/**
 * Load all plugins.
 *
 * @api public
 */

Hydro.prototype.loadPlugins = function() {
  util.forEach(this.get('plugins'), function(plugin) {
    plugin = loa(plugin);
    plugin(this, util);
    this.plugins.push(plugin);
  }, this);
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
 * Create a test suite.
 *
 * @param {String} title
 * @api public
 */

Hydro.prototype.createSuite = function(title) {
  return new Suite(title);
};

/**
 * proxy to interface
 *
 * TODO: consider refactoring
 */

util.forEach(['addTest', 'addSuite'], function(method) {
  Hydro.prototype[method] = function(){
    return this.interface[method].apply(this.interface, arguments);
  };
});

/**
 * Attach global methods and properties.
 *
 * @api private
 */

Hydro.prototype.attachGlobals = function() {
  var target = this.global();
  util.eachKey(this.get('globals'), function(key, val) {
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
  var target = this.global();
  var self = this;

  util.eachKey(proxies, function(key, val) {
    target[key] = function() {
      return self.interface[val].apply(self.interface, arguments);
    };
  });
};

/**
 * Return the attach target or the top-level
 * object of the current platform.
 *
 * @returns {Object}
 * @api private
 */

Hydro.prototype.global = function() {
  return this.get('attach') || globalo();
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
  formatter = loa(name);
  if (util.isFunction(formatter)) formatter = new formatter;
  formatter.use(this);
};

/**
 * Primary exports.
 */

module.exports = Hydro;
module.exports.util = util;
module.exports.Test = Test;
module.exports.Suite = Suite;

});
require.register("hydro/lib/hydro/test/async.js", function(exports, require, module){
/**
 * External dependencies.
 */

var tryc = require('tryc');

/**
 * Store `setTimeout` locally since modules like `Timekeeper`
 * can modify it.
 */

var sTimeout = setTimeout;

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

AsyncTest.prototype._timeout = 1000 * 2;

/**
 * Async.
 */

AsyncTest.prototype.async = true;

/**
 * Execute the test.
 *
 * @param {Function} done
 * @api private
 */

AsyncTest.prototype.exec = function(done) {
  var timeout = null;
  var ended = false;
  var fn = this.fn;
  var context = this.context;

  function end(err) {
    if (ended) return;
    ended = true;
    clearTimeout(timeout);
    done(err);
  }

  timeout = sTimeout(function() {
    end(new Error('Test timed out'));
  }, this._timeout);

  tryc(function(done) {
    fn.call(context, done);
  }, end)
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
var inherits = require('super');
var Emitter = require('evts');

/**
 * Internal dependencies.
 */

var util = require('../util');

/**
 * Store `Date` locally since modules like `Timekeeper`
 * can modify it.
 */

var D = Date;

/**
 * Base Test.
 *
 * @param {String} title
 * @param {Function} fn
 * @param {Array} meta
 * @constructor
 */

function Base(title, fn, meta) {
  this.title = title;
  this.fn = fn;
  this.meta = util.toArray(meta || []);
  this.status = null;
  this.error = null;
  this.time = null;
  this.context = {};
  this.events = {
    pre: 'pre:test',
    post: 'post:test'
  };

  if (!this.fn) this.pending();
}

/**
 * Extend.
 */

Base.extend = extend;

/**
 * inherit from Emitter
 */

inherits(Base, Emitter);

/**
 * Configure test timeout.
 *
 * @param {Number} ms
 * @api public
 */

Base.prototype.timeout = function(ms) {
  this._timeout = ms;
  return this;
};

/**
 * Mark the test as skipped.
 *
 * @api public
 */

Base.prototype.skip = function(condition) {
  if (arguments.length && !condition) return;
  this.status = 'skipped';
  this.time = 0;
};

/**
 * Mark the test as pending.
 *
 * @returns {Base} self
 * @api public
 */

Base.prototype.pending = function() {
  this.status = 'pending';
  this.time = 0;
  return this;
};

/**
 * Return the titles of all parent suites +
 * the test title.
 *
 * @returns {String}
 * @api public
 */

Base.prototype.fullTitle = function() {
  var parents = this.parents().splice(1);
  var fullTitle = [];

  for (var i = 0, len = parents.length; i < len; i++) {
    fullTitle.push(parents[i].title);
  }

  fullTitle.push(this.title);
  return fullTitle.join(' ');
};

/**
 * Run the test.
 *
 * @param {Object} emitter
 * @param {Function} done
 * @api public
 */

Base.prototype.run = function(emitter, done) {
  var self = this;
  var events = this.events;

  emitter.emit(events.pre, this, function() {
    var disabled = self.status === 'pending' || self.status === 'skipped';
    if (disabled) return emitter.emit(events.post, self, done);
    self.emit('before', function(err) {
      if (err) return done(err);
      var start = (new D).getTime();
      self.exec(function(err) {
        self.time = (new D).getTime() - start;
        if (err) self.fail(err);
        else self.pass();
        self.emit('after', function(err) {
          if (err) return done(err);
          emitter.emit(events.post, self, done);
        });
      });
    });
  });
};

/**
 * Return all parent suites.
 *
 * @returns {Array}
 * @api public
 */

Base.prototype.parents = function() {
  return this.suite.parents().concat(this.suite);
};

/**
 * Mark the test as failed.
 *
 * @param {Object} error
 * @returns {Base} self
 * @api private
 */

Base.prototype.fail = function(err) {
  this.status = 'failed';
  this.error = err;
  return this;
};

/**
 * Mark the test as passed.
 *
 * @returns {Base} self
 * @api private
 */

Base.prototype.pass = function() {
  this.status = 'passed';
  return this;
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
var BaseTest = require('./base');

/**
 * Test factory.
 *
 * @param {Array} [title, meta, fn]
 * @returns {Base} test
 * @api public
 */

exports.create = function(params) {
  var title = params.shift();
  var fn = null;
  var klass = null;
  if (typeof params[params.length - 1] === 'function') fn = params.pop();
  klass = (fn && fn.length) ? AsyncTest : SyncTest;
  return new klass(title, fn, params);
};

/**
 * Export `AsyncTest`.
 */

exports.SyncTest = SyncTest;

/**
 * Export `SyncTest`.
 */

exports.AsyncTest = AsyncTest;

/**
 * Export `BaseTest`.
 */

exports.BaseTest = BaseTest;

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
 * Sync.
 */

SyncTest.prototype.sync = true;

/**
 * Execute the test.
 *
 * @param {Function} done
 * @api private
 */

SyncTest.prototype.exec = function(done) {
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
require.register("hydro/lib/hydro/suite/index.js", function(exports, require, module){
/**
 * External dependencies.
 */

var inherits = require('super');
var Emitter = require('evts');

/**
 * Internal dependencies.
 */

var util = require('../util');

/**
 * Test suite.
 *
 * @param {String} title
 * @constructor
 */

function Suite(title) {
  this.title = util.isFunction(title) ? util.fnName(title) : title;
  this.parent = null;
  this.tests = [];
  this.suites = [];
  this.events = {
    pre: 'pre:suite',
    post: 'post:suite'
  };
}

/**
 * inherit from Emitter
 */

inherits(Suite, Emitter)

/**
 * Register test `fn` with `title`.
 *
 * @param {Test} test
 * @api public
 */

Suite.prototype.addTest = function(test) {
  test.suite = this;
  this.tests.push(test);
};

/**
 * Add a child `suite`.
 *
 * @param {Suite} suite
 * @api public
 */

Suite.prototype.addSuite = function(suite) {
  suite.parent = this;
  this.suites.push(suite);
};

/**
 * Run the test suite.
 *
 * @param {Object} emitter
 * @param {Function} fn
 * @api public
 */

Suite.prototype.run = function(emitter, fn) {
  var self = this;
  var runnable = this.tests.slice(0).concat(this.suites.slice(0));
  var current = null;
  var events = this.events;

  function next(err) {
    if (err) return fn(err);
    if (current = runnable.shift()) {
      return current.run(emitter, next);
    }

    self.emit('after', function(err){
      if (err) return fn(err);
      emitter.emit(events.post, self, fn);
    })
  }

  emitter.emit(events.pre, this, function(err){
    if (err) return fn(err);
    self.emit('before', next);
  });
};

/**
 * Return all parent suites.
 *
 * @returns {Array}
 * @api public
 */

Suite.prototype.parents = function() {
  return this.parent.parents().concat(this.parent);
};

/**
 * Primary export.
 */

module.exports = Suite;

});
require.register("hydro/lib/hydro/suite/root.js", function(exports, require, module){
/**
 * External dependencies.
 */

var inherits = require('super');

/**
 * Internal dependencies.
 */

var Suite = require('./index');

/**
 * Root suite.
 *
 * @constructor
 */

function RootSuite() {
  Suite.call(this);

  this.events = {
    pre: 'pre:all',
    post: 'post:all'
  };
}

/**
 * Inherit `Suite`.
 */

inherits(RootSuite, Suite);

/**
 * The root suite can't have any tests.
 *
 * @api public
 */

RootSuite.prototype.addTest = function() {
  throw new Error('Please add a test suite');
};

/**
 * The root suite doesn't have any parent suites.
 *
 * @returns {Array}
 * @api public
 */

RootSuite.prototype.parents = function() {
  return [];
};

/**
 * Primary export.
 */

module.exports = RootSuite;

});
require.register("hydro/lib/hydro/interface.js", function(exports, require, module){
/**
 * Internal dependencies.
 */

var Suite = require('./suite');
var util = require('./util');

/**
 * Public interface for proxy methods.
 *
 * @param {Hydro} hydro
 * @constructor
 */

function Interface(hydro) {
  this.hydro = hydro;
  this.ctx = new Frame(hydro.root);
  this.stack = [this.ctx];
}

/**
 * Delegate to Hydro.
 */

util.forEach(['createTest', 'createSuite'], function(method) {
  Interface.prototype[method] = function() {
    return this.hydro[method].apply(this.hydro, arguments);
  };
});

/**
 * Add a test suite.
 *
 * @param {String} title
 * @param {Function} body
 * @api public
 */

Interface.prototype.addSuite = function(title, fn) {
  var suite = this.pushSuite(title);
  if (fn) fn.call(suite);
  this.popSuite();
  return suite;
};

/**
 * Open a new suite.
 *
 * @param {Suite|String} title
 * @return {Suite}
 * @api public
 */

Interface.prototype.pushSuite = function(title) {
  var suite = !(title instanceof Suite)
    ? this.hydro.createSuite.apply(this.hydro, arguments)
    : title;
  this.ctx.suite.addSuite(suite);
  this.ctx = new Frame(suite);
  this.stack.push(this.ctx);
  return suite;
};

/**
 * Close the current suite.
 *
 * @return {Suite}
 * @api public
 */

Interface.prototype.popSuite = function() {
  this.ctx = this.stack[this.stack.length - 2];
  return this.stack.pop();
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

Interface.prototype.addTest = function() {
  var test = this.hydro.createTest.apply(this.hydro, arguments)

  each('beforeEach', this, before);
  each('afterEach', this, after);

  util.forEach(this.ctx.beforeNext, before);
  this.ctx.beforeNext.length = 0;

  util.forEach(this.ctx.afterNext, after);
  this.ctx.afterNext.length = 0;

  this.ctx.suite.addTest(test);

  function before(fn){ test.on('before', fn); }
  function after(fn){ test.on('after', fn); }

  return test
};

/**
 * Before next.
 *
 * @param {Function} fn
 * @api public
 */

Interface.prototype.beforeNext = function(fn) {
  this.ctx.beforeNext.push(fn);
};

/**
 * After next.
 *
 * @param {Function} fn
 * @api public
 */

Interface.prototype.afterNext = function(fn) {
  this.ctx.afterNext.push(fn);
};

/**
 * Before each.
 *
 * @param {Function} fn
 * @api public
 */

Interface.prototype.before = function(fn) {
  this.ctx.beforeEach.push(fn);
};

/**
 * After each.
 *
 * @param {Function} fn
 * @api public
 */

Interface.prototype.after = function(fn) {
  this.ctx.afterEach.push(fn);
};

/**
 * Before all.
 *
 * @param {Function} fn
 * @api public
 */

Interface.prototype.beforeAll = function(fn) {
  this.ctx.suite.on('before', fn);
};

/**
 * After all.
 *
 * @param {Function} fn
 * @api public
 */

Interface.prototype.afterAll = function(fn) {
  this.ctx.suite.on('after', fn);
};

/**
 * Hook storage container.
 *
 * @param {Suite} suite
 * @api private
 */

function Frame(suite) {
  this.suite = suite;
  this.beforeNext = [];
  this.beforeEach = [];
  this.afterEach = [];
  this.afterNext = [];
}

/**
 * Interate through all functions in the stack.
 *
 * @param {String} key
 * @param {Interface} interface
 * @param {Function} fn
 * @api private
 */

function each(key, interface, fn){
  var stack = interface.stack;

  for (var i = 0, len = stack.length; i < len; i++) {
    util.forEach(stack[i][key], fn);
  }
}

/**
 * Primary export.
 */

module.exports = Interface;

});
require.register("hydro/lib/hydro/util.js", function(exports, require, module){
/**
 * toString.
 */

var toString = Object.prototype.toString;

/**
 * Slice.
 */

var slice = Array.prototype.slice;

/**
 * Check if `str` is string.
 *
 * @param {Mixed} str
 * @returns {Boolean}
 * @api public
 */

exports.isString = function(str) {
  return toString.call(str) === '[object String]';
};

/**
 * Check if `fn` is function.
 *
 * @param {Mixed} fn
 * @returns {Boolean}
 * @api public
 */

exports.isFunction = function(fn) {
  return toString.call(fn) === '[object Function]';
};

/**
 * Check if `arr` is array.
 *
 * @param {Mixed} arr
 * @returns {Boolean}
 * @api private
 */

exports.isArray = function(arr) {
  return toString.call(arr) === '[object Array]';
};

/**
 * Convert `arguments` to array.
 *
 * @param {Arguments} args
 * @returns {Array}
 * @api public
 */

exports.slice = function(args) {
  return slice.call(args);
};

/**
 * Convert `arr` to array.
 *
 * @param {Mixed} arr
 * @returns {Array}
 * @api public
 */

exports.toArray = function(arr) {
  if (exports.isArray(arr)) return arr;
  return [arr];
};

/**
 * forEach.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @param {Object} context
 * @api public
 */

exports.forEach = function(arr, fn, ctx) {
  for (var i = 0, len = arr.length; i < len; i++) {
    fn.call(ctx, arr[i]);
  }
};

/**
 * Call `fn` for each key in `obj`.
 *
 * @param {Object} obj
 * @param {Function} fn
 * @api public
 */

exports.eachKey = function(obj, fn) {
  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    fn(key, obj[key]);
  }
};

/**
 * Get function name.
 *
 * @param {Function} fn
 * @returns {String}
 * @api public
 */

exports.fnName = function(fn) {
  if (fn.name) return fn.name;
  var match = /^\s?function ([^(]*)\(/.exec(fn);
  return match && match[1] ? match[1] : '';
};

/**
 * Noop.
 *
 * @api public
 */

exports.noop = function(){};

});












require.alias("hydrojs-loa/index.js", "hydro/deps/loa/index.js");
require.alias("hydrojs-loa/index.js", "hydro/deps/loa/index.js");
require.alias("hydrojs-loa/index.js", "loa/index.js");
require.alias("hydrojs-loa/index.js", "hydrojs-loa/index.js");
require.alias("vesln-evts/lib/evts.js", "hydro/deps/evts/lib/evts.js");
require.alias("vesln-evts/lib/evts.js", "hydro/deps/evts/index.js");
require.alias("vesln-evts/lib/evts.js", "evts/index.js");
require.alias("vesln-evts/lib/evts.js", "vesln-evts/index.js");
require.alias("vesln-tryc/lib/browser.js", "hydro/deps/tryc/lib/browser.js");
require.alias("vesln-tryc/lib/browser.js", "hydro/deps/tryc/index.js");
require.alias("vesln-tryc/lib/browser.js", "tryc/index.js");
require.alias("vesln-tryc/lib/browser.js", "vesln-tryc/index.js");
require.alias("vesln-fload/lib/browser.js", "hydro/deps/fload/lib/browser.js");
require.alias("vesln-fload/lib/browser.js", "hydro/deps/fload/index.js");
require.alias("vesln-fload/lib/browser.js", "fload/index.js");
require.alias("vesln-fload/lib/browser.js", "vesln-fload/index.js");
require.alias("vesln-globalo/index.js", "hydro/deps/globalo/index.js");
require.alias("vesln-globalo/index.js", "hydro/deps/globalo/index.js");
require.alias("vesln-globalo/index.js", "globalo/index.js");
require.alias("vesln-globalo/index.js", "vesln-globalo/index.js");
require.alias("vesln-super/lib/super.js", "hydro/deps/super/lib/super.js");
require.alias("vesln-super/lib/super.js", "hydro/deps/super/index.js");
require.alias("vesln-super/lib/super.js", "super/index.js");
require.alias("vesln-super/lib/super.js", "vesln-super/index.js");
require.alias("hydro/lib/hydro.js", "hydro/index.js");if (typeof exports == "object") {
  module.exports = require("hydro");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("hydro"); });
} else {
  this["Hydro"] = require("hydro");
}})();