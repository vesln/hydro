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
}

/**
 * Execute the test.
 *
 * @param {Function} done
 * @api public
 */

Test.prototype.run = function(done) {
  var self = this;

  try {
    if (!this.async) {
      this.fn();
      done();
    } else {
      this.fn(function(err) {
        if (err) self.fail(err);
        done();
      });
    }
  } catch (err) {
    this.fail(err);
    done();
  }
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
