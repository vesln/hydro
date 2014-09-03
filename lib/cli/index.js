/**
 * Dependencies
 */

var resolve = require('path').resolve;
var fs = require('fs');

/**
 * CLI runner.
 *
 * @param {Object} hydro
 * @param {Object} argv
 * @constructor
 */

function Cli(hydro, argv) {
  if (!(this instanceof Cli)) {
    return new Cli(hydro, argv);
  }

  this.hydro = hydro;
  this.argv = argv;
  this.options = {};
  this.conf = [];
  this.commands = [ 'help', 'version' ];
  this.arrayParams = { plugins: true };
}

/**
 * Run.
 *
 * @api public
 */

Cli.prototype.run = function() {
  this.ensureEnv();
  this.configure();
  this.prepareOptions();
  this.execCommand();
};

/**
 * Set `NODE_ENV` to test if none.
 *
 * @api private
 */

Cli.prototype.ensureEnv = function() {
  process.NODE_ENV = process.NODE_ENV || 'test';
};

/**
 * Configure.
 *
 * @api private
 */

Cli.prototype.configure = function() {
  var conf = this.conf;
  var options = this.options;
  var argv = this.argv;
  var hydro = this.hydro;

  if (argv.param('setup')) {
    argv.param('setup').forEach(function(file) {
      conf.push(resolve(file));
    });
  } else {
    conf.push(resolve('hydro.conf.js'));
  }

  delete argv.params['setup'];

  if (argv.commands.length) {
    options.tests = argv.commands;
  }

  conf.forEach(function(file) {
    if (fs.existsSync(file)) {
      var setup = require(file);
      if ('function' === typeof setup) setup(hydro);
    }
  });
};

/**
 * Prepare options.
 */

Cli.prototype.prepareOptions = function() {
  var argv = this.argv;
  var options = this.options;
  var arrayParams = this.arrayParams;

  // migrate options
  for (var key in argv.params) {
    if (argv.params[key].length == 1 && !arrayParams[key]) {
      options[key] = argv.params[key][0];
    } else {
      options[key] = argv.params[key];
    }
  }

  // set modes
  argv.modes.forEach(function(mode) {
    options[mode] = true;
  });

  // Convert dashed keys to camel case. Basically
  // this will prettify the config. Things like "clean-stacks" will become "cleanStacks".

  Object.keys(options).forEach(function(key) {
    var camel = key.replace(/(\-[a-z])/g, function(match) {
      return match.replace('-', '').toUpperCase();
    });
    if (camel === key) return;
    options[camel] = options[key];
    delete options[key];
  });

  // set the config
  this.hydro.set(options);
};

/**
 * Execute the requested command
 *
 * @api private
 */

Cli.prototype.execCommand = function() {
  var argv = this.argv;
  var failures = 0;

  this.commands.forEach(function(command) {
    if (!argv.mode(command)) return;
    require('./commands/' + command)(this.hydro);
    process.exit(0);
  }, this);

  this.hydro.on('post:test', function(test) {
    failures += test.status === 'failed' ? 1 : 0;
  });

  this.hydro.run(function(err) {
    if (err) throw err;
    process.exit(failures);
  });
};

/**
 * Primary export.
 */

module.exports = Cli;
