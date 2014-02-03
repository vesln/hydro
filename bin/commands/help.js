/**
 * CLI flags.
 */

var flags = [
  '--formatter    specify formatter to use',
  '--suite        set top-level test suite',
  '--help         show help information',
  '--version      show hydro version',
  '--no-colors    disable colors',
  '--timeout      timeout for async tests',
  '--plugins      specify plugin(s) to use',
  '--setup        specify setup file(s) to use',
  '--stack-limit  stack trace limit',
];

/**
 * ljust `str` with `width`.
 *
 * @param {String} str
 * @param {Number} width
 * @returns {String}
 * @api private
 */

function ljust(str, width) {
  str += '';
  var len = Math.max(0, width - str.length);
  return str + Array(len + 1).join(' ');
}

/**
 * Print usage.
 *
 * @api private
 */

function usage() {
  console.log();
  console.log('Usage: hydro [debug] [options] path/to/test(s)');
  console.log();
}

/**
 * Print the code CLI flags.
 *
 * @api private
 */

function coreFlags() {
  console.log('Core flags:');
  console.log();
  flags.forEach(function(flag) {
    console.log('  ' + flag);
  });
}

/**
 * Print CLI flags from plugins.
 *
 * @param {Array} plugins
 * @api private
 */

function pluginFlags(plugins) {
  var pflags = [];
  var len = 0;

  plugins.forEach(function(plugin) {
    Object.keys(plugin.flags || {}).forEach(function(flag) {
      pflags.push([flag, plugin.flags[flag]]);
      len = Math.max(flag.length, len);
    });
  });

  if (pflags.length) {
    console.log();
    console.log('Plugin flags:');
    console.log();
    pflags.forEach(function(flag) {
      console.log('  %s   %s', ljust(flag[0], len), flag[1]);
    });
  }

  console.log();
}

/**
 * Show help.
 *
 * @param {Object} hydro
 * @api public
 */

module.exports = function(hydro) {
  usage();
  coreFlags();
  hydro.loadPlugins();
  if (!hydro.plugins.length) return console.log();
  pluginFlags(hydro.plugins);
};
