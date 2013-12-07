/**
 * Internal dependencies.
 */

var BaseTest = require('./base');

/**
 * AsyncTest.
 *
 * @constructor
 */

var AsyncTest = BaseTest.extend();

AsyncTest.prototype._run = function(events, done) {
  var timeout = null;
  var ended = false;

  function end(err) {
    if (ended) return;
    ended = true;
    clearTimeout(timeout);
    process.removeListener('uncaughtException', end);
    done(err);
  }

  process.on('uncaughtException', end);

  timeout = setTimeout(function() {
    end(new Error('Test timed out'));
  }, 1000 * 60);

  this.fn(end);
};

/**
 * Primary export.
 */

module.exports = AsyncTest;
