/**
 * Test.
 *
 * @param {String} title
 * @param {Function} fn
 * @param {Array} tags
 * @param {String} file
 * @param {Number} source line
 * @constructor
 */

function Test(title, fn, tags, file, line) {
  this.title = title;
  this.tags = tags || [];
  this.fn = fn;
  this.file = file;
  this.line = line;
  this.async = fn && fn.length === 1;
  this.failed = false;
  this.error = null;
  this.start = null;
  this.time = 0;
  this.skipped = false;
  if (!fn) this.skip();
}

/**
 * Skip the test.
 *
 * @api public
 */

Test.prototype.skip = function() {
  this.skipped = true;
};

/**
 * Execute the test.
 *
 * @param {Object} events
 * @param {Function} done
 * @api public
 */

Test.prototype.run = function(events, done) {
  var self = this;
  var timeout = null;
  var start = null;
  var ended = false;

  function end(err) {
    if (ended) return;
    ended = true;
    self.time = (new Date).getTime() - start;
    if (self.async) clearTimeout(timeout);
    if (err) self.fail(err);
    process.removeListener('uncaughtException', end);
    events.emit('post:test', self, done);
  }

  if (this.skipped) return done();

  start = (new Date).getTime();

  events.emit('pre:test', this, function() {
    process.on('uncaughtException', end);

    try {
      if (!self.async) {
        self.fn();
        end();
      } else {
        timeout = setTimeout(function() {
          end(new Error('Test timed out'));
        }, 1000 * 60);

        self.fn(end);
      }
    } catch (err) {
      end(err);
    }
  });

};

/**
 * Fail the test.
 *
 * @param {Error} err
 * @api public
 */

Test.prototype.fail = function(err) {
  this.failed = true;
  this.error = err;
};

/**
 * Primary export.
 */

module.exports = Test;
