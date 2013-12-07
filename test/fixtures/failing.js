var assert = require('assert');

t('Async throw', function(done) {
  setTimeout(function() {
    throw new Error('Foo');
  }, 40);
});

t('Sync', function() {
  assert(false);
});

t('Async', function(done) {
  process.nextTick(function() {
    done(new Error('Next tick'));
  });
});

t('Timeout', function(done) {
  setTimeout(function() {
    done(new Error('Timeout'));
  }, 40);
});

t('Throws', function(done) {
  throw new Error('bad');
});
