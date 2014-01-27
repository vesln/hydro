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

/**
 * a callback which ensures users hear about errors
 *
 * @param {Error} err
 * @api public
 */

exports.rethrow = function(err) {
  if (err) setTimeout(function(){ throw err; }, 0);
};
