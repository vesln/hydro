/**
 * Core dependencies.
 */

var tty = require('tty');

/**
 * Enabled.
 */

var enabled = tty.isatty(1) && tty.isatty(2);

/**
 * Colors.
 */

var colors = {
  red: '\u001b[31m',
  green: '\u001b[32m'
};

/**
 * Reset.
 */

var reset = '\u001b[0m';

/**
 * Colorize `input` if enabled.
 *
 * @param {String} color
 * @param {String} input
 * @param {Boolean} condition (optional)
 * @api public
 */

module.exports = function(color, input, cond) {
  if (!enabled || cond === true) return input;
  return colors[color] + input + reset;
};
