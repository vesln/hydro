/**
 * Test.
 *
 * @param {String} title
 * @param {Function} fn
 * @constructor
 */

function Test(title, fn) {
  this.title = title;
  this.fn = fn;
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
  this.start = (new Date).getTime();

  function end(err) {
    if (err) self.fail(err);
    done();
  }

  try {
    if (!this.async) {
      this.fn();
      end();
    } else {
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
