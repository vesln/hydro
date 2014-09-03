/**
 * Dependencies
 */

var _ = require('./util');
var merge = require('super').merge;

/**
 * Configurations.
 *
 * @constructor
 */

function Config() {
  this.options = {
    global: global,
    stackLimit: Infinity,
    plugins: [],
    aliases: {},
    globals: {},
    tests: []
  };
}
/**
 * Set option `key` to `val`.
 *
 * @param {Object|String} key
 * @param {Mixed} val
 * @api public
 */

Config.prototype.set = function(key, val) {
  if (_.isObject(key)) {
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

Config.prototype.push = function(key, val) {
  if (typeof this.options[key] === 'undefined') {
    this.options[key] = [];
  }
  this.options[key].push(val);
};

/**
 * Return option `key`.
 *
 * TODO(vesln): use pathval
 *
 * @returns {Mixed}
 * @api public
 */

Config.prototype.get = function(key) {
  return this.options[key];
};

/**
 * Primary export
 */

module.exports = Config;
