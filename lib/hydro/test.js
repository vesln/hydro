/**
 * Test.
 *
 * @param {String} title
 * @param {Function} fn
 * @param {String} file
 * @param {Number} source line
 * @constructor
 */

function Test(title, fn, file, line) {
  this.title = title;
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
 * @param {Function} done
 * @api public
 */

Test.prototype.run = function(done) {
  var self = this;
  var timeout = null;
  var start = null;

  function end(err) {
    self.time = (new Date).getTime() - start;
    if (self.async) clearTimeout(timeout);
    if (err) self.fail(err);
    done(err);
  }

  if (this.skipped) {
    return done();
  }

  start = (new Date).getTime();

  try {
    if (!this.async) {
      this.fn();
      end();
    } else {
      timeout = setTimeout(function() {
        end(new Error('Test timed out'));
      }, 1000 * 60);

      this.fn(end);
    }
  } catch (err) {
    end(err);
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
