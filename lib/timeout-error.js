/**
 * Timeout Error.
 *
 * @param {String} message
 * @constructor
 */

function TimeoutError(message) {
  this.message = message;
  this.timeout = true;

  Error.captureStackTrace(this, arguments.callee);
}

/**
 * Inherit from `Error`.
 */

TimeoutError.prototype = Object.create(Error.prototype);

/**
 * Set name.
 */

TimeoutError.prototype.name = 'TimeoutError';

/**
 * Ensure correct constructor.
 */

TimeoutError.prototype.constructor = TimeoutError;

/**
 * Primary export
 */

module.exports = TimeoutError;
