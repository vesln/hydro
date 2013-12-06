var inherits = require('util').inherits;
var BaseTest = require('./base-test');

/**
 * AsyncTest.
 *
 * @constructor
 */

function AsyncTest() {
  BaseTest.apply(this, arguments);
}

inherits(AsyncTest, BaseTest);

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
