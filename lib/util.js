/**
 * toString.
 */

var toString = Object.prototype.toString;

/**
 * Slice.
 */

var slice = Array.prototype.slice;

/**
 * Extract title from a function or a string.
 *
 * @param {String|Function} title
 * @returns {String}
 * @api public
 */

exports.title = function(title) {
  return toString.call(title) === '[object Function]'
    ? exports.fnName(title)
    : title;
};

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

exports.noop = function() {};

/**
 * A callback which ensures users hear about errors
 *
 * @param {Error} err
 * @api public
 */

exports.rethrow = function(err) {
  if (!err) return;

  setTimeout(function() {
    throw err;
  }, 0);
};
