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
