/**
 * Dependencies
 */

var tryc = require('tryc');
var sTimeout = require('timer-ref').setTimeout;
var BaseTest = require('./base');
var TimeoutError = require('../timeout-error');

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
    end(new TimeoutError('Test timed out'));
  }, this._timeout);

  tryc(function(done) {
    fn.call(context, done);
  }, end)
};

/**
 * Primary export.
 */

module.exports = AsyncTest;
