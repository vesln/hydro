/**
 * Core dependencies.
 */

var domain = require('domain');

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

AsyncTest.prototype.timeout = 1000 * 2;

/**
 * Execute the test.
 *
 * @param {Object} events
 * @param {Function} done
 * @api private
 */

AsyncTest.prototype.exec = function(events, done) {
  var timeout = null;
  var ended = false;
  var operation = domain.create();
  var fn = this.fn;
  var context = this.context;

  function end(err) {
    if (ended) return;
    ended = true;
    clearTimeout(timeout);
    done(err);
  }

  operation.on('error', end);

  timeout = setTimeout(function() {
    end(new Error('Test timed out'));
  }, this.timeout);

  operation.run(function() {
    fn.call(context, end);
  });
};

/**
 * Primary export.
 */

module.exports = AsyncTest;
