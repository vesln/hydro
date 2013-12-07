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
  this.failed = false;
  this.error = null;
  this.time = null;
  this.skipped = false;
}

Test.prototype.fail = function(err) {
  this.failed = true;
  this.error = err;
};

Test.prototype.run = function(events, done) {
  var self = this;

  events.emit('pre:test', this, function() {
    var start = (new Date).getTime();
    self._run(events, function(err) {
      self.time = (new Date).getTime() - start;
      if (err) self.fail(err);
      events.emit('post:test', self, done);
    });
  });
};

/**
 * Primary export.
 */

module.exports = Test;
