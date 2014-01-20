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
