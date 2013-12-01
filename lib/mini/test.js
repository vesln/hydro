/**
 * Test.
 *
 * @param {String} title
 * @param {Function} fn
 * @constructor
 */

function Test(title, fn, file, line) {
  this.title = title;
  this.fn = fn;
  this.file = file;
  this.line = line;
  this.async = fn.length === 1;
  this.failed = false;
  this.error = null;
  this.start = null;
  this.time = null;
}

/**
 * Execute the test.
 *
 * @param {Function} done
 * @api public
 */

Test.prototype.run = function(done) {
  var self = this;

  function end(err) {
    if (self.async) clearTimeout(timeout);
    if (err) self.fail(err);
    done(err);
  }

  function timeout() {
    end(new Error('Test timed out'));
  }

  this.start = (new Date).getTime();

  try {
    if (!this.async) {
      this.fn();
      end();
    } else {
      // TODO: this could be configurable
      setTimeout(timeout, 1000 * 60);
      this.fn(end);
    }
  } catch (err) {
    end(err);
  }
};

/**
 * Capture test execution time.
 *
 * @api public
 */

Test.prototype.captureTime = function() {
  this.time = (new Date).getTime() - this.start;
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
