var AsyncTest = require('./async');
var SyncTest = require('./sync');
var SkippedTest = require('./skipped');

exports.create = function(title, tags, fn, file) {
  if (!fn && 'function' === typeof tags) {
    fn = tags;
    tags = null;
  }

  var klass = null;

  if (!fn) {
    klass = SkippedTest;
  } else if (fn.length === 0) {
    klass = SyncTest;
  } else {
    klass = AsyncTest;
  }

  return new klass(title, fn, tags, file);
};
